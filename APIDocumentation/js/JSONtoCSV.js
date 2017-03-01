function JSONtoCSV(fileName, url)
{
    alert("allo" + url);
        var json = $.getJSON(url, function (json) {

            var row = "";
            var csv = '';
            alert("allo" + json);
            var arrData = typeof json != 'object' ? JSON.parse(json) : json;
            
            //extract the first row of data as headers
            for (var index in arrData[0]) {
                row += index + ',';
            }

            row.slice(0, -1);
            
            csv += row + '\r\n';
            alert("allo 1");
            for (var i = 0; i < arrData.length; i++)
            {
                var row = "";
                for(var index in arrData[i])
                {
                    row += '"' + arrData[i][index] + '",';          //create rows from the JSON data objects
                }
                row.slice(0, row.length);
                
                csv += row + '\r\n';                               //add it to the CSV string
            }
            alert("allo 2");
            blob = new Blob([csv], { type: 'text/csv' });
                
            var csvUrl = window.URL.createObjectURL(blob); 

            $("<a />", {
                        "download": fileName + '.csv',  
                        "href": csvUrl,
                        }).appendTo("body")     //create, append and remove a download link
                            .click(function ()
                            {
                                $(this).remove()
                            })[0].click()
        });

      
    }
