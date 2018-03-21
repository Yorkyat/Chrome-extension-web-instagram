// add edit with camanjs button
var edit_btn = "<button type='button' class='camanjs btn green'>CamanJS</button>";
$(".queue-item").append(edit_btn);
$(".queue-item").css({ "margin-top": "25px", "margin-bottom": "25px", "margin-left": "10px", "margin-right": "10px" });

$(document).on("click", ".camanjs", function () {
    var modal_source = "#camanjs-edit-item";
    var modal = PF.obj.modal.selectors.root;
    var $item = $(this).closest("li");
    var id = $item.data("id");
    var file = CHV.fn.uploader.files[id];
    PF.fn.modal.call({
        type: "html",
        template: $(modal_source).html(),
        callback: function () {
            $(".image-preview", modal).append($('<canvas/>', { 'id': 'canvas', "class": "canvas", "data-caman-hidpi-disabled": "false" }));

            // var source_canvas = $(".queue-item[data-id="+id+"] .preview .canvas")[0];
            // var target_canvas = $(".image-preview .canvas", modal)[0];
            // target_canvas.width = source_canvas.width;
            // target_canvas.height = source_canvas.height;
            // var target_canvas_ctx = target_canvas.getContext('2d');
            // target_canvas_ctx.drawImage(source_canvas, 0, 0);
            
            // draw canvas
            var canvas = document.getElementById('canvas');
            var ctx = canvas.getContext('2d');
            var img = new Image;
            img.onload = function () {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
            }
            // upload from device
            if (file["url"] === undefined) {
                img.src = URL.createObjectURL(file);
            } else {
                // upload by url
                // solve cross-origin problem
                img.setAttribute('crossorigin', 'anonymous');
                img.src = 'https://cors-anywhere.herokuapp.com/' + file["url"];
            }
        }
    });
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
    var data_filter_array = [];
    var val_change_array = [];
    $("#fullscreen-modal-box .Filter input").each(function () {
        var data_filter = $(this).attr("data-filter");
        var val_change = $(this).val();
        data_filter_array.push(data_filter);
        val_change_array.push(val_change);
        $(this).siblings(".FilterValue").html(val_change);
    });
    Caman("#fullscreen-modal-box .image-preview .canvas", function () {
        var self = this;
        $.each(data_filter_array, function (index) {
            var data_filter = data_filter_array[index];
            var val_change = val_change_array[index];
            if (data_filter == "gamma") {
                self[data_filter](parseFloat(val_change));
            }
            else {
                self[data_filter](parseInt(val_change));
            }
        });
        this.revert(false);
        this.render(function(){
            console.log("filters applied")
        });
    });
})

// preset filters
$(document).on("click", "#PresetFilters a", function () {
    var preset_filter = $(this).attr("data-preset");
    Caman('.image-preview .canvas', function () {
        this[preset_filter]();
        this.revert(false);
        this.render(function(){
            console.log(preset_filter + " completed");
        });
    });
});