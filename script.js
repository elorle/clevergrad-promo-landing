document.addEventListener("DOMContentLoaded", ready);
var precision = 100; // точность. 100 - сотые, 1000 – тысячные и т.д.
var diff = -3000; // разность межды реальным значением бегунка и отображаемым
var linkDiv = 17000; // если бегунок <= этого значения – firstLink, если больше – secondLink
var firstLink = 'https://clevergrad.ru/poisk-poselkov.html';
var secondLink = 'http://test.com';

function ready() {
	var range = document.getElementById('range');
	var labels = document.getElementsByClassName('label');
	var mainButton = document.getElementById('mainButton');
	makeLabels(labels,range.max);
	range.oninput = rangeChange.bind(range,labels,mainButton);
	mainButton.onclick = mainButtonClick.bind(range);

	var moreInfoBlock = document.getElementById('moreInfo');
	var form = moreInfoBlock.getElementsByTagName('form')[0];
	var callMeButton = document.getElementById('moreInfoButton');
	var closeButton = document.getElementById('close');
	callMeButton.onclick = callMeButtonClick.bind(moreInfoBlock);
	closeButton.onclick = closeButtonClick.bind(moreInfoBlock);
	form.onsubmit = submitForm.bind(form);
}

function rangeChange(labels,mainButton) {
	changeRangeColor(this);
	updateLabelsClass(labels,parseInt(this.value),parseInt(this.max));
	updateButtonDisplay(this.value,mainButton);
}

function changeRangeColor(rangeObj) {
	var ratio = Math.round(rangeObj.value/(rangeObj.max-rangeObj.min)*100*precision)/precision;
	var rat720 = Math.round((720-diff)/(rangeObj.max-rangeObj.min)*100*precision)/precision;
	var rat4000 = Math.round((4000-diff)/(rangeObj.max-rangeObj.min)*100*precision)/precision;
	var rat8000 = Math.round((8000-diff)/(rangeObj.max-rangeObj.min)*100*precision)/precision;
	var rat12000 = Math.round((12000-diff)/(rangeObj.max-rangeObj.min)*100*precision)/precision;
	var rat17000 = Math.round((17000-diff)/(rangeObj.max-rangeObj.min)*100*precision)/precision;
	console.log(rat720,rat4000,rat8000,rat12000,rat17000);
	if (rangeObj.value < 720-diff) {
		rangeObj.style.background = 'linear-gradient(to right, #aaa 0%, #aaa '+ratio+'%, #fff '+ratio+'%, #fff 100%)';
		rangeObj.style.setProperty('--slider-color', "#919191");
	}
	else if (rangeObj.value < 17000-diff) {
		rangeObj.style.background = 'linear-gradient(to right, '+
			'#aaa 0%, #aaa '+rat720+'%, '+
			'#00b160 '+rat720+'%, #00b160 '+ratio+'%, '+
			'#fff '+ratio+'%, #fff 100%)';
		rangeObj.style.setProperty('--slider-color', "#008c4c");
	}
	else {
		rangeObj.style.background = 'linear-gradient(to right, '+
			'#aaa 0%, #aaa '+rat720+'%, '+
			'#00b160 '+rat720+'%, #00b160 '+rat17000+'%, '+
			'#fc0078 '+rat17000+'%, #fc0078 '+ratio+'%, '+
			'#fff '+ratio+'%, #fff 100%)';
		rangeObj.style.setProperty('--slider-color', "#bf005b");
	}
}

function makeLabels(labels, max) {
	for (var i = labels.length - 1; i >= 0; i--) {
		labels[i].style.left = Math.round((labels[i].getAttribute('value'))/max*100*precision)/precision-diff/max*100+"%";
	}
}

function updateLabelsClass(labels, value, max) {
	var temp = -(value/(max)-0.5)*400; // исправление бага праузерского бегунка
	for (var i = labels.length - 1; i >= 0; i--) {
		if (labels[i].getAttribute('value') <= value+temp+diff) {
			if (!labels[i].classList.contains('less')) {
				labels[i].classList.add('less');
			}
		}
		else {
			if (labels[i].classList.contains('less')) {
				labels[i].classList.remove('less');
			}
		}
	}
}

function updateButtonDisplay(priceVal, mainButton) {
	if (priceVal >= 600-diff) {
		mainButton.style.display = 'initial';
	}
	else {
		mainButton.style = '';
	}
}

function mainButtonClick() {
	if (this.value <= linkDiv-diff) {
		document.location.href = firstLink;
	}
	else {
		document.location.href = secondLink;
	}
}

function callMeButtonClick() {
	this.style.display = 'block';
	setTimeout(function() {
		this.style.opacity = '1';
	}.bind(this), 100);
}

function closeButtonClick() {
	this.style.opacity = '0';
	setTimeout(function() {
		this.style.display = 'none';
	}.bind(this), 500);
}

function submitForm() {
	var inputs = this.getElementsByTagName('input');
	var name,phone,allow;
	name = inputs[0].value;
	phone = inputs[1].value;
	allow = inputs[2];
	if (name == '') {
		alert('Пожалуйста, представьтесь!');
		return false;
	}
	if (phone == '') {
		alert('Пожалуйста, введите номер телефона!');
		return false;
	}
	if (!allow.checked) {
		alert('Пожалуйста, согласитесь на обработку данных. Обещаем, Ваши данные НЕ будут переданы третьим лицам!');
		return false;
	}
	var xhr = new XMLHttpRequest();

	var body = 'name=' + encodeURIComponent(name) + '&phone=' + encodeURIComponent(phone);

	xhr.open("POST", '/mail.php', true);
	xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

	xhr.send(body);

    xhr.onload = function() {
    	if (xhr.responseText == 'success') {
    		alert("Заявка успешно отправлена, мы в ближайшее время свяжемся с Вами!");
    	}
    	else {
    		alert("К сожалению, произошла ошибка на сервере :( Вы можете связаться с нами по номеру: +78124216869");
    	}
    };
	return false;
}