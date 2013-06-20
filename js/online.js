

var onlineIntervalId;

$(document).ready(function () {

});

function refreshUsers() {
    $.ajaxSetup({ cache: false });

    $("#refreshUsersButton").attr("disabled", true);

    $.ajax
    ({
        beforeSend: function () { $.mobile.showPageLoadingMsg(); }, //Show spinner
        complete: function () { $.mobile.hidePageLoadingMsg() }, //Hide spinner
        type: "POST",
        url: baseURL + "/monitor/GetTodaysData",
        dataType: 'json',
        success: function (jsonData) {
            var markup = [];
            $.each(jsonData.stats.OnlineUsers, function (i, obj) {
                markup.push("<li><h2>");
                if (obj.IsGuest)
                    markup.push("Guest " + obj.IpAddress);
                else
                    markup.push(obj.FullName);
                markup.push("<span style='float:right;'>£" + obj.BasketValue + "</span>");
                markup.push("</h2>");
                markup.push("<p>" + obj.LastPageUrl + "</p>");
                markup.push("</li>");
            });

            $('#onlineUsers').html(markup.join(""));
            $('#onlineUsers').listview('refresh');
            $("#refreshUsersButton").attr("disabled", false);
        },
        error: function (request, error) {
            alert('failed ' + error);
            $("#refreshUsersButton").attr("disabled", false);
        }
    });

}
