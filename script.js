document.addEventListener("DOMContentLoaded", ready);
var precision = 100; // точность. 100 - сотые, 1000 – тысячные и т.д.
var diff = -3000; // разность межды реальным значением бегунка и отображаемым
var linkDiv = 17000; // если бегунок <= этого значения – firstLink, если больше – secondLink
var firstLink = 'https://clevergrad.ru/poisk-poselkov.html?utm_source=gorodam.net&utm_medium=portal&utm_campaign=gorodam.net';
var secondLink = 'https://cleverpremium.ru/catalog/?utm_source=gorodam.net&utm_medium=portal&utm_campaign=gorodamnet17mln';

function ready() {
	var firstTouch = { 
		check: false
	};

	var elemIdArr = ['logo','mainButton','moreInfoButton'];
	var elemTagInContentArr = ['p','h1'];

	var range = document.getElementById('range');
	var labels = document.getElementsByClassName('label');
	var mainButton = document.getElementById('mainButton');
	var priceSliderDiv = document.getElementById('price');
	var priceSliderText = document.getElementById('priceText');
	makeLabels(labels,range.max);
	range.oninput = rangeChange.bind(range,labels,mainButton,priceSliderDiv,priceSliderText,firstTouch,elemIdArr,elemTagInContentArr);
	mainButton.onclick = mainButtonClick.bind(range);

	var moreInfoBlock = document.getElementById('moreInfo');
	var form = moreInfoBlock.getElementsByTagName('form')[0];
	var callMeButton = document.getElementById('moreInfoButton');
	var closeButton = document.getElementById('close');
	callMeButton.onclick = callMeButtonClick.bind(moreInfoBlock);
	closeButton.onclick = closeButtonClick.bind(moreInfoBlock);
	form.onsubmit = submitForm.bind(form);

	var quizBlock = document.getElementById('quiz');
	var quizOptions = document.getElementsByClassName('select-box__option');
	var form2 = quizBlock.getElementsByTagName('form')[0];
	var quizButton = document.getElementById('quizButton');
	var closeQuizButton = document.getElementById('close2');
	var answers = new Object();
	answers.type = 0;
	answers.square = 0;
	answers.direction = 0;
	answers.landscape = 0;
	answers.budget = 0;
	quizButton.onclick = callMeButtonClick.bind(quizBlock);
	closeQuizButton.onclick = closeButtonClick.bind(quizBlock);
	form2.onsubmit = submitQuizForm.bind(form2,answers);
	for (let i = quizOptions.length - 1; i >= 0; i--) {
		quizOptions[i].onclick = quizOptionClick.bind(quizOptions[i].getAttribute('for'),answers);
	}

	// установка маски при вводе телефона
	var phoneMask = IMask(
		document.getElementById('quizPhone'), {
			mask: '+{7} (000) 000-00-00'
	});

	setTimeout(arrowOut, 700, elemIdArr, elemTagInContentArr, range, mainButton);

	setTimeout(arrowHideAfterFirstTouch, 700, firstTouch, elemIdArr, elemTagInContentArr);
}

function arrowHideAfterFirstTouch(firstTouch, elemIdArr, elemTagInContentArr) {
	document.body.onclick = function() {
		if (!firstTouch.check) {
			firstTouch.check = true;
			arrowHide(elemIdArr,elemTagInContentArr);
		}
		this.onclick = null;
	};
}

function rangeChange(labels,mainButton,priceSliderDiv,priceSliderText,firstTouch,elemIdArr,elemTagInContentArr) {
	if (!firstTouch.check) {
		firstTouch.check = true;
		arrowHide(elemIdArr,elemTagInContentArr);
	}
	changeRangeColor(this);
	updateLabelsClass(labels,parseInt(this.value),parseInt(this.max));
	updateButtonDisplay(this.value,mainButton);
	movePriceSlider(parseInt(this.value),parseInt(this.max),priceSliderDiv,priceSliderText);
}

