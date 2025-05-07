"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface ReportViewerProps {
  reportId: string
  onBack: () => void
}

export default function ReportViewer({ reportId, onBack }: ReportViewerProps) {
  const [report, setReport] = useState<{ content: string; title: string }>({
    title: "",
    content: "",
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // In a real app, this would fetch the report from an API
    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      const mockReports = {
        "1": {
          title: "Q3 2023 Security Assessment",
          content: `# Q3 2023 Security Assessment Report

## Executive Summary

This security assessment was conducted on the main website (https://example.com) between July 1 and September 30, 2023. The assessment identified several security vulnerabilities that require attention.

### Key Findings

- **2 Critical vulnerabilities** were identified that require immediate remediation
- **5 High-risk vulnerabilities** that should be addressed within 30 days
- **10 Medium-risk vulnerabilities** that should be addressed within 60 days
- **20 Low-risk vulnerabilities** that should be addressed as part of regular maintenance

## Critical Vulnerabilities

### 1. SQL Injection in Login Form

**Description:** The login form is vulnerable to SQL injection attacks, which could allow an attacker to bypass authentication or extract sensitive information from the database.

**Impact:** An attacker could gain unauthorized access to the application, extract sensitive data, or potentially compromise the entire database.

**Remediation:** Implement prepared statements or parameterized queries for all database interactions. Validate and sanitize all user inputs.

### 2. Remote Code Execution in File Upload Feature

**Description:** The file upload feature in the admin panel does not properly validate file types, allowing attackers to upload and execute malicious code.

**Impact:** An attacker could execute arbitrary code on the server, potentially leading to complete system compromise.

**Remediation:** Implement strict file type validation, use a whitelist approach for allowed file extensions, scan uploaded files for malicious content, and store uploaded files outside the web root.

## High-Risk Vulnerabilities

### 1. Cross-Site Scripting (XSS) in Search Function

**Description:** The search function does not properly sanitize user input, making it vulnerable to stored XSS attacks.

**Impact:** Attackers could inject malicious scripts that execute in users' browsers, potentially stealing session cookies or performing actions on behalf of the victim.

**Remediation:** Implement proper output encoding and input validation. Consider implementing a Content Security Policy (CSP).

### 2. Outdated SSL/TLS Configuration

**Description:** The server is using outdated SSL/TLS protocols and cipher suites that are known to be vulnerable.

**Impact:** This could allow attackers to intercept and decrypt sensitive communications between users and the server.

**Remediation:** Update the SSL/TLS configuration to use only secure protocols (TLS 1.2 and above) and strong cipher suites. Disable SSL 3.0, TLS 1.0, and TLS 1.1.

## Conclusion

The security assessment identified several critical and high-risk vulnerabilities that require immediate attention. We recommend addressing these issues according to the suggested timelines to improve the overall security posture of the application.`,
        },
        "2": {
          title: "API Security Review",
          content: `# API Security Review

## Executive Summary

This security assessment focused on the API endpoints at https://api.example.com. The review identified several security concerns related to authentication, authorization, and data validation.

### Key Findings

- **1 Critical vulnerability** requiring immediate attention
- **3 High-risk vulnerabilities** that should be addressed within 30 days
- **7 Medium-risk vulnerabilities** that should be addressed within 60 days
- **15 Low-risk vulnerabilities** that should be addressed as part of regular maintenance

## Critical Vulnerabilities

### 1. Broken Authentication in Password Reset Flow

**Description:** The password reset functionality does not properly validate reset tokens, allowing attackers to reset any user's password with a crafted request.

**Impact:** An attacker could take over any user account by resetting their password.

**Remediation:** Implement proper validation of reset tokens, ensure tokens are tied to specific user accounts, set short expiration times for tokens, and implement rate limiting for reset attempts.

## High-Risk Vulnerabilities

### 1. Insecure Direct Object References (IDOR)

**Description:** Several API endpoints allow access to resources based on user-supplied IDs without proper authorization checks.

**Impact:** Attackers could access or modify data belonging to other users by manipulating resource IDs in API requests.

**Remediation:** Implement proper authorization checks for all API endpoints that access user data. Use indirect references or verify that the requesting user has permission to access the requested resource.

### 2. Missing Rate Limiting

**Description:** The API does not implement rate limiting, making it vulnerable to brute force attacks and denial of service.

**Impact:** Attackers could perform brute force attacks against authentication endpoints or cause denial of service by flooding the API with requests.

**Remediation:** Implement rate limiting for all API endpoints, with stricter limits for authentication-related endpoints. Consider using token bucket or leaky bucket algorithms for more sophisticated rate limiting.

## Medium-Risk Vulnerabilities

### 1. Insufficient Logging and Monitoring

**Description:** The API does not maintain adequate logs of security-relevant events, making it difficult to detect and respond to security incidents.

**Impact:** Security breaches may go undetected, and there may be insufficient information to investigate incidents when they are discovered.

**Remediation:** Implement comprehensive logging for all security-relevant events, including authentication attempts, authorization failures, and access to sensitive data. Set up monitoring and alerting for suspicious activities.

## Conclusion

The API security review identified several significant vulnerabilities that should be addressed to improve the security of the API. We recommend implementing the suggested remediations according to the priority levels indicated.`,
        },
        "3": {
          title: "Internal Network Vulnerability Assessment",
          content: `# Internal Network Vulnerability Assessment

## Executive Summary

This assessment evaluated the security posture of the internal network (192.168.1.0/24). The assessment identified several security issues related to network configuration, patch management, and access controls.

### Key Findings

- **0 Critical vulnerabilities**
- **8 High-risk vulnerabilities** that should be addressed within 30 days
- **12 Medium-risk vulnerabilities** that should be addressed within 60 days
- **25 Low-risk vulnerabilities** that should be addressed as part of regular maintenance

## High-Risk Vulnerabilities

### 1. Unpatched Windows Servers

**Description:** Several Windows servers (192.168.1.10, 192.168.1.11, 192.168.1.12) are missing critical security patches, including patches for vulnerabilities that are actively being exploited in the wild.

**Impact:** These servers are vulnerable to known exploits that could allow attackers to gain unauthorized access or execute arbitrary code.

**Remediation:** Implement a regular patch management process. Apply all missing security patches as soon as possible after testing. Consider implementing an automated patch management solution.

### 2. Weak Network Segmentation

**Description:** The network lacks proper segmentation, allowing unrestricted communication between different security zones.

**Impact:** If an attacker compromises one system, they could easily move laterally to other systems on the network, potentially escalating the breach.

**Remediation:** Implement network segmentation using VLANs, firewalls, or other network controls. Restrict communication between different security zones based on the principle of least privilege.

## Medium-Risk Vulnerabilities

### 1. Insecure Network Services

**Description:** Several systems are running unnecessary or insecurely configured network services, including telnet, FTP, and SNMP with default community strings.

**Impact:** These services could provide attack vectors for unauthorized access or information disclosure.

**Remediation:** Disable or remove unnecessary services. Replace insecure services with secure alternatives (e.g., SSH instead of telnet, SFTP instead of FTP). Configure services securely, including changing default credentials and enabling encryption where available.

## Conclusion

The internal network assessment identified several high and medium-risk vulnerabilities that should be addressed to improve the overall security posture of the network. We recommend implementing the suggested remediations according to the priority levels indicated.`,
        },
        "4": {
          title: "Development Environment Security Audit",
          content: `# Development Environment Security Audit

## Executive Summary

This security audit focused on the development and staging environments at https://dev.example.com. The audit identified several security issues that could potentially impact the security of the production environment.

### Key Findings

- **3 Critical vulnerabilities** requiring immediate attention
- **6 High-risk vulnerabilities** that should be addressed within 30 days
- **9 Medium-risk vulnerabilities** that should be addressed within 60 days
- **18 Low-risk vulnerabilities** that should be addressed as part of regular maintenance

## Critical Vulnerabilities

### 1. Production Credentials in Development Environment

**Description:** Production database credentials and API keys were found in plaintext configuration files in the development environment.

**Impact:** If the development environment is compromised, attackers could gain access to production systems and data.

**Remediation:** Remove all production credentials from development environments. Use environment-specific credentials for each environment. Consider using a secrets management solution to handle sensitive credentials securely.

### 2. Public Git Repository Exposing Sensitive Information

**Description:** A public Git repository was found to contain sensitive information, including API keys, passwords, and internal documentation.

**Impact:** Attackers could use this information to gain unauthorized access to systems or to plan more targeted attacks.

**Remediation:** Remove sensitive information from the repository history using tools like BFG Repo-Cleaner or git-filter-branch. Implement pre-commit hooks to prevent committing sensitive information in the future. Consider using a secrets scanning tool as part of the CI/CD pipeline.

### 3. Insecure Deployment Process

**Description:** The deployment process does not include security testing or code review, allowing insecure code to be deployed to production.

**Impact:** Vulnerabilities could be introduced into the production environment, potentially leading to security breaches.

**Remediation:** Implement security testing as part of the CI/CD pipeline, including static code analysis, dependency scanning, and dynamic application security testing. Require code review for all changes before they are deployed to production.

## High-Risk Vulnerabilities

### 1. Lack of Access Controls in Development Environment

**Description:** The development environment does not implement proper access controls, allowing all developers to access all parts of the system regardless of their role or need.

**Impact:** This could lead to unauthorized access to sensitive data or functionality, either accidentally or maliciously.

**Remediation:** Implement role-based access controls in the development environment. Restrict access based on the principle of least privilege. Implement proper authentication and authorization mechanisms.

## Conclusion

The development environment security audit identified several critical and high-risk vulnerabilities that require immediate attention. Addressing these issues will not only improve the security of the development environment but also help prevent security issues from being introduced into the production environment.`,
        },
      }

      if (mockReports[reportId]) {
        setReport(mockReports[reportId])
      } else {
        setReport({
          title: "Report Not Found",
          content: "The requested report could not be found.",
        })
      }
      setLoading(false)
    }, 800)
  }, [reportId])

  const handleDownload = () => {
    // Create a blob with the report content
    const blob = new Blob([report.content], { type: "text/markdown" })
    const url = URL.createObjectURL(blob)

    // Create a temporary link and trigger download
    const a = document.createElement("a")
    a.href = url
    a.download = `${report.title.replace(/\s+/g, "_")}.md`
    document.body.appendChild(a)
    a.click()

    // Clean up
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Simple Markdown renderer
  const renderMarkdown = (markdown: string) => {
    if (!markdown) return null

    // Split the markdown into lines
    const lines = markdown.split("\n")

    // Process each line
    const renderedLines = lines.map((line, index) => {
      // Headers
      if (line.startsWith("# ")) {
        return (
          <h1 key={index} className="text-3xl font-bold mb-6 text-gray-100">
            {line.substring(2)}
          </h1>
        )
      }
      if (line.startsWith("## ")) {
        return (
          <h2 key={index} className="text-2xl font-bold mt-8 mb-4 text-gray-100">
            {line.substring(3)}
          </h2>
        )
      }
      if (line.startsWith("### ")) {
        return (
          <h3 key={index} className="text-xl font-bold mt-6 mb-3 text-gray-100">
            {line.substring(4)}
          </h3>
        )
      }
      if (line.startsWith("#### ")) {
        return (
          <h4 key={index} className="text-lg font-bold mt-4 mb-2 text-gray-100">
            {line.substring(5)}
          </h4>
        )
      }

      // Lists
      if (line.startsWith("- ")) {
        return (
          <div key={index} className="flex mb-2">
            <span className="mr-2 text-gray-300">•</span>
            <span className="text-gray-300">{line.substring(2)}</span>
          </div>
        )
      }

      // Bold and italic
      let processedLine = line
      // Bold
      processedLine = processedLine.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      // Italic
      processedLine = processedLine.replace(/\*(.*?)\*/g, "<em>$1</em>")

      // Empty line
      if (line.trim() === "") {
        return <div key={index} className="h-4"></div>
      }

      // Regular paragraph
      return <p key={index} className="mb-4 text-gray-300" dangerouslySetInnerHTML={{ __html: processedLine }}></p>
    })

    return renderedLines
  }

  return (
    <div className="p-8">
      <header className="mb-8 flex items-center justify-between">
        <div className="flex items-center">
          <Button
            variant="outline"
            size="sm"
            className="mr-4 bg-gray-700 border-gray-600 hover:bg-gray-600 text-white"
            onClick={onBack}
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Reports
          </Button>
          <h1 className="text-3xl font-bold text-gray-100">{report.title}</h1>
        </div>
        <Button
          variant="outline"
          className="bg-gray-700 border-gray-600 hover:bg-gray-600 text-white"
          onClick={handleDownload}
        >
          <Download className="w-4 h-4 mr-2" /> Download Report
        </Button>
      </header>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <Card className="bg-gray-800 border-gray-700 p-8">
          <div className="prose prose-invert max-w-none">{renderMarkdown(report.content)}</div>
        </Card>
      )}
    </div>
  )
}
