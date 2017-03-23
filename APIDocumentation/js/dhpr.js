//var dhpr = "http://api.hres.ca/controller/dhprController.ashx?";

var dhpr = "./controller/dhprController.ashx?";

function saveXML(url, elementName) {
    var filename = elementName + '.xml';
    if (window.navigator.msSaveBlob) {
        $.ajax({
            url: url,
            type: "POST", /* or type:"GET" or type:"PUT" */
            dataType: "xml",
            data: {
            },
            success: function (XMLContent) {
                window.navigator.msSaveOrOpenBlob(new Blob([XMLContent], { type: "text/xml;" }), filename);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                $("#" + elementName).attr({ 'href': url, 'target': '_blank' });
                console.log("jqXHR: " + jqXHR + " Status: " + textStatus + " Error: " + errorThrown);
                return;
            }
        });
    }
    else {
        $("#" + elementName).attr({ 'download': filename, 'href': url, 'target': '_blank' });
    }
};

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
     return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));    
}

function goDhprUrl(lang, pType) {
    var term = getParameterByName("term");
    var searchUrl = dhpr + "term=" + term + "&pType=" + pType + "&lang=" + lang;
    return searchUrl;
}


function goDhprLangUrl(lang, pType) {
    var term = getParameterByName("term");
    var langSwitch = lang == 'en' ? "fr" : "en";
    var langUrl = lang == 'fr' ? "sommaire-decision-reglementaire-resultat.html" : "regulatory-decision-summary-result.html";
    langUrl += "?term=" + term + "&pType=" + pType + "&lang=" + langSwitch;
    return langUrl;
}

function goDhprUrlByID(lang, pType) {
    var linkID = getParameterByName("linkID");
    var searchUrl = dhpr + "linkID=" + linkID +  "&pType=" + pType + "&lang=" + lang;
    return searchUrl;
}
function goDhprLangUrlByID(lang, pType) {
    var linkID = getParameterByName("linkID");
    var langSwitch = lang == 'en' ? "fr" : "en";
    var langUrl = "regulatory-decision-summary-result.html?" + langSwitch + ".html?linkID=" + linkID + "&pType=" + pType + "&lang=" + langSwitch;
    return langUrl;
}


function OnFail(result) {
    window.location.href = "./genericError.html";
}


function formatedContact(contactName, contactUrl) {
    if ($.trim(contactName) == '')
    {
        return "&nbsp;";
    }
    return '<a href='+ contactUrl + '>' + contactName + '</a>';
}


function formatedDate(data) {
        if ($.trim(data) == '') {
            return "";
        }
        var data = data.replace("/Date(", "").replace(")/", "");
        if (data.indexOf("+") > 0) {
            data = data.substring(0, data.indexOf("+"));
        }
        else if (data.indexOf("-") > 0) {
            data = data.substring(0, data.indexOf("-"));
        }
        var date = new Date(parseInt(data, 10));
        var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
        var currentDate = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
        return date.getFullYear() + "-" + month + "-" + currentDate;
}

