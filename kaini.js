let lang = "en";
var globalship = null;
var globalbg = null;
var globalavatar = null;
let loader;

let tabManager;
var k2 = {};
var colle = {};
var shipDB = {};
var fleets = [
    new Array(6),
    new Array(6),
    new Array(6),
    new Array(6),
];
var fleetLevels = [
    [1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1]
];
var shipTypes = {};

function setCookie(name, value, domain) {
    var dom = domain ? ("; domain=" + domain) : '';
    document.cookie = name + "=" + encodeURIComponent(value) + "; max-age=" + (60 * 60 * 24 * 365) + "; path=/" + dom;
}

function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
    }
    return null;
}

function store(key, value) {
    if (storage) {
        localStorage.setItem(key, value)
    } else {
        setCookie(key, value);
    }
}

function restore(key) {
    var item = null;
    if (storage) {
        item = localStorage.getItem(key)
        if (item) return item;
    }
    return getCookie(key);
}

function getBase64Image(img) {
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;

    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    var dataURL = canvas.toDataURL("image/png");

    return dataURL;
}

var storage = (function() {
    var uid = new Date;
    var storage;
    var result;
    try {
        (storage = window.localStorage).setItem(uid, uid);
        result = storage.getItem(uid) == uid;
        storage.removeItem(uid);
        return result && storage;
    } catch (exception) {}
}());

