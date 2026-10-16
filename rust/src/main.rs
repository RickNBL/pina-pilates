//! Servidor local alternativo sem dependências externas. Não usar em produção.
use std::{fs, io::{Read, Write}, net::{TcpListener, TcpStream}, path::PathBuf, time::Duration};
fn handle(mut stream: TcpStream, root: &PathBuf) -> std::io::Result<()> {
    stream.set_read_timeout(Some(Duration::from_secs(3)))?;
    stream.set_write_timeout(Some(Duration::from_secs(3)))?;
    let mut buffer = [0_u8; 8192];
    let count = stream.read(&mut buffer)?;
    let request = String::from_utf8_lossy(&buffer[..count]);
    let mut parts = request.lines().next().unwrap_or("").split_whitespace();
    let method = parts.next().unwrap_or("");
    let route = parts.next().unwrap_or("/").split('?').next().unwrap_or("/");
    let relative = if route == "/" { "index.html" } else { route.trim_start_matches('/') };
    let file = root.join(relative).canonicalize();
    let (status, mime, body) = if method != "GET" && method != "HEAD" {
        ("405 Method Not Allowed", "text/plain", b"Method not allowed".to_vec())
    } else if let Ok(path) = file {
        if !path.starts_with(root) || !path.is_file() {
            ("404 Not Found", "text/plain", b"Not found".to_vec())
        } else {
            let mime = match path.extension().and_then(|e| e.to_str()).unwrap_or("") {
                "html" => "text/html; charset=utf-8", "css" => "text/css; charset=utf-8",
                "js" => "application/javascript", "png" => "image/png", "jpg" | "jpeg" => "image/jpeg",
                "webp" => "image/webp", "svg" => "image/svg+xml", _ => "application/octet-stream"
            };
            ("200 OK", mime, fs::read(path)?)
        }
    } else { ("404 Not Found", "text/plain", b"Not found".to_vec()) };
    write!(stream, "HTTP/1.1 {}\r\nContent-Type: {}\r\nContent-Length: {}\r\nX-Content-Type-Options: nosniff\r\nConnection: close\r\n\r\n", status, mime, body.len())?;
    if method != "HEAD" { stream.write_all(&body)?; }
    Ok(())
}
fn main() -> std::io::Result<()> {
    let root = PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("../dist").canonicalize()?;
    let listener = TcpListener::bind("127.0.0.1:8081")?;
    println!("Local: http://127.0.0.1:8081");
    for connection in listener.incoming() {
        match connection { Ok(stream) => { let dir = root.clone(); std::thread::spawn(move || { let _ = handle(stream, &dir); }); }, Err(e) => eprintln!("{}", e) }
    }
    Ok(())
}
