#!/usr/bin/env python3
"""
GUNIC Advanced Security Scanner Backend
Scanner profissional sem limitações de CORS
"""

import requests
import socket
import ssl
import dns.resolver
import whois
import subprocess
import json
import time
import threading
from urllib.parse import urljoin, urlparse
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

class AdvancedSecurityScanner:
    def __init__(self):
        self.vulnerabilities = []
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        })
    
    def scan_target(self, url):
        """Scan completo sem limitações"""
        results = {
            'url': url,
            'timestamp': time.time(),
            'vulnerabilities': [],
            'open_ports': [],
            'subdomains': [],
            'technologies': {},
            'ssl_info': {},
            'dns_records': {},
            'whois_data': {}
        }
        
        domain = urlparse(url).netloc
        
        # 1. Port Scanning REAL
        results['open_ports'] = self.port_scan(domain)
        
        # 2. Subdomain Enumeration REAL  
        results['subdomains'] = self.subdomain_enum(domain)
        
        # 3. SSL/TLS Analysis REAL
        results['ssl_info'] = self.ssl_analysis(domain)
        
        # 4. DNS Enumeration REAL
        results['dns_records'] = self.dns_enum(domain)
        
        # 5. WHOIS Lookup REAL
        results['whois_data'] = self.whois_lookup(domain)
        
        # 6. Web Vulnerability Scanning REAL
        results['vulnerabilities'] = self.web_vuln_scan(url)
        
        # 7. Technology Detection REAL
        results['technologies'] = self.tech_detection(url)
        
        return results
    
    def port_scan(self, domain):
        """Port scanning real com socket"""
        print(f"[+] Scanning ports on {domain}")
        open_ports = []
        common_ports = [21, 22, 23, 25, 53, 80, 110, 143, 443, 993, 995, 3306, 3389, 5432, 6379, 27017]
        
        def scan_port(port):
            try:
                sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
                sock.settimeout(2)
                result = sock.connect_ex((domain, port))
                if result == 0:
                    service = socket.getservbyport(port, 'tcp') if port < 1024 else 'unknown'
                    open_ports.append({'port': port, 'service': service})
                    print(f"[+] Port {port} open ({service})")
                sock.close()
            except:
                pass
        
        threads = []
        for port in common_ports:
            t = threading.Thread(target=scan_port, args=(port,))
            threads.append(t)
            t.start()
        
        for t in threads:
            t.join()
        
        return open_ports
    
    def subdomain_enum(self, domain):
        """Enumeração real de subdomínios"""
        print(f"[+] Enumerating subdomains for {domain}")
        subdomains = []
        wordlist = ['www', 'mail', 'ftp', 'admin', 'test', 'dev', 'staging', 'api', 'blog', 'shop', 'portal', 'secure', 'vpn', 'remote', 'backup', 'db', 'mysql', 'phpmyadmin', 'cpanel', 'webmail', 'support']
        
        def check_subdomain(sub):
            try:
                subdomain = f"{sub}.{domain}"
                socket.gethostbyname(subdomain)
                subdomains.append(subdomain)
                print(f"[+] Found subdomain: {subdomain}")
            except:
                pass
        
        threads = []
        for sub in wordlist:
            t = threading.Thread(target=check_subdomain, args=(sub,))
            threads.append(t)
            t.start()
        
        for t in threads:
            t.join()
        
        return subdomains
    
    def ssl_analysis(self, domain):
        """Análise SSL/TLS real"""
        print(f"[+] Analyzing SSL/TLS for {domain}")
        try:
            context = ssl.create_default_context()
            with socket.create_connection((domain, 443), timeout=10) as sock:
                with context.wrap_socket(sock, server_hostname=domain) as ssock:
                    cert = ssock.getpeercert()
                    return {
                        'version': ssock.version(),
                        'cipher': ssock.cipher(),
                        'cert_subject': dict(x[0] for x in cert['subject']),
                        'cert_issuer': dict(x[0] for x in cert['issuer']),
                        'cert_expires': cert['notAfter']
                    }
        except Exception as e:
            return {'error': str(e)}
    
    def dns_enum(self, domain):
        """Enumeração DNS real"""
        print(f"[+] DNS enumeration for {domain}")
        records = {}
        record_types = ['A', 'AAAA', 'MX', 'TXT', 'CNAME', 'NS', 'SOA']
        
        for record_type in record_types:
            try:
                answers = dns.resolver.resolve(domain, record_type)
                records[record_type] = [str(rdata) for rdata in answers]
            except:
                records[record_type] = []
        
        return records
    
    def whois_lookup(self, domain):
        """WHOIS lookup real"""
        print(f"[+] WHOIS lookup for {domain}")
        try:
            w = whois.whois(domain)
            return {
                'registrar': w.registrar,
                'creation_date': str(w.creation_date),
                'expiration_date': str(w.expiration_date),
                'name_servers': w.name_servers,
                'emails': w.emails
            }
        except Exception as e:
            return {'error': str(e)}
    
    def web_vuln_scan(self, url):
        """Scan de vulnerabilidades web real"""
        print(f"[+] Web vulnerability scanning for {url}")
        vulnerabilities = []
        
        # SQL Injection Test REAL
        sql_payloads = ["'", "' OR '1'='1", "' UNION SELECT 1,2,3--", "'; DROP TABLE users--"]
        params = ['id', 'user', 'search', 'q', 'page']
        
        for param in params:
            for payload in sql_payloads:
                try:
                    test_url = f"{url}?{param}={payload}"
                    response = self.session.get(test_url, timeout=5)
                    
                    # Detectar erros SQL
                    sql_errors = ['mysql_fetch', 'ORA-', 'Microsoft OLE DB', 'PostgreSQL', 'sqlite3.OperationalError']
                    for error in sql_errors:
                        if error.lower() in response.text.lower():
                            vulnerabilities.append({
                                'type': 'SQL Injection',
                                'severity': 'critical',
                                'url': test_url,
                                'description': f'SQL error detected with payload: {payload}'
                            })
                            print(f"[!] SQL Injection found: {param}")
                            break
                except:
                    pass
        
        # XSS Test REAL
        xss_payloads = ["<script>alert('XSS')</script>", "<img src=x onerror=alert('XSS')>"]
        for param in params:
            for payload in xss_payloads:
                try:
                    test_url = f"{url}?{param}={payload}"
                    response = self.session.get(test_url, timeout=5)
                    
                    if payload in response.text:
                        vulnerabilities.append({
                            'type': 'Cross-Site Scripting (XSS)',
                            'severity': 'high',
                            'url': test_url,
                            'description': f'XSS payload reflected: {payload}'
                        })
                        print(f"[!] XSS found: {param}")
                except:
                    pass
        
        # Directory Traversal REAL
        lfi_payloads = ["../../../etc/passwd", "..\\..\\..\\windows\\system32\\drivers\\etc\\hosts"]
        for payload in lfi_payloads:
            try:
                test_url = f"{url}?file={payload}"
                response = self.session.get(test_url, timeout=5)
                
                if 'root:' in response.text or 'localhost' in response.text:
                    vulnerabilities.append({
                        'type': 'Local File Inclusion (LFI)',
                        'severity': 'critical',
                        'url': test_url,
                        'description': f'File inclusion successful: {payload}'
                    })
                    print(f"[!] LFI found")
            except:
                pass
        
        return vulnerabilities
    
    def tech_detection(self, url):
        """Detecção de tecnologias real"""
        print(f"[+] Technology detection for {url}")
        try:
            response = self.session.get(url, timeout=10)
            headers = response.headers
            
            technologies = {
                'server': headers.get('Server', 'Unknown'),
                'powered_by': headers.get('X-Powered-By', 'Unknown'),
                'framework': 'Unknown',
                'cms': 'Unknown'
            }
            
            # Detectar CMS
            content = response.text.lower()
            if 'wp-content' in content:
                technologies['cms'] = 'WordPress'
            elif 'joomla' in content:
                technologies['cms'] = 'Joomla'
            elif 'drupal' in content:
                technologies['cms'] = 'Drupal'
            
            return technologies
        except Exception as e:
            return {'error': str(e)}

scanner = AdvancedSecurityScanner()

@app.route('/scan', methods=['POST'])
def scan_endpoint():
    data = request.json
    url = data.get('url')
    
    if not url:
        return jsonify({'error': 'URL required'}), 400
    
    try:
        results = scanner.scan_target(url)
        return jsonify(results)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'Scanner backend online'})

if __name__ == '__main__':
    print("🚀 GUNIC Advanced Security Scanner Backend")
    print("⚠️  Use apenas com autorização!")
    print("🌐 Starting server on http://localhost:5000")
    app.run(host='0.0.0.0', port=5000, debug=True)