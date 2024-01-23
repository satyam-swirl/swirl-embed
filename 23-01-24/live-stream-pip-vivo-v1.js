var urlSL = window.location.href.split('?')[0] ? window.location.href.split('?')[0] : window.location.href;
urlSL = urlSL.replace('#', '');
const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];
var displaySL = 12;
let allStreamsSL = [];
let currentStreamSL = '';

let SET1 = false;

var headTag = document.getElementsByTagName("head")[0];

if (typeof jQuery == 'undefined') {
    var jqTag = document.createElement('script');
    jqTag.rel = 'text/javascript';
    jqTag.src = 'https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js';
    headTag.insertBefore(jqTag, headTag.lastChild);
    jqTag.onload = function () { SET1 = true; };
} else {
    SET1 = true;
}

var jqTag = document.createElement('link');
jqTag.rel = 'stylesheet';
jqTag.href = 'https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css';
headTag.insertBefore(jqTag, headTag.lastChild);

var jqTag = document.createElement('link');
jqTag.rel = 'stylesheet';
jqTag.href = 'https://apigoswirl.com/live_stream_pages/v6.1/live-streams.min.css';
headTag.insertBefore(jqTag, headTag.lastChild);

let SLScriptsLOADED = setInterval(() => {
    if (SET1) {
        executeSLiveNow();
        clearInterval(SLScriptsLOADED);
    }
}, 500);

