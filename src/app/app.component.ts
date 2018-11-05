import {Component, NgZone, OnInit} from '@angular/core';
import {slide} from './slideWindow';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  ngOnInit(): void {


  }

  constructor(private ngZone: NgZone) {
    slide();
  }

  title = 'blog';

  navigate = (linkEl) => {
    document.body.classList.remove('render');
    document.body.addEventListener('transitionend', () => window.location = linkEl.href);
  };

  ngAfterViewInit() {
    this.ngZone.runOutsideAngular(_ => {

      setTimeout(() => document.body.classList.add('render'), 60);
      document.body.classList.remove('loading');
      let spriteImagesSrc = ['http://1999.leizihao.cn/assets/zangai.jpg', 'http://1999.leizihao.cn/assets/sky-2.jpg', 'http://1999.leizihao.cn/assets/zangai2.jpeg'];
      let texts = [{
        text: '塟愛鎵镞de栤仯-個亾炷頁',
        link: 'https://github.com/100cm',
        icon: '',
        x: -400,
        y: -200,
        extra_texts:[
          {
            text:
              "◥◣很多時候，峩們走着走着憱潵ろ，那張臉看着看着憱勌ろ。◢\n"+
              "﹌★`妳覺嘚湜洇為苼萿dе鮃啖咊瑣粹耗儘ろ彼呲dе噭凊っ╳灬\n" +
              "祺實隻是妳忘記孒當初nà個執着説愛锝垍魢，ㄣ\n" +
              "︶ㄣ莣記叻去實現黣迗擁抱親肳説愛對祊的諾言。しovё\n" +
              "〃塬來，誐們吥湜吥愛叻，洏湜朢記叻椡柢應該怎麽愛。ぐ",
            style:{fontSize:20},
            x:550
          }
        ],
        extra_image: [{
          src: 'http://1999.leizihao.cn/assets/63.gif'
        }]
      }, {
        text: '髒鑀鎵镞唯㈠ZんǏ定官方棢站ツ\n' +
          '﹎ゞ心已停機愛已欠費感情不在服務區 /╱°\n' +
          'ぉ潯找昔鈤樻族ゞ\n' +
          '╃别低頭，緑帽會掉。别流涙，老王會笑メ\n' +
          '現茬+杁髒鑀鎵鏃\n' +
          'QQ裙：554967109\n',
        icon: '',
        x: -400,
        y: -200,
        style: {fontSize: 28},
        color: '#cccccc'
      }, {
        text: '丶鎿什么琓蓅妳ミ灬 ╭ァ亲、伱给dē幸福呢ぉ灬\n',
        x: -400,
        y: -200,
        size:true,
        extra_texts: [{
          text: '塟愛鎵镞de鸟仯',
          link: 'https://8w.wtf',
        },

          {
            text: '塟愛鎵镞de栤仯3',
            link: 'http://xiamian.win/',
          }
        ],
        extra_image: [{
          src: 'http://1999.leizihao.cn/assets/zangai-logo.jpg',
          x: 500,
          y: -300
        },
          {
            src: 'http://1999.leizihao.cn/assets/zangai-logo2.png',
            x: 500,
            y: 100,
            width:400,
            height:500,
          }
          ]
      }];

      new window['CanvasSlideshow']({
        sprites: spriteImagesSrc,
        displacementImage: 'http://1999.leizihao.cn/assets/clouds.jpg',
        autoPlay: true,
        fullScreen: true,
        wacky: true,
        autoPlaySpeed: [1.2, 1.2],
        displaceScale: [800, 500],
        centerSprites: true,
        texts: texts,
        textColor: '#cccccc',
      });
    });

  }
}
