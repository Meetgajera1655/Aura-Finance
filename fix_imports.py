import os
import re

FRONTEND_SRC = r"D:\Python\FinTechForge-main\FinTechForge-main\apps\frontend\src"
SHARED_DIRS = ["components", "constants", "helpers", "hooks", "lib", "services", "types"]

def fix_imports():
    pattern = re.compile(r'(\.\./)+shared/(' + '|'.join(SHARED_DIRS) + r')')
    for root, dirs, files in os.walk(FRONTEND_SRC):
        for file in files:
            if file.endswith((".ts", ".tsx")):
                filepath = os.path.join(root, file)
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                new_content = pattern.sub(r'@/\2', content)
                
                if new_content != content:
                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.write(new_content)
                    print(f"Fixed imports in {filepath}")

if __name__ == "__main__":
    fix_imports()
