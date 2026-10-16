from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED

root = Path(__file__).resolve().parents[1]
output = root.parent / 'studio-pina-pilates.zip'
excluded = {'node_modules', '.git', 'target', '__pycache__', '.sites'}
with ZipFile(output, 'w', ZIP_DEFLATED) as archive:
    for file in root.rglob('*'):
        if file.is_file() and not excluded.intersection(file.relative_to(root).parts):
            archive.write(file, Path('studio-pina-pilates') / file.relative_to(root))
print(output)
