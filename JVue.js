class JVue{
    constructor(opts){
        this.opts=opts;
        this._data=opts.data;
        this.el=opts.el;
        this.compile(opts.el);
    }
    compile(el){
        let ele=document.querySelector(el);
        let childNode=ele.childNodes;
        console.log(chilsNode);
    }


}