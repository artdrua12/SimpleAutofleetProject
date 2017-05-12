window.onload = function() {


    $("#fullpage").fullpage({ // настройка fullpage
        sectionsColor: [, "yellow"],
        anchors: ["first", "second"],
        scrollBar: true,
        afterLoad: admin,
        onLeave: function() {
            $("#slide1").empty();
        },
        loopHorizontal: true
            //scrollOverflow: true
    });

    if (!localStorage.getItem("localStorage")) { // проверяем есть ли значения в локал сторадж
        let array = [];
        for (let i = 0; i < 100; i++) {
            let obj = new CarFabrica();
            obj.randCar();
            array.push(obj);
        }
        localStorage.setItem("localStorage", JSON.stringify(array)); // заносим массив в локал сторадж  
    }

    for (let i = 0; i < 5; i++) { //  топ 5 кликов объявлений
        let array = arrayFromLocal();
        let obj = maxElement(array);
        let ins = $("article").eq(i);
        let id = $('<div> id объявления </div>').html(obj.id).addClass("divInside").appendTo(ins);
        let img = $('<div>  </div>').addClass("divImg").css('backgroundImage', "url(" + obj.image + ")").appendTo(ins);
        let name = $('<div> </div>').html("Марка: " + obj.name).addClass("divInside").appendTo(ins);
    }

    function maxElement(array) {
        for (let i = 0; i < array.length; i++) {
            if (array[i].click > array[0].click) {
                return array[i];
            } else return array[0];
        }
    }

    let $main = $("main");
    $main.on("click", modalShow);
    $("#left").on("click", left);
    $("#right").on("click", right);
    $("#return").click(function() {
        $main.empty();
        head.show(400);
        $("section").animate({
            "flex-grow": "1"
        }, 500);

        setTimeout(function() {
            head.append(scrolSave);
        }, 500);
        $("#25").on("click", resize);
        $("#50").on("click", resize);
    })

    let head = $("header");
    let scrolSave = head.children();
    $("#25").on("click", empty($main));
    $("#25").on("click", divCreate);
    $("#25").on("click", resize);
    $("#50").on("click", empty($main));
    $("#50").on("click", divCreate);
    $("#50").on("click", resize);
    $("#insert").on("click", function() {
        location.href = "#second/1";
    });
    $("#admin").on("click", function() {
        location.href = "#second";
    });
    $("#clear").on("click", function() {
        localStorage.clear();
        empty($main);
    });

    $("#slide1").on("click", adminDel);
    $("#slide1").on("click", adminChange);
    let modal = $("#modal");
    modal.on("click", modalClose);
    let curentElement = null;
    let $additionally = null;

    function modalShow(e) { // показ окна 
        modal.empty($main);
        if (curentElement) {
            curentElement.css("opacity", 1);
        }
        if ($(e.target).hasClass("divImg")) {
            curentElement = $(e.target).parent(); // получаем div чей элемент сгенерировал событие
            increaseClick(curentElement.children().eq(0).html()); // увеличивем клики
            modal.css({
                "top": curentElement.offset().top,
                "left": curentElement.offset().left,
                "width": curentElement.width(),
                "height": curentElement.height(),
                "background-color": curentElement.css("background-color"),
                "display": "block"
            })

            let array = arrayFromLocal() //  массив объектов из Local Storage
            let id = curentElement.children().eq(0).html(); // получаем айди div по которому кликнули
            let obj = objReturn(id, array);
            modal.append(curentElement.clone()); // вставка данных
            $("#modal .divImg ").animate({ "width": 280, "height": 220 }, 300);
            $additionally = modal.children().eq(0); // получаем div кликнутого элемента для вставки
            $additionally.append($('<div> </div>').addClass("divInside").html("Состояние: " + obj.status));
            $additionally.append($('<div> </div>').addClass("divInside").html("Тип коробки: " + obj.transmission));
            $additionally.append($('<div> </div>').html("Пробег: " + obj.valueEngine + " км").addClass("divInside").appendTo($additionally));
            modal.append($additionally); // вставка дополнительных данных

            modal.animate({ "width": 400, "height": 400 }, 500);
            modal.animate({ "top": (window.pageYOffset + 150), "left": (window.innerWidth - 400) / 2 }, 700);
            curentElement.css("opacity", 0);
        } //end  if
        event.stopPropagation();
    } // end modalShow

    function modalClose(e) {
        modal.animate({ "width": curentElement.width(), "height": curentElement.height() }, 300);
        modal.animate({ "top": curentElement.offset().top, "left": curentElement.offset().left }, 400);
        setTimeout(function() {
            modal.css("display", "none");
            curentElement.css("opacity", 1);
            curentElement = null;
        }, 700);
    } // end modalClose

    function resize() {
        scrolSave.detach();
        head.hide(400);
        $("section").animate({
            "flex-grow": "0",
        }, 500);
        $("#25").off("click", resize);
        $("#50").off("click", resize);
    };

    form(); // построение формы
    let nameArray = ["Ford", "Lada", "Chevrole", "Porche", "Vaz", "MAZ", "Audi"];
    $("#name").autocomplete({
        source: nameArray
    });
    let modelArray = ["Model 1", "Model 2", "Model 3", "Model 4", "Model 5"];
    $("#model").autocomplete({
        source: modelArray
    });
    let priceArray = ["2000", "1500", "12000", "1700", "40000", "72000"];
    $("#price").autocomplete({
        source: priceArray
    });
    // select"


}; // end load

