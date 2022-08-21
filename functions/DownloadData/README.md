# DownloadData

## 🤖 Documentation

Update the fuel stations data.

## 📝 Environment Variables

List of environment variables used by this cloud function:

- **APPWRITE_FUNCTION_ENDPOINT** - Endpoint of Appwrite project
- **APPWRITE_FUNCTION_API_KEY** - Appwrite API Key


## TOOLS 

log last running docker container for function

```bash
docker logs $(docker ps | grep openruntimes/deno | awk '{print $1}' | head -n 1) -f
```