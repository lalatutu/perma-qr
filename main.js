// =======================================
//          QR CODE
// =======================================
var awesomeQR;
require(['js/qrcode/awesome-qr'], function (instance) {
    awesomeQR = instance;
    // generate(); // default
});

var backgroundImg;
var logoImg;
var backgroundGIFArray;

function handleFileSelectBKG(evt) {
    var files = evt.target.files; // FileList object
    // files is a FileList of File objects. List some properties.
    var output = [];
    if (files.length <= 0) return;
    var file = files[0];
    if (!file.type.toString().startsWith("image/")) {
        $("#image-result").hide();
        alert('Oops, the file type is not correct.');
        return;
    }
    var url = URL.createObjectURL(file);
    var img = new Image();
    backgroundImg = undefined;
    img.onload = function () {
        $('#backgroundImgLoaded').show();
        backgroundImg = img;
        $("#background-img-select").text("Remove background image");
        generate();
    };
    img.src = url;

}

function handleFileSelectLOGO(evt) {
    var files = evt.target.files; // FileList object
    // files is a FileList of File objects. List some properties.
    var output = [];
    if (files.length <= 0) return;
    var file = files[0];
    if (!file.type.toString().startsWith("image/")) {
        $("#image-result").hide();
        alert('Oops, the file type is not correct.');
        return;
    }
    var url = URL.createObjectURL(file);
    var img = new Image();
    logoImg = undefined;
    img.onload = function () {
        $('#logoImgLoaded').show();
        logoImg = img;
        $("#logo-img-select").text("Remove logo image");
        generate();
    };
    img.src = url;


}

function handleFileSelectBKGGIF(evt) {
    var files = evt.target.files; // FileList object
    // files is a FileList of File objects. List some properties.
    var output = [];
    if (files.length <= 0) return;
    var file = files[0];
    if (!file.type.toString().startsWith("image/gif")) {
        $("#image-result").hide();
        alert('Oops, the file type is not correct.');
        return;
    }
    var r = new FileReader();
    r.onload = function (e) {
        backgroundGIFArray = e.target.result;
        $("#background-gif-img-select").text("Remove background GIF");
        generate();
    };
    r.readAsArrayBuffer(file);
}

$("#auto-color").change(function () {
    if (this.checked) {
        $('#c-ctr').hide();
    } else {
        $('#c-ctr').show();
    }
});

$("#binarize").change(function () {
    if (!this.checked) {
        $('#b-ctr').hide();
    } else {
        $('#b-ctr').show();
    }
});

$(function () {
    document.getElementById('background-img-select-native').addEventListener('change', handleFileSelectBKG, false);
    document.getElementById('logo-img-select-native').addEventListener('change', handleFileSelectLOGO, false);
    document.getElementById('background-gif-img-select-native').addEventListener('change', handleFileSelectBKGGIF, false);
    $("#background-img-select").click(function () {
        if (backgroundImg === undefined) {
            $("#background-img-select-native").click();
        } else {
            $('#backgroundImgLoaded').hide();
            backgroundImg = undefined;
            $("#background-img-select").text("Select background image");
        }
    });
    $("#logo-img-select").click(function () {
        if (logoImg === undefined) {
            $("#logo-img-select-native").click();
        } else {
            $('#logoImgLoaded').hide();
            logoImg = undefined;
            $("#logo-img-select").text("Select logo image");
        }
    });
    $("#background-gif-img-select").click(function () {
        if (backgroundGIFArray === undefined) {
            $("#background-gif-img-select-native").click();
        } else {
            backgroundGIFArray = undefined;
            $("#background-gif-img-select").html("Select background GIF<sup> NEW</sup>");
        }
    });

    if (window.File && window.FileReader && window.FileList && window.Blob) {
        $("#file-api-issue").hide();
        $("#file-form").show();
    } else {
        $("#file-api-issue").show();
        $("#file-form").hide();
    }
});

// =======================================
//          LOGIN ARWEAVE
// =======================================
function clickLogin() {
    $('#jwk-cli').trigger('click');
}

function beforeLogin() {
    $('#not-login').css('display','block');
    $('#login-success').css('display','none');
    $('#btn-login').html('LOGGING ...').prop('disabled','disabled');
}

function onLoginSuccess() {
    $('#btn-login').html('LOGIN').prop('disabled',false);

    $('#ar_address').html(ar.getAddress());
    $('#balance_winston').html(ar.getBalance().winston);
    $('#balance_ar').html(ar.getBalance().ar);

    $('#not-login').css('display','none');
    $('#login-success').css('display','block');
    $('#save-box').css('display','block');

    getMyLists();
}

function onLoginError(err) {
    $('#btn-login').html('LOGIN').prop('disabled',false);
}