///////////////////////////////--------------------------------------OTHER FUNCTION-------------------------------------------------///////////////////////////
function objReturn(value, array) {
    for (let i = 0; i < array.length; i++) {
        if (array[i].id == value) {
            return array[i];
        }
    }
}

function admin(link, index) {
    if (index == 2) {

        let array = arrayFromLocal();
        for (let i = 0; i < array.length; i++) {
            let div = $('<div>  </div>').css('background-color', "wheat").addClass("flexChild flex");
            $('<div> </div>').html("click to delete").addClass("admin flexChild").appendTo(div);
            $('<div> </div>').html("click to change").addClass("adminChange flexChild").appendTo(div);
            for (key in array[i]) {
                $('<div> </div>').html(key + ": " + array[i][key]).addClass("divInside").appendTo(div);
            }
            $("#slide1").append(div);
        }
    }
}

function increaseClick(id) {
    let array = arrayFromLocal() // получаем массив
    let obj = objReturn(id, array); // получаем объект
    obj.click = obj.click + 1; // увеличиваем клики
    localStorage.setItem("localStorage", JSON.stringify(array)); // заносим новый массив в локал сторадж(перезаписываем)  
}

function adminDel(e) {
    if ($(e.target).hasClass("admin")) {
        $(e.target).parent().remove();
        let id = $(e.target).parent().children().eq(2).html().slice(3);
        let array = arrayFromLocal();
        array.pop(objReturn(id, array)); // удаляем объект чей элемент сгенерировал событие
        localStorage.setItem("localStorage", JSON.stringify(array)); // заносим новый массив в локал сторадж(перезаписываем)  
    }
}

function adminChange(e) {
    if ($(e.target).hasClass("adminChange")) {
        let id = $(e.target).parent().children().eq(2).html().slice(3);
        $parent = $("#slide2");

        location.href = "#second/1";
        let $div = $("<div></div>").addClass("formdiv flex ").attr("id", "divchange");
        $div.append($("<label></label>").html("id").addClass("flexChild formLegend"));
        $div.append($("<input>").attr("type", "text").addClass("flexChild formInput").val(id));
        $parent.append($div);

        let change = $("<button >Change</button>").attr('id', "change").addClass("formdiv formLegend");
        $parent.append(change);
        change.on("click", function() {
            $("#divchange").remove();
            $("#change").remove(); // удаляем кнопку change

            let array = arrayFromLocal();
            let dataArray = [];
            let i = 0;
            /*for (key in array[0]) {
                dataArray[i++] = $("#" + key + "").val();
            }*/

            for (let i = 0; i < array.length; i++) {
                if (array[i].id == id) {
                    for (key in array[i]) {
                        if (key === "id") {
                            continue;
                        }
                        array[i][key] = $("#" + key + "").val(); // заменили объект
                    }
                }
            }
            localStorage.setItem("localStorage", JSON.stringify(array)); // заносим новый массив в локал сторадж(перезаписываем)
        });
    }
}

function divCreate(e) {
    function randElement(array) {
        return array[Math.floor(Math.random() * array.length)];
    }
    let array = arrayFromLocal();
    for (let i = 0; i < e.target.id; i++) {
        let obj = array[i];

        let div = $('<div>  </div>').css({ 'background-color': randElement(["green", "yellow", "gray", "pink", "white", "wheat"]) });
        let id = $('<div> id объявления </div>').html(obj.id).addClass("divInside").appendTo(div);
        let img = $('<div>  </div>').addClass("divImg").css('backgroundImage', "url(" + obj.image + ")").appendTo(div);
        let name = $('<div> </div>').html("Марка: " + obj.name).addClass("divInside").appendTo(div);
        let model = $('<div> </div>').html("Модель: " + obj.model).addClass("divInside").appendTo(div);
        let year = $('<div> </div>').html("Год выпуска: " + obj.year).addClass("divInside").appendTo(div);
        let price = $('<div> </div>').html("Цена: " + obj.price + " pуб<br>" + (obj.price / 2).toFixed(0) + " y.e<br>" + (obj.price / 2.2).toFixed(0) + " euro").addClass("divInside").appendTo(div);
        let mileage = $('<div> </div>').html("Пробег: " + obj.mileage + " км").addClass("divInside").appendTo(div);
        div.addClass("flexChild flex").appendTo("#main");
    }
}

class CarFabrica {

    constructor(array = []) { //  по умолчанию равен пустому массиву
        this.id = function() {
            return (new Date()).getTime();
        }();
        this.name = array[0];
        this.model = array[1];
        this.year = array[2];
        this.mileage = array[3];
        this.status = array[4];
        this.transmission = array[5];
        this.valueEngine = array[6];
        this.price = array[7];
        this.image = array[8];
        this.click = 0;
    }

