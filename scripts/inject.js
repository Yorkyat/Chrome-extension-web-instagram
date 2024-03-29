// add edit with camanjs button
var edit_btn = "<button type='button' class='camanjs btn green edit'>CamanJS</button>";
$(".queue-item").append(edit_btn);
$(".queue-item").css({ "margin-top": "25px", "margin-bottom": "25px", "margin-left": "10px", "margin-right": "10px" });

// dict storing original image dataURL, parsedMeta, name
var imgDict = {};
var presetFilterToken = undefined;
var sliderFilterArray = ["0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0"];
var data_filter_array = ["brightness", "contrast", "saturation", "vibrance", "exposure", "hue", "sepia", "gamma", "noise", "clip", "sharpen", "stackBlur"];
// var presetFilterArray = [];
var globalId = undefined;

$(document).on("click", ".camanjs", function () {
    var modal_source = "#camanjs-edit-item";
    var modal = PF.obj.modal.selectors.root;
    var $item = $(this).closest("li");
    var id = $item.data("id");
    var file = CHV.fn.uploader.files[id];
    var parsedMeta = file["parsedMeta"];
    var name = file["name"];

    globalId = id;
    presetFilterToken = undefined;

    PF.fn.modal.call({
        type: "html",
        template: $(modal_source).html(),
        callback: function () {
            $(".image-preview", modal).append($('<canvas/>', { 'id': 'canvas', "class": "canvas", "data-caman-hidpi-disabled": "false" }));
            $('html').data('modal-form-values', {})

            $("#PresetFilters a").addClass("blue");
            $("#PresetFilters a").removeClass("orange");

            // var source_canvas = $(".queue-item[data-id="+id+"] .preview .canvas")[0];
            // var target_canvas = $(".image-preview .canvas", modal)[0];
            // target_canvas.width = source_canvas.width;
            // target_canvas.height = source_canvas.height;
            // var target_canvas_ctx = target_canvas.getContext('2d');
            // target_canvas_ctx.drawImage(source_canvas, 0, 0);

            var canvas = document.getElementById('canvas');
            var ctx = canvas.getContext('2d');
            var img = new Image;

            // 1st time open
            if (imgDict[id] === undefined) {
                img.onload = function () {
                    // draw canvas
                    canvas.width = img.width;
                    canvas.height = img.height;
                    ctx.drawImage(img, 0, 0);

                    var dataURL = canvas.toDataURL(file["parsedMeta"]["mimetype"]);
                    imgDict[id] = {};
                    imgDict[id]["dataURL"] = dataURL;
                    imgDict[id]["parsedMeta"] = parsedMeta;
                    imgDict[id]["name"] = name;
                    imgDict[id]["presetFilter"] = [];
                    imgDict[id]["sliderFilter"] = sliderFilterArray;

                }
                // upload from device
                if (file["url"] === undefined) {
                    img.src = URL.createObjectURL(file);
                } else {
                    // upload by url
                    // solve cross-origin problem
                    // img.setAttribute('crossorigin', 'anonymous');
                    // img.src = 'https://cors-anywhere.herokuapp.com/' + file["url"];
                    chrome.runtime.sendMessage(injectExtensionId, { url: file["url"], type: parsedMeta.mimetype }, function (response) {
                        img.src = response.dataUrl;
                    });
                }
            } else {
                // resume
                sliderFilterArray = imgDict[id]["sliderFilter"];

                img.onload = function () {
                    // draw canvas
                    canvas.width = img.width;
                    canvas.height = img.height;
                    ctx.drawImage(img, 0, 0);

                    // set the values of the sliders in last edit
                    $("#fullscreen-modal-box .Filter input").each(function (index) {
                        $(this).val(imgDict[id]["sliderFilter"][index]);
                        $(this).siblings(".FilterValue").html(imgDict[id]["sliderFilter"][index]);
                    });

                    // do filters
                    Caman(canvas, function () {
                        var temp = this;
                        this.revert(false);

                        // do silder filters
                        $.each(data_filter_array, function (index) {
                            var data_filter = data_filter_array[index];
                            var val_change = imgDict[id]["sliderFilter"][index];
                            if (val_change !== "0") {
                                if (data_filter === "gamma") {
                                    temp[data_filter](parseFloat(val_change));
                                }
                                else {
                                    temp[data_filter](parseInt(val_change));
                                }
                            }
                        });

                        // do preset filter
                        if (typeof imgDict[globalId]["presetFilter"] !== "undefined" && imgDict[globalId]["presetFilter"].length > 0) {
                            $.each(imgDict[globalId]["presetFilter"], function (index) {
                                temp[imgDict[globalId]["presetFilter"][index]]();
                            });
                        }

                        this.render(function () {
                            console.log("resume finished")
                        });
                    });
                }
                img.src = imgDict[id]["dataURL"];
            }
        },
        confirm: function () {
            canvas.toBlob(function (blob) {
                var blobFile = new Blob([blob], { type: imgDict[id]["parsedMeta"]["mimetype"] });
                blobFile["parsedMeta"] = imgDict[id]["parsedMeta"];
                blobFile["name"] = imgDict[id]["name"];
                CHV.fn.uploader.files[id] = blobFile;
            });

            if (presetFilterToken) {
                imgDict[id]["presetFilter"].push(presetFilterToken);
            }
            imgDict[id]["sliderFilter"] = sliderFilterArray;

            var canvasPreview = $(".queue-item[data-id=" + id + "] .preview").find("canvas")[0];
            var ctxPreview = canvasPreview.getContext('2d');
            canvasPreview.width = $(".image-preview").find("canvas")[0].width;
            canvasPreview.height = $(".image-preview").find("canvas")[0].height;
            ctxPreview.drawImage($(".image-preview").find("canvas")[0], 0, 0);


            // close modal
            PF.fn.modal.close();
            return;
        }
    });
});

