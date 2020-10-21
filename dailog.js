export default class Dailog extends EventTarget {
    constructor({width = "40%",
         height="260px",
         title="我的标题",
         content="我的内容",
         maskable= true,
         isCancel= true,
         dragable= true,
         success = ()=>{},
         cancel = ()=>{}
    }
        ) {
        super();
        this.opts = {
            width,
            height,
            title,
            content,
            maskable,
            isCancel,
            dragable,
            success,
            cancel
        }

        // opts
        // for(let i in opts){

        // }
        // 合并配置 :用除了 Object.assign 方法之外的方法合并配置；
        // 默认配置
        // let defaultOpts = {
        //     width: "30%",
        //     height: "250px",
        //     title: "测试标题",
        //     content: "测试内容",
        //     dragable: true, //是否可拖拽
        //     maskable: true, //是否有遮罩
        //     isCancel: false //是否有取消
        // }
        // this.opts = opts;
        // this.opts = Object.assign(defaultOpts, opts)

        // this.opts = {...defaultOpts,...opts};
        // console.log(this.opts);
        // console.log(defaultOpts);
        this.init();

    }
    init() {
        this.createDom();
        if (!this.opts.maskable) {
            // 没有遮罩层；
            this.divEle.querySelector(".k-wrapper").style.display = "none";
        }
        // 自定义事件；绑定自定义事件
        this.addEventListener("success", this.opts.success);

        // 绑定事件；
        let dailog = this.divEle.querySelector(".k-dialog");
        dailog.addEventListener("click", e => {
            // console.log(e.target.className);
            switch (e.target.className) {
                case 'k-close':
                    this.close();
                    break;
                case 'k-primary':
                    // this.opts.success();
                    this.confirm();
                    this.close();
                    break;
                case 'k-cancel':
                    this.opts.cancel("取消了");
                    this.close();
                    break;
            }
        })
        if (this.opts.dragable) {
            this.drag();
        }
    }
    confirm(value) {
        // let val = "值";
        let event = new CustomEvent("success",{
            detail:value
        })
        this.dispatchEvent(event);
    }
    close() {
        this.divEle.style.display = "none";
    }
    createDom() {
        let divEle = document.createElement("div");
        divEle.innerHTML = `<div class="k-wrapper"></div>
        <div class="k-dialog" style="width:${this.opts.width};height:${this.opts.height}">
            <div class="k-header">
                <span class="k-title">${this.opts.title}</span><span class="k-close">X</span>
            </div>
            <div class="k-body">
                <span>${this.opts.content}</span>
            </div>
            <div class="k-footer">
                ${this.opts.isCancel ? ' <span class="k-cancel">取消</span>' : ''}
                <span class="k-primary">确定</span>
            </div>
        </div>`;
        document.body.appendChild(divEle);
        divEle.style.display = "none";
        this.divEle = divEle;
    }
    open() {
        // 显示dailog;
        this.divEle.style.display = "block";
    }
    drag() {
        let dailog = this.divEle.querySelector(".k-dialog");
        dailog.onmousedown = e => {
            let x = e.clientX - dailog.offsetLeft;
            let y = e.clientY - dailog.offsetTop;
            // console.log(x,y);
            dailog.onmousemove = e => {
                let xx = e.clientX;
                let yy = e.clientY;
                dailog.style.left = xx - x + "px";
                dailog.style.top = yy - y + "px";
            }
        }
        document.onmouseup = function () {
            dailog.onmousemove = "";
        }
    }
}


// 扩展带有input框的dailog

export class ExtendsDailog extends Dailog{
    constructor(opts){
        super(opts);
        this.createInput();
    }
    confirm(){
        // console.log("confirm");
        let value = this.myinput.value ?? "默认值";
        // console.log(value);
        super.confirm(value);
    }
    createInput(){
        let myinput = document.createElement("input");
        myinput.classList.add("input-inner");
        this.divEle.querySelector(".k-body").appendChild(myinput);
        this.myinput = myinput;
    }
}


class MyDailog extends HTMLElement{
        constructor(){
            super();
            // this.innerHTML
            this.innerHTML = `<button>点击</button>`;
            let dailog = new Dailog({
                title:this.title,
                success:(e)=>{
                   this.dispatchEvent(new CustomEvent("success",{
                       detail:e.detail
                   }))
                }

            });
            this.onclick = function(){
                dailog.open();
            }
        }
        get title(){
            return this.getAttribute("title") ?? "默认标题"
        }
    }
customElements.define("my-dailog",MyDailog)




