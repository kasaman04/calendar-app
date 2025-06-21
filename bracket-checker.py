#!/usr/bin/env python3
import re

def check_jsx_brackets(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Extract script content
    script_match = re.search(r'<script[^>]*>(.*?)</script>', content, re.DOTALL)
    if not script_match:
        print("No script tag found")
        return
    
    script_content = script_match.group(1)
    lines = script_content.split('\n')
    
    # Stack to track opening brackets
    bracket_stack = []
    paren_stack = []
    brace_stack = []
    
    # Track different types of brackets
    bracket_pairs = {'(': ')', '[': ']', '{': '}'}
    
    for line_num, line in enumerate(lines, 1):
        # Skip comment lines
        if line.strip().startswith('//'):
            continue
            
        # Track brackets
        for char_pos, char in enumerate(line):
            if char in '([{':
                bracket_stack.append((char, line_num, char_pos))
            elif char in ')]}':
                if not bracket_stack:
                    print(f"❌ Line {line_num}: Unexpected closing '{char}' at position {char_pos}")
                    print(f"   Line content: {line.strip()}")
                    return
                
                last_open, last_line, last_pos = bracket_stack.pop()
                expected_close = bracket_pairs[last_open]
                
                if char != expected_close:
                    print(f"❌ Line {line_num}: Mismatched bracket - expected '{expected_close}' but found '{char}'")
                    print(f"   Opening bracket was on line {last_line} at position {last_pos}")
                    print(f"   Line content: {line.strip()}")
                    return
    
    if bracket_stack:
        print("❌ Unclosed brackets found:")
        for bracket, line_num, pos in bracket_stack:
            print(f"   '{bracket}' opened on line {line_num} at position {pos}")
    else:
        print("✅ All brackets appear to be properly matched")

if __name__ == "__main__":
    check_jsx_brackets("/mnt/c/Users/iwasa kazuma/Claude Code/カレンダーアプリ/calendar-card.html")