function formatedList(data) {
    var list;
    if ($.trim(data) == '') {
        return "";
    }
    $.each(data, function (index, record) {
        list += "<li>" + record + "</li>";
    });

    if (list != '') {
        list = list.replace("undefined", "");
        list = list.replace(/"/g, "");
        return "<ul>" + list + "</ul>";;
    }
    return "";
}

function getUnique(inputArray) {
    var outputArray = [];

    for (var i = 0; i < inputArray.length; i++) {
        if ((jQuery.inArray(inputArray[i], outputArray)) == -1) {
            outputArray.push(inputArray[i]);
        }
    }
    return outputArray;
}

function objectFindByKey(array, key, value) {
    for (var i = 0; i < array.length; i++) {
        if (array[i][key] === value) {
            return array[i];
        }
    }
    return null;
}

function formatedArrayList(data) {
    
    var list;
    if ($.trim(data) == '') {
        return "";
    }


    var arraryCount = 0;
    var returnValue = "";
    var orderNoList = [];

    for (i = 0; i < data.length; i++) {
        orderNoList[i] = $.trim(data[i].OrderNo);
    }
    var uniqueList = getUnique(orderNoList);  
   // console.log(uniqueList.length);

    for (var i = 0; i < uniqueList.length; i++) {
        var title = "";
        var list = "";
        //console.log("arraryCount" + arraryCount);
        //console.log("uniqueList.length" + uniqueList.length);
        //console.log("uniqueList" + uniqueList[i]);
        //console.log("i" + i);
        if (arraryCount == i)
        {
            title = "<br/><strong> Conclusion" + uniqueList[i] + "</strong><br/>";
            //var found = $.map(data, function (val) {
            //    return val.OrderNo == uniqueList[i] ? val.Bullet + "<br/>" : null;
            //});
            var result = $.grep(data, function (e) {
                if (e.OrderNo == uniqueList[i])
                {
                    list += e.Bullet + "<br/>";
                } 
            });
        }
        returnValue += title + list;
        arraryCount ++;
    }
    //console.log("returnValue" + returnValue);
    return returnValue;   
}


function ExportExcel(JSONData, ReportTitle, ShowLabel) {
    //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
    var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData.data) : JSONData.data;
    var CSV = '';
    //Set Report title in first row or line

    CSV += ReportTitle + '\r\n\n';

    //This condition will generate the Label/Header
    if (ShowLabel) {
        var row = "";
        //This loop will extract the label from 1st index of on array
        for (var index in arrData[0]) {
            //Now convert each value to string and comma-seprated
            row += index + ',';
        }

        row = row.slice(0, -1);
        //append Label row with line break
        CSV += row + '\r\n';
    }

    //1st loop is to extract each row
    for (var i = 0; i < arrData.length; i++) {
        var row = "";

        //2nd loop will extract each column and convert it in string comma-seprated
        for (var index in arrData[i]) {
            if (index == 'DateDecision' || index == 'CreatedDate') {
                row += '"' + formatedDate(arrData[i][index]) + '",';
            }
            else {
                row += '"' + arrData[i][index] + '",';
            }
        }

        row.slice(0, row.length - 1);
        //add a line break after each row
        CSV += row + '\r\n';
    }

    if (CSV == '') {
        alert("Invalid data");
        return;
    }

    //Generate a file name
    var fileName = "RDSResult_";
    //this will remove the blank-spaces from the title and replace it with an underscore
    fileName += ReportTitle.replace(/ /g, "_");
    //Initialize file format you want csv or xls
    var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);

    // Now the little tricky part.
    // you can use either>> window.open(uri);
    // but this will not work in some browsers
    // or you will not get the correct file extension    

    //this trick will generate a temp <a /> tag
    var link = document.createElement("a");
    link.href = uri;

    //set the visibility hidden so it will not effect on your web-layout
    link.style = "visibility:hidden";
    link.download = fileName + ".csv";

    //this part will append the anchor tag and remove it after automatic click
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function ExportJson(el, JSONData) {
    var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
    var data = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(arrData));
    el.setAttribute("href", "data:" + data);
    el.setAttribute("download", "RDSResult.json");
}

//Export Xml
function ExportXml(el) {
    var JSONData = $('#txt').val();
    //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
    var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
    var xml = json2xml(arrData, 'items');
    xml = '<?xml version="1.0" encoding="utf-8"?>' + xml;    
    var data = "Application/octet-stream," + encodeURIComponent(xml);
    el.setAttribute("href", "data:" + data);
    el.setAttribute("download", "RDSResult.xml");
}

var arrayCount = 0;
var json2xml = (function (undefined) {
    "use strict";
    var tag = function (name, closing) {
       // console.log("name:" + name + "arrayCount:" + arrayCount);
        if (name == arrayCount) {
            name = "item";
        }
        return "<" + (closing ? "/" : "") + name + ">";
    };
    return function (obj, rootname) {
        var xml = "";
        for (var i in obj) {

            if (obj.hasOwnProperty(i)) {
                var value = obj[i],
                    type = typeof value;
                if (value instanceof Array && type == 'object') {
                    for (var sub in value) {
                        xml += json2xml(value[sub]);
                    }
                } else if (value instanceof Object && type == 'object') {
                    xml += tag(i) + json2xml(value) + tag(i, 1);
                    arrayCount++;                   
                } else {
                    if (i == 'DateDecision' || i == 'CreatedDate') {
                        xml += tag(i) + formatedDate(value) + tag(i, {
                            closing: 1
                        });
                    }
                    else
                    {
                        xml += tag(i) + value + tag(i, {
                            closing: 1
                        });
                    }
                }
                
            }
        }

        return rootname ? tag(rootname) + xml + tag(rootname, 1) : xml;
    };
})(json2xml || {});



   

