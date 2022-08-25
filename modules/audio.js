let random = Math.random;
let sign = Math.sign;
let sin = Math.sin;
let max = Math.max;
let atan = Math.atan;
const PI = Math.PI;

export default class Audio {
    constructor() {
        
        this.ctx = new AudioContext();
        this.master = this.ctx.createGain();
        this.master.gain.setValueAtTime(0.5, this.ctx.currentTime); 
        this.master.connect(this.ctx.destination);
    }

    playCrash(volume = 1) {
        const srate = 8000;
        const length = srate*1;
        let buffer = this.ctx.createBuffer(1, length, srate);
        let data = buffer.getChannelData(0);
        let p1 = 90 + random() * 64;

        for(let t = 0; t < length; t++) {
            let tt = t;
            t = t & ~(1 << ~~(t/p1));
            let env = (1- t / length);
            let env2 = (1- t / 2000);
            // const env = 1-(t % (1<<12) / (1<<12));
            let kick = sin(env**32*0x5f);
            data[tt] = atan(
                kick * env2**5
            ) / (PI/2) * volume
            ;
            t = tt;
        }

        let source = this.ctx.createBufferSource();
        source.buffer = buffer;
        // source.loop = true;

        source.connect(this.master);
        source.start();
    }

    playCollect(volume = 1) {
        const srate = 8000;
        const length = 8000;
        let buffer = this.ctx.createBuffer(1, length, srate);
        let data = buffer.getChannelData(0);
        let p1 = 1 + random();

        for(let t = 0; t < length; t++) {
            let tt = t;
            // t = t & ~(1 << ~~(t/p1));
            let env = (1- t / 8000);
            data[tt] = atan(
                sin(t * .02 * p1 * (t>>9) * (t>>10))
            ) / (PI/2) * 2 * volume * env**2
            ;
            t = tt;
        }

        let source = this.ctx.createBufferSource();
        source.buffer = buffer;
        // source.loop = true;

        source.connect(this.master);
        source.start();
    }

    
    playLevelFinish(volume = 1) {
        const srate = 8000;
        const length = srate*2;
        let buffer = this.ctx.createBuffer(1, length, srate);
        let data = buffer.getChannelData(0);
        let p1 = 1 + random();

        for(let t = 0; t < length; t++) {
            let tt = t;
            // t = t & ~(1 << ~~(t/p1));
            let env = (1 - t / length);
            const env2 = 1-(t % (1<<10) / (1<<10));
            data[tt] = atan(
                sin(t * .05 * p1 * 2**((t>>10)%3)) * sin(env2)**3 * env**3
                +
                sin(t * .05 * p1) * env**5
            ) / (PI/2) * 2 * volume
            +
            data[max(tt-1000, 0)] * 0.4
            ;
            t = tt;
        }

        let source = this.ctx.createBufferSource();
        source.buffer = buffer;
        // source.loop = true;

        source.connect(this.master);
        source.start();
    }
    

    start() {

        const srate = 12000;
        const length = 1 << 20;
        let musicBuffer = this.ctx.createBuffer(1, length, srate);
        let data = musicBuffer.getChannelData(0);

        let flavor;
        
        let b = 0;
        for(let i = 0; i < 5; i++) {
            b = b | ~~(random() * 4);
            b = b << 2;
        }
        
        let bs = [
            773752, 
            773752, 
            773752|0x7f, 
            957758312, 

            773752, 
            773752, 
            773752|0x7f, 
            957758312, 

            792323628, 
            792323628, 
            957758312, 
            957758312, 

            1008437436, 
            1008437436, 
            773752|0x7f, 
            957758312, 

            
        ];
        
        for(let t = 0; t < length; t++) {
            const env = 1-(t % (1<<12) / (1<<12));
            const env2 = 1-(t % (1<<15) / (1<<15));
            const env3 = 1-(t % (1<<10) / (1<<10));
            let hihat1 = (random()*2-1)*env**32 * 0.5;
            let hihat2 = (random()*2-1)*env3**32 * 1.9;
            let kick = sin(env**6*0x6f)*env;
            let snare = (random()*2-1)*env**4;
            if(t % (1<<15) == 0) flavor = ~~(random() * 2048);
            if(t % (1<<16) == 0) {
                
                // for(let i = 0; i < 5; i++) {
                //     b = b | ~~(random() * 4);
                //     b = b << 2;
                // }
                // bs.push(b);
                b = bs.shift();
            };
            let tt = t;
            t = t & b;
            data[tt] = 
                [[kick,hihat1,snare,hihat1][(t>>12)%4] * 0.4, [kick,snare,hihat1,hihat2][(t>>12)%4] * 0.4][max((t>>14)%4-2, 0)]
                + sign(sin((t&((1<<(5-(t>>14)%3+(t>>12)%6))-1))*(1/64)*PI*(1+env2*.25))) * 0.05
                + sign(sin((t&(flavor << 4))*(1/64)*PI)) * 0.05
                // + sign(sin((t&([32,2,3,111][(t>>15)%4] << 4))*(1/64)*PI)) * 0.1
                + data[max(0, t - 2100)] * 0.4
                + data[max(0, t - 2000)] * 0.4
            ;
            t = tt;
        }
        
        console.log(bs.toString());

        let musicSource = this.ctx.createBufferSource();
        musicSource.buffer = musicBuffer;
        musicSource.loop = true;

        musicSource.connect(this.master);
        musicSource.start();
    }
    
    update() {
    }
}