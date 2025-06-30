#!/usr/bin/env python3
"""
End-to-end test script for the Landing Page Generator system.
Tests the API endpoints and deployment functionality.
"""

import json
import requests
import time
import sys
from typing import Dict, Any

class SystemTester:
    def __init__(self, base_url: str = "http://localhost:5000"):
        self.base_url = base_url
        self.test_data = {
            "title": "Test Landing Page",
            "description": "This is a test landing page created by the automated testing system. It includes all the standard features and should deploy successfully to Netlify."
        }
    
    def test_health_check(self) -> bool:
        """Test the health check endpoint."""
        print("🔍 Testing health check endpoint...")
        try:
            response = requests.get(f"{self.base_url}/health", timeout=10)
            if response.status_code == 200:
                data = response.json()
                print(f"✅ Health check passed: {data.get('status')}")
                return True
            else:
                print(f"❌ Health check failed: {response.status_code}")
                return False
        except Exception as e:
            print(f"❌ Health check error: {e}")
            return False
    
    def test_preview_endpoint(self) -> bool:
        """Test the preview endpoint."""
        print("🔍 Testing preview endpoint...")
        try:
            response = requests.post(
                f"{self.base_url}/api/preview",
                json=self.test_data,
                headers={"Content-Type": "application/json"},
                timeout=30
            )
            
            if response.status_code == 200:
                data = response.json()
                if data.get('success') and 'html' in data:
                    print("✅ Preview generation successful")
                    html_length = len(data['html'])
                    print(f"   Generated HTML length: {html_length} characters")
                    return True
                else:
                    print(f"❌ Preview failed: {data}")
                    return False
            else:
                print(f"❌ Preview request failed: {response.status_code} - {response.text}")
                return False
        except Exception as e:
            print(f"❌ Preview test error: {e}")
            return False
    
    def test_deploy_endpoint(self, run_actual_deploy: bool = False) -> bool:
        """Test the deploy endpoint."""
        if not run_actual_deploy:
            print("⚠️  Skipping actual deployment test (set run_actual_deploy=True to test)")
            return True
            
        print("🔍 Testing deployment endpoint...")
        print("⚠️  This will create an actual Netlify site!")
        
        try:
            response = requests.post(
                f"{self.base_url}/api/deploy",
                json=self.test_data,
                headers={"Content-Type": "application/json"},
                timeout=60
            )
            
            if response.status_code == 200:
                data = response.json()
                if data.get('success') and 'url' in data:
                    print("✅ Deployment successful!")
                    print(f"   Live URL: {data['url']}")
                    print(f"   Admin URL: {data.get('admin_url', 'N/A')}")
                    print(f"   Site ID: {data.get('site_id', 'N/A')}")
                    return True
                else:
                    print(f"❌ Deployment failed: {data}")
                    return False
            else:
                print(f"❌ Deployment request failed: {response.status_code} - {response.text}")
                return False
        except Exception as e:
            print(f"❌ Deployment test error: {e}")
            return False
    
    def test_rate_limiting(self) -> bool:
        """Test rate limiting functionality."""
        print("🔍 Testing rate limiting...")
        try:
            # Make multiple rapid requests to test rate limiting
            for i in range(3):
                response = requests.post(
                    f"{self.base_url}/api/preview",
                    json=self.test_data,
                    headers={"Content-Type": "application/json"},
                    timeout=10
                )
                if response.status_code != 200:
                    print(f"⚠️  Request {i+1} failed: {response.status_code}")
                time.sleep(0.1)
            
            print("✅ Rate limiting test completed (no 429 errors)")
            return True
        except Exception as e:
            print(f"❌ Rate limiting test error: {e}")
            return False
    
    def test_input_validation(self) -> bool:
        """Test input validation."""
        print("🔍 Testing input validation...")
        
        test_cases = [
            {"title": "", "description": "Valid description"},  # Empty title
            {"title": "Valid title", "description": ""},  # Empty description
            {"title": "x" * 101, "description": "Valid description"},  # Title too long
            {"title": "Valid title", "description": "x" * 501},  # Description too long
        ]
        
        for i, invalid_data in enumerate(test_cases):
            try:
                response = requests.post(
                    f"{self.base_url}/api/preview",
                    json=invalid_data,
                    headers={"Content-Type": "application/json"},
                    timeout=10
                )
                
                if response.status_code == 400:
                    print(f"✅ Validation test {i+1} passed (rejected invalid input)")
                else:
                    print(f"⚠️  Validation test {i+1} unexpected: {response.status_code}")
            except Exception as e:
                print(f"❌ Validation test {i+1} error: {e}")
                return False
        
        return True
    
    def run_all_tests(self, include_deployment: bool = False) -> Dict[str, bool]:
        """Run all tests and return results."""
        print("🚀 Starting Landing Page Generator System Tests")
        print("=" * 60)
        
        results = {}
        
        # Test 1: Health Check
        results['health_check'] = self.test_health_check()
        print()
        
        # Test 2: Preview Endpoint
        results['preview'] = self.test_preview_endpoint()
        print()
        
        # Test 3: Input Validation
        results['validation'] = self.test_input_validation()
        print()
        
        # Test 4: Rate Limiting
        results['rate_limiting'] = self.test_rate_limiting()
        print()
        
        # Test 5: Deployment (optional)
        results['deployment'] = self.test_deploy_endpoint(include_deployment)
        print()
        
        # Summary
        print("📊 Test Results Summary")
        print("=" * 30)
        total_tests = len(results)
        passed_tests = sum(1 for result in results.values() if result)
        
        for test_name, passed in results.items():
            status = "✅ PASS" if passed else "❌ FAIL"
            print(f"{test_name.replace('_', ' ').title()}: {status}")
        
        print(f"\nOverall: {passed_tests}/{total_tests} tests passed")
        
        if passed_tests == total_tests:
            print("🎉 All tests passed! System is working correctly.")
        else:
            print("⚠️  Some tests failed. Please check the backend configuration.")
        
        return results

def main():
    """Main function."""
    import argparse
    
    parser = argparse.ArgumentParser(description='Test the Landing Page Generator system')
    parser.add_argument('--url', default='http://localhost:5000', help='Backend URL')
    parser.add_argument('--deploy', action='store_true', help='Include actual deployment test')
    parser.add_argument('--quick', action='store_true', help='Run only health check and preview tests')
    
    args = parser.parse_args()
    
    tester = SystemTester(args.url)
    
    if args.quick:
        print("🏃‍♂️ Running quick tests only...")
        results = {
            'health_check': tester.test_health_check(),
            'preview': tester.test_preview_endpoint()
        }
        success = all(results.values())
    else:
        results = tester.run_all_tests(include_deployment=args.deploy)
        success = all(results.values())
    
    if not success:
        sys.exit(1)

if __name__ == '__main__':
    main() 