function readJwk (evt) {
    var files = evt.target.files;
    var file = files[0];
    var reader = new FileReader();
    reader.onload = function(event) {
        var jwk = event.target.result;
        jwk = JSON.parse(jwk);
        ar.init().then(function () {
            ar.login(jwk);
        });
    };
    reader.readAsText(file);
}

// =======================================
//          SUBMIT TX ARWEAVE
// =======================================

function download(tx_id) {
    var filename = $('#filename').val();
    if (typeof tx_id === 'undefined') {
        var img_id = 'qrcode';
        if (! filename) filename = "QRCode";
    }else{
        // download old
        var img_id = 'img' + tx_id;
        filename = $('#filename' + tx_id).html();
    }

    var data = $("#" + img_id).attr('src');
    var a = document.createElement("a");
    a.href = data; //Image Base64 Goes here
    a.download = filename + '.png'; //File name Here
    a.click(); //Downloaded file
}

function generate() {
    try {
        var options = {
            text: $('#contents').val(),
            size: $('#in-size').val(),
            margin: $('#in-margin').val(),
            dotScale: parseFloat($('#in-dotScale').val()),
            maskedDots: $('#maskedDots').is(":checked"),
            colorDark: $('#in-cd').val(),
            colorLight: $('#in-cl').val(),
            correctLevel: AwesomeQRCode.CorrectLevel.H,
            backgroundImage: backgroundImg,
            backgroundDimming: $('#in-backgroundDimming').val(),
            logoImage: logoImg,
            logoScale: parseFloat($('#in-logo-scale').val()),
            logoMargin: $('#in-logo-margin').val(),
            logoCornerRadius: $('#in-logo-radius').val(),
            autoColor: $('#auto-color').is(":checked"),
            whiteMargin: $('#whiteMargin').is(":checked"),
            binarize: $('#binarize').is(":checked"),
            binarizeThreshold: $('#in-bin-threshold').val(),
            gifBackground: backgroundGIFArray,
            bindElement: 'qrcode',
            callback: function (data) {
            }
        };
        awesomeQR.create(options);
        $('#btn-submit').prop('disabled',false);
    } catch (e) {
        console.error(e);
    }
}

async function clickSubmit(){
    // get file name
    var filename = $('#filename').val();
    if (! filename) {
        alert('Please enter file name !');
        $('#filename').focus();
        return ;
    }

    if (! ar.hasLogin()){
        alert('Please login before save file !');
        clickLogin();
        return;
    }
    var data_qr = $("#qrcode").attr('src');
    $('#btn-submit').prop('disabled','disabled');

    let response = await ar.submitTx(JSON.stringify({
        'src': data_qr,
        'name': filename,
        'content': $('#contents').val(),
    }),{
        'App-Name': 'perma-qr',
        'App-Version': '1.0.0',
        'Type': 'image/qr',
    });

    if(response.status === 200){
        alert('File saved successfully!');
    }else{
        alert('Error! ' + response.statusText);
    }


}

async function getMyLists() {
    const txids = await ar.arweave.arql({
        op: "and",
        expr1: {
            op: "equals",
            expr1: "from",
            expr2: ar.getAddress(),
        },
        expr2: {
            op: 'and',
            expr1: {
                op: 'equals',
                expr1: 'App-Name',
                expr2: 'perma-qr'
            },
            expr2: {
                op: 'equals',
                expr1: 'Type',
                expr2: 'image/qr'
            }
        }
    });
    await getTransactionInfo(txids);
}

async function getTransactionInfo(txids) {
    $('#my-list').html('');
    var my_lists = [];
    for (var i = 0; i < txids.length; i++) {
        var txId = txids[i];
        const tx = ar.arweave.transactions.get(txId).then(transaction => {
            // Get the data base64 decoded as a string.
            let data = transaction.get('data', {decode: true, string: true});
            try {
                data = JSON.parse(data);
                my_lists.push(data);

                // data.id = txId;
                var html =
                    '<div class="col s12 m4 l3 box-mine">' +
                    '    <div style="width: 250px; display: inline-block;">' +
                    '        <div class="card-image" style="box-shadow: 9px 12px 22px -5px rgba(163,160,163,0.72);">' +
                    '            <img id="img' + txId + '" style="margin-top: 0;" class="responsive-img" src="' + data.src + '">' +
                    '        </div>' +
                    '        <div class="card-content" style="text-align: center;">' +
                    '            <p align="center" class="filename" id="filename' + txId + '">' + data.name + '</p><br>' +
                    '            <p class="file_content">' + data.content + '</p><br>' +
                    '            <button class="btn btn-sm btn-primary blue" onclick="download(\'' + txId + '\')">Download</button>' +
                    '        </div>' +
                    '    </div>' +
                    '</div>';
                $('#my-list').append(html);
            }catch (e) {
                console.log(e);
            }
            $('#lists_count').html($('.box-mine').length);
        });
    }
    $('#div-my-list').css('display','block');
    return my_lists;
}
