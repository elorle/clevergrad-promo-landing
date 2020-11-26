document.addEventListener("DOMContentLoaded", ready);
var precision = 100; // точность. 100 - сотые, 1000 – тысячные и т.д.

function ready() {
	var range = document.getElementById('range');
	var labels = document.getElementsByClassName('label');
	var mainButton = document.getElementById('mainButton');
	makeLabels(labels,range.max);
	range.oninput = rangeChange.bind(range,labels,mainButton);
	mainButton.onclick = mainButtonClick.bind(range);
}

function rangeChange(labels,mainButton) {
	changeRangeColor(this);
	updateLabelsClass(labels,parseInt(this.value),this.max);
	updateButtonDisplay(this.value,mainButton);
}

function changeRangeColor(rangeObj) {
	var ratio = Math.round(rangeObj.value/(rangeObj.max-rangeObj.min)*100*precision)/precision;
	rangeObj.style.background = 'linear-gradient(to right, #aaa 0%, #aaa '+ratio+'%, #fff '+ratio+'%, #fff 100%)';
}

function makeLabels(labels, max) {
	for (var i = labels.length - 1; i >= 0; i--) {
		labels[i].style.left = Math.round(labels[i].getAttribute('value')/max*100*precision)/precision+"%";
	}
}

function updateLabelsClass(labels, value, max) {
	var temp = -(value/(max)-0.5)*400; // исправление бага праузерского бегунка
	for (var i = labels.length - 1; i >= 0; i--) {
		if (labels[i].getAttribute('value') <= value+temp) {
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
	if (priceVal >= 600) {
		mainButton.style.display = 'initial';
	}
	else {
		mainButton.style = '';
	}
}

function mainButtonClick() {
	if (this.value < 5000) {
		document.location.href = 'http://testlink.org';
	}
	else {
		document.location.href = 'http://test.com';
	}
}