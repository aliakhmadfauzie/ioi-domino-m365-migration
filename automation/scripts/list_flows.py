import json, urllib.request

MCP_URL = "https://mcp.flowstudio.app/mcp"
MCP_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6ImFsaW1pZ3JhdGlvbkBpb2lvaS5vbm1pY3Jvc29mdC5jb20iLCJhcHBpZCI6IjM0NzY0M2RkLTE5ODUtNGY5OS1iNGQ0LTJjODBmZDM4OGY2OCIsInRpZCI6ImM2ZjYyMThiLTVmZjItNDhiNS05MTE0LWY4OWRhMjNjYWFkYiIsIm9pZCI6IjBjOGI5YzRiLThiMDUtNDNlNy1hMjJjLTYyNjdkZjY5ZTM4YiIsIndvcmtzcGFjZSI6IndzX2M2ZjYyMThiLTVmZjItNDhiNS05MTE0LWY4OWRhMjNjYWFkYl8yZmZ3X20iLCJpYXQiOjE3ODA0MzMyODIsImV4cCI6MTgxMjA1NTY4Mn0.R1kqfrFHyvC4p_OtPCrF_YCRORd-iVscEaNAS1IQxSM"

def mcp(tool, **kwargs):
    payload = {
        "jsonrpc": "2.0",
        "method": "tools/call",
        "id": 1,
        "params": {"name": tool, "arguments": kwargs}
    }
    req = urllib.request.Request(
        MCP_URL,
        data=json.dumps(payload).encode(),
        headers={
            "x-api-key": MCP_TOKEN,
            "Content-Type": "application/json",
            "User-Agent": "FlowStudio-MCP/1.0"
        }
    )
    resp = urllib.request.urlopen(req, timeout=120)
    raw = json.loads(resp.read())
    if "error" in raw:
        raise RuntimeError(f"MCP error: {json.dumps(raw['error'])}")
    result = raw.get("result", {})
    content = result.get("content", [])
    if result.get("isError"):
        err_text = content[0]["text"] if content else "Unknown error"
        raise RuntimeError(f"Tool error: {err_text}")
    text = content[0]["text"]
    return json.loads(text)

if __name__ == "__main__":
    env = "Default-c6f6218b-5ff2-48b5-9114-f89da23caadb"

    # Get the Universal Approval Flow definition
    print("=== IT - Universal Approval Flow ===")
    flow = mcp("get_live_flow",
               environmentName=env,
               flowName="dfb01165-9d01-0466-e8ba-1100c3cf5d39")
    text = json.dumps(flow, indent=2)
    if len(text) > 25000:
        print(text[:25000])
        print("\n... [TRUNCATED] ...")
    else:
        print(text)
