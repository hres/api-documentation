function JSONtoCSV(fileName, url) {

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

        if ((!!document.documentMode == true)) //IF IE > 10
        {
            navigator.msSaveBlob(blob, fileName + '.csv');
        }

        else if (navigator.userAgent.indexOf("Chrome") != -1 || navigator.userAgent.indexOf("Firefox") != -1 || navigator.userAgent.indexOf("Opera") != -1 || navigator.userAgent.indexOf('OPR') != -1) {

            $("<a />", {
                "download": fileName + '.csv',
                "href": csvUrl,
            }).appendTo("body")     //create, append and remove a download link
                            .click(function (e) {
                                $(this).remove()
                            })[0].click()
        }
        else {
            alert("Your Browser does not support that feature.");
        }
    });


}

