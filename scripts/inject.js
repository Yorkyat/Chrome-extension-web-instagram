var edit_btn = "<button type='button' class='camanjs btn green'>CamanJS</button>";
$(".queue-item").append(edit_btn);

$(".queue-item").css({"margin-top": "25px", "margin-bottom": "25px", "margin-left": "10px", "margin-right": "10px"});

$(document).on("click", ".camanjs", function(){
    var modal_source = "<div>Hello World</div>";
    PF.fn.modal.call({
        type: "html",
        template: $(modal_source).html(),
    });
});