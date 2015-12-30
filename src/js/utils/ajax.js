/**
 * IE 5.5+, Firefox, Opera, Chrome, Safari XHR object
 *
 * @param string url
 * @param object callback
 * @param mixed data
 * @param string responseType type of the request, e.g. text or arraybuffer
 */
function ajax(url, data, callback, headers, responseType) {
    var x;
    responseType = responseType || 'text';
    headers = headers ||
            {
                'Content-type': 'application/x-www-form-urlencoded'
            }
        ;

    if (responseType == null) {
        responseType = 'text';
    }
    try {
        x = new(this.XMLHttpRequest || ActiveXObject)('MSXML2.XMLHTTP.3.0');
        x.open(data ? 'POST' : 'GET', url, 1);
        x.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        for (var type in headers) {
            var value = headers[type];
            x.setRequestHeader(type, value);
        }
        x.responseType = responseType;
        x.onreadystatechange = function () {
            if (x.readyState == 4) {
                callback(x.response, x);
            }
            else if (x.readyState == 4) {}
        };
        x.send(data)
    } catch (e) {
        window.console && console.log(e);
    }
};
