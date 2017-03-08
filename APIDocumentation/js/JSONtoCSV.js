function JSONtoCSV(fileName, url)
{
    console.log("Test");

    var json = $.getJSON(url, function (json) {

        var row = "";
        var csv = '';
        var arrData = typeof json != 'object' ? JSON.parse(json) : json;

        //extract the first row of data as headers
        for (var index in arrData[0]) {
            row += index + ',';
        }

        row.slice(0, -1);

        csv += row + '\r\n';

        for (var i = 0; i < arrData.length; i++) {
            var row = "";   
            for (var index in arrData[i]) {
                row += '"' + arrData[i][index] + '",';          //create rows from the JSON data objects
            }

            row.slice(0, row.length);

            csv += row + '\r\n';                               //add it to the CSV string
        }

        blob = new Blob([csv], { type: 'text/csv' });

        var csvUrl = window.URL.createObjectURL(blob);

        $("<a />", {
            "download": fileName + '.csv',
            "href": csvUrl,
        }).appendTo("body")     //create, append and remove a download link
                        .click(function () {
                            $(this).remove()
                        })[0].click()
    });

    //});

}


/*
   var xhr = createCORS('GET', url);

   if (!xhr) {
       throw new Error('CORS not supported. Unable to download CSV file');
   }

   xhr.onload = function () {
       var responseText = xhr.responseText;
       console.log(responseText);
   }

   xhr.onerror = function () {
       throw new Error('there was an error with the XHttpRequest');
   }
   */
//xhr.send(function () {
/*
$.ajax({

    type: 'GET',
    url: url,
    contentType: 'text/csv',
    xhrFields:
        {
            
        }

});
*/

/*
function createCORS(method, url)
{
    var xhr = new XMLHttpRequest();

    if ("withCredentials" in xhr) 
    {
        xhr.open(method, url, true);
    }
    else if(typeof XDomainRequest != "undefined")
    {
        xhr = new XDomainRequest();
        xhr.open(method, url);
    }
    else
    {
        xhr = null;
    }
 
    return xhr;
 */

