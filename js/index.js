/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    initialize: function() {
        this.bind();
    },
    bind: function() {
        document.addEventListener('deviceready', this.deviceready, false);
    },
    deviceready: function() {
        // This is an event handler function, which means the scope is the event.
        // So, we must explicitly called `app.report()` instead of `this.report()`.
        app.report('deviceready');
    },
    report: function(id) {
        // Report the event in the console
        console.log("Report: " + id);

        // Toggle the state from "pending" to "complete" for the reported ID.
        // Accomplished by adding .hide to the pending element and removing
        // .hide from the complete element.
        document.querySelector('#' + id + ' .pending').className += ' hide';
        var completeElem = document.querySelector('#' + id + ' .complete');
        completeElem.className = completeElem.className.split('hide').join('');
    }
};

//var baseURL = "http://92.19.252.49/BPAdminService";

var baseURL = "http://mobile.bluepony.co.uk";

function formatJSONDate(jsonDate) {
    var newDate = new Date(parseInt(jsonDate.substr(6)));
    return newDate.getDate()+'/'+(newDate.getMonth()+1)+'/' + newDate.getFullYear();
}

$(document).bind("mobileinit", function() {
    	      $.mobile.page.prototype.options.addBackBtn = true;
    });

$(document).ready(function () {
    $.mobile.defaultPageTransition = 'none';
    $.mobile.page.prototype.options.addBackBtn = true;
    $.ajaxSetup({ cache: false });
    $.support.cors = true;
    $.mobile.allowCrossDomainPages = true;

    var loginData = isLoggedIn();
    if (loginData.loggedIn) {
        $('#loginPanel').hide();
        refreshSummaryData();
        setSummaryPageRefresh();
        $('#summaryLoginButton').text(loginData.name);
    } else $('#summaryPanel').hide();

    $('#btnLogin').click(function () {

        $.ajax
        ({
            type: "POST",
            url: baseURL + "/account/clientlogin",
            dataType: 'json',
            data: { UserName: $('#txtUsername').val(), Password: $('#txtPassword').val() },
            success: function (jsonData) {
                $('#loginPanel').hide();
                $('#summaryPanel').show();
                refreshSummaryData();
                setSummaryPageRefesh();

            },
            error: function (request, error) {
                $('#summaryPanel').hide();
                alert('Invalid username or password' + error);
            }
        });
    });
});

var homeIntervalId;

function setSummaryPageRefresh() {
    $('#HomePage').on('pageshow', function () {
        homeIntervalId = window.setInterval(refreshSummaryData, 30000);
        refreshSummaryData();
    });

    $('#HomePage').on('pagehide', function () {
        clearInterval(homeIntervalId);
    });

}

function isLoggedIn() {
    var loginData;
    $.ajax({
        beforeSend: function () { $.mobile.showPageLoadingMsg(); }, //Show spinner
        complete: function () { $.mobile.hidePageLoadingMsg() }, //Hide spinner
        type: "POST",
        async:false,
        url: baseURL + "/account/isloggedin",
        dataType: 'json',
        success: function (jsonData) {
            loginData = jsonData;
        },
        error: function (request, error) {
            loginData = new { loggedIn : false, name : 'Guest' };
        }
    });
    return loginData;
}

function refreshSummaryData() {
    $.ajax
    ({
        beforeSend: function () { $.mobile.showPageLoadingMsg(); }, //Show spinner
        complete: function () { $.mobile.hidePageLoadingMsg() }, //Hide spinner
        type: "POST",
        url: baseURL + "/monitor/gettodaysdata",
        dataType: 'json',
        success: function (jsonData) {
            $('#summaryPanel').show();
            $("#numOrdersToday").text("(" + jsonData.stats.NumOrdersToday + ")");
            $("#orderAmtToday").html("&pound;" + jsonData.stats.OrderAmtToday);
            $("#numUsersOnline").text(jsonData.stats.NumUsersOnline);
            $("#basketAmt").html("&pound;" + jsonData.stats.BasketAmount);
        },
        error: function (request, error) {
            alert('failed - ' + error);
        }
    });

}


