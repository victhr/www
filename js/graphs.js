


$(document).ready(function () {
    $.ajaxSetup({ cache: true });
});

function drawChart() {
    $.ajax({
        beforeSend: function () { $.mobile.showPageLoadingMsg(); }, //Show spinner
        complete: function () { $.mobile.hidePageLoadingMsg() }, //Hide spinner
        type: "POST",
        url: baseURL + "/monitor/GetWeeklyStatsData",
        dataType: 'json',
        success: function (jsonData) {

            var headMarkup, series1Markup, series2Markup;
            headMarkup = [];
            series1Markup = [];
            series2Markup = [];

            headMarkup.push('<td>&nbsp;</td>');
            series1Markup.push('<th scope="row">Last week</th>');
            series2Markup.push('<th scope="row">This week</th>');

            for (var i = 0; i < 14; i++) {
                if (i < 7) {

                    headMarkup.push('<th scope="col">');
                    headMarkup.push(jsonData.stats[i].StatsDay);
                    headMarkup.push('</th>');

                    series1Markup.push("<td>");
                    series1Markup.push(jsonData.stats[i].TotalSales);
                    series1Markup.push("</td>");
                }
                else {
                    series2Markup.push("<td>");
                    series2Markup.push(jsonData.stats[i].TotalSales);
                    series2Markup.push("</td>");
                }
            }

            $('#headRow').html(headMarkup.join(""));
            $('#series1Row').html(series1Markup.join(""));
            $('#series2Row').html(series2Markup.join(""));

            $('#figure').remove();

            createGraph('#data-table', '.chart');
        },
        error: function (request, error) {
            alert('failed ' + error);
        }

    });
}