function changeRangeColor(rangeObj) {
	var ratio = Math.round(rangeObj.value/(rangeObj.max-rangeObj.min)*100*precision)/precision;
	var rat700 = Math.round((700-diff)/(rangeObj.max-rangeObj.min)*100*precision)/precision;
	var rat17000 = Math.round((17000-diff)/(rangeObj.max-rangeObj.min)*100*precision)/precision;
	if (rangeObj.value < 700-diff) {
		rangeObj.style.background = 'linear-gradient(to right, #aaa 0%, #aaa '+ratio+'%, #fff '+ratio+'%, #fff 100%)';
		rangeObj.style.setProperty('--slider-color', "#654321");
	}
	else {
		rangeObj.style.background = 'linear-gradient(to right, '+
			'#aaa 0%, #aaa '+rat700+'%, '+
			'#fc0078 '+rat700+'%, #fc0078 '+ratio+'%, '+
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
		var price = (parseInt(this.value)+diff)*1000;
		if (this.value < 3000-diff) {
			document.location.href = firstLink+"&minPrice=600000&maxPrice="+price;
		}
		else {
			document.location.href = firstLink+"&minPrice="+price+"&maxPrice=30000000";
		}
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

function submitQuizForm(answers) {
	var name = this.querySelector("input[name=name]").value;
	var phone = this.querySelector("input[name=phone]").value;
	var allow = this.querySelector("input[name=dataProcessing]");
	if (answers.type == 0) {
		alert('Пожалуйста, выберите, вы хотите участок с домом или без');
		return false;
	}
	if (answers.square == 0) {
		alert('Пожалуйста, выберите желаемую площадь участка');
		return false;
	}
	if (answers.direction == 0) {
		alert('Пожалуйста, выберите, в какой части города вы хотели бы жить');
		return false;
	}
	if (answers.landscape == 0) {
		alert('Пожалуйста, выберите, какой ландшафт вы хотели бы');
		return false;
	}
	if (answers.budget == 0) {
		alert('Пожалуйста, выберите бюджет');
		return false;
	}
	if (name == '') {
		alert('Пожалуйста, представьтесь');
		return false;
	}
	if (phone == '') {
		alert('Пожалуйста, введите номер телефона');
		return false;
	}
	if (!allow.checked) {
		alert('Пожалуйста, согласитесь на обработку данных. Обещаем, Ваши данные НЕ будут переданы третьим лицам!');
		return false;
	}
	var additionalElems = document.getElementsByName("additional");
	var additional = "Доп. важная информация: ";
	for (var i = additionalElems.length - 1; i >= 0; i--) {
		if (additionalElems[i].checked) {
			additional += additionalElems[i].value+" | ";
		}
	}
	var xhr = new XMLHttpRequest();

	name = encodeURIComponent("Имя: "+name);
	phone = encodeURIComponent("Телефон: "+phone);
	answers.type = encodeURIComponent("Тип: "+answers.type);
	answers.square = encodeURIComponent("Площадь: "+answers.square);
	answers.direction = encodeURIComponent("Часть города: "+answers.direction);
	answers.landscape = encodeURIComponent("Ландшафт: "+answers.landscape);
	answers.budget = encodeURIComponent("Бюджет: "+answers.budget);
	additional = encodeURIComponent("Доп. важности: "+additional);

	var body = 'name=' + name + '&phone=' + phone + '&type'+answers.type+'&square'+answers.square+'&direction'+answers.direction+'&landscape'+answers.landscape+'&budget'+answers.budget+'&additional'+additional;
	console.log(body);

	xhr.open("POST", 'https://gorodam.net/mail.php', true);
	xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

	xhr.send(body);

	xhr.onload = function() {
		if (xhr.responseText == 'success') {
			alert("Заявка успешно отправлена, мы в ближайшее время свяжемся с Вами!");
		}
		else {
			console.log(xhr.responseText);
			alert("К сожалению, произошла ошибка на сервере :( Вы можете связаться с нами по номеру: +78124216869");
		}
	};
	return false;
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

	xhr.open("POST", 'https://gorodam.net/mail.php', true);
	xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

	xhr.send(body);

	xhr.onload = function() {
		if (xhr.responseText == 'success') {
			alert("Заявка успешно отправлена, мы в ближайшее время свяжемся с Вами!");
		}
		else {
			console.log(xhr.responseText);
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
		if (pos+diff < 700) {
			priceSliderText.innerHTML = "< 700 тыс";
		}
		else if (pos+diff < 1000) {
			priceSliderText.innerHTML = (pos+diff)+" тыс";
		}
		else if (pos+diff < 17000) {
			priceSliderText.innerHTML = (pos+diff)/1000+" млн";
		}
		else {
			priceSliderText.innerHTML = "> 17 млн";
		}
	}
	else {
		priceSliderDiv.style.display = 'none';
	}
}

function arrowOut(elemIdArr,elemTagInContentArr,range,mainButton) {
	var temp;
	for (var i = elemIdArr.length - 1; i >= 0; i--) {
		temp = document.getElementById(elemIdArr[i]);
		temp.classList.add('little-opacity');
	}
	var content = document.getElementById('content');
	for (i = elemTagInContentArr.length - 1; i >= 0; i--) {
		temp = content.getElementsByTagName(elemTagInContentArr[i])[0];
		temp.classList.add('little-opacity');
	}
	document.getElementById('arrow').style.display = 'initial';
	document.getElementById('arrowLabel').style.display = 'initial';

	var timerId = setInterval(function() {
		range.value = parseInt(range.value)+400;
		// console.log(range.value);
	}, 25, range, timerId);

	setTimeout(function() {
		clearInterval(timerId);
		timerId = setInterval(function() {
			range.value = parseInt(range.value)-200;
			if (range.value <= 700-diff) {
				range.value = 700-diff;
				clearInterval(timerId);
				updateButtonDisplay(range.value,mainButton);
			}
		}, 25, range, timerId, mainButton);
	}, 500, range, timerId, mainButton);
}

function arrowHide(elemIdArr,elemTagInContentArr) {
	var temp;
	for (var i = elemIdArr.length - 1; i >= 0; i--) {
		temp = document.getElementById(elemIdArr[i]);
		temp.classList.remove('little-opacity');
	}
	var content = document.getElementById('content');
	for (i = elemTagInContentArr.length - 1; i >= 0; i--) {
		temp = content.getElementsByTagName(elemTagInContentArr[i])[0];
		temp.classList.remove('little-opacity');
	}
	document.getElementById('arrow').style.display = 'none';
	document.getElementById('arrowLabel').style.display = 'none';
}

function quizOptionClick(answers) {
	answers[document.getElementById(this).name] = document.getElementById(this).value;
}

function mask(inputName, mask, evt) {
	try {
		var text = document.getElementById(inputName);
		var value = text.value;

		// If user pressed DEL or BACK SPACE, clean the value
		try {
			var e = (evt.which) ? evt.which : event.keyCode;
			if ( e == 46 || e == 8 ) {
				text.value = "";
				return;
			}
		} catch (e1) {}

		var literalPattern=/[0\*]/;
		var numberPattern=/[0-9]/;
		var newValue = "";

		for (var vId = 0, mId = 0 ; mId < mask.length ; ) {
			if (mId >= value.length)
				break;

			// Number expected but got a different value, store only the valid portion
			if (mask[mId] == '0' && value[vId].match(numberPattern) == null) {
				break;
			}

			// Found a literal
			while (mask[mId].match(literalPattern) == null) {
				if (value[vId] == mask[mId])
					break;

				newValue += mask[mId++];
			}

			newValue += value[vId++];
			mId++;
		}

		text.value = newValue;
	} catch(e) {}
}