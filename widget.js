function bookimedWidget(obj) {
    var _this = this;
    
    if (obj.id) {
        this.id = obj.id;
        this.blockId = obj.blockId || '.js-bookimed-widget';
        this.maxPage = obj.maxPage || 3;
        this.host = obj.host || 'https://bookimed.com/';
        this.lazyLoadOffset = obj.lazyLoadOffset && obj.lazyLoadOffset < 500 ?obj.lazyLoadOffset : 100;
        this.paddingConst = obj.paddingConst || 60;
        this.widget = document.querySelector(this.blockId);
        this.headerWidget = this.widget.querySelector('.header');
        this.headerTopWidget = this.headerWidget.querySelector('.top');
        this.headerDownWidget = this.headerWidget.querySelector('.down');
        this.contentWidget = this.widget.querySelector('.content');
        this.reviews = this.widget.querySelectorAll('.review') || this.widget.querySelector('.content span');
        this.btnMore = this.widget.querySelectorAll('div.more');
        this.preloader = this.widget.querySelector('.preloader');
        this.lastReview = this.reviews[this.reviews.length - 1];
        this.loadPage = 1;
        this.isLoaded = true;

        this.getReviews = function() {
            if (this.maxPage != this.loadPage && this.isLoaded) {
                this.showPreloader();

                var request = new XMLHttpRequest();

                request.open('GET', this.host + '/widget/' + this.id + '/?page=' + this.loadPage, false);

                request.onload = function() {
                    if (request.status >= 200 && request.status < 400) {
                        var response = JSON.parse(request.responseText);
    
                        console.log(response.header);
                        if (response.header) {
                            _this.headerTopWidget.insertAdjacentHTML('afterend', response.header);
                            _this.headerTopWidget.parentNode.removeChild(_this.headerTopWidget);
                            _this.headerDownWidget.parentNode.removeChild(_this.headerDownWidget);
                        }
                        console.log(response.reviews);
                        _this.contentWidget.innerHTML += response.reviews;
                        _this.loadPage++;
                        _this.reloadReviews();
                        _this.hidePreloader();
                        
                    } else {
                        console.error('Request is bad. ' + request.status + ': ' + request.statusText);
                        _this.hidePreloader();
                    }
                };

                request.send();
            }
        };

        this.addContentMaxHeight = function() {
            var maxHeight = this.widget.getBoundingClientRect().height - this.paddingConst - this.headerWidget.getBoundingClientRect().height;

            this.contentWidget.setAttribute("style","height:" + maxHeight + "px");
        }

        this.reloadReviews = function() {
            this.reviews = this.widget.querySelectorAll('.review');
            this.lastReview = this.reviews[this.reviews.length - 1];
        }

        this.debounce = function debounce(a,b,c){var d;return function(){var e=this,f=arguments;clearTimeout(d),d=setTimeout(function(){d=null,c||a.apply(e,f)},b),c&&!d&&a.apply(e,f)}};

        this.initLazyLoad = function() {
            _this.contentWidget.onscroll = this.debounce(function() {
                var contentCoordinate = _this.contentWidget.getBoundingClientRect(),
                    lastReviewCoordinate = _this.lastReview.getBoundingClientRect(),
                    offset = lastReviewCoordinate.y + lastReviewCoordinate.height - contentCoordinate.y - contentCoordinate.height;

                if (offset < _this.lazyLoadOffset) {
                    _this.getReviews();
                }
            }, 100);
        }

        this.showPreloader = function() {
            _this.isLoaded = false;
            _this.preloader.classList.add('active');
        }

        this.hidePreloader = function() {
            _this.isLoaded = true;
            _this.preloader.classList.remove('active');
        }

        this.initShowHideBtn = function() {
            _this.btnMore.forEach(function(elem) {
                elem.addEventListener('click', function() {
                    var classList = this.classList;
            
                    if (~classList.value.indexOf('active')) {
                        classList.remove('active');
                        this.closest('.review').classList.remove('full');
                    } else {
                        classList.add('active');
                        this.closest('.review').classList.add('full');
                    }
                });
            });
        }

        this.initShowHideBtn();
        this.initLazyLoad();
        this.addContentMaxHeight();
        this.getReviews();
    } else {
        console.error("Id is required parametr. If you have any problems, contact Bookimed.")
    }
}