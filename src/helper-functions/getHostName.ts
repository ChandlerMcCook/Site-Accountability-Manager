export function getHostName(url : string) {
  let hostname;
  if (url == undefined) return ""

  if (url.startsWith("file:")) {
    return url
  }

  if (url.indexOf("//") > -1) {
    hostname = url.split("/")[2]
  } else {
    hostname = url.split("/")[0]
  }

  if (url.indexOf("www.") > -1)
    hostname = hostname.split("www.")[1]

  hostname = hostname.split(":")[0]
  hostname = hostname.split("?")[0]

  return hostname
}