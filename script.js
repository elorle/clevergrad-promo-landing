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
	var priceSliderDiv = document.getElementById('price');
	var priceSliderText = document.getElementById('priceText');
	makeLabels(labels,range.max);
	range.oninput = rangeChange.bind(range,labels,mainButton,priceSliderDiv,priceSliderText);
	mainButton.onclick = mainButtonClick.bind(range);

	var moreInfoBlock = document.getElementById('moreInfo');
	var form = moreInfoBlock.getElementsByTagName('form')[0];
	var callMeButton = document.getElementById('moreInfoButton');
	var closeButton = document.getElementById('close');
	callMeButton.onclick = callMeButtonClick.bind(moreInfoBlock);
	closeButton.onclick = closeButtonClick.bind(moreInfoBlock);
	form.onsubmit = submitForm.bind(form);
}

function rangeChange(labels,mainButton,priceSliderDiv,priceSliderText) {
	changeRangeColor(this);
	updateLabelsClass(labels,parseInt(this.value),parseInt(this.max));
	updateButtonDisplay(this.value,mainButton);
	movePriceSlider(parseInt(this.value),parseInt(this.max),priceSliderDiv,priceSliderText);
}

function changeRangeColor(rangeObj) {
	var ratio = Math.round(rangeObj.value/(rangeObj.max-rangeObj.min)*100*precision)/precision;
	var rat720 = Math.round((720-diff)/(rangeObj.max-rangeObj.min)*100*precision)/precision;
	var rat17000 = Math.round((17000-diff)/(rangeObj.max-rangeObj.min)*100*precision)/precision;
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

function movePriceSlider(pos,max,priceSliderDiv,priceSliderText) {
	var temp = -(pos/max)*200; // исправление бага праузерского бегунка
	if (pos >= 100) {
		if (priceSliderDiv.style.display != 'initial') {
			priceSliderDiv.style.display = 'initial';
		}
		priceSliderDiv.style.left = Math.round(pos/max*100*precision+temp)/precision+"%";
		if (pos+diff < 720) {
			priceSliderText.innerHTML = "<720 тыс";
		}
		else if (pos+diff < 1000) {
			priceSliderText.innerHTML = (pos+diff)+" тыс";
		}
		else if (pos+diff < 17000) {
			priceSliderText.innerHTML = (pos+diff)/1000+" млн";
		}
		else {
			priceSliderText.innerHTML = ">17 млн";
		}
	}
	else {
		priceSliderDiv.style.display = 'none';
	}
}