function executeSLiveNow() {
    $('body').append(`
        <div class="SL-iframe-live" style="display:none;">
            <iframe id="SL-iframe-tag" style="width: 100%;height: 100vh;border: none;position: fixed;top: 0;left: 0;z-index: 1211;" src="" allow="clipboard-read; clipboard-write; fullscreen"></iframe>
            <img class="SL-popup-close-btn SL-popup-close-btn-P" onclick="closeLiveStreamPop();" src="https://cdn.jsdelivr.net/gh/SwirlAdmin/swirl-cdn/assets/images/live-close-icon.svg">          
            <img class="SL-popup-close-btn SL-popup-close-btn-L" style="display: none;" onclick="closeLiveStreamPop();" src="https://cdn.jsdelivr.net/gh/SwirlAdmin/swirl-cdn/assets/images/landscape/close.webp">       
        </div> 

        <div class="SL-pip-live" style="display: none;" onclick="fullScreenPIPSL(event);">
            <video class="" id="id-video-pip-SL" playsinline="playsinline" preload="auto" data-setup="{}" autoplay muted loop>
                <source src="" type=""></source>
            </video> 
            <img class="SL-pip-close-btn" onclick="closePIPSL();" src="https://cdn.jsdelivr.net/gh/SwirlAdmin/swirl-cdn/assets/images/live-close-icon.svg">  
            <div class="SL-pip-fullscreen-btn"></div>
        </div>

        <input type="text" class="SL-copylink-input" value="" style="display: none !important;" onclick="SLcopyLink(this);">
    `);

    if (document.getElementById('swirl-live-streams') == null) {
        if (localStorage.getItem('_pipSL')) {
            let pipStreamData = JSON.parse(localStorage.getItem('_pipSL'));
            allStreamsSL[btoa(pipStreamData.streamURL)] = pipStreamData;
            openPIPSL();
        }
        return;
    }

    $('#swirl-live-streams').append(`
        <div class="SL-streams-list"></div>        
    `);

    let code = $('#swirl-live-streams').data('code');
    let domain = (new URL(urlSL));
    let store = domain.hostname;
    $.ajax({
        type: "POST",
        dataType: "json",
        url: "https://api.goswirl.live/index.php/api/LiveAPI/streamlisting?user=" + code,
        success: function (data) {
            $('.SLS-loader').remove();
            if (Object.keys(data).length && (data['scheduled'].length || data['completed'].length)) {
                customization = data['data'];
                // console.log(customization);

                let append = '';
                let playThis = '';
                if (customization.format == 0) {

                    var scounts = 0;

                    // custom css
                    append += `
                        <style>                            
                            @media (max-width: 600px) {
                                .SL-stream-title-full {
                                    font-size: 12px !important;
                                }

                                .SL-views-and-like label {
                                    font-size: 12px !important;
                                }

                                .SL-full-card .SL-share-images {
                                    width: 28px !important;
                                    margin: 3px !important;
                                }

                                .SL-stream-play-action-full {
                                    font-size: 15px !important;
                                    padding: 5px 20px !important;
                                }

                                .SL-stream-title {
                                    font-size: 12px !important;
                                }

                                .SL-streams-list .col-6 {
                                    padding: 0 10px;
                                }
                            }
                        </style>
                    `;

                    append += '<div class="row">';
                    // if (data['live'].length) {
                    //     data['live'].forEach(live => {
                    //         append += `                                
                    //                 <div class="col-md-2 mb-1">
                    //                     <div class="SL-active-stream-video-container position-relative" data-stream="${live.streamURL}" onclick="watchStream('${live.streamURL}');">
                    //                         <img src="${live.cover_img}" class="SL-vdo-thmub"
                    //                             alt="Stream Thumbnail" >
                    //                         <img src="https://cdn.jsdelivr.net/gh/SwirlAdmin/swirl-cdn/assets/images/goswirl-webp/play.webp" class="SL-play-btn" alt="Play icon"
                    //                             >
                    //                         <p class="SL-stream-label LL">Live</p>
                    //                         <p class="SL-stream-title scroll_on_hover ellipsis">${live.title}</p>
                    //                     </div>
                    //                 </div>                                                              
                    //             `;
                    //     });
                    // }                    

                    if (data['scheduled'].length) {
                        data['scheduled'].forEach(scheduled => {
                            allStreamsSL[btoa(scheduled.streamURL)] = scheduled;
                            scounts++;
                            var onDT = new Date(`${(scheduled.starting_time).replaceAll('-', '/')}`);
                            var onTime = (onDT.toLocaleString('en-IN', { hour: 'numeric', minute: 'numeric', hour12: true })).toUpperCase();
                            onDT = "" + onDT.getDate() + " " + monthNames[`${onDT.getMonth()}`] + ", " + onDT.getFullYear() + " - " + onTime;
                            let scheduleTimeUp = false;
                            if (scounts == 1) {
                                append += `                                
                                    <div class="col-md-12 mb-2 SL-full-card" style="background: #fff8fc !important;" data-stream="${scheduled.streamURL}">
                                        <div class="row align-items-center justify-content-center">
                                            <div class="col-12 col-md-2 p-0">
                                                <img src="${scheduled.cover_img}" class="SL-vdo-thmub-full" alt="Stream Thumbnail" >
                                            </div>
                                            <div class="col-12 col-md-10 py-1 ${customization.scheduled_grid == '0' ? 'order-md-first' : ''}">
                                                <p class="SL-stream-title-full">${scheduled.title}</p>
                                                <p class="SL-stream-desc-full">${scheduled.description ? scheduled.description : ''}</p>
                                                <button class="SL-stream-play-action-full d-none" onclick="watchStream('${scheduled.streamURL}');" style="color: ${customization.date_bk_color} !important; border-color: ${customization.date_bk_color} !important;">Watch Now</button>

                                                <div class="SL-schedule-timer">
                                                    <p class="SL-schedule-on-date">Scheduled for ${onDT}</p>
                                                    <div class="SL-active-stream-video-content mb-1">
                                                        <b id="${scheduled.id}day"></b>
                                                        <b id="${scheduled.id}hour"></b>
                                                        <b id="${scheduled.id}min"></b>
                                                        <b id="${scheduled.id}sec"></b>
                                                    </div>                                                
                                                </div>

                                                <style>
                                                    .SL-watch-live-btn::before {
                                                        background-color: ${customization.date_bk_color} !important;
                                                    }
                                                </style>
                                                <button class="SL-watch-live-btn streamClick" onclick="watchStream('${scheduled.streamURL}');" style="color: ${customization.date_fk_color} !important; background: ${customization.date_bk_color} !important;">WATCH LIVE</button>

                                                <div class="SL-share mt-2">
                                                    <p class="SL-link-copied" style="color: ${customization.date_bk_color} !important;">Link Copied!</p>
                                                    <img class="SL-facebook SL-share-images" src="https://cdn.jsdelivr.net/gh/SwirlAdmin/swirl-cdn/assets/images/goswirl-webp/facebook.webp" data-sharelink="${urlSL + '?stream=' + window.btoa(scheduled.streamURL)}" alt="Facebook icon" title="Share on Facebook">
                                                    <img class="SL-twitter SL-share-images" src="https://cdn.jsdelivr.net/gh/SwirlAdmin/swirl-cdn/assets/images/goswirl-webp/twitter.webp" data-sharelink="${urlSL + '?stream=' + window.btoa(scheduled.streamURL)}" alt="Twitter icon" title="Share on Twitter">
                                                    <img class="SL-whatsapp SL-share-images" src="https://cdn.jsdelivr.net/gh/SwirlAdmin/swirl-cdn/assets/images/goswirl-webp/whatsapp.webp" data-sharelink="${urlSL + '?stream=' + window.btoa(scheduled.streamURL)}" alt="Whatsapp icon" title="Share on Whatsapp">
                                                    <img class="SL-copy SL-share-images" src="https://cdn.jsdelivr.net/gh/SwirlAdmin/swirl-cdn/assets/images/goswirl-webp/copy-link.webp" data-sharelink="${urlSL + '?stream=' + window.btoa(scheduled.streamURL)}" alt="Copy link icon" title="Copy link">                                                
                                                </div>                                                
                                            </div>                                            
                                        </div>                                        
                                    </div>                                    
                                `;

                                var countDownDate = [];
                                var x = [];
                                var now = [];
                                var distance = [];
                                var days = [];
                                var hours = [];
                                var minutes = [];
                                var seconds = [];
                                // countDownDate[scheduled.id] = new Date("2022-10-17 20:25:00").getTime();
                                countDownDate[scheduled.id] = new Date((scheduled.starting_time).replaceAll('-', '/')).getTime();
                                x[scheduled.id] = setInterval(function () {
                                    // Get today's date and time
                                    now[scheduled.id] = new Date().getTime();

                                    // Find the distance between now and the count down date
                                    distance[scheduled.id] = countDownDate[scheduled.id] - now[scheduled.id];

                                    // Time calculations for days, hours, minutes and seconds
                                    days[scheduled.id] = Math.floor(distance[scheduled.id] / (1000 * 60 * 60 * 24));
                                    hours[scheduled.id] = Math.floor((distance[scheduled.id] % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                                    minutes[scheduled.id] = Math.floor((distance[scheduled.id] % (1000 * 60 * 60)) / (1000 * 60));
                                    seconds[scheduled.id] = Math.floor((distance[scheduled.id] % (1000 * 60)) / 1000);

                                    // Output the result in an element with id="demo"
                                    document.getElementById(`${scheduled.id}day`).innerHTML = String(days[scheduled.id]).padStart(2, '0');
                                    document.getElementById(`${scheduled.id}hour`).innerHTML = String(hours[scheduled.id]).padStart(2, '0');
                                    document.getElementById(`${scheduled.id}min`).innerHTML = String(minutes[scheduled.id]).padStart(2, '0');
                                    document.getElementById(`${scheduled.id}sec`).innerHTML = String(seconds[scheduled.id]).padStart(2, '0');

                                    // If the count down is over, write some text 
                                    if (distance[scheduled.id] < 0) {
                                        scheduleTimeUp = true;
                                        clearInterval(x[scheduled.id]);
                                        document.getElementById(`${scheduled.id}day`).innerHTML = '00';
                                        document.getElementById(`${scheduled.id}hour`).innerHTML = '00';
                                        document.getElementById(`${scheduled.id}min`).innerHTML = '00';
                                        document.getElementById(`${scheduled.id}sec`).innerHTML = '00';

                                        // location.reload();
                                        // watchStream(`${scheduled.streamURL}`);
                                        playThis = scheduled.streamURL;
                                        $('.SL-schedule-timer').html(``);
                                    }
                                }, 1000);
                                setTimeout(() => {
                                    if (!scheduleTimeUp) playThis = scheduled.streamURL; //watchStream(`${scheduled.streamURL}`);
                                }, 2000);
                            } else {
                                append += `                                
                                    <div class="col-6 col-md-2 mb-1 px-md-1 loading-SL" ${scounts > (displaySL + 1) ? 'style="display: none;"' : ''}>                                        
                                        <div class="SL-active-stream-video-container position-relative" data-stream="${scheduled.streamURL}">
                                            <img src="${scheduled.cover_img}" class="SL-vdo-thmub"
                                                alt="Stream Thumbnail" >
                                            <img src="https://cdn.jsdelivr.net/gh/SwirlAdmin/swirl-cdn/assets/images/goswirl-webp/play.webp" class="SL-play-btn" alt="Play icon"
                                                >                                                                                
                                            <p class="SL-date-top">${onDT.split(',')[0]}</p>                                                                                    
                                            <div class="SL-stream-info-container" style="background: ${customization.date_bk_color} !important;">
                                                <div class="SL-stream-info">                                                    
                                                    <div class="text-left SL-share">
                                                        <p class="SL-link-copied" style="color: ${customization.date_fk_color} !important;">Link Copied!</p>
                                                        <img class="SL-facebook SL-share-images" src="https://cdn.jsdelivr.net/gh/SwirlAdmin/swirl-cdn/assets/images/goswirl-webp/facebook.webp" data-sharelink="${urlSL + '?stream=' + window.btoa(scheduled.streamURL)}" alt="Facebook icon" title="Share on Facebook">
                                                        <img class="SL-twitter SL-share-images" src="https://cdn.jsdelivr.net/gh/SwirlAdmin/swirl-cdn/assets/images/goswirl-webp/twitter.webp" data-sharelink="${urlSL + '?stream=' + window.btoa(scheduled.streamURL)}" alt="Twitter icon" title="Share on Twitter">
                                                        <img class="SL-whatsapp SL-share-images" src="https://cdn.jsdelivr.net/gh/SwirlAdmin/swirl-cdn/assets/images/goswirl-webp/whatsapp.webp" data-sharelink="${urlSL + '?stream=' + window.btoa(scheduled.streamURL)}" alt="Whatsapp icon" title="Share on Whatsapp">
                                                        <img class="SL-copy SL-share-images" src="https://cdn.jsdelivr.net/gh/SwirlAdmin/swirl-cdn/assets/images/goswirl-webp/copy-link.webp" data-sharelink="${urlSL + '?stream=' + window.btoa(scheduled.streamURL)}" alt="Copy link icon" title="Copy link">                                                
                                                    </div>
                                                </div>                                            
                                            </div>
                                        </div>
                                        <p class="SL-stream-title">${scheduled.title}</p>                                        
                                        <div class="SL-views-and-like">
                                            <div>
                                                <img src="https://cdn.jsdelivr.net/gh/SwirlAdmin/swirl-cdn/assets/images/heart-fill.svg" alt="Heart icon">
                                                <label>${scheduled.total_like ? scheduled.total_like : '0'}</label>
                                            </div>
                                            <div>
                                                <img src="https://cdn.jsdelivr.net/gh/SwirlAdmin/swirl-cdn/assets/images/eye-fill.svg" alt="Views icon">    
                                                <label>${scheduled.total_views ? scheduled.total_views : '0'}</label>
                                            </div>
                                        </div>
                                        <p class="SL-stream-desc">${scheduled.description ? scheduled.description : ''}</p>
                                        <button class="SL-stream-play-action streamClick" style="background: ${customization.date_bk_color} !important; color: ${customization.date_fk_color} !important;" onclick="watchStream('${scheduled.streamURL}');">Watch Now</button>
                                    </div>                                    
                                `;
                            }
                        });
                    }

                    if (data['completed'].length) {
                        data['completed'].forEach(completed => {
                            allStreamsSL[btoa(completed.streamURL)] = completed;
                            scounts++;
                            var onDT = new Date(`${(completed.starting_time).replaceAll('-', '/')}`);
                            var onTime = (onDT.toLocaleString('en-IN', { hour: 'numeric', minute: 'numeric', hour12: true })).toUpperCase();
                            onDT = "" + onDT.getDate() + " " + monthNames[`${onDT.getMonth()}`] + ", " + onDT.getFullYear() + " - " + onTime;
                            if (scounts == 1) {
                                append += `                                
                                    <div class="col-md-12 mb-2 SL-full-card" style="background: #fff8fc !important;" data-stream="${completed.streamURL}">
                                        <div class="row align-items-center justify-content-center">
                                            <div class="col-12 col-md-2 p-0">
                                                <img src="${completed.cover_img}" class="SL-vdo-thmub-full" alt="Stream Thumbnail" >
                                            </div>
                                            <div class="col-12 col-md-10 py-1 ${customization.scheduled_grid == '0' ? 'order-md-first' : ''}"">
                                                <p class="SL-stream-title-full">${completed.title}</p>
                                                <p class="SL-stream-desc-full">${completed.description ? completed.description : ''}</p>
                                                <button class="SL-stream-play-action-full streamClick" onclick="watchStream('${completed.streamURL}');" style="color: ${customization.date_bk_color} !important; border-color: ${customization.date_bk_color} !important;">Watch Now</button>

                                                <div class="SL-views-and-like mt-3">
                                                    <div>
                                                        <img src="https://cdn.jsdelivr.net/gh/SwirlAdmin/swirl-cdn/assets/images/heart-fill.svg" alt="Heart icon">
                                                        <label>${completed.total_like ? completed.total_like : '0'}</label>
                                                    </div>
                                                    <div>
                                                        <img src="https://cdn.jsdelivr.net/gh/SwirlAdmin/swirl-cdn/assets/images/eye-fill.svg" alt="Views icon">    
                                                        <label>${completed.total_views ? completed.total_views : '0'}</label>
                                                    </div>
                                                </div>

                                                <div class="SL-share mt-2">
                                                    <p class="SL-link-copied" style="color: ${customization.date_bk_color} !important;">Link Copied!</p>
                                                    <img class="SL-facebook SL-share-images" src="https://cdn.jsdelivr.net/gh/SwirlAdmin/swirl-cdn/assets/images/goswirl-webp/facebook.webp" data-sharelink="${urlSL + '?stream=' + window.btoa(completed.streamURL)}" alt="Facebook icon" title="Share on Facebook">
                                                    <img class="SL-twitter SL-share-images" src="https://cdn.jsdelivr.net/gh/SwirlAdmin/swirl-cdn/assets/images/goswirl-webp/twitter.webp" data-sharelink="${urlSL + '?stream=' + window.btoa(completed.streamURL)}" alt="Twitter icon" title="Share on Twitter">
                                                    <img class="SL-whatsapp SL-share-images" src="https://cdn.jsdelivr.net/gh/SwirlAdmin/swirl-cdn/assets/images/goswirl-webp/whatsapp.webp" data-sharelink="${urlSL + '?stream=' + window.btoa(completed.streamURL)}" alt="Whatsapp icon" title="Share on Whatsapp">
                                                    <img class="SL-copy SL-share-images" src="https://cdn.jsdelivr.net/gh/SwirlAdmin/swirl-cdn/assets/images/goswirl-webp/copy-link.webp" data-sharelink="${urlSL + '?stream=' + window.btoa(completed.streamURL)}" alt="Copy link icon" title="Copy link">                                                
                                                </div>
                                            </div>
                                        </div>                                        
                                    </div>                                    
                                `;

                                // watchStream(`${completed.streamURL}`);
                                playThis = completed.streamURL;
                            } else {
                                append += `
                                    <div class="col-6 col-md-2 mb-1 px-md-1 loading-SL" ${scounts > (displaySL + 1) ? 'style="display: none;"' : ''}>                                        
                                        <div class="SL-active-stream-video-container position-relative" data-stream="${completed.streamURL}" onclick="!event.target.className.includes('SL-share-images') ? watchStream('${completed.streamURL}') : '';">
                                            <img src="${completed.cover_img}" class="SL-vdo-thmub"
                                                alt="Stream Thumbnail" >
                                            <img src="https://cdn.jsdelivr.net/gh/SwirlAdmin/swirl-cdn/assets/images/goswirl-webp/play.webp" class="SL-play-btn" alt="Play icon"
                                                >                                        
                                            <p class="SL-date-top">${onDT.split(',')[0]}</p>
                                            ${customization.total_view_set ? `<p class="SL-views-top"><img src="https://cdn.jsdelivr.net/gh/SwirlAdmin/swirl-cdn/assets/images/goswirl-webp/views-icon.webp" alt="Views icon"> ${completed.total_views}</p>` : ''}                                        
                                            <div class="SL-stream-info-container" style="background: ${customization.date_bk_color} !important;">
                                                <div class="SL-stream-info">                                                    
                                                    <div class="text-left SL-share">
                                                        <p class="SL-link-copied" style="color: ${customization.date_fk_color} !important;">Link Copied!</p>
                                                        <img class="SL-facebook SL-share-images" src="https://cdn.jsdelivr.net/gh/SwirlAdmin/swirl-cdn/assets/images/goswirl-webp/facebook.webp" data-sharelink="${urlSL + '?stream=' + window.btoa(completed.streamURL)}" alt="Facebook icon" title="Share on Facebook">
                                                        <img class="SL-twitter SL-share-images" src="https://cdn.jsdelivr.net/gh/SwirlAdmin/swirl-cdn/assets/images/goswirl-webp/twitter.webp" data-sharelink="${urlSL + '?stream=' + window.btoa(completed.streamURL)}" alt="Twitter icon" title="Share on Twitter">
                                                        <img class="SL-whatsapp SL-share-images" src="https://cdn.jsdelivr.net/gh/SwirlAdmin/swirl-cdn/assets/images/goswirl-webp/whatsapp.webp" data-sharelink="${urlSL + '?stream=' + window.btoa(completed.streamURL)}" alt="Whatsapp icon" title="Share on Whatsapp">
                                                        <img class="SL-copy SL-share-images" src="https://cdn.jsdelivr.net/gh/SwirlAdmin/swirl-cdn/assets/images/goswirl-webp/copy-link.webp" data-sharelink="${urlSL + '?stream=' + window.btoa(completed.streamURL)}" alt="Copy link icon" title="Copy link">                                                
                                                    </div>
                                                </div>                                            
                                            </div>
                                        </div>
                                        <p class="SL-stream-title">${completed.title}</p>
                                        <div class="SL-views-and-like">
                                            <div>
                                                <img src="https://cdn.jsdelivr.net/gh/SwirlAdmin/swirl-cdn/assets/images/heart-fill.svg" alt="Heart icon">
                                                <label>${completed.total_like ? completed.total_like : '0'}</label>
                                            </div>
                                            <div>
                                                <img src="https://cdn.jsdelivr.net/gh/SwirlAdmin/swirl-cdn/assets/images/eye-fill.svg" alt="Views icon">    
                                                <label>${completed.total_views ? completed.total_views : '0'}</label>
                                            </div>
                                        </div>
                                        <p class="SL-stream-desc">${completed.description ? completed.description : ''}</p>
                                        <button class="SL-stream-play-action streamClick" style="background: ${customization.date_bk_color} !important; color: ${customization.date_fk_color} !important;" onclick="watchStream('${completed.streamURL}');">Watch Now</button>
                                    </div>
                                `;
                            }
                        });
                    }

                    append += '</div>';
                    if (scounts > displaySL) {
                        append += `<button class="SL-stream-load-more mb-1" onclick="loadMoreSL(this);" style="color: ${customization.date_bk_color} !important; border-color: ${customization.date_bk_color} !important;">LOAD MORE <p class="SL-loader" style="border-color: ${customization.date_bk_color}25 !important; border-top-color: ${customization.date_bk_color} !important;"></p></button>`;
                    }

                } else {

                    if (data['scheduled'].length) {
                        append += `<p class="m-0 mb-1 mt-1 pb-1 h5 SL-break-title ${customization.header_setting ? 'text-center' : ''}">${customization.schedule_text}</p><hr class="SL-title-border ${customization.header_setting ? 'm-auto mb-1' : ''}" style="background: ${customization.date_bk_color} !important;"><div class="row px-2">`;
                        data['scheduled'].forEach(scheduled => {
                            allStreamsSL[btoa(scheduled.streamURL)] = scheduled;
                            var onDT = new Date(`${(scheduled.starting_time).replaceAll('-', '/')}`);
                            var onTime = (onDT.toLocaleString('en-IN', { hour: 'numeric', minute: 'numeric', hour12: true })).toUpperCase();
                            onDT = "" + onDT.getDate() + " " + monthNames[`${onDT.getMonth()}`] + ", " + onDT.getFullYear() + " - " + onTime;
                            append += `                                
                                <div class="col-md-3 mb-1 px-md-1">
                                    <p class="SL-stream-title">${scheduled.title}</p>
                                    <div class="SL-active-stream-video-container position-relative" data-stream="${scheduled.streamURL}" onclick="!event.target.className.includes('SL-share-images') ? watchStream('${scheduled.streamURL}') : '';">
                                        <img src="${scheduled.cover_img}" class="SL-vdo-thmub"
                                            alt="Stream Thumbnail" >
                                        <img src="https://cdn.jsdelivr.net/gh/SwirlAdmin/swirl-cdn/assets/images/goswirl-webp/play.webp" class="SL-play-btn" alt="Play icon"
                                            >                                                                                
                                        <p class="SL-date-top">${onDT.split(',')[0]}</p>
                                        <div class="SL-stream-info-container" style="background: ${customization.date_bk_color} !important;">
                                            <div class="SL-stream-info">                                                
                                                <div class="text-left SL-share">
                                                    <p class="SL-link-copied" style="color: ${customization.date_fk_color} !important;">Link Copied!</p>
                                                    <img class="SL-facebook SL-share-images" src="https://cdn.jsdelivr.net/gh/SwirlAdmin/swirl-cdn/assets/images/goswirl-webp/facebook.webp" data-sharelink="${urlSL + '?stream=' + window.btoa(scheduled.streamURL)}" alt="Facebook icon" title="Share on Facebook">
                                                    <img class="SL-twitter SL-share-images" src="https://cdn.jsdelivr.net/gh/SwirlAdmin/swirl-cdn/assets/images/goswirl-webp/twitter.webp" data-sharelink="${urlSL + '?stream=' + window.btoa(scheduled.streamURL)}" alt="Twitter icon" title="Share on Twitter">
                                                    <img class="SL-whatsapp SL-share-images" src="https://cdn.jsdelivr.net/gh/SwirlAdmin/swirl-cdn/assets/images/goswirl-webp/whatsapp.webp" data-sharelink="${urlSL + '?stream=' + window.btoa(scheduled.streamURL)}" alt="Whatsapp icon" title="Share on Whatsapp">
                                                    <img class="SL-copy SL-share-images" src="https://cdn.jsdelivr.net/gh/SwirlAdmin/swirl-cdn/assets/images/goswirl-webp/copy-link.webp" data-sharelink="${urlSL + '?stream=' + window.btoa(scheduled.streamURL)}" alt="Copy link icon" title="Copy link">                                                
                                                </div>
                                            </div>                                            
                                        </div>
                                    </div>
                                    <p class="SL-stream-desc">${scheduled.description ? scheduled.description : ''}</p>
                                    <button class="SL-stream-play-action" style="background: ${customization.date_bk_color} !important; color: ${customization.date_fk_color} !important;" onclick="watchStream('${scheduled.streamURL}');">Watch Now</button>
                                </div>                                    
                            `;
                        });
                        append += '</div>';
                    }

                    if (data['completed'].length) {
                        append += `<p class="m-0 mb-1 mt-1 pb-1 h5 SL-break-title ${customization.header_setting ? 'text-center' : ''}">${customization.completed_text}</p><hr class="SL-title-border ${customization.header_setting ? 'm-auto mb-1' : ''}" style="background: ${customization.date_bk_color} !important;"><div class="row px-2">`;
                        data['completed'].forEach(completed => {
                            allStreamsSL[btoa(completed.streamURL)] = completed;
                            var onDT = new Date(`${(completed.starting_time).replaceAll('-', '/')}`);
                            var onTime = (onDT.toLocaleString('en-IN', { hour: 'numeric', minute: 'numeric', hour12: true })).toUpperCase();
                            onDT = "" + onDT.getDate() + " " + monthNames[`${onDT.getMonth()}`] + ", " + onDT.getFullYear() + " - " + onTime;
                            append += `
                                <div class="col-md-3 mb-1 px-md-1">
                                    <p class="SL-stream-title">${completed.title}</p>
                                    <div class="SL-active-stream-video-container position-relative" data-stream="${completed.streamURL}" onclick="!event.target.className.includes('SL-share-images') ? watchStream('${completed.streamURL}') : '';">
                                        <img src="${completed.cover_img}" class="SL-vdo-thmub"
                                            alt="Stream Thumbnail" >
                                        <img src="https://cdn.jsdelivr.net/gh/SwirlAdmin/swirl-cdn/assets/images/goswirl-webp/play.webp" class="SL-play-btn" alt="Play icon"
                                            >                                        
                                        <p class="SL-date-top">${onDT.split(',')[0]}</p>
                                        ${customization.total_view_set ? `<p class="SL-views-top"><img src="https://cdn.jsdelivr.net/gh/SwirlAdmin/swirl-cdn/assets/images/goswirl-webp/views-icon.webp" alt="Views icon"> ${completed.total_views}</p>` : ''}
                                        <div class="SL-stream-info-container" style="background: ${customization.date_bk_color} !important;">
                                            <div class="SL-stream-info">                                                
                                                <div class="text-left SL-share">
                                                    <p class="SL-link-copied" style="color: ${customization.date_fk_color} !important;">Link Copied!</p>
                                                    <img class="SL-facebook SL-share-images" src="https://cdn.jsdelivr.net/gh/SwirlAdmin/swirl-cdn/assets/images/goswirl-webp/facebook.webp" data-sharelink="${urlSL + '?stream=' + window.btoa(completed.streamURL)}" alt="Facebook icon" title="Share on Facebook">
                                                    <img class="SL-twitter SL-share-images" src="https://cdn.jsdelivr.net/gh/SwirlAdmin/swirl-cdn/assets/images/goswirl-webp/twitter.webp" data-sharelink="${urlSL + '?stream=' + window.btoa(completed.streamURL)}" alt="Twitter icon" title="Share on Twitter">
                                                    <img class="SL-whatsapp SL-share-images" src="https://cdn.jsdelivr.net/gh/SwirlAdmin/swirl-cdn/assets/images/goswirl-webp/whatsapp.webp" data-sharelink="${urlSL + '?stream=' + window.btoa(completed.streamURL)}" alt="Whatsapp icon" title="Share on Whatsapp">
                                                    <img class="SL-copy SL-share-images" src="https://cdn.jsdelivr.net/gh/SwirlAdmin/swirl-cdn/assets/images/goswirl-webp/copy-link.webp" data-sharelink="${urlSL + '?stream=' + window.btoa(completed.streamURL)}" alt="Copy link icon" title="Copy link">                                                
                                                </div>
                                            </div>                                            
                                        </div>
                                    </div>
                                    <p class="SL-stream-desc">${completed.description ? completed.description : ''}</p>
                                    <button class="SL-stream-play-action" style="background: ${customization.date_bk_color} !important; color: ${customization.date_fk_color} !important;" onclick="watchStream('${completed.streamURL}');">Watch Now</button>
                                </div>
                            `;

                        });
                        append += '</div>';
                    }

                }

                $('.SL-streams-list').html(append);

                // Shared link autoplay
                setTimeout(() => {
                    const urlSearchParams = new URLSearchParams(window.location.search);
                    const params = Object.fromEntries(urlSearchParams.entries());
                    if (typeof params['stream'] != 'undefined' || typeof params['live'] != 'undefined') {
                        setTimeout(() => {
                            if ($(`div[data-stream="${window.atob(typeof params['stream'] != 'undefined' ? params['stream'] : params['live'])}"]`).find('.streamClick').length) {
                                $(`div[data-stream="${window.atob(typeof params['stream'] != 'undefined' ? params['stream'] : params['live'])}"]`).find('.streamClick').click();
                            } else {
                                $(`div[data-stream="${window.atob(typeof params['stream'] != 'undefined' ? params['stream'] : params['live'])}"]`).click();
                            }
                        }, 500);
                    } else if (playThis) {
                        watchStream(playThis);
                    }
                }, 2000);

                // share clicks
                $('.SL-facebook').click(function () {
                    let link = $(this).attr('data-sharelink');

                    window.open('https://www.facebook.com/sharer/sharer.php?u=' + link, '_blank');
                });

                $('.SL-twitter').click(function () {
                    let link = $(this).attr('data-sharelink');

                    window.open('https://twitter.com/share?url=' + link, '_blank');
                });

                $('.SL-whatsapp').click(function () {
                    let link = $(this).attr('data-sharelink');

                    window.open('https://api.whatsapp.com/send?text=' + link);
                });

                $('.SL-copy').click(function () {
                    let link = $(this).attr('data-sharelink');

                    $('.SL-copylink-input').val(link);
                    $('.SL-copylink-input').click();
                    $(this).parent('.SL-share').find('.SL-link-copied').fadeIn().delay(3000).fadeOut();
                });

                // for stuff that scrolls left on hover
                $(".scroll_on_hover").mouseover(function () {
                    $(this).removeClass("ellipsis");
                    var maxscroll = $(this).width();
                    var speed = maxscroll * 15;
                    $(this).animate({
                        scrollLeft: maxscroll
                    }, speed, "linear");
                });

                $(".scroll_on_hover").mouseout(function () {
                    $(this).stop();
                    $(this).addClass("ellipsis");
                    $(this).animate({
                        scrollLeft: 0
                    }, 'slow');
                });

                $(window).resize(function () {
                    SLFrameHeight();
                });
            }
            else {
                $('#swirl-live-streams').html(`
                    <p class="h5 text-muted text-center my-5">No Live Stream yet!</p>
                `);
            }
        }
    });
}

// Iframe post listener
var eventMethodSL = window.addEventListener ? "addEventListener" : "attachEvent";
var eventerSL = window[eventMethodSL];
var messageEventSL = eventMethodSL == "attachEvent" ? "onmessage" : "message";

// Listen message from child window
eventerSL(messageEventSL, function (e) {
    const { action, data } = e.data;
    if (action == 'updateStreamTime') {
        // console.log('Called from SATYAM ' + data);
        localStorage.setItem('_pipSecondsSL', data);
        localStorage.setItem('_pipSL', JSON.stringify(allStreamsSL[btoa(currentStreamSL)]));
    }

    if (action == 'refreshStreamPage') {
        // console.log(data);
        location.reload();
    }
}, false);

let allOverElementsLS = [];
let allOverElementsLSSticky = [];

function closeLiveStreamPop() {
    localStorage.setItem('_pipSL', '');

    let sls = document.querySelector('.SL-iframe-live');

    let slsFrame = document.querySelector('.SL-iframe-live iframe');
    slsFrame.src = '';

    sls.style.display = 'none';

    // Scroll and over items
    var html = jQuery('html');
    var scrollPosition = html.data('scroll-position');
    html.css('overflow', html.data('previous-overflow'));
    window.scrollTo(scrollPosition[0], scrollPosition[1]);

    // Show again all hidden fixed elements
    allOverElementsLS.forEach(element => {
        $(element).show();
    });

    // Show again all hidden fixed elements
    allOverElementsLSSticky.forEach(element => {
        $(element).show();
    });
}

function watchStream(stream, fromPIP = false) {
    if ($('.SL-iframe-live').is(':visible')) return;

    currentStreamSL = stream;

    let startTimeQ = '';
    if (fromPIP) {
        startTimeQ = '&start_time=' + Math.floor($('.SL-pip-live video')[0].currentTime);
    }

    if (!fromPIP) {
        localStorage.setItem('_pipSL', JSON.stringify(allStreamsSL[btoa(stream)]));
    }

    let streamData = allStreamsSL[btoa(stream)];
    $('.SL-popup-close-btn').hide();
    if (streamData.video_orientation == '2') {
        $('.SL-popup-close-btn-L').show();
        if (streamData.live_preview == '0') {
            $('.SL-popup-close-btn-L').css('filter', 'invert(1)');
        } else {
            $('.SL-popup-close-btn-L').css('filter', 'none');
        }
    } else {
        $('.SL-popup-close-btn-P').show();
    }

    let slsFrame = document.querySelector('.SL-iframe-live iframe');
    // slsFrame.src = stream+'?plugin=1';
    let link = btoa(urlSL + '?stream=' + window.btoa(stream));
    slsFrame.src = stream.includes("?flag") ? stream + '&plugin=' + link + '&page=listing' + startTimeQ : stream + '?plugin=' + link + '&page=listing' + startTimeQ;

    // Scroll and over items
    var scrollPosition = [
        self.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft,
        self.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
    ];
    var html = jQuery('html'); // it would make more sense to apply this to body, but IE7 won't have that
    html.data('scroll-position', scrollPosition);
    html.data('previous-overflow', html.css('overflow'));
    html.css('overflow', 'hidden');
    window.scrollTo(scrollPosition[0], scrollPosition[1]);

    // hide all fixed visible elements
    allOverElementsLS = [];
    allOverElementsLSSticky = [];
    $('*').each(function () {
        if ($(this).css('position') == 'fixed' && $(this).is(":visible")) {
            if (!$(this).is('.SSV-play-modal') && !$(this).is('.SSV-PIP')) {
                $(this).hide();
                allOverElementsLS.push($(this));
            }
        }

        if ($(this).css('position') == 'sticky' && $(this).is(":visible")) {
            if (!$(this).is('.SSV-play-modal') && !$(this).is('.SSV-PIP')) {
                $(this).hide();
                allOverElementsLS.push($(this));
            }
        }
    });

    SLFrameHeight();
    $('.SL-iframe-live').show();
}

function openPIPSL() {
    let pipStreamData = JSON.parse(localStorage.getItem('_pipSL'));
    let pipStartTime = localStorage.getItem('_pipSecondsSL') || 0;

    // application/x-mpegURL  ,  video/mp4
    if (pipStreamData.show_preview == '1' && pipStreamData.is_live == '0') {
        if (pipStreamData.video_orientation == '1') $('.SL-pip-live').addClass('SL-pip-live-P');
        $('.SL-pip-live video source').attr('type', 'video/mp4');
        $('.SL-pip-live video source').attr('src', pipStreamData.recording_preview);
        $('.SL-pip-live video').attr('poster', pipStreamData.cover_img);
        $('.SL-pip-live video')[0].load();
        $('.SL-pip-live video')[0].play();
    } else if (pipStreamData.recording_url != '') {
        if (pipStreamData.video_orientation == '1') $('.SL-pip-live').addClass('SL-pip-live-P');
        $('.SL-pip-live video source').attr('type', 'video/mp4');
        $('.SL-pip-live video source').attr('src', pipStreamData.recording_url + '#t=' + pipStartTime);
        $('.SL-pip-live video').attr('poster', pipStreamData.cover_img);
        $('.SL-pip-live video')[0].load();
        $('.SL-pip-live video')[0].play();
    } else {
        var jqTag = document.createElement('script');
        jqTag.rel = 'text/javascript';
        jqTag.src = 'https://vjs.zencdn.net/8.6.1/video.min.js';
        headTag.insertBefore(jqTag, headTag.lastChild);
        jqTag.onload = function () {
            if (pipStreamData.video_orientation == '1') $('.SL-pip-live').addClass('SL-pip-live-P');
            let vWidth = pipStreamData.video_orientation == '1' ? '180px' : '250px';
            $('.SL-pip-live video').attr('height', 'auto');
            $('.SL-pip-live video').attr('width', vWidth);
            $('.SL-pip-live video source').attr('type', 'application/x-mpegURL');
            $('.SL-pip-live video source').attr('src', pipStreamData.mogi_accessurl);
            $('.SL-pip-live video').addClass('video-js');
            $('.SL-pip-live video').attr('poster', pipStreamData.cover_img);
            var player = videojs('id-video-pip-SL');
            player.play();
        };
    }

    $('.SL-pip-live').show();
}

function closePIPSL() {
    $('.SL-pip-live video').get(0).pause();
    $('.SL-pip-live').hide();

    localStorage.setItem('_pipSL', '');
}

function fullScreenPIPSL(e) {
    let pipStreamData = JSON.parse(localStorage.getItem('_pipSL'));

    if (e.target.classList == 'SL-pip-close-btn') return;

    $('.SL-pip-live video').get(0).pause();
    $('.SL-pip-live').hide();
    watchStream(pipStreamData.streamURL, true);
}

function SLcopyLink(inp) {
    /* Get the text field */
    var copyText = inp;

    copyText.select();
    copyText.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(copyText.value);

    return;
}

function loadMoreSL(btn) {
    $('.SL-loader').show();
    setTimeout(() => {
        var showCount = 0;
        $('.loading-SL:hidden').each(function () {
            showCount++;
            if (showCount <= displaySL) {
                $(this).show();
            }
        });

        if ($('.loading-SL:hidden').length == 0) {
            $('.SL-stream-load-more').hide();
        }

        $('.SL-loader').hide();
    }, 2000);
}

function SLFrameHeight() {
    $('.SL-iframe-live iframe').height(window.innerHeight); //set full height
}

function checkLive(streamId) {
    return false;
}