// clear the imgDict if the queue-item is empty
$(document).on("click", ".queue-item [data-action=cancel]", function () {
    if (Object.keys(CHV.fn.uploader.files).length < 1) {
        // clear the imgDict
        imgDict = {};
    }
});

$(document).on("click", "[data-action=upload]", function(){
    imgDict = {};
    presetFilterToken = undefined;
    sliderFilterArray = ["0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0"];
});

// silders filters(not stacked)
// $(document).on("change", ".Filter input", function () {
//     var data_filter = $(this).attr("data-filter");
//     var val_change = $(this).val();
//     $(this).siblings(".FilterValue").html(val_change);
//     Caman('.image-preview .canvas', function () {
//         this[data_filter](parseInt(val_change));
//         this.revert(false);
//         this.render();
//     });
// });

// silders filters(stacked)
$(document).on("change", "#fullscreen-modal-box .Filter input", function () {
    sliderFilterArray = [];
    $("#fullscreen-modal-box .Filter input").each(function () {
        var val_change = $(this).val();
        sliderFilterArray.push(val_change);
        $(this).siblings(".FilterValue").html(val_change);
    });

    Caman("#fullscreen-modal-box .image-preview .canvas", function () {
        var self = this;
        this.revert(false);

        // apply custom filters
        $.each(data_filter_array, function (index) {
            var data_filter = data_filter_array[index];
            var val_change = sliderFilterArray[index];
            if (val_change !== "0") {
                if (data_filter === "gamma") {
                    self[data_filter](parseFloat(val_change));
                }
                else {
                    self[data_filter](parseInt(val_change));
                }
            }
        });

        // apply the preset filters saved before
        if (typeof imgDict[globalId]["presetFilter"] !== "undefined" && imgDict[globalId]["presetFilter"].length > 0) {
            $.each(imgDict[globalId]["presetFilter"], function (index) {
                self[imgDict[globalId]["presetFilter"][index]]();
            });
        }

        // apply the preset filter in the current edit state
        if (presetFilterToken) {
            self[presetFilterToken]();
        }

        this.render(function () {
            console.log("filters applied")
        });
    });
})

// preset filters
$(document).on("click", "#PresetFilters a", function () {
    var tempObj = this;
    var tempHtml = $(this).html();
    var preset_filter = $(this).attr("data-preset");
    if (preset_filter === "original") {
        presetFilterToken = undefined;
    } else {
        presetFilterToken = preset_filter;
    }

    $("#PresetFilters a").addClass("blue");
    $("#PresetFilters a").removeClass("orange");

    $(this).removeClass("blue");
    $(this).addClass("orange");
    $(this).html("Rending");

    // // reset the sliders value
    // $("#fullscreen-modal-box .Filter input").each(function () {
    //     $(this).val(0);
    //     $(this).siblings(".FilterValue").html(0);
    // });

    Caman('.image-preview .canvas', function () {
        var self = this;
        this.revert(false);

        // apply custom filters in the current state
        if (preset_filter !== "original") {
            $.each(data_filter_array, function (index) {
                var data_filter = data_filter_array[index];
                var val_change = sliderFilterArray[index];
                if (val_change !== "0") {
                    if (data_filter === "gamma") {
                        self[data_filter](parseFloat(val_change));
                    }
                    else {
                        self[data_filter](parseInt(val_change));
                    }
                }
            });
        } else {
            $("#fullscreen-modal-box .Filter input").each(function () {
                sliderFilterArray = ["0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0"];
                $(this).val(0);
                $(this).siblings(".FilterValue").html(0);
            });
        }

        // apply the preset filters saved before
        if (typeof imgDict[globalId]["presetFilter"] !== "undefined" && imgDict[globalId]["presetFilter"].length > 0) {
            $.each(imgDict[globalId]["presetFilter"], function (index) {
                self[imgDict[globalId]["presetFilter"][index]]();
            });
        }

        // apply the preset filter
        if (presetFilterToken) {
            self[presetFilterToken]();
        }

        this.render(function () {
            console.log(preset_filter + " completed");
            $(tempObj).html(tempHtml);
        });
    });
});