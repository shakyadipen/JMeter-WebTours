/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.984375, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "03_Find_Flight-7"], "isController": false}, {"data": [1.0, 500, 1500, "04_Payment-0"], "isController": false}, {"data": [1.0, 500, 1500, "04_Payment-1"], "isController": false}, {"data": [1.0, 500, 1500, "03_Find_Flight-3"], "isController": false}, {"data": [1.0, 500, 1500, "05_Logout"], "isController": true}, {"data": [1.0, 500, 1500, "03_Find_Flight-4"], "isController": false}, {"data": [1.0, 500, 1500, "03_Find_Flight-5"], "isController": false}, {"data": [1.0, 500, 1500, "03_Find_Flight-6"], "isController": false}, {"data": [0.5, 500, 1500, "03_Find_Flight"], "isController": true}, {"data": [1.0, 500, 1500, "01_LaunchHome"], "isController": true}, {"data": [1.0, 500, 1500, "02_Login-3"], "isController": false}, {"data": [1.0, 500, 1500, "02_Login-4"], "isController": false}, {"data": [1.0, 500, 1500, "02_Login-1"], "isController": false}, {"data": [1.0, 500, 1500, "02_Login-2"], "isController": false}, {"data": [1.0, 500, 1500, "02_Login"], "isController": true}, {"data": [1.0, 500, 1500, "01_LaunchHome-5"], "isController": false}, {"data": [1.0, 500, 1500, "01_LaunchHome-6"], "isController": false}, {"data": [1.0, 500, 1500, "01_LaunchHome-7"], "isController": false}, {"data": [1.0, 500, 1500, "02_Login-5"], "isController": false}, {"data": [1.0, 500, 1500, "01_LaunchHome-8"], "isController": false}, {"data": [1.0, 500, 1500, "02_Login-6"], "isController": false}, {"data": [1.0, 500, 1500, "01_LaunchHome-2"], "isController": false}, {"data": [1.0, 500, 1500, "01_LaunchHome-3"], "isController": false}, {"data": [1.0, 500, 1500, "01_LaunchHome-4"], "isController": false}, {"data": [1.0, 500, 1500, "01_LaunchHome-0"], "isController": false}, {"data": [1.0, 500, 1500, "05_Logout-1"], "isController": false}, {"data": [1.0, 500, 1500, "03_Find_Flight-0"], "isController": false}, {"data": [1.0, 500, 1500, "05_Logout-0"], "isController": false}, {"data": [1.0, 500, 1500, "03_Find_Flight-1"], "isController": false}, {"data": [1.0, 500, 1500, "03_Find_Flight-2"], "isController": false}, {"data": [1.0, 500, 1500, "04_Payment"], "isController": true}, {"data": [1.0, 500, 1500, "02_Login-0"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 54, 0, 0.0, 54.74074074074075, 1, 125, 54.5, 110.5, 120.5, 125.0, 29.427792915531334, 45.57061052452316, 15.313138623978203], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["03_Find_Flight-7", 2, 0, 0.0, 114.5, 107, 122, 114.5, 122.0, 122.0, 122.0, 5.780346820809248, 16.58462789017341, 4.577989523121388], "isController": false}, {"data": ["04_Payment-0", 2, 0, 0.0, 122.5, 120, 125, 122.5, 125.0, 125.0, 125.0, 5.571030640668524, 15.366578168523677, 5.143954561281337], "isController": false}, {"data": ["04_Payment-1", 2, 0, 0.0, 59.0, 58, 60, 59.0, 60.0, 60.0, 60.0, 6.779661016949152, 7.302701271186441, 3.038930084745763], "isController": false}, {"data": ["03_Find_Flight-3", 2, 0, 0.0, 2.5, 2, 3, 2.5, 3.0, 3.0, 3.0, 8.438818565400844, 8.43057753164557, 4.071070675105485], "isController": false}, {"data": ["05_Logout", 2, 0, 0.0, 152.5, 149, 156, 152.5, 156.0, 156.0, 156.0, 5.181347150259067, 14.026068652849741, 5.176287240932642], "isController": true}, {"data": ["03_Find_Flight-4", 2, 0, 0.0, 70.5, 61, 80, 70.5, 80.0, 80.0, 80.0, 6.802721088435374, 30.007706207482993, 3.8863201530612246], "isController": false}, {"data": ["03_Find_Flight-5", 2, 0, 0.0, 58.0, 53, 63, 58.0, 63.0, 63.0, 63.0, 7.220216606498195, 7.4387973826714795, 3.4972924187725627], "isController": false}, {"data": ["03_Find_Flight-6", 2, 0, 0.0, 73.0, 73, 73, 73.0, 73.0, 73.0, 73.0, 6.7340067340067336, 17.70964856902357, 6.092829335016836], "isController": false}, {"data": ["03_Find_Flight", 2, 0, 0.0, 531.0, 528, 534, 531.0, 534.0, 534.0, 534.0, 2.574002574002574, 39.723596364221365, 12.481650176962676], "isController": true}, {"data": ["01_LaunchHome", 2, 0, 0.0, 271.0, 216, 326, 271.0, 326.0, 326.0, 326.0, 2.785515320334262, 33.92670612813371, 8.778181580779945], "isController": true}, {"data": ["02_Login-3", 2, 0, 0.0, 55.5, 51, 60, 55.5, 60.0, 60.0, 60.0, 6.600660066006601, 6.349267739273928, 3.1456270627062706], "isController": false}, {"data": ["02_Login-4", 2, 0, 0.0, 4.0, 3, 5, 4.0, 5.0, 5.0, 5.0, 7.8431372549019605, 7.889093137254902, 3.753063725490196], "isController": false}, {"data": ["02_Login-1", 2, 0, 0.0, 101.5, 97, 106, 101.5, 106.0, 106.0, 106.0, 5.633802816901409, 9.622579225352114, 3.11949823943662], "isController": false}, {"data": ["02_Login-2", 2, 0, 0.0, 115.0, 112, 118, 115.0, 118.0, 118.0, 118.0, 5.54016620498615, 6.275969529085873, 3.040599030470914], "isController": false}, {"data": ["02_Login", 2, 0, 0.0, 342.0, 328, 356, 342.0, 356.0, 356.0, 356.0, 3.2679738562091503, 25.020424836601308, 12.021931168300654], "isController": true}, {"data": ["01_LaunchHome-5", 2, 0, 0.0, 65.0, 44, 86, 65.0, 86.0, 86.0, 86.0, 5.47945205479452, 5.484803082191781, 2.3330479452054793], "isController": false}, {"data": ["01_LaunchHome-6", 2, 0, 0.0, 51.0, 47, 55, 51.0, 55.0, 55.0, 55.0, 6.024096385542169, 9.759742093373493, 2.729668674698795], "isController": false}, {"data": ["01_LaunchHome-7", 2, 0, 0.0, 46.0, 46, 46, 46.0, 46.0, 46.0, 46.0, 6.042296072507553, 10.367494335347432, 2.7615181268882174], "isController": false}, {"data": ["02_Login-5", 2, 0, 0.0, 3.0, 3, 3, 3.0, 3.0, 3.0, 3.0, 7.905138339920948, 8.090415019762846, 3.767292490118577], "isController": false}, {"data": ["01_LaunchHome-8", 2, 0, 0.0, 61.0, 60, 62, 61.0, 62.0, 62.0, 62.0, 5.813953488372093, 5.5414244186046515, 2.134811046511628], "isController": false}, {"data": ["02_Login-6", 2, 0, 0.0, 3.5, 2, 5, 3.5, 5.0, 5.0, 5.0, 7.905138339920948, 7.897418478260869, 3.767292490118577], "isController": false}, {"data": ["01_LaunchHome-2", 2, 0, 0.0, 2.5, 2, 3, 2.5, 3.0, 3.0, 3.0, 6.0606060606060606, 5.95999053030303, 2.5153882575757573], "isController": false}, {"data": ["01_LaunchHome-3", 2, 0, 0.0, 3.0, 2, 4, 3.0, 4.0, 4.0, 4.0, 6.079027355623101, 26.631363981762917, 2.0481098024316107], "isController": false}, {"data": ["01_LaunchHome-4", 2, 0, 0.0, 2.5, 1, 4, 2.5, 4.0, 4.0, 4.0, 6.153846153846154, 5.396634615384615, 2.067307692307692], "isController": false}, {"data": ["01_LaunchHome-0", 2, 0, 0.0, 40.0, 4, 76, 40.0, 76.0, 76.0, 76.0, 4.926108374384237, 3.194273399014778, 1.7751308497536944], "isController": false}, {"data": ["05_Logout-1", 2, 0, 0.0, 106.0, 103, 109, 106.0, 109.0, 109.0, 109.0, 5.899705014749262, 10.065219395280236, 2.6790652654867255], "isController": false}, {"data": ["03_Find_Flight-0", 2, 0, 0.0, 50.5, 49, 52, 50.5, 52.0, 52.0, 52.0, 6.779661016949152, 5.5813029661016955, 3.8466631355932206], "isController": false}, {"data": ["05_Logout-0", 2, 0, 0.0, 46.5, 46, 47, 46.5, 47.0, 47.0, 47.0, 7.067137809187279, 7.074039310954064, 3.851037985865725], "isController": false}, {"data": ["03_Find_Flight-1", 2, 0, 0.0, 105.0, 104, 106, 105.0, 106.0, 106.0, 106.0, 5.763688760806916, 9.844425432276658, 3.287103746397695], "isController": false}, {"data": ["03_Find_Flight-2", 2, 0, 0.0, 57.0, 54, 60, 57.0, 60.0, 60.0, 60.0, 6.779661016949152, 6.521451271186441, 3.230932203389831], "isController": false}, {"data": ["04_Payment", 2, 0, 0.0, 181.5, 180, 183, 181.5, 183.0, 183.0, 183.0, 4.773269689737471, 18.307633502386636, 6.546930936754177], "isController": true}, {"data": ["02_Login-0", 2, 0, 0.0, 59.5, 51, 68, 59.5, 68.0, 68.0, 68.0, 6.097560975609756, 5.031678734756097, 4.0729801829268295], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 54, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
