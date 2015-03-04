var everlive = require("../lib/everlive");
var dialogs = require("ui/dialogs");
var buttonModule = require("ui/button");
var frameModule = require("ui/frame");
var view = require("ui/core/view");
var localSettings = require("local-settings");
var observable = require("data/observable");
var viewTaskVM = require("../view-models/viewTaskViewModel")
var platformModule = require("platform");
var absoluteLayoutModule = require("ui/layouts/absolute-layout");

var vm = {};
var page;
onNavigatedTo = function (args) {
    page = args.object;
    vm.task = page.navigationContext;
    vm.task.hasPhoto = false;
    
    if (taskHasPhoto()) {
        var el = new everlive({
            apiKey: TELERIK_BAAS_KEY,
            token: localSettings.getString(TOKEN_DATA_KEY)
        });

        el.Files.getDownloadUrlById(vm.task.Photo)
            .then(function (downloadUrl) {
                    page.getViewById("image").url = downloadUrl;
                },
                function (error) {
                    alert(JSON.stringify(error));
                });
        vm.task.hasPhoto = true;
    }
    
    vm.ProjectName = "to do";
    vm.DueDateText = "12-March";
    vm.ReminderText = "5 minutes before";
    page.bindingContext = vm;
    initFAB();

}
exports.onNavigatedTo = onNavigatedTo;

function initFAB() {
    
    var FABelement = page.getViewById("FAB");
    var widthDIP = platformModule.screen.mainScreen.widthPixels / platformModule.screen.mainScreen.scale;
    var heightDIP = platformModule.screen.mainScreen.heightPixels / platformModule.screen.mainScreen.scale;
    var FABSize = 150;
    var FABMargin = 16;
    
    absoluteLayoutModule.AbsoluteLayout.setLeft(FABelement, widthDIP - 70 - FABMargin);
    absoluteLayoutModule.AbsoluteLayout.setTop(FABelement, heightDIP - 70 - FABSize - FABMargin);
}

function taskHasPhoto()
{
    var photoId = vm.task.Photo;
    if (!photoId || photoId.indexOf("000") > -1)
    {
        return false;
    }
    
    return true;
}

function onDeleteButtonTap(args) {
    dialogs.confirm("Are you sure you want to delete task?").then(function (result) {

        if (!result) return;

        var activityIndicator = view.getViewById(page, "activityIndicator");
        activityIndicator.busy = true;

        var el = new everlive({
            apiKey: TELERIK_BAAS_KEY,
            token: localSettings.getString(TOKEN_DATA_KEY)
        });

        // TODO: delete do not work.
        el.data('Task').destroySingle({
                Id: vm.task.Id
            },
            function (data) {
                activityIndicator.busy = false;
                topMostFrame.navigate("app/views/main");
            },
            function (error) {
                activityIndicator.busy = false;
                alert("Error deleting Task:[" + JSON.stringify(error) + "]");
            });
    });
}
exports.onDeleteButtonTap = onDeleteButtonTap;

function onEditButtonTap(args) {
    var navigationEntry = {
        context: vm.task,
        moduleName: "app/views/editTask"
    };
    topMostFrame.navigate(navigationEntry);
}

exports.onEditButtonTap = onEditButtonTap;

function onCompleteButtonTap(args) {
    alert("This functionality will be implemented in the next version!")
}

exports.onCompleteButtonTap = onCompleteButtonTap;