    randCar() {

        this.name = randElement(["Ford", "Lada", "Chevrole", "Porche", "Vaz", "MAZ", "Audi"]);
        this.model = randElement(["Model 1", "Model 2", "Model 3", "Model 4", "Model 5"]);
        this.year = randElement([1990, 1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999, 2000]);
        this.mileage = randElement([1, 10, 100, 1000, 10000]);
        this.status = randElement(["new", "used"]);
        this.transmission = randElement(["automat", "mechanics"]);
        this.valueEngine = randElement([800, 900, 1000, 1100, 1200, 1300, 1400]);
        this.price = randElement([2000, 1500, 12000, 700, 40000, 78000])
        this.image = document.getElementById("t34").getAttribute("src");

        function randElement(array) {
            return array[Math.floor(Math.random() * array.length)];
        }
    }
}

function right() {

    let $a = $("article").eq(2).offset().left; // от начала экрана до 2 элемента
    let $b = $("article").eq(1).offset().left; // от начала экрана до 1 элемента
    let $c = $a - $b; // wight article

    $("#scrolling").animate({ left: $c }, 320);
    setTimeout(fun, 400);

    function fun() {
        let $del = $("header article").eq(2).detach(); // delete first element
        let $firstElm = $("header article").last();
        $("header article").first().before($firstElm); // last make to first
        $("header article").eq(2).after($del);
        $("#scrolling").css("left", "0px");
    }
}

function left() {
    let $a = $("article").eq(1).offset().left; // от начала экрана до 2 элемента
    let $b = $("article").eq(0).offset().left; // от начала экрана до 1 элемента
    let $c = $a - $b; // 

    $("#scrolling").animate({ left: -$c }, 320);
    setTimeout(fun, 400);

    function fun() {
        let $del = $("header article").eq(0).detach(); // delete first element
        $("header article").last().after($del); // adding to the end of the first element
        $("#scrolling").css("left", "0px");
    }
}

function arrayFromLocal() {
    let jsonArray = localStorage.getItem("localStorage");
    return array = JSON.parse(jsonArray);
}

function empty(element) {
    element.empty();
}

function form() {

    function labelInput(name, parent) {
        let $div = $("<div></div>").addClass("formdiv flex ");
        $div.append($("<label></label>").html(name).addClass("flexChild formLegend"));
        $div.append($("<input>").attr({ type: "text", id: name }).addClass("flexChild formInput"));
        parent.append($div);
    }

    function radio(name, parent, array) {

        let $div = $("<div></div>").addClass("formdiv flex ");
        $div.append($("<label></label>").html(name).addClass("flexChild formLegend"));
        $divradio = $("<div></div>").attr({ type: "text", id: name }).addClass("flexChild formInput flex");

        for (let i = 0; i < array.length; i++) {
            $divradio.append($("<input>").addClass("formInput").attr({ type: "radio", id: array[i], value: array[i], name: "creature_type" }));
            $divradio.append($("<label></label>").html(array[i]).addClass("formLegend").attr("for", array[i]));
        }
        $div.append($divradio);
        parent.append($div);
    }

    function select(name, parent, array) {
        let $div = $("<div></div>").addClass("formdiv flex ");
        $div.append($("<label></label>").html(name).addClass("flexChild formLegend"));
        $select = $("<select></select>").addClass("flexChild formInput").attr("id", name);
        for (let i = 0; i < array.length; i++) {
            $select.append($('<option ></option>').html(array[i]));
        }
        $div.append($select);
        parent.append($div);
    }

    $parent = $("#slide2");
    empty($parent);
    let obj = new CarFabrica();

    for (key in obj) {
        if (key === "id") {
            continue;
        }
        if (key === "year") {
            select(key, $parent, [1990, 1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999, 2000]);
            continue;
        }
        if (key === "mileage") {
            select(key, $parent, [1, 10, 100, 1000, 10000]);
            continue;
        }
        if (key === "status") {
            radio(key, $parent, ["new", "used"]);
            continue;
        }
        if (key === "transmission") {
            radio(key, $parent, ["automat", "mechanics"]);
            continue;
        }
        if (key === "valueEngine") {
            select(key, $parent, [800, 900, 1000, 1100, 1200, 1300, 1400]);
            continue;
        }
        labelInput(key, $parent);
    }

    let insert = $("<button >Insert</button>").attr('id', "insert").addClass("formdiv formLegend");
    insert.on("click", addObject);
    $parent.append(insert);
}

function addObject() {
    let array = arrayFromLocal();
    alert("добавлен новый объект");
    let dataArray = [];
    let i = 0;
    for (key in array[0]) {
        if (key === "id") {
            continue;
        }
        dataArray[i++] = $("#" + key + "").val();
    }
    let obj = new CarFabrica(dataArray);
    array.push(obj);
    localStorage.setItem("localStorage", JSON.stringify(array)); // заносим новый массив в локал сторадж(перезаписываем) 
}