$(document).ready(function() {
    $(".shipClass").each(function() {
        var arrLength = $(this).find("input").length;
        var blankArray = new Array(arrLength);
        while (arrLength--) blankArray[arrLength] = false;
        k2[this.id] = blankArray;
    });

    var loading = {};
    var selectedFleet = 0;
    var selectedSlot = 0;

    var conversion = {};
    var abyssDB = {};
    var flagRarity = 0;
    

    var deskoffsetdb = {
        "016.png": { x: 0, y: -140 },
        "017.png": { x: 0, y: -140 },
        "021.png": { x: 0, y: -140 },
        "026.png": { x: 0, y: -140 },
        "037.png": { x: 0, y: -140 },
        "042a.png": { x: 0, y: 70 },
        "042b.png": { x: 0, y: 70 },
        "046.png": { x: 0, y: -140 },
        "057.png": { x: 0, y: -140 },
    }

    var c = document.getElementById("result");
    var ctx = c.getContext("2d");
    var hexagonAngle = 0.523598776,
        sideLength = 24;
    var hexHeight = Math.sin(hexagonAngle) * sideLength;
    var hexRadius = Math.cos(hexagonAngle) * sideLength;
    var hexRectangleHeight = sideLength + 2 * hexHeight;
    var hexRectangleWidth = 2 * hexRadius;
    var centerx = (hexRectangleHeight * 5 / 4 - hexRectangleWidth) / 2;
    var centery = (hexRectangleHeight * 5 / 4 - hexRectangleHeight) / 2 + 5;
    var textfont = "'Ubuntu', 'メイリオ', Times, serif";
    var numberfont = "'Exo', 'メイリオ', Times, serif";

    var recalculateSides = function(side) {
        sideLength = side;
        hexHeight = Math.sin(hexagonAngle) * sideLength;
        hexRadius = Math.cos(hexagonAngle) * sideLength;
        hexRectangleHeight = sideLength + 2 * hexHeight;
        hexRectangleWidth = 2 * hexRadius;
        centerx = (hexRectangleHeight * 5 / 4 - hexRectangleWidth) / 2;
        centery = (hexRectangleHeight * 5 / 4 - hexRectangleHeight) / 2 + 5;
    };

    var saveAll = function() {
        var furnitures = $(".furnitureClass input:checked").toArray();
        var furnObj = {};
        for (var i in furnitures) {
            furnObj[furnitures[i].name] = furnitures[i].id;
        }
        $(".shipClass").each(function() {
            var abbr = this.id;
            var k2s = $(this).find("input");
            var k2Array = {};
            k2s.each(function(i) {
                k2Array[this.id] = $(this).prop("checked");
            });
            k2[abbr] = k2Array;
        });
        store("ttkName", $("input[name='name']").val());
        store("ttkLvl", $("input[name='level']").val());
        store("ttkServer", $("select[name='server']").val());
        store("ttkFurn", Base64.encode(JSON.stringify(furnObj)));
        store("ttkFurnCam", $("#roomY").val());
        store("ttkTint", $("#tint-color").val());
        store("ttkHexOpa", $("#hexOpa").val());
        store("k2", Base64.encode(JSON.stringify(k2)));
        store("secretaryCam", JSON.stringify([$("#customX").val(), $("#customY").val(), $("#customZ").val()]));
        store("secretaryHit", $(".damaged").length > 0 && !$($(".damaged")[0]).hasClass("abyss")) ? true : false;
        store("fleet", Base64.encode(fleets.join("|")));
        store("fleetLvl", Base64.encode(fleetLevels.join("|")));
        store("colle", Base64.encode(JSON.stringify(colle)));
        store("bg", globalbg);
        store("bgUse", $("#useBG").prop("checked"));
        store("bgCam", JSON.stringify([$("#bgX").val(), $("#bgY").val(), $("#bgZ").val()]));
        store("bgStretch", $("#bgStretch").prop("checked"));
        store("avatar", globalavatar);
    };

    var loadAll = function() {
        $(".flagship").removeClass("flagship");
        $(".damaged").removeClass("damaged");
        $("input[name='name']").val(restore("ttkName"));
        $("input[name='level']").val(restore("ttkLvl"));
        var bgCamTemp = restore("bgCam");
        bgCamTemp = bgCamTemp ? JSON.parse(bgCamTemp) : [0, 0, 100]
        $("#bgX").val(bgCamTemp[0]);
        $("#bgY").val(bgCamTemp[1]);
        $("#bgZ").val(bgCamTemp[2]);
        $("#useBG").prop("checked", (!restore("bgUse") || restore("bgUse") == "true"));
        var secretaryCamTemp = restore("secretaryCam");
        secretaryCamTemp = secretaryCamTemp ? JSON.parse(secretaryCamTemp) : [0, 0, 0]
        $("#customX").val(secretaryCamTemp[0]);
        $("#customY").val(secretaryCamTemp[1]);
        $("#customZ").val(secretaryCamTemp[2]);
        $("#roomY").val(restore("ttkFurnCam") || 0);
        $("#tint-color").val(restore("ttkTint") || "#ffffff");
        $("#hexOpa").val(restore("ttkHexOpa") || 0.33);
        $("#hexOpa").val(restore("ttkHexOpa") || 0.33);
        $("#bgStretch").prop("checked", (!restore("bgStretch") || restore("bgStretch") == "true"));

        globalbg = restore("bg");
        if (globalbg != 'null') $('#bg').attr('src', globalbg);

        globalavatar = restore("avatar");
        if (globalavatar != 'null') {
            $('#avatar').attr('src', globalavatar);
        } else $('#avatar').removeAttr('src');
        var serverTemp = restore("ttkServer");
        if (serverTemp != 'null') {
            $("select[name='server']").val(serverTemp);
        }

        var k2Temp = restore("k2");
        k2Temp = k2Temp ? JSON.parse(Base64.decode(k2Temp)) : null;
        var colleTemp = restore("colle");
        colleTemp = colleTemp ? JSON.parse(Base64.decode(colleTemp)) : null;
        var furnTemp = restore("ttkFurn");
        furnTemp = furnTemp ? JSON.parse(Base64.decode(furnTemp)) : null;
        var fleetsTemp = restore("fleet");
        fleetsTemp = fleetsTemp ? Base64.decode(fleetsTemp).split("|") : null;
        for (var i in fleetsTemp) {
            fleetsTemp[i] = fleetsTemp[i].split(",");
        }
        var fleetLevelsTemp = restore("fleetLvl");
        fleetLevelsTemp = fleetLevelsTemp ? Base64.decode(fleetLevelsTemp).split("|") : null;
        for (var i in fleetLevelsTemp) {
            fleetLevelsTemp[i] = fleetLevelsTemp[i].split(",");
        }

        if (k2Temp) {
            k2 = k2Temp;
            $(".shipClass input").prop("checked", false);
            for (var i in k2) {
                for (var j in k2[i]) {
                    $("#" + j).prop("checked", k2[i][j]);
                }
            }
        }
        if (colleTemp) {
            colle = colleTemp;
            $("#colleDiv img").removeClass("selected");
            for (var i in colle) {
                $("#kore" + i).addClass("selected");
            }
        }
        if (fleetsTemp) {
            fleets = fleetsTemp;
            for (var i in fleets[0]) {
                var ship = fleets[0][i];
                if (ship !== null && ship !== "") {
                    if (i == 0) {
                        $("#" + ship).addClass("flagship");
                        if (restore("secretaryHit") == "true") $("#" + ship).next("span").addClass("damaged");
                        flagRarity = shipDB[ship.substring(4)] ? shipDB[ship.substring(4)].rarity : 0;
                    }
                    var slot = parseInt(i) + 1;
                    $("#slot" + slot).html('<img style="height:50px; width:50px;" src="' + $("#" + ship).attr("src") + '"/>');
                }
            }
        }

        if (fleetLevelsTemp) {
            fleetLevels = fleetLevelsTemp;
            for (var i in fleetLevels[0]) {
                var level = parseInt(fleetLevels[0][i]);
                if (level && level > 0) {
                    var slot = parseInt(i) + 1;
                    $("#level" + slot).val(level);
                }
            }
        }
        if (furnTemp) {
            var loadCount = 0;
            $("#buttons button").prop("disabled", true);
            $("#loadingDiv").html("Rendering...");
            var imgError = false;
            for (var i in furnTemp) {
                var furniture = furnTemp[i];
                var current = $("#" + furniture);
                current.prop("checked", true);
                var type = current.parent().parent().parent().attr("id");
                var activeImg = $("#active" + type);
                activeImg.off("load");
                if (type == "Outside") {
                    var selectedOut = $("#Outside").find(":checked");
                    var windowType = $("#Window").find(":checked").attr("data-pType");
                    var imgToLoad = selectedOut.val() + windowType;
                    var path = "furniture/outside/" + imgToLoad + ".png";
                    activeImg.attr("src", path);
                } else {
                    var imgToLoad = current.val();
                    activeImg.attr("src", "furniture/" + type.toLowerCase() + "/" + imgToLoad + ".png");
                }
                if (activeImg.prop("complete")) {
                    loadCount++;
                    if (loadCount == Object.keys(furnTemp).length) {
                        $("#buttons button").prop("disabled", false);
                        $("#loadingDiv").html("");
                        if ($("#displayRoom").hasClass("on")) {
                            drawRoom(132);
                        } else {
                            generateFunction("loadAllImgCached");
                        }
                    }
                } else {
                    activeImg.on("load", function() {
                            loadCount++;
                            if (loadCount == Object.keys(furnTemp).length) {
                                $("#buttons button").prop("disabled", false);
                                $("#loadingDiv").html(imgError ? "Couldn't find a furniture's image." : "");
                                if ($("#displayRoom").hasClass("on")) {
                                    drawRoom(132);
                                } else {
                                    generateFunction("loadAllImgLoaded");
                                }
                            }
                        })
                        .error(function(error) {
                            loadCount++;
                            imgError = true;
                            if (loadCount == Object.keys(furnTemp).length) {
                                $("#buttons button").prop("disabled", false);
                                $("#loadingDiv").html("Couldn't find a furniture's image.");
                            }
                        });
                }
            }
        } else {
            generateFunction("loadNoFurniture");
        }
    };

    var bindAvatars = function() {
        if (!$(this).hasClass("abyss")) {
            fleets[selectedFleet][selectedSlot] = $(this).prev("img").attr("id");
            $("#fleets .chosen").html('<img style="height:50px; width:50px;" src="' + $(this).prev("img").attr("src") + '"/>');
        }

        if (selectedFleet == 0 && selectedSlot == 0) {
            if (!$(this).hasClass("damaged")) {
                $(".damaged").removeClass("damaged");
            }
            $(this).toggleClass("damaged");
            $(".flagship").removeClass("flagship");
            var flagship = $(this).prev("img");
            flagship.toggleClass("flagship");
            flagRarity = shipDB[$(this).prev("img").attr("id").substring(4)] ? shipDB[$(this).prev("img").attr("id").substring(4)].rarity : 0;
            generateFunction("fleetFlagshipChange");
        }
    }

    var loadAbyssalShips = function() {
        $("#loadAbyss").remove();
        $("#avatars .hidden").removeClass("hidden");

        $.ajax({
            dataType: "json",
            timeout: 10000,
            url: (lang == "en" ? 'db2.json?v=13' : 'db2j.json?v=13'),
            success: function(data) {
                abyssDB = data;
                $("#loadingDiv").html("Loading images: ");
                $("#loadingProgress").show().html("0/" + Object.keys(data).length);
                var i = 0;
                for (var e in abyssDB) {
                    var ship = data[e];
                    if (ship.name) {
                        var newDiv = $('<img class="abyss tooltip2" title="' + ship.full + '" src="icons/' + ship.type + '/' + e + '.png" id="icon' + e + '"></img>');
                        var extraSpan = $('<span class="abyss" id="hit' + e + '">破</span>');
                        newDiv.on("load", function() {
                            i++;
                            $("#loadingProgress").html(i + "/" + Object.keys(data).length);
                            if (i == Object.keys(data).length) {
                                $("#loadingDiv").html("");
                                $("#loadingProgress").hide();
                            }
                        });
                        newDiv.on("click", function() {
                            $(".flagship").removeClass("flagship");
                            $(".damaged").removeClass("damaged");
                            $(this).toggleClass("flagship");
                            flagRarity = 0;
                            generateFunction("fleetShipChangeAbyss");
                        });
                        if ($(".shipList [data-name='" + ship.name + "']").length == 0) {
                            $(".div" + ship.type).append('<div><label>' + ship.name.replace(new RegExp('_', 'g'), ' ') + '</label><div data-name="' + ship.name + '" class="' + ship.type + '"></div></div>');
                        }
                        $("#avatars [data-name='" + ship.name + "']").append(newDiv);
                        if (ship.damageable) {
                            $("#avatars [data-name='" + ship.name + "']").append(extraSpan);
                        }
                    }
                }
                $("#avatars span").unbind("click").on("click", bindAvatars);
                $('.tooltip2').tooltipster();
            },
            error: function() {
                $("#loadingDiv").html("Can't find Abyssal DB, please contact Harvestasya or Nya-chan on Github");
            }
        });
    }

    var generateFunction = function(source) {
        console.log(source);
        $("#loadingDiv").html("Rendering...");
        $("#buttons button").prop('disabled', true);
        $("#save").prop("disabled", true);

        ctx.clearRect(0, 0, c.width, c.height);
        ctx.save();
        ctx.fillStyle = "#666";
        ctx.fillRect(0, 0, c.width, c.height);
        if ($("#useBG").prop("checked")) {
            drawRoom($("#buttonToggles .active").attr("id") != "displayBadge" ? 132 : parseInt(document.getElementById("roomY").value));
            ctx.globalAlpha = 0.33;
            ctx.fillRect(0, 0, c.width, c.height);
        } else {
            var bg = document.getElementById("bg");
            var stretch = $("#bgStretch").prop("checked");
            var x = $("#bgX").val() || 0;
            var y = $("#bgY").val() || 0;
            var z = $("#bgZ").val() || 0;
            ctx.drawImage(bg, x, y, stretch ? c.width : bg.width * (z / 100), stretch ? c.height : bg.height * (z / 100));
        }
        ctx.restore();

        ctx.strokeRect(0, 0, c.width, c.height);
        redraw();
    }

    var drawSecretary = function(callback, hideAvatar) {
        var avatarImg = $('#avatar');
        var selected = $(".flagship")[0] ? $(".flagship")[0].id.substring(4) : null;
        var damaged = false;
        if (selected && $("#hit" + selected).hasClass("damaged")) damaged = true;
        var dir = $(".flagship").parent().length > 0 ? $(".flagship").parent().attr("class") : null;

        if (globalship != null) {
            var img = new Image();
            img.onload = function() {
                var offx = 0;
                var offy = 0;

                offx += document.getElementById("customX").value ? parseInt(document.getElementById("customX").value) : 0;
                offy += document.getElementById("customY").value ? parseInt(document.getElementById("customY").value) : 0;

                ctx.save();
                var scale = document.getElementById("customZ").value ? parseInt(document.getElementById("customZ").value) + 100 : 100;
                scale = scale / 100;
                ctx.translate(c.width - img.width * 7 / 8 + offx, c.height / 2 - img.height / 5 + offy);
                ctx.translate(img.width / 2, img.height / 2);
                ctx.scale(scale, scale);
                ctx.drawImage(img, -img.width / 2, -img.height / 2);
                ctx.restore();

                callback();

                if (!hideAvatar) {
                    drawCustomAvatar(ctx);
                }
            };
            img.onerror = callback;

            img.src = globalship;
        } else if (selected) {
            var img = new Image();
            img.onload = function() {
                var offx = 0;
                var offy = 0;
                if (flagRarity == 0 && abyssDB[selected]) {
                    if (damaged && abyssDB[selected].offset2) {
                        offx = abyssDB[selected].offset2.x;
                        offy = abyssDB[selected].offset2.y;
                    } else {
                        offx = abyssDB[selected].offset.x;
                        offy = abyssDB[selected].offset.y;
                    }
                } else if (shipDB[selected]) {
                    if (damaged && shipDB[selected].offset2) {
                        offx = shipDB[selected].offset2.x;
                        offy = shipDB[selected].offset2.y;
                    } else if (shipDB[selected].offset) {
                        offx = shipDB[selected].offset.x;
                        offy = shipDB[selected].offset.y;
                    }
                }

                offx += document.getElementById("customX").value ? parseInt(document.getElementById("customX").value) : 0;
                offy += document.getElementById("customY").value ? parseInt(document.getElementById("customY").value) : 0;

                ctx.save();
                var scale = document.getElementById("customZ").value ? parseInt(document.getElementById("customZ").value) + 100 : 100;
                if (scale >= 50 && scale <= 150) {
                    scale = scale / 100;
                    ctx.translate(c.width - img.width * 7 / 8 + offx, c.height / 2 - img.height / 5 + offy);
                    ctx.translate(img.width / 2, img.height / 2);
                    ctx.scale(scale, scale);
                    ctx.drawImage(img, -img.width / 2, -img.height / 2);
                } else {
                    ctx.drawImage(img, c.width - img.width * 7 / 8 + offx, c.height / 2 - img.height / 5 + offy);
                }
                ctx.restore();

                callback();

                if (!hideAvatar) {
                    if (!avatarImg.attr("src")) {
                        drawDefaultAvatar(ctx, selected, flagRarity);
                    } else {
                        drawCustomAvatar(ctx);
                    }
                }
            };
            img.onerror = callback;

            img.src = "full/" + dir + "/" + selected + (damaged ? "x" : "") + ".png";
        } else {
            callback();

            if (avatarImg.attr("src") && !hideAvatar) {
                drawCustomAvatar(ctx);
            }
        }
    }

    var drawDefaultAvatar = function(ctx, id, rarity) {
        var rarity = document.getElementById("r" + rarity);
        var icon = document.getElementById("icon" + id);
        ctx.save();
        ctx.fillStyle = "black";
        ctx.fillRect(35, c.height*0.1875, 100, 100);
        ctx.strokeRect(35, c.height*0.1875, 100, 100);
        ctx.restore();
        ctx.drawImage(rarity, 30, 5, 100, 100, 35, c.height*0.1875, 100, 100);
        ctx.drawImage(icon, 35, c.height*0.1875);
    }

    var drawCustomAvatar = function(ctx) {
        var avatar = document.getElementById("avatar");
        ctx.save();
        ctx.fillStyle = "transparent";
        ctx.fillRect(35, c.height*0.1875, 100, 100);
        ctx.strokeRect(35, c.height*0.1875, 100, 100);
        ctx.restore();
        ctx.drawImage(avatar, 35, c.height*0.1875, 100, 100);
    }

    var redraw = function() {
        var mode = $("#buttonToggles .active").attr("id");
        if (mode == "displayBadge") {
            if ($("#k2").prop("checked")) {
                drawSecretary(drawNewBadge);
            } else {
                drawSecretary(drawBadge);
            }
        } else if (mode == "displayPoster") {
            drawSecretary(drawPoster, true);
        } else if (mode == "displayRoom") {
            drawRoom(132);
        }
    }

    var drawPoster = function() {
        var newLength = 10;
        recalculateSides(newLength);
        ctx.save();
        var name = $("[name='name']")[0];
        var level = $("[name='level']")[0];
        var server = $("[name='server'] :selected").text();
        var useBlue = $("#useBlue").prop("checked");
        var maxPerLine = 40;
        var linebarwidth = newLength * (2 * Math.sin(Math.PI / 2) + 1);
        var line1 = 55;
        var bottomLine = c.height - 10;
        var row1 = 40;
        var row1box = row1 + 15;
        var row2 = row1 + hexRadius;
        var row2box = row1box + hexRadius;
        var progressrow = 530;
        var progressrowbox = 540;

        ctx.font = "20px " + textfont;
        ctx.imageSmoothingEnabled = true;
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'black';
        if (name.value) {
            drawText(name.value, 20, 25, 3);
        } else {
            drawText((lang == "en" ? "Nameless Admiral" : "無名提督"), 20, 25, 3);
        }

        ctx.save();
        ctx.font = "10px " + textfont;
        ctx.globalCompositeOperation = "lighter";
        ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
        ctx.strokeStyle = 'transparent';
        var date = new Date();
        drawText(date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(), 5, c.height - 5, 3);
        ctx.restore();

        ctx.font = "14px " + textfont;

        ctx.textAlign = "right";
        drawText((lang == "en" ? "DE" : "海"), row1, line1 + newLength - 9);
        var numDE = 0;
        var maxDE = $("#colleDiv .divDE img.selected").length;
        ctx.save();
        ctx.fillStyle = "white";

        $("#colleDiv .divDE img").each(function(i) {

            var x = row1box + numDE * hexRectangleWidth;
            var y = Math.floor(numDE / maxPerLine) * +linebarwidth / 2 + line1 - 15;
            var img = document.getElementById(this.id);
            drawHexagon(img, x, y, $(this).hasClass("selected"), false);

            numDE++;
        });
        ctx.textAlign = "left";
        ctx.font = "14px " + numberfont;
        drawText(maxDE + "/" + numDE + " (" + (maxDE / numDE * 100).toFixed() + "%)", row1box + numDE * hexRectangleWidth + 8, line1);
        ctx.restore();

        var line2 = line1 + linebarwidth / 2 + linebarwidth / 4;

        ctx.font = "14px " + textfont;

        ctx.textAlign = "right";
        drawText((lang == "en" ? "DD" : "駆"), row2, line2 + newLength - 9);
        var numDD = 0;
        var maxDD = $("#colleDiv .divDD img.selected").length;
        ctx.save();
        ctx.fillStyle = "white";

        $("#colleDiv .divDD img").each(function(i) {
            var x = row2box + numDD % maxPerLine * hexRectangleWidth;
            if (Math.floor(numDD / maxPerLine % 2) > 0) {
                x = row2box + (maxPerLine - numDD % maxPerLine) * hexRectangleWidth - hexRadius;
            }
            var y = Math.floor(numDD / maxPerLine) * +linebarwidth / 2 + line2 - 15;
            var img = document.getElementById(this.id);
            drawHexagon(img, x, y, $(this).hasClass("selected"), false);

            numDD++;
        });
        ctx.textAlign = "left";
        ctx.font = "14px " + numberfont;
        drawText(maxDD + "/" + numDD + " (" + (maxDD / numDD * 100).toFixed() + "%)", row2box + maxPerLine * hexRectangleWidth + 8, line2);
        ctx.restore();


        var line3 = line2 + linebarwidth + linebarwidth / 4 + Math.floor(numDD / maxPerLine) * 8;
        var line4 = line3 + linebarwidth / 2 + linebarwidth / 4;
        var line5 = line4 + linebarwidth / 2 + linebarwidth / 4;
        var line6 = line5 + linebarwidth / 2 + linebarwidth / 4;
        var line7 = line6 + linebarwidth / 2 + linebarwidth / 4;
        var line8 = line7 + linebarwidth / 2 + linebarwidth / 4;
        var line9 = line8 + linebarwidth / 2 + linebarwidth / 4;

        drawText((lang == "en" ? "CL" : "軽巡"), row1, line3 + newLength - 9);
        var numCL = 0;
        var maxCL = $("#colleDiv .divCL img.selected").length;
        ctx.save();
        ctx.fillStyle = "white";
        $("#colleDiv .divCL img").each(function() {
            var x = row1box + numCL * hexRectangleWidth;
            var y = line3 - 15;
            var img = document.getElementById(this.id);
            drawHexagon(img, x, y, $(this).hasClass("selected"), false);

            numCL++;
        });
        ctx.textAlign = "left";
        ctx.font = "14px " + numberfont;
        drawText(maxCL + "/" + numCL + " (" + (maxCL / numCL * 100).toFixed() + "%)", row1box + numCL * hexRectangleWidth + 8, line3);
        ctx.restore();

        drawText((lang == "en" ? "CA" : "重巡"), row2, line4 + newLength - 9);
        var numCA = 0;
        var maxCA = $("#colleDiv .divCA img.selected").length;
        var blue = 0;
        ctx.save();
        ctx.fillStyle = "white";
        $("#colleDiv .divCA img").each(function() {
            var x = row2box + numCA * hexRectangleWidth;
            var y = line4 - 15;
            var img = document.getElementById(this.id);
            drawHexagon(img, x, y, $(this).hasClass("selected"), false);

            numCA++;
        });
        ctx.textAlign = "left";
        ctx.font = "14px " + numberfont;
        drawText(maxCA + "/" + numCA + " (" + (maxCA / numCA * 100).toFixed() + "%)", row1box + numCA * hexRectangleWidth + 8, line4);
        ctx.restore();

        drawText((lang == "en" ? "CVL" : "軽母"), row2, line6 + newLength - 9);
        var numCVL = 0;
        var maxCVL = $("#colleDiv .divCVL img.selected").length;
        ctx.save();
        ctx.fillStyle = "white";
        $("#colleDiv .divCVL img").each(function() {
            var x = row2box + numCVL * hexRectangleWidth;
            var y = line6 - 15;
            var img = document.getElementById(this.id);
            drawHexagon(img, x, y, $(this).hasClass("selected"), false);

            numCVL++;
        });
        ctx.textAlign = "left";
        ctx.font = "14px " + numberfont;
        drawText(maxCVL + "/" + numCVL + " (" + (maxCVL / numCVL * 100).toFixed() + "%)", row2box + numCVL * hexRectangleWidth + 8, line6);
        ctx.restore();

        drawText((lang == "en" ? "BB" : "戦"), row1, line5 + newLength - 9);
        var numBB = 0;
        var maxBB = $("#colleDiv .divBB img.selected").length;
        ctx.save();
        ctx.fillStyle = "white";
        $("#colleDiv .divBB img").each(function() {
            var x = row1box + numBB * hexRectangleWidth;
            var y = line5 - 15;
            var img = document.getElementById(this.id);
            drawHexagon(img, x, y, $(this).hasClass("selected"), false);

            numBB++;
        });
        ctx.textAlign = "left";
        ctx.font = "14px " + numberfont;
        drawText(maxBB + "/" + numBB + " (" + (maxBB / numBB * 100).toFixed() + "%)", row1box + numBB * hexRectangleWidth + 8, line5);
        ctx.restore();

        drawText((lang == "en" ? "CV" : "航"), row1, line7 + newLength - 9);
        var numCV = 0;
        var maxCV = $("#colleDiv .divCV img.selected").length;
        ctx.save();
        ctx.fillStyle = "white";
        $("#colleDiv .divCV img").each(function() {
            var x = row1box + numCV * hexRectangleWidth;
            var y = line7 - 15;
            var img = document.getElementById(this.id);
            drawHexagon(img, x, y, $(this).hasClass("selected"), false);

            numCV++;
        });
        ctx.textAlign = "left";
        ctx.font = "14px " + numberfont;
        drawText(maxCV + "/" + numCV + " (" + (maxCV / numCV * 100).toFixed() + "%)", row1box + numCV * hexRectangleWidth + 8, line7);
        ctx.restore();

        drawText((lang == "en" ? "SS" : "潜"), row2, line8 + newLength - 9);
        var numSS = 0;
        var maxSS = $("#colleDiv .divSS img.selected").length;
        ctx.save();
        ctx.fillStyle = "white";
        $("#colleDiv .divSS img").each(function() {
            var x = row2box + numSS * hexRectangleWidth;
            var y = line8 - 15;
            var img = document.getElementById(this.id);
            drawHexagon(img, x, y, $(this).hasClass("selected"), false);

            numSS++;
        });
        ctx.textAlign = "left";
        ctx.font = "14px " + numberfont;
        drawText(maxSS + "/" + numSS + " (" + (maxSS / numSS * 100).toFixed() + "%)", row2box + numSS * hexRectangleWidth + 8, line8);
        ctx.restore();

        drawText((lang == "en" ? "AX" : "他"), row1, line9 + newLength - 9);
        var numAX = 0;
        var maxAX = $("#colleDiv .divAX img.selected").length;
        ctx.save();
        ctx.fillStyle = "white";
        $("#colleDiv .divAX img").each(function() {
            var x = row1box + numAX * hexRectangleWidth;
            var y = line9 - 15;
            var img = document.getElementById(this.id);
            drawHexagon(img, x, y, $(this).hasClass("selected"), false);

            numAX++;
        });
        ctx.textAlign = "left";
        ctx.font = "14px " + numberfont;
        drawText(maxAX + "/" + numAX + " (" + (maxAX / numAX * 100).toFixed() + "%)", row1box + numAX * hexRectangleWidth + 8, line9);
        ctx.restore();

        ctx.font = "12px " + textfont;
        var shipBoxes = $("#colleDiv");
        var chkShips = shipBoxes.find("img.selected").length;
        var allShips = shipBoxes.find("img").length;

        var ships = chkShips + "/" + allShips;
        var shipPct = chkShips / allShips;
        var barWidth = 300;

        ctx.save();
        ctx.strokeRect(progressrowbox, bottomLine - 10, barWidth, 8);
        var grd = ctx.createLinearGradient(progressrowbox, 0, progressrowbox + barWidth, 0);
        grd.addColorStop(0, "#A00000");
        grd.addColorStop(0.33, "#FF9900");
        grd.addColorStop(0.66, "#DDDD33");
        grd.addColorStop(1, "#00A000");
        ctx.fillStyle = grd;
        ctx.fillRect(progressrowbox, bottomLine - 10, (barWidth * shipPct).toFixed(), 8);
        ctx.restore();

        ctx.font = "20px " + numberfont;
        drawText(ships + " (" + (shipPct * 100).toFixed(1) + "%)", progressrowbox + barWidth, bottomLine - linebarwidth / 2, 3);
        ctx.font = "12px " + textfont;
        ctx.textAlign = "right";
        drawText("Lv. " + (level.value ? level.value : "?"), c.width / 2, 25);

        if (server != "Your Server") {
            drawText(server.substring(server.indexOf(" ") + 1), c.width - 25, 25);
        } else {
            drawText((lang == "en" ? "Unknown Server" : "不明サーバ"), c.width - 25, 25);
        }
        ctx.textAlign = "left";
        ctx.restore();
        $("#loadingDiv").html("");
        $("#loadingProgress").hide();
        $("#buttons button").prop('disabled', false);
    };

    var drawRoom = function(roomY) {
        var ratio = c.width / bg.clientWidth;
        var activeFloor = document.getElementById("activeFloor");
        var activeWall = document.getElementById("activeWall");
        var activeDesk = document.getElementById("activeDesk");
        var activeOutside = document.getElementById("activeOutside");
        var activeWindow = document.getElementById("activeWindow");
        var activeObject = document.getElementById("activeObject");
        var activeChest = document.getElementById("activeChest");
        ctx.globalAlpha = 1;
        ratio = c.width / activeFloor.clientWidth;
        if (activeFloor.complete)
            ctx.drawImage(activeFloor, 0, 150 * ratio + roomY, c.width, activeFloor.clientHeight * ratio);
        if (activeWall.complete)
            ctx.drawImage(activeWall, 0, -125 * ratio + roomY, c.width, activeWall.clientHeight * ratio);
        if (activeObject.complete)
            ctx.drawImage(activeObject, 0, -125 * ratio + roomY, activeObject.clientWidth * ratio, activeObject.clientHeight * ratio);
        if (activeOutside.complete)
            ctx.drawImage(activeOutside, 210, -125 * ratio + roomY, activeOutside.clientWidth * ratio, activeOutside.clientHeight * ratio);
        if (activeWindow.complete)
            ctx.drawImage(activeWindow, 210, -125 * ratio + roomY, activeWindow.clientWidth * ratio, activeWindow.clientHeight * ratio);

        var isNormalDesk = activeDesk.src.match(/(\d\d\d.?).png$/gm);
        var deskOffset = null;
        if (isNormalDesk) {
            deskOffset = deskoffsetdb[isNormalDesk[0]];
        }

        if (deskOffset) {
            ctx.drawImage(activeDesk, deskOffset.x, deskOffset.y + roomY + 7, activeDesk.clientWidth * ratio, activeDesk.clientHeight * ratio);
        } else {
            ctx.drawImage(activeDesk, 0, roomY + 7, activeDesk.clientWidth * ratio, activeDesk.clientHeight * ratio);
        }

        ctx.drawImage(activeChest, c.width - activeChest.clientWidth * ratio, -125 * ratio + roomY, activeChest.clientWidth * ratio, activeChest.clientHeight * ratio);
        var fillTint = $("#tint-color").val();
        ctx.fillStyle = fillTint ? fillTint : "#ffffff";

        $("#loadingDiv").html("");
        $("#loadingProgress").hide();
        $("#buttons button").prop('disabled', false);
    };

    var drawText = function(text, posx, posy, width) {
        ctx.save();
        ctx.lineWidth = typeof width !== 'undefined' ? width : 2;
        ctx.strokeText(text, posx, posy);
        ctx.fillText(text, posx, posy);
        ctx.restore();
    };

    var drawHexagon = function(img, x, y, checked, color) {
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(x + hexRadius, y);
        ctx.lineTo(x + hexRectangleWidth, y + hexHeight);
        ctx.lineTo(x + hexRectangleWidth, y + hexHeight + sideLength);
        ctx.lineTo(x + hexRadius, y + hexRectangleHeight);
        ctx.lineTo(x, y + sideLength + hexHeight);
        ctx.lineTo(x, y + hexHeight);
        ctx.closePath();
        ctx.stroke();
        ctx.fillStyle = color ? color : "white";
        ctx.globalAlpha = $("#hexOpa").val() ? $("#hexOpa").val() : 0;
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.clip();

        if (img && checked) {
            ctx.drawImage(img, x - centerx, y - centery, hexRectangleHeight * 5 / 4, hexRectangleHeight * 5 / 4);
        }
        ctx.restore();
    }

    var drawProgress = function(checked, total, offset) {
        var progressrow = 530;
        var progressrowbox = 540;
        var ships = checked + "/" + total;
        var shipPct = checked / total;
        var barWidth = 300;
        var grd = ctx.createLinearGradient(progressrowbox, 0, progressrowbox + barWidth, 0);

        ctx.save();
        ctx.strokeRect(progressrowbox, c.height - offset, barWidth, 8);

        grd.addColorStop(0, "#A00000");
        grd.addColorStop(0.33, "#FF9900");
        grd.addColorStop(0.66, "#DDDD33");
        grd.addColorStop(1, "#00A000");
        ctx.fillStyle = grd;
        ctx.fillRect(progressrowbox, c.height - offset, (barWidth * shipPct).toFixed(), 8);
        ctx.restore();

        ctx.font = "20px " + numberfont;
        drawText(ships + " (" + (shipPct * 100).toFixed(1) + "%)", progressrowbox + barWidth, c.height - 25, 3);
    };

    var drawNewBadge = function() {
        recalculateSides(22);

        ctx.save();
        ctx.strokeRect(35, c.height*0.1875, 100, 100);
        var name = $("[name='name']")[0];
        var alevel = $("[name='level']")[0];
        var server = $("[name='server'] :selected").text();
        var line1 = 45;
        var line2 = line1 + sideLength * 1.5 + 8;
        var line3 = line2 + sideLength * 1.5 + 8;
        var line4 = line3 + sideLength * 1.5 + 8;
        var row1 = 210;
        var row1box = row1 + 15;
        var row2 = row1 + hexRadius;
        var row2box = row1box + hexRadius;
        var row3 = row2 + hexRadius;
        var row3box = row2box + hexRadius;
        var row4 = row3 + hexRadius;
        var row4box = row3box + hexRadius;

        ctx.font = "20px " + textfont;
        ctx.imageSmoothingEnabled = true;
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'black';
        if (name.value) {
            drawText(name.value, 20, 25, 3);
        } else {
            drawText((lang == "en" ? "Nameless Admiral" : "無名提督"), 20, 25, 3);
        }

        ctx.save();
        ctx.font = "10px " + textfont;
        ctx.globalCompositeOperation = "darker";
        ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
        ctx.strokeStyle = 'transparent';
        var date = new Date();
        drawText(date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(), 5, c.height - 5, 3);
        ctx.restore();

        ctx.font = "14px " + textfont;

        ctx.textAlign = "right";
        ctx.drawImage(document.getElementById("fleet1a"), row1 - 23, line1 + sideLength / 2 - 15);
        ctx.drawImage(document.getElementById("fleet2a"), row2 - 23, line2 + sideLength / 2 - 15);
        ctx.drawImage(document.getElementById("fleet3a"), row3 - 23, line3 + sideLength / 2 - 15);
        ctx.drawImage(document.getElementById("fleet4a"), row4 - 23, line4 + sideLength / 2 - 15);
        ctx.save();
        ctx.fillStyle = "white";
        for (var i = 0; i < 6; i++) {
            var x = row1box + i * hexRectangleWidth;
            var y = line1 - 15;
            var img = document.getElementById(fleets[0][i]);
            var level = fleetLevels[0][i];
            drawHexagon(img, x, y, true);
            if (img) {
                ctx.font = "10px " + textfont;
                ctx.textAlign = "left";
                drawText(level, x, y + 8);
            }

            var x = row2box + i * hexRectangleWidth;
            var y = line2 - 15;
            var img = document.getElementById(fleets[1][i]);
            var level = fleetLevels[1][i];
            drawHexagon(img, x, y, true);
            if (img) {
                ctx.font = "10px " + textfont;
                ctx.textAlign = "left";
                drawText(level, x, y + 8);
            }

            var x = row3box + i * hexRectangleWidth;
            var y = line3 - 15;
            var img = document.getElementById(fleets[2][i]);
            var level = fleetLevels[2][i];
            drawHexagon(img, x, y, true);
            if (img) {
                ctx.font = "10px " + textfont;
                ctx.textAlign = "left";
                drawText(level, x, y + 8);
            }

            var x = row4box + i * hexRectangleWidth;
            var y = line4 - 15;
            var img = document.getElementById(fleets[3][i]);
            var level = fleetLevels[3][i];
            drawHexagon(img, x, y, true);
            if (img) {
                ctx.font = "10px " + textfont;
                ctx.textAlign = "left";
                drawText(level, x, y + 8);
            }
        }
        ctx.restore();


        ctx.font = "12px " + textfont;
        ctx.textAlign = "center";
        drawText("Lv. " + (level.value ? level.value : "?"), 85, line4 + 5);
    
        if (server !== "------") {
            drawText((lang == "en" ? server.substring(server.indexOf(" ") + 1) : server), 85, line4 + 19);
        } else {
            drawText((lang == "en" ? "Unknown Server" : "不明サーバ"), 85, line4 + 22);
        }
        ctx.textAlign = "left";
        ctx.restore();
        $("#loadingDiv").html("");
        $("#buttons button").prop('disabled', false);
    };

    var drawBadge = function() {
        var newLength = 16;
        recalculateSides(newLength);
        ctx.save();
        ctx.strokeRect(35, c.height*0.1875, 100, 100);
        //TODO: move to global variables
        var name = $("[name='name']")[0];
        var level = $("[name='level']")[0];
        var server = $("[name='server'] :selected").text();
        var useBlue = $("#useBlue").prop("checked");
        var maxPerLine = 12;
        var linebarwidth = newLength * (2 * Math.sin(Math.PI / 2) + 1);
        var line = 10;
        var line4 = 175;
        var evenRow = true;
    
        ctx.font = "20px " + textfont;
        ctx.imageSmoothingEnabled = true;
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'black';
        if (name.value) {
            drawText(name.value, 20, 25, 3);
        } else {
            drawText((lang == "en" ? "Nameless Admiral" : "無名提督"), 20, 25, 3);
        }
    
        ctx.save();
        ctx.font = "10px " + textfont;
        ctx.globalCompositeOperation = "lighter";
        ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
        ctx.strokeStyle = 'transparent';
        var date = new Date();
        drawText(date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(), 5, c.height - 5, 3);
        ctx.restore();
    
        for (var key in shipTypes) {
            if ($("#" + key.toLowerCase()).find("[type='checkbox']").length == 0 || ["SS", "AX"].indexOf(key) > -1) {
                continue;
            }
            var classLang = shipTypes[key]
            var row = 175;
            var rowbox = row + 15;
            var lower = key.toLowerCase();
            var num = 0;
            var blue = $("#" + key.toLowerCase()).find(".blueprint").not(".kai").length;
            var max = $("#" + key.toLowerCase()).find("[type='checkbox']").length;
            var selected = $("#" + key.toLowerCase()).find("[type='checkbox']:checked").length;
    
            if (blue > 0 && useBlue) {
                max -= blue;
                var blueSelect = $("#" + key.toLowerCase()).find(".blueprint").not(".kai").find("[type='checkbox']:checked").length;
                selected = Math.max(0, selected - blueSelect);
            }
            var percentLocation = Math.min(maxPerLine, max);
    
            if (Math.floor((max - 1) / maxPerLine % 2) == 1) {
                evenRow = !evenRow;
            }
    
            if (max / maxPerLine > 1) {
                line = line + (linebarwidth * Math.floor(max / maxPerLine)) / 2;
            }
            if (evenRow) {
                row = row + hexRadius;
                rowbox = rowbox + hexRadius;
    
            }
    
            ctx.font = "14px " + textfont;
    
            ctx.textAlign = "right";
            drawText((lang == "en" ? classLang[lang] : classLang["jp"]), row, line + newLength - 9);
    
            ctx.save();
            ctx.fillStyle = "white";
    
            $($("#" + key.toLowerCase()).find("[type='checkbox']").get().reverse()).each(function (i) {
                var label = $(this).parent().parent();
                var current = max - num - 1;
                if (!(useBlue && label.hasClass("blueprint") && !label.hasClass("kai"))) {
                    var x = rowbox + current % maxPerLine * hexRectangleWidth;
                    if (Math.floor(current / maxPerLine % 2) > 0) {
                        x = rowbox + (maxPerLine - (current + 1) % maxPerLine) * hexRectangleWidth - hexRadius;
                    }
                    var y = Math.floor(current / maxPerLine) * -linebarwidth / 2 + line - 15;
                    var img = document.getElementById("icon" + this.id);
                    var blueprint = label.hasClass("blueprint") ? (label.hasClass("prototype") ? "pink" : "lightblue") : "white";
                    drawHexagon(img, x, y, this.checked, blueprint);
    
                    num++;
                }
    
            });
            ctx.textAlign = "left";
            ctx.font = "14px " + numberfont;
            drawText(selected + "/" + num, rowbox + percentLocation * hexRectangleWidth + 8, line + newLength - 9);
            ctx.restore();
            line = line + linebarwidth / 2;
            evenRow = !evenRow;
    
        }
        var numCV = $("#cv").find("[type='checkbox']").length - ((useBlue) ? $("#cv").find(".blueprint").not(".kai").length : 0);
        var startPositionSS = (numCV + 3) * hexRectangleWidth;
        var numSS = 0;
        var maxSS = $("#ss").find("[type='checkbox']:checked").length;
        var ssRow = 175;
        var ssRowbox = ssRow + 15;
        var blue = 0;
        line = line - linebarwidth;
        drawText((lang == "en" ? "SS" : "潜"), ssRow + startPositionSS, line + linebarwidth / 2 + newLength - 9);
        ctx.save();
        ctx.fillStyle = "white";
        $("#ss").find("[type='checkbox']").each(function() {
            var label = $(this).parent().parent();
            if (!(useBlue && label.hasClass("blueprint") && !label.hasClass("kai"))) {
                var x = startPositionSS + ssRowbox + numSS * hexRectangleWidth;
                var y = line - 15 + linebarwidth / 2;
                var img = document.getElementById("icon" + this.id);
                var blueprint = $(this).parent().parent().find("label").hasClass("blueprint") ? "lightblue" : "white";
                drawHexagon(img, x, y, this.checked, blueprint);
    
                numSS++;
            } else if (this.checked && label.hasClass("blueprint")) {
                blue++;
            }
        });
        ctx.textAlign = "left";
        ctx.font = "14px " + numberfont;
        drawText(maxSS - blue + "/" + numSS, startPositionSS + ssRowbox + numSS * hexRectangleWidth + 8, line + newLength - 9 + linebarwidth / 2);
        ctx.restore();
    
        var numCVL = $("#cvl").find("[type='checkbox']").length - ((useBlue) ? $("#cvl").find(".blueprint").not(".kai").length : 0);
        var startPositionAX = (numCVL + 3.5) * hexRectangleWidth;
        var axRow = 163 + hexRadius;
        var axRowbox = axRow + hexRadius;
        drawText((lang == "en" ? "AX" : "その他"), axRow + startPositionAX, line + newLength - 9);
        var numAX = 0;
        var maxAX = $("#ax").find("[type='checkbox']:checked").length;
        var blue = 0;
        ctx.save();
        ctx.fillStyle = "white";
        $("#ax").find("[type='checkbox']").each(function() {
            var label = $(this).parent().parent();
            if (!(useBlue && label.hasClass("blueprint") && !label.hasClass("kai"))) {
                var x = startPositionAX + axRowbox + numAX * hexRectangleWidth;
                var y = line - 15;
                var img = document.getElementById("icon" + this.id);
                var blueprint = $(this).parent().parent().find("label").hasClass("blueprint") ? "lightblue" : "white";
                drawHexagon(img, x, y, this.checked, blueprint);
    
                numAX++;
            } else if (this.checked && label.hasClass("blueprint")) {
                blue++;
            }
        });
        ctx.textAlign = "left";
        ctx.font = "14px " + numberfont;
        drawText(maxAX - blue + "/" + numAX, startPositionAX + axRowbox + numAX * hexRectangleWidth + 8, line + newLength - 9);
        ctx.restore();
    
        ctx.font = "12px " + textfont;
        var shipBoxes = $(".shipOptions");
        var allBlue = shipBoxes.find(".blueprint").length - shipBoxes.find(".kai").length;
        var chkBlue = shipBoxes.find(".blueprint :checked").length - shipBoxes.find(".kai :checked").length;
        var chkShips = !useBlue ? shipBoxes.find("[type='checkbox']:checked").length : shipBoxes.find("[type='checkbox']:checked").length - chkBlue;
        var allShips = !useBlue ? shipBoxes.find("[type='checkbox']").length : shipBoxes.find("[type='checkbox']").length - allBlue;
    
        drawProgress(chkShips, allShips, 20);
    
        ctx.font = "12px " + textfont;
        ctx.textAlign = "center";
        drawText("Lv. " + (level.value ? level.value : "?"), 85, line4 - 2);
    
        if (server !== "------") {
            drawText((lang == "en" ? server.substring(server.indexOf(" ") + 1) : server), 85, line4 + 12);
        } else {
            drawText((lang == "en" ? "Unknown Server" : "不明サーバ"), 85, line4 + 15);
        }
        ctx.textAlign = "left";
        ctx.restore();
        $("#loadingDiv").html("");
        $("#loadingProgress").hide();
        $("#buttons button").prop('disabled', false);
    };

    var doneLoading = function() {
        for (var i in colle) {
            $("#kore" + i).addClass("selected");
        }
        $(".flagship").removeClass("flagship");
        $(".damaged").removeClass("damaged");
        for (var i in fleets[0]) {
            var ship = fleets[0][i];
            var shipName = ship.substring(4);
            if (ship !== null && ship !== "") {
                if (i == 0) {
                    $("#" + ship).addClass("flagship");
                    flagRarity = shipDB[shipName] ? shipDB[shipName].rarity : 0;
                }
                var slot = parseInt(i) + 1;
                $("#slot" + slot).html('<img style="height:50px; width:50px;" src="icons/' + shipDB[shipName].type + '/' + shipName + '.png"/>');
            }
        }
        for (var i in fleetLevels[0]) {
            var level = parseInt(fleetLevels[0][i]);
            if (level && level > 0) {
                var slot = parseInt(i) + 1;
                $("#level" + slot).val(level);
            }
        }
        generateFunction("initial");
    };

    //Begin Init Code
    var init = function() {
        var mstId2FleetIdTable = loader.getMstIdTable();
        shipTypes = loader.getShipTypes();
        shipDB = loader.getShips()
        abyssDB = loader.getAbyssals();
        implications = loader.getImplications()
        tabManager = new TabManager(loader);
        
        tabManager.loadTabs();
        
        
        if (apiMode) {
            if (importName) $("input[name='name']").val(importName);
            if (importLvl) $("input[name='level']").val(importLvl);
            if (importServer) $("select[name='server']").val(importServer);

            if (importShips) {
                importShips = JSON.parse(importShips);
                var importedColle = {};
                var importedK2 = {};
                for (var i in importShips) {
                    if (importShips[i] in mstId2FleetIdTable) {
                        var ship = mstId2FleetIdTable[importShips[i]];
                        importedColle[ship] = true;
                        // Add implicated ships
                        if (ship in implications) {
                            for (var j in implications[ship]) {
                                importedColle[implications[ship][j]] = true;
                            }
                        }
                    }
                }

                // Deducing K2
                if (importK2) {
                    for (var i in importedColle) {
                        var ship = $("#" + i);
                        if (ship.length > 0) {
                            var shipType = shipDB[i].type;
                            if (!importedK2[shipType]) importedK2[shipType] = {};
                            importedK2[shipType][i] = true;
                            $("#" + i).prop("checked", true);
                        }
                    }
                    k2 = importedK2;
                }


                if (importColle) colle = importedColle;
            }
            //4 fleets
            if (importFleets) {
                importFleets = JSON.parse(importFleets);
                var importedFleets = [
                    new Array(6),
                    new Array(6),
                    new Array(6),
                    new Array(6)
                ];
                var importedFleetLevels = [
                    [1, 1, 1, 1, 1, 1],
                    [1, 1, 1, 1, 1, 1],
                    [1, 1, 1, 1, 1, 1],
                    [1, 1, 1, 1, 1, 1]
                ];

                for (var fleet in importFleets) {
                    for (var i in importFleets[fleet]) {
                        if (importFleets[fleet][i] && importFleets[fleet][i] != null && mstId2FleetIdTable[importFleets[fleet][i].id]) {
                            importedFleets[fleet][i] = "icon" + mstId2FleetIdTable[importFleets[fleet][i].id];
                            importedFleetLevels[fleet][i] = importFleets[fleet][i].lvl;
                        }
                    }
                }
                fleets = importedFleets;
                fleetLevels = importedFleetLevels;
            }
        }

        ctx.strokeRect(0, 0, c.width, c.height);
        ctx.imageSmoothingEnabled = true;
        ctx.mozImageSmoothingEnabled = true;
        ctx.webkitImageSmoothingEnabled = true;

        var i = 0;
        for (var e in shipDB) {
            var ship = shipDB[e];
            if (ship.name) {
                var newDiv = $('<img class="tooltip" title="' + ship.full + '" src="icons/' + ship.type + '/' + e + '.png" id="icon' + e + '"></img>');
                var extraSpan = $('<span id="hit' + e + '">破</span>');
                newDiv.on("load", function() {
                    i++;
                    $("#loadingProgress").html(i + "/" + Object.keys(shipDB).length);
                    if (i == Object.keys(shipDB).length) {
                        doneLoading();
                    }
                });
                if ($(".shipList [data-name='" + ship.name + "']").length == 0) {
                    $(".div" + ship.type).append('<div><label>' + ship.name.replace(new RegExp('_', 'g'), ' ') + '</label><div data-name="' + ship.name + '" class="' + ship.type + '"></div></div>');
                }
                if (ship.unique) {
                    $("#colleDiv [data-name='" + ship.name + "']").append('<img title="' + ship.full + '"alt="full/FinalBoss.png" src="icons/' + ship.type + '/' + e + '.png" id="kore' + e + '"></img>').append(extraSpan);
                }
                $("#avatars [data-name='" + ship.name + "']").append(newDiv);
                if (ship.damageable != false) {
                    $("#avatars [data-name='" + ship.name + "']").append(extraSpan);
                }
            }
        }

        $("#colleDiv .shipClasses").each(function(i) {
            var selectClass = $("<div class='colleAll'><input id='selectAll-" + i + "' type='checkbox'/><label for='selectAll-" + i + "'>" + (lang == "jp" ? "全て選択" : (lang == "cn" || lang == "tw") ? "全選" : "Select All") + "</label></div>");
            $(this).append(selectClass);
            selectClass.find("input").on("change", function() {
                var imgs = $(this).parent().parent().find("img");
                for (var e in imgs.toArray()) {
                    var img = $(imgs[e]);
                    colle[img.attr("id").substring(4)] = this.checked;
                    img.toggleClass("selected", this.checked);
                }
                generateFunction("colleChangeAll");
            });
        });

        $('.tooltip').tooltipster();

        $(".shipClasses").find("label").next("div").each(function() {
            if ($(this).find("img").length == 0) {
                $(this).parent().remove();
            }
        });

        $("#fleetSelect div").on("click", function() {
            $("#fleetSelect .chosen").removeClass("chosen");
            $(this).toggleClass("chosen");
            var index = this.id.substring(5);
            selectedFleet = parseInt(index) - 1;

            $("#fleets div").html("");
            $("#fleetLevels input").val(1);

            for (var i in fleets[selectedFleet]) {
                var avatar = fleets[selectedFleet][i];
                var slot = parseInt(i) + 1;
                if (avatar !== null && avatar !== "") {
                    $("#slot" + slot).html('<img style="height:50px; width:50px;" src="' + $("#" + avatar).attr("src") + '"/>');
                }
                $("#level" + slot).val(fleetLevels[selectedFleet][i]);
            }
        });

        $("#fleets div").on("click", function() {
            $("#fleets .chosen").removeClass("chosen");
            $(this).toggleClass("chosen");
            var index = this.id.substring(4);
            selectedSlot = parseInt(index) - 1;
        });

        $("#fleetLevels input").on("change", function() {
            var index = this.id.substring(5);
            selectedSlot = parseInt(index) - 1;
            fleetLevels[selectedFleet][selectedSlot] = this.value;
            generateFunction("fleetLevelChange");
        });

        $("#avatars img").on("click", function() {
            if (!$(this).hasClass("abyss")) {
                fleets[selectedFleet][selectedSlot] = $(this).attr("id");
                $("#fleets .chosen").html('<img style="height:50px; width:50px;" src="' + $(this).attr("src") + '"/>');
            }
            if (selectedFleet == 0 && selectedSlot == 0) {
                $(".flagship").removeClass("flagship");
                $(".damaged").removeClass("damaged");
                $(this).toggleClass("flagship");
                flagRarity = shipDB[this.id.substring(4)] ? shipDB[this.id.substring(4)].rarity : 0;
            }
            generateFunction("fleetShipChange");
        });

        $("#colleDiv img").on("click", function() {
            if (colle[$(this).attr("id").substring(4)] && $(this).hasClass("selected")) {
                delete colle[$(this).attr("id").substring(4)];
            } else if (!$(this).hasClass("selected")) {
                colle[$(this).attr("id").substring(4)] = true;
            }
            $(this).toggleClass("selected");

            generateFunction("colleChange");
        });

        $("#avatars span").on("click", bindAvatars);

        $(".shipList > label").on("click", function() {
            $(this).next("div").slideToggle();
        });

        $(".shipClasses label").on("click", function() {
            $(this).next("div").toggle();
        });

        $("#removeSlot").on("click", function() {
            if (selectedFleet == 0 && selectedSlot == 0) {
                $(".damaged").removeClass("damaged");
                $(".flagship").removeClass("flagship");
                flagRarity = 0;
            }

            fleets[selectedFleet][selectedSlot] = null;
            $("#fleets .chosen").html("");
            generateFunction("fleetRemoveSlot");
        });

        $(".shipOptions input[type='checkbox']").on("change", function() {
            generateFunction("kainiShipChange");
        });

        $("#selectAll").on("change", function() {
            if (this.checked) {
                $(".shipOptions [type='checkbox']").prop("checked", true);
            } else {
                $(".shipOptions [type='checkbox']").prop("checked", false);
            }
            generateFunction("kainiSelectAll");
        });

        $("#displayBadge").on("click", function() {
            $("#buttonToggles button").removeClass("active");
            $(this).addClass("active");
            c.width = 850;
            c.height = 320;
            generateFunction("displayBadge");
        });
        $("#displayRoom").on("click", function() {
            $("#buttonToggles button").removeClass("active");
            $(this).addClass("active");
            c.width = 850;
            c.height = 510;
            drawRoom(132);
        });
        $("#displayPoster").on("click", function() {
            $("#buttonToggles button").removeClass("active");
            $(this).addClass("active");
            c.width = 850;
            c.height = 510;
            generateFunction("displayPoster");
        });

        $("#generate").on("click", generateFunction);

        $("#Floor,#Wall,#Desk,#Object,#Chest,#Window").on("change", function() {
            var type = this.id;
            delete loading[type];
            var activeImg = $("#active" + type);
            var imgToLoad = $(this).find(":checked").val();
            activeImg.off("load");
            activeImg.attr("src", "furniture/" + this.id.toLowerCase() + "/" + imgToLoad + ".png");
            if (activeImg.prop("complete")) {
                if ($.isEmptyObject(loading) && type != "Window") {
                    $("#buttons button").prop("disabled", false);
                    $("#loadingDiv").html("");
                    if ($("#displayRoom").hasClass("on")) {
                        drawRoom(132);
                    } else generateFunction("furnitureChangeCache");
                }
            } else {
                loading[type] = imgToLoad;
                $("#buttons button").prop("disabled", true);
                $("#loadingDiv").html("Rendering...");
                activeImg.on("load", function() {
                        delete loading[type];
                        if ($.isEmptyObject(loading)) {
                            $("#buttons button").prop("disabled", false);
                            $("#loadingDiv").html("");
                            if ($("#displayRoom").hasClass("on")) {
                                drawRoom(132);
                            } else generateFunction("furnitureChangeLoaded");
                        }
                    })
                    .error(function() {
                        delete loading[type];
                        if ($.isEmptyObject(loading)) {
                            $("#buttons button").prop("disabled", false);
                            $("#loadingDiv").html("Couldn't find this furniture's image.");
                        }
                    });
            }

            if (type == "Window") {
                $("#Outside").on("change", );
            }
        });

        $("#Outside").on("change", function(byWindow) {
            delete loading["Outside"];
            var activeOut = $("#activeOutside");
            var selectedOut = $("#Outside").find(":checked");
            var windowType = $("#Window").find(":checked").attr("data-pType");
            var imgToLoad = selectedOut.val() + windowType;
            var path = "furniture/outside/" + imgToLoad + ".png";
            activeOut.off("load");
            activeOut.attr("src", path);
            if (activeOut.prop("complete") && $.isEmptyObject(loading)) {
                $("#buttons button").prop("disabled", false);
                $("#loadingDiv").html("");
                if ($("#displayRoom").hasClass("on")) {
                    drawRoom(132);
                } else generateFunction("furnitureOutsideCache");
            } else {
                activeOut.on("load", function() {
                    delete loading["Outside"];
                    if ($.isEmptyObject(loading)) {
                        $("#buttons button").prop("disabled", false);
                        $("#loadingDiv").html("");
                        if ($("#displayRoom").hasClass("on")) {
                            drawRoom(132);
                        } else generateFunction("furnitureOutsideLoaded");
                    }
                });
            }

        })

        $("#ttkInfo input[type='text'],#ttkInfo input[type='number']").on("blur", function() {
            generateFunction("ttkInfo");
        });

        $("#ttkInfo select").on("click", function() {
            generateFunction("ttkServer");
        });

        $("#ttkInfo input[type='checkbox']").on("click", function() {
            generateFunction("ttkLevel");
        });

        $("#loadAbyss").on("click", function() {
            loadAbyssalShips();
        });

        $("#save").on("click", function() {
            saveAll();
            this.setAttribute("disabled", "disabled");
        });
        $("#load").on("click", function() {
            loadAll();
        });

        $("#export").on("click", function() {
            var exportImg = document.createElement("img");
            $(exportImg).attr("src", c.toDataURL("image/png"));
            var exportContainer = document.createElement("div");
            $(exportContainer).attr("class", "export-container");
            $(exportContainer).append(exportImg);
            var exportSpan = document.createElement("span");
            $(exportSpan).text('Right-click the image and choose "Save As..." to save it to your computer.');
            $(exportContainer).append(exportSpan);
            var exportCloser = document.createElement("span");
            $(exportCloser).attr("class", "close");
            $(exportCloser).text("+");
            $(exportContainer).append(exportCloser);
            $("body").prepend(exportContainer);
        });

        $("body").on("click", ".export-container", function() {
            $(".export-container").remove();
        });

        $('#avatar').on("load", function() {
            if ($.isEmptyObject(loading)) generateFunction("avatarImgChange");
        });

        $('#bg').on("load", function() {
            if ($.isEmptyObject(loading)) generateFunction("bgImgChange");
        });

        $("#customInputs input[type='checkbox']").on("change", function() {
            generateFunction("customInputChange");
        });

        $("#customInputs input[type='number']").on("change", function() {
            generateFunction("customInputChange");
        });

        $("#avatarImg").on("change", function() {
            if (this.files && this.files[0]) {
                var reader = new FileReader();

                reader.onload = function(e) {
                    $('#avatar').attr('src', e.target.result);
                    globalavatar = e.target.result;
                }

                reader.readAsDataURL(this.files[0]);
            }
        });

        $("#shipImg").on("change", function() {
            if (this.files && this.files[0]) {
                var reader = new FileReader();

                reader.onload = function(e) {
                    $('#customShip').attr('src', e.target.result);
                    globalship = e.target.result;
                    generateFunction("customShipChange");
                }

                reader.readAsDataURL(this.files[0]);
            }
        });

        $("#bgImg").on("change", function() {
            $("#useBG").prop("checked", false);
            if (this.files && this.files[0]) {
                var reader = new FileReader();

                reader.onload = function(e) {
                    $('#bg').attr('src', e.target.result);
                    globalbg = e.target.result;
                }

                reader.readAsDataURL(this.files[0]);
            }
        });

        $("#shipClear").on("click", function() {
            globalship = null;
            $('#shipImg').val("");
            $('#customShip').removeAttr('src');
            generateFunction('clear');
        });

        $("#avatarClear").on("click", function() {
            globalavatar = null;
            $('#avatarImg').val("");
            $('#avatar').removeAttr('src');
            generateFunction('clear');
        });

        $("#bgClear").on("click", function() {
            globalbg = null;
            $('#bgImg').val("");
            $('#bg').attr('src', 'bg.jpg');
            generateFunction('clear');
        });

    }
    loader = new DataLoader(lang);
    loader.initData(init);
});

$(window).on("load", function() {
    $("#tabs").liteTabs({ "width": "100%" });
    $("#tabs").show();

    $(".furnitureClass.invert > div div").each(function() {
        //Newest Furniture First
        $(this).prependTo(this.parentNode);
    });
});