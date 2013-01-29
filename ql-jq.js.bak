/*
* jQuery 1.2.6 - New Wave Javascript
*
* Copyright (c) 2008 John Resig (jquery.com)
* Dual licensed under the MIT (MIT-LICENSE.txt)
* and GPL (GPL-LICENSE.txt) licenses.
*
* $Date: 2008-05-24 14:22:17 -0400 (Sat, 24 May 2008) $
* $Rev: 5685 $
*/
;
(function(){
    var _jQuery=window.jQuery,_$=window.$;
    var jQuery=window.jQuery=window.$=function(selector,context){
        return new jQuery.fn.init(selector,context)
    }
    ;
    var quickExpr=/^[^&lt;
    ]*(&lt;
    (.|\s)+&gt;
    )[^&gt;
    ]*$|^#(\w+)$/,isSimple=/^.[^:#\[\.]*$/,undefined;
    jQuery.fn=jQuery.prototype={
        init:function(selector,context){
            selector=selector||document;
            if(selector.nodeType){
                this[0]=selector;
                this.length=1;
                return this
            }
            if(typeof selector=="string"){
                var match=quickExpr.exec(selector);
                if(match&&(match[1]||!context)){
                    if(match[1])selector=jQuery.clean([match[1]],context);
                    else{
                        var elem=document.getElementById(match[3]);
                        if(elem){
                            if(elem.id!=match[3])return jQuery().find(selector);
                            return jQuery(elem)
                        }
                        selector=[]
                    }

                }
                else return jQuery(context).find(selector)
            }
            else if(jQuery.isFunction(selector))return jQuery(document)[jQuery.fn.ready?"ready":"load"](selector);return this.setArray(jQuery.makeArray(selector))
        }
        ,jquery:"1.2.6",size:function(){
            return this.length
        }
        ,length:0,get:function(num){
            return num==undefined?jQuery.makeArray(this):this[num]
        }
        ,pushStack:function(elems){
            var ret=jQuery(elems);
            ret.prevObject=this;
            return ret
        }
        ,setArray:function(elems){
            this.length=0;
            Array.prototype.push.apply(this,elems);
            return this
        }
        ,each:function(callback,args){
            return jQuery.each(this,callback,args)
        }
        ,index:function(elem){
            var ret=-1;
            return jQuery.inArray(elem&&elem.jquery?elem[0]:elem,this)
        }
        ,attr:function(name,value,type){
            var options=name;if(name.constructor==String)if(value===undefined)return this[0]&&jQuery[type||"attr"](this[0],name);else{
                options={

                }
                ;
                options[name]=value
            }
            return this.each(function(i){
                for(name in options)jQuery.attr(type?this.style:this,name,jQuery.prop(this,options[name],type,i,name))
            }
            )
        }
        ,css:function(key,value){
            if((key=='width'||key=='height')&&parseFloat(value)&lt;0)value=undefined;return this.attr(key,value,"curCSS")
        }
        ,text:function(text){
            if(typeof text!="object"&&text!=null)return this.empty().append((this[0]&&this[0].ownerDocument||document).createTextNode(text));var ret="";jQuery.each(text||this,function(){
                jQuery.each(this.childNodes,function(){
                    if(this.nodeType!=8)ret+=this.nodeType!=1?this.nodeValue:jQuery.fn.text([this])
                }
                )
            }
            );
            return ret
        }
        ,wrapAll:function(html){
            if(this[0])jQuery(html,this[0].ownerDocument).clone().insertBefore(this[0]).map(function(){
                var elem=this;
                while(elem.firstChild)elem=elem.firstChild;
                return elem
            }
            ).append(this);
            return this
        }
        ,wrapInner:function(html){
            return this.each(function(){
                jQuery(this).contents().wrapAll(html)
            }
            )
        }
        ,wrap:function(html){
            return this.each(function(){
                jQuery(this).wrapAll(html)
            }
            )
        }
        ,append:function(){
            return this.domManip(arguments,true,false,function(elem){
                if(this.nodeType==1)this.appendChild(elem)
            }
            )
        }
        ,prepend:function(){
            return this.domManip(arguments,true,true,function(elem){
                if(this.nodeType==1)this.insertBefore(elem,this.firstChild)
            }
            )
        }
        ,before:function(){
            return this.domManip(arguments,false,false,function(elem){
                this.parentNode.insertBefore(elem,this)
            }
            )
        }
        ,after:function(){
            return this.domManip(arguments,false,true,function(elem){
                this.parentNode.insertBefore(elem,this.nextSibling)
            }
            )
        }
        ,end:function(){
            return this.prevObject||jQuery([])
        }
        ,find:function(selector){
            var elems=jQuery.map(this,function(elem){
                return jQuery.find(selector,elem)
            }
            );return this.pushStack(/[^+&gt;] [^+&gt;]/.test(selector)||selector.indexOf("..")&gt;-1?jQuery.unique(elems):elems)
        }
        ,clone:function(events){
            var ret=this.map(function(){
                if(jQuery.browser.msie&&!jQuery.isXMLDoc(this)){
                    var clone=this.cloneNode(true),container=document.createElement("div");container.appendChild(clone);return jQuery.clean([container.innerHTML])[0]
                }
                else return this.cloneNode(true)
            }
            );var clone=ret.find("*").andSelf().each(function(){
                if(this[expando]!=undefined)this[expando]=null
            }
            );if(events===true)this.find("*").andSelf().each(function(i){
                if(this.nodeType==3)return;var events=jQuery.data(this,"events");for(var type in events)for(var handler in events[type])jQuery.event.add(clone[i],type,events[type][handler],events[type][handler].data)
            }
            );
            return ret
        }
        ,filter:function(selector){
            return this.pushStack(jQuery.isFunction(selector)&&jQuery.grep(this,function(elem,i){
                return selector.call(elem,i)
            }
            )||jQuery.multiFilter(selector,this))
        }
        ,not:function(selector){
            if(selector.constructor==String)if(isSimple.test(selector))return this.pushStack(jQuery.multiFilter(selector,this,true));
            else selector=jQuery.multiFilter(selector,this);
            var isArrayLike=selector.length&&selector[selector.length-1]!==undefined&&!selector.nodeType;
            return this.filter(function(){
                return isArrayLike?jQuery.inArray(this,selector)&lt;
                0:this!=selector
            }
            )
        }
        ,add:function(selector){
            return this.pushStack(jQuery.unique(jQuery.merge(this.get(),typeof selector=='string'?jQuery(selector):jQuery.makeArray(selector))))
        }
        ,is:function(selector){
            return!!selector&&jQuery.multiFilter(selector,this).length&gt;
            0
        }
        ,hasClass:function(selector){
            return this.is("."+selector)
        }
        ,val:function(value){
            if(value==undefined){
                if(this.length){
                    var elem=this[0];if(jQuery.nodeName(elem,"select")){
                        var index=elem.selectedIndex,values=[],options=elem.options,one=elem.type=="select-one";if(index&lt;0)return null;for(var i=one?index:0,max=one?index+1:options.length;i&lt;max;i++){
                            var option=options[i];
                            if(option.selected){
                                value=jQuery.browser.msie&&!option.attributes.value.specified?option.text:option.value;
                                if(one)return value;
                                values.push(value)
                            }

                        }
                        return values
                    }
                    else return(this[0].value||"").replace(/\r/g,"")
                }
                return undefined
            }
            if(value.constructor==Number)value+='';
            return this.each(function(){
                if(this.nodeType!=1)return;if(value.constructor==Array&&/radio|checkbox/.test(this.type))this.checked=(jQuery.inArray(this.value,value)&gt;=0||jQuery.inArray(this.name,value)&gt;=0);else if(jQuery.nodeName(this,"select")){
                    var values=jQuery.makeArray(value);jQuery("option",this).each(function(){
                        this.selected=(jQuery.inArray(this.value,values)&gt;
                        =0||jQuery.inArray(this.text,values)&gt;
                        =0)
                    }
                    );
                    if(!values.length)this.selectedIndex=-1
                }
                else this.value=value
            }
            )
        }
        ,html:function(value){
            return value==undefined?(this[0]?this[0].innerHTML:null):this.empty().append(value)
        }
        ,replaceWith:function(value){
            return this.after(value).remove()
        }
        ,eq:function(i){
            return this.slice(i,i+1)
        }
        ,slice:function(){
            return this.pushStack(Array.prototype.slice.apply(this,arguments))
        }
        ,map:function(callback){
            return this.pushStack(jQuery.map(this,function(elem,i){
                return callback.call(elem,i,elem)
            }
            ))
        }
        ,andSelf:function(){
            return this.add(this.prevObject)
        }
        ,data:function(key,value){
            var parts=key.split(".");parts[1]=parts[1]?"."+parts[1]:"";if(value===undefined){
                var data=this.triggerHandler("getData"+parts[1]+"!",[parts[0]]);if(data===undefined&&this.length)data=jQuery.data(this[0],key);return data===undefined&&parts[1]?this.data(parts[0]):data
            }
            else return this.trigger("setData"+parts[1]+"!",[parts[0],value]).each(function(){
                jQuery.data(this,key,value)
            }
            )
        }
        ,removeData:function(key){
            return this.each(function(){
                jQuery.removeData(this,key)
            }
            )
        }
        ,domManip:function(args,table,reverse,callback){
            var clone=this.length&gt;
            1,elems;
            return this.each(function(){
                if(!elems){
                    elems=jQuery.clean(args,this.ownerDocument);
                    if(reverse)elems.reverse()
                }
                var obj=this;if(table&&jQuery.nodeName(this,"table")&&jQuery.nodeName(elems[0],"tr"))obj=this.getElementsByTagName("tbody")[0]||this.appendChild(this.ownerDocument.createElement("tbody"));var scripts=jQuery([]);jQuery.each(elems,function(){
                    var elem=clone?jQuery(this).clone(true)[0]:this;if(jQuery.nodeName(elem,"script"))scripts=scripts.add(elem);else{
                        if(elem.nodeType==1)scripts=scripts.add(jQuery("script",elem).remove());callback.call(obj,elem)
                    }

                }
                );
                scripts.each(evalScript)
            }
            )
        }

    }
    ;
    jQuery.fn.init.prototype=jQuery.fn;
    /************************************************************\
    *
    \************************************************************/
    function evalScript(i,elem){
        if(elem.src)jQuery.ajax({
            url:elem.src,async:false,dataType:"script"
        }
        );else jQuery.globalEval(elem.text||elem.textContent||elem.innerHTML||"");if(elem.parentNode)elem.parentNode.removeChild(elem)
    }
    /************************************************************\
    *
    \************************************************************/
    function now(){
        return+new Date
    }
    jQuery.extend=jQuery.fn.extend=function(){
        var target=arguments[0]||{

        }
        ,i=1,length=arguments.length,deep=false,options;
        if(target.constructor==Boolean){
            deep=target;
            target=arguments[1]||{

            }
            ;
            i=2
        }
        if(typeof target!="object"&&typeof target!="function")target={

        }
        ;
        if(length==i){
            target=this;
            --i
        }
        for(;i&lt;length;i++)if((options=arguments[i])!=null)for(var name in options){
            var src=target[name],copy=options[name];if(target===copy)continue;if(deep&©&&typeof copy=="object"&&!copy.nodeType)target[name]=jQuery.extend(deep,src||(copy.length!=null?[]:{

            }
            ),copy);
            else if(copy!==undefined)target[name]=copy
        }
        return target
    }
    ;var expando="jQuery"+now(),uuid=0,windowData={

    }
    ,exclude=/z-?index|font-?weight|opacity|zoom|line-?height/i,defaultView=document.defaultView||{

    }
    ;
    jQuery.extend({
        noConflict:function(deep){
            window.$=_$;
            if(deep)window.jQuery=_jQuery;
            return jQuery
        }
        ,isFunction:function(fn){
            return!!fn&&typeof fn!="string"&&!fn.nodeName&&fn.constructor!=Array&&/^[\s[]?function/.test(fn+"")
        }
        ,isXMLDoc:function(elem){
            return elem.documentElement&&!elem.body||elem.tagName&&elem.ownerDocument&&!elem.ownerDocument.body
        }
        ,globalEval:function(data){
            data=jQuery.trim(data);
            if(data){
                var head=document.getElementsByTagName("head")[0]||document.documentElement,script=document.createElement("script");script.type="text/javascript";if(jQuery.browser.msie)script.text=data;else script.appendChild(document.createTextNode(data));head.insertBefore(script,head.firstChild);head.removeChild(script)
            }

        }
        ,nodeName:function(elem,name){
            return elem.nodeName&&elem.nodeName.toUpperCase()==name.toUpperCase()
        }
        ,cache:{

        }
        ,data:function(elem,name,data){
            elem=elem==window?windowData:elem;
            var id=elem[expando];
            if(!id)id=elem[expando]=++uuid;
            if(name&&!jQuery.cache[id])jQuery.cache[id]={

            }
            ;
            if(data!==undefined)jQuery.cache[id][name]=data;
            return name?jQuery.cache[id][name]:id
        }
        ,removeData:function(elem,name){
            elem=elem==window?windowData:elem;
            var id=elem[expando];
            if(name){
                if(jQuery.cache[id]){
                    delete jQuery.cache[id][name];name="";for(name in jQuery.cache[id])break;if(!name)jQuery.removeData(elem)
                }

            }
            else{
                try{
                    delete elem[expando]
                }
                catch(e){
                    if(elem.removeAttribute)elem.removeAttribute(expando)
                }
                delete jQuery.cache[id]
            }

        }
        ,each:function(object,callback,args){
            var name,i=0,length=object.length;
            if(args){
                if(length==undefined){
                    for(name in object)if(callback.apply(object[name],args)===false)break
                }
                else for(;i&lt;length;)if(callback.apply(object[i++],args)===false)break
            }
            else{
                if(length==undefined){
                    for(name in object)if(callback.call(object[name],name,object[name])===false)break
                }
                else for(var value=object[0];i&lt;length&&callback.call(value,i,value)!==false;value=object[++i]){

                }

            }
            return object
        }
        ,prop:function(elem,value,type,i,name){
            if(jQuery.isFunction(value))value=value.call(elem,i);return value&&value.constructor==Number&&type=="curCSS"&&!exclude.test(name)?value+"px":value
        }
        ,className:{
            add:function(elem,classNames){
                jQuery.each((classNames||"").split(/\s+/),function(i,className){
                    if(elem.nodeType==1&&!jQuery.className.has(elem.className,className))elem.className+=(elem.className?" ":"")+className
                }
                )
            }
            ,remove:function(elem,classNames){
                if(elem.nodeType==1)elem.className=classNames!=undefined?jQuery.grep(elem.className.split(/\s+/),function(className){
                    return!jQuery.className.has(classNames,className)
                }
                ).join(" "):""
            }
            ,has:function(elem,className){
                return jQuery.inArray(className,(elem.className||elem).toString().split(/\s+/))&gt;
                -1
            }

        }
        ,swap:function(elem,options,callback){
            var old={

            }
            ;for(var name in options){
                old[name]=elem.style[name];
                elem.style[name]=options[name]
            }
            callback.call(elem);for(var name in options)elem.style[name]=old[name]
        }
        ,css:function(elem,name,force){
            if(name=="width"||name=="height"){
                var val,props={
                    position:"absolute",visibility:"hidden",display:"block"
                }
                ,which=name=="width"?["Left","Right"]:["Top","Bottom"];/************************************************************\
                *
                \************************************************************/
                function getWH(){
                    val=name=="width"?elem.offsetWidth:elem.offsetHeight;var padding=0,border=0;jQuery.each(which,function(){
                        padding+=parseFloat(jQuery.curCSS(elem,"padding"+this,true))||0;border+=parseFloat(jQuery.curCSS(elem,"border"+this+"Width",true))||0
                    }
                    );
                    val-=Math.round(padding+border)
                }
                if(jQuery(elem).is(":visible"))getWH();else jQuery.swap(elem,props,getWH);return Math.max(0,val)
            }
            return jQuery.curCSS(elem,name,force)
        }
        ,curCSS:function(elem,name,force){
            var ret,style=elem.style;
            /************************************************************\
            *
            \************************************************************/
            function color(elem){
                if(!jQuery.browser.safari)return false;var ret=defaultView.getComputedStyle(elem,null);return!ret||ret.getPropertyValue("color")==""
            }
            if(name=="opacity"&&jQuery.browser.msie){
                ret=jQuery.attr(style,"opacity");return ret==""?"1":ret
            }
            if(jQuery.browser.opera&&name=="display"){
                var save=style.outline;style.outline="0 solid black";style.outline=save
            }
            if(name.match(/float/i))name=styleFloat;if(!force&&style&&style[name])ret=style[name];else if(defaultView.getComputedStyle){
                if(name.match(/float/i))name="float";name=name.replace(/([A-Z])/g,"-$1").toLowerCase();var computedStyle=defaultView.getComputedStyle(elem,null);if(computedStyle&&!color(elem))ret=computedStyle.getPropertyValue(name);else{
                    var swap=[],stack=[],a=elem,i=0;for(;a&&color(a);a=a.parentNode)stack.unshift(a);for(;i&lt;stack.length;i++)if(color(stack[i])){
                        swap[i]=stack[i].style.display;stack[i].style.display="block"
                    }
                    ret=name=="display"&&swap[stack.length-1]!=null?"none":(computedStyle&&computedStyle.getPropertyValue(name))||"";for(i=0;i&lt;swap.length;i++)if(swap[i]!=null)stack[i].style.display=swap[i]
                }
                if(name=="opacity"&&ret=="")ret="1"
            }
            else if(elem.currentStyle){
                var camelCase=name.replace(/\-(\w)/g,function(all,letter){
                    return letter.toUpperCase()
                }
                );
                ret=elem.currentStyle[name]||elem.currentStyle[camelCase];
                if(!/^\d+(px)?$/i.test(ret)&&/^\d/.test(ret)){
                    var left=style.left,rsLeft=elem.runtimeStyle.left;elem.runtimeStyle.left=elem.currentStyle.left;style.left=ret||0;ret=style.pixelLeft+"px";style.left=left;elem.runtimeStyle.left=rsLeft
                }

            }
            return ret
        }
        ,clean:function(elems,context){
            var ret=[];
            context=context||document;
            if(typeof context.createElement=='undefined')context=context.ownerDocument||context[0]&&context[0].ownerDocument||document;
            jQuery.each(elems,function(i,elem){
                if(!elem)return;if(elem.constructor==Number)elem+='';if(typeof elem=="string"){
                    elem=elem.replace(/(&lt;
                    (\w+)[^&gt;
                    ]*?)\/&gt;
                    /g,function(all,front,tag){
                        return tag.match(/^(abbr|br|col|img|input|link|meta|param|hr|area|embed)$/i)?all:front+"&gt;&lt;/"+tag+"&gt;"
                    }
                    );var tags=jQuery.trim(elem).toLowerCase(),div=context.createElement("div");var wrap=!tags.indexOf("&lt;opt")&&[1,"&lt;select multiple='multiple'&gt;","&lt;/select&gt;"]||!tags.indexOf("&lt;leg")&&[1,"&lt;fieldset&gt;","&lt;/fieldset&gt;"]||tags.match(/^&lt;(thead|tbody|tfoot|colg|cap)/)&&[1,"&lt;table&gt;","&lt;/table&gt;"]||!tags.indexOf("&lt;tr")&&[2,"&lt;table&gt;&lt;tbody&gt;","&lt;/tbody&gt;&lt;/table&gt;"]||(!tags.indexOf("&lt;td")||!tags.indexOf("&lt;th"))&&[3,"&lt;table&gt;&lt;tbody&gt;&lt;tr&gt;","&lt;/tr&gt;&lt;/tbody&gt;&lt;/table&gt;"]||!tags.indexOf("&lt;col")&&[2,"&lt;table&gt;&lt;tbody&gt;&lt;/tbody&gt;&lt;colgroup&gt;","&lt;/colgroup&gt;&lt;/table&gt;"]||jQuery.browser.msie&&[1,"div<div>","</div>"]||[0,"",""];div.innerHTML=wrap[1]+elem+wrap[2];while(wrap[0]--)div=div.lastChild;if(jQuery.browser.msie){
                        var tbody=!tags.indexOf("&lt;table")&&tags.indexOf("&lt;tbody")&lt;0?div.firstChild&&div.firstChild.childNodes:wrap[1]=="&lt;table&gt;"&&tags.indexOf("&lt;tbody")&lt;0?div.childNodes:[];for(var j=tbody.length-1;j&gt;=0;--j)if(jQuery.nodeName(tbody[j],"tbody")&&!tbody[j].childNodes.length)tbody[j].parentNode.removeChild(tbody[j]);if(/^\s/.test(elem))div.insertBefore(context.createTextNode(elem.match(/^\s*/)[0]),div.firstChild)
                    }
                    elem=jQuery.makeArray(div.childNodes)
                }
                if(elem.length===0&&(!jQuery.nodeName(elem,"form")&&!jQuery.nodeName(elem,"select")))return;if(elem[0]==undefined||jQuery.nodeName(elem,"form")||elem.options)ret.push(elem);else ret=jQuery.merge(ret,elem)
            }
            );
            return ret
        }
        ,attr:function(elem,name,value){
            if(!elem||elem.nodeType==3||elem.nodeType==8)return undefined;
            var notxml=!jQuery.isXMLDoc(elem),set=value!==undefined,msie=jQuery.browser.msie;
            name=notxml&&jQuery.props[name]||name;
            if(elem.tagName){
                var special=/href|src|style/.test(name);if(name=="selected"&&jQuery.browser.safari)elem.parentNode.selectedIndex;if(name in elem&&notxml&&!special){
                    if(set){
                        if(name=="type"&&jQuery.nodeName(elem,"input")&&elem.parentNode)throw"type property can't be changed";elem[name]=value
                    }
                    if(jQuery.nodeName(elem,"form")&&elem.getAttributeNode(name))return elem.getAttributeNode(name).nodeValue;return elem[name]
                }
                if(msie&&notxml&&name=="style")return jQuery.attr(elem.style,"cssText",value);if(set)elem.setAttribute(name,""+value);var attr=msie&&notxml&&special?elem.getAttribute(name,2):elem.getAttribute(name);return attr===null?undefined:attr
            }
            if(msie&&name=="opacity"){
                if(set){
                    elem.zoom=1;elem.filter=(elem.filter||"").replace(/alpha\([^)]*\)/,"")+(parseInt(value)+''=="NaN"?"":"alpha(opacity="+value*100+")")
                }
                return elem.filter&&elem.filter.indexOf("opacity=")&gt;=0?(parseFloat(elem.filter.match(/opacity=([^)]*)/)[1])/100)+'':""
            }
            name=name.replace(/-([a-z])/ig,function(all,letter){
                return letter.toUpperCase()
            }
            );
            if(set)elem[name]=value;
            return elem[name]
        }
        ,trim:function(text){
            return(text||"").replace(/^\s+|\s+$/g,"")
        }
        ,makeArray:function(array){
            var ret=[];
            if(array!=null){
                var i=array.length;
                if(i==null||array.split||array.setInterval||array.call)ret[0]=array;
                else while(i)ret[--i]=array[i]
            }
            return ret
        }
        ,inArray:function(elem,array){
            for(var i=0,length=array.length;i&lt;length;i++)if(array[i]===elem)return i;return-1
        }
        ,merge:function(first,second){
            var i=0,elem,pos=first.length;
            if(jQuery.browser.msie){
                while(elem=second[i++])if(elem.nodeType!=8)first[pos++]=elem
            }
            else while(elem=second[i++])first[pos++]=elem;
            return first
        }
        ,unique:function(array){
            var ret=[],done={

            }
            ;
            try{
                for(var i=0,length=array.length;i&lt;length;i++){
                    var id=jQuery.data(array[i]);
                    if(!done[id]){
                        done[id]=true;
                        ret.push(array[i])
                    }

                }

            }
            catch(e){
                ret=array
            }
            return ret
        }
        ,grep:function(elems,callback,inv){
            var ret=[];for(var i=0,length=elems.length;i&lt;length;i++)if(!inv!=!callback(elems[i],i))ret.push(elems[i]);return ret
        }
        ,map:function(elems,callback){
            var ret=[];for(var i=0,length=elems.length;i&lt;length;i++){
                var value=callback(elems[i],i);
                if(value!=null)ret[ret.length]=value
            }
            return ret.concat.apply([],ret)
        }

    }
    );
    var userAgent=navigator.userAgent.toLowerCase();
    jQuery.browser={
        version:(userAgent.match(/.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/)||[])[1],safari:/webkit/.test(userAgent),opera:/opera/.test(userAgent),msie:/msie/.test(userAgent)&&!/opera/.test(userAgent),mozilla:/mozilla/.test(userAgent)&&!/(compatible|webkit)/.test(userAgent)
    }
    ;var styleFloat=jQuery.browser.msie?"styleFloat":"cssFloat";jQuery.extend({
        boxModel:!jQuery.browser.msie||document.compatMode=="CSS1Compat",props:{
            "for":"htmlFor","class":"className","float":styleFloat,cssFloat:styleFloat,styleFloat:styleFloat,readonly:"readOnly",maxlength:"maxLength",cellspacing:"cellSpacing"
        }

    }
    );
    jQuery.each({
        parent:function(elem){
            return elem.parentNode
        }
        ,parents:function(elem){
            return jQuery.dir(elem,"parentNode")
        }
        ,next:function(elem){
            return jQuery.nth(elem,2,"nextSibling")
        }
        ,prev:function(elem){
            return jQuery.nth(elem,2,"previousSibling")
        }
        ,nextAll:function(elem){
            return jQuery.dir(elem,"nextSibling")
        }
        ,prevAll:function(elem){
            return jQuery.dir(elem,"previousSibling")
        }
        ,siblings:function(elem){
            return jQuery.sibling(elem.parentNode.firstChild,elem)
        }
        ,children:function(elem){
            return jQuery.sibling(elem.firstChild)
        }
        ,contents:function(elem){
            return jQuery.nodeName(elem,"iframe")?elem.contentDocument||elem.contentWindow.document:jQuery.makeArray(elem.childNodes)
        }

    }
    ,function(name,fn){
        jQuery.fn[name]=function(selector){
            var ret=jQuery.map(this,fn);if(selector&&typeof selector=="string")ret=jQuery.multiFilter(selector,ret);return this.pushStack(jQuery.unique(ret))
        }

    }
    );
    jQuery.each({
        appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"
    }
    ,function(name,original){
        jQuery.fn[name]=function(){
            var args=arguments;
            return this.each(function(){
                for(var i=0,length=args.length;i&lt;length;i++)jQuery(args[i])[original](this)
            }
            )
        }

    }
    );
    jQuery.each({
        removeAttr:function(name){
            jQuery.attr(this,name,"");if(this.nodeType==1)this.removeAttribute(name)
        }
        ,addClass:function(classNames){
            jQuery.className.add(this,classNames)
        }
        ,removeClass:function(classNames){
            jQuery.className.remove(this,classNames)
        }
        ,toggleClass:function(classNames){
            jQuery.className[jQuery.className.has(this,classNames)?"remove":"add"](this,classNames)
        }
        ,remove:function(selector){
            if(!selector||jQuery.filter(selector,[this]).r.length){
                jQuery("*",this).add(this).each(function(){
                    jQuery.event.remove(this);
                    jQuery.removeData(this)
                }
                );
                if(this.parentNode)this.parentNode.removeChild(this)
            }

        }
        ,empty:function(){
            jQuery("&gt;*",this).remove();while(this.firstChild)this.removeChild(this.firstChild)
        }

    }
    ,function(name,fn){
        jQuery.fn[name]=function(){
            return this.each(fn,arguments)
        }

    }
    );jQuery.each(["Height","Width"],function(i,name){
        var type=name.toLowerCase();
        jQuery.fn[type]=function(size){
            return this[0]==window?jQuery.browser.opera&&document.body["client"+name]||jQuery.browser.safari&&window["inner"+name]||document.compatMode=="CSS1Compat"&&document.documentElement["client"+name]||document.body["client"+name]:this[0]==document?Math.max(Math.max(document.body["scroll"+name],document.documentElement["scroll"+name]),Math.max(document.body["offset"+name],document.documentElement["offset"+name])):size==undefined?(this.length?jQuery.css(this[0],type):null):this.css(type,size.constructor==String?size:size+"px")
        }

    }
    );
    /************************************************************\
    *
    \************************************************************/
    function num(elem,prop){
        return elem[0]&&parseInt(jQuery.curCSS(elem[0],prop,true),10)||0
    }
    var chars=jQuery.browser.safari&&parseInt(jQuery.browser.version)&lt;417?"(?:[\\w*_-]|\\\\.)":"(?:[\\w\u0128-\uFFFF*_-]|\\\\.)",quickChild=new RegExp("^&gt;\\s*("+chars+"+)"),quickID=new RegExp("^("+chars+"+)(#)("+chars+"+)"),quickClass=new RegExp("^([#.]?)("+chars+"*)");jQuery.extend({
        expr:{
            "":function(a,i,m){
                return m[2]=="*"||jQuery.nodeName(a,m[2])
            }
            ,"#":function(a,i,m){
                return a.getAttribute("id")==m[2]
            }
            ,":":{
                lt:function(a,i,m){
                    return i&lt;
                    m[3]-0
                }
                ,gt:function(a,i,m){
                    return i&gt;
                    m[3]-0
                }
                ,nth:function(a,i,m){
                    return m[3]-0==i
                }
                ,eq:function(a,i,m){
                    return m[3]-0==i
                }
                ,first:function(a,i){
                    return i==0
                }
                ,last:function(a,i,m,r){
                    return i==r.length-1
                }
                ,even:function(a,i){
                    return i%2==0
                }
                ,odd:function(a,i){
                    return i%2
                }
                ,"first-child":function(a){
                    return a.parentNode.getElementsByTagName("*")[0]==a
                }
                ,"last-child":function(a){
                    return jQuery.nth(a.parentNode.lastChild,1,"previousSibling")==a
                }
                ,"only-child":function(a){
                    return!jQuery.nth(a.parentNode.lastChild,2,"previousSibling")
                }
                ,parent:function(a){
                    return a.firstChild
                }
                ,empty:function(a){
                    return!a.firstChild
                }
                ,contains:function(a,i,m){
                    return(a.textContent||a.innerText||jQuery(a).text()||"").indexOf(m[3])&gt;=0
                }
                ,visible:function(a){
                    return"hidden"!=a.type&&jQuery.css(a,"display")!="none"&&jQuery.css(a,"visibility")!="hidden"
                }
                ,hidden:function(a){
                    return"hidden"==a.type||jQuery.css(a,"display")=="none"||jQuery.css(a,"visibility")=="hidden"
                }
                ,enabled:function(a){
                    return!a.disabled
                }
                ,disabled:function(a){
                    return a.disabled
                }
                ,checked:function(a){
                    return a.checked
                }
                ,selected:function(a){
                    return a.selected||jQuery.attr(a,"selected")
                }
                ,text:function(a){
                    return"text"==a.type
                }
                ,radio:function(a){
                    return"radio"==a.type
                }
                ,checkbox:function(a){
                    return"checkbox"==a.type
                }
                ,file:function(a){
                    return"file"==a.type
                }
                ,password:function(a){
                    return"password"==a.type
                }
                ,submit:function(a){
                    return"submit"==a.type
                }
                ,image:function(a){
                    return"image"==a.type
                }
                ,reset:function(a){
                    return"reset"==a.type
                }
                ,button:function(a){
                    return"button"==a.type||jQuery.nodeName(a,"button")
                }
                ,input:function(a){
                    return/input|select|textarea|button/i.test(a.nodeName)
                }
                ,has:function(a,i,m){
                    return jQuery.find(m[3],a).length
                }
                ,header:function(a){
                    return/h\d/i.test(a.nodeName)
                }
                ,animated:function(a){
                    return jQuery.grep(jQuery.timers,function(fn){
                        return a==fn.elem
                    }
                    ).length
                }

            }

        }
        ,parse:[/^(\[) *@?([\w-]+) *([!*$^~=]*) *('?"?)(.*?)\4 *\]/,/^(:)([\w-]+)\("?'?(.*?(\(.*?\))?[^(]*?)"?'?\)/,new RegExp("^([:.#]*)("+chars+"+)")],multiFilter:function(expr,elems,not){
            var old,cur=[];
            while(expr&&expr!=old){
                old=expr;var f=jQuery.filter(expr,elems,not);expr=f.t.replace(/^\s*,\s*/,"");cur=not?elems=f.r:jQuery.merge(cur,f.r)
            }
            return cur
        }
        ,find:function(t,context){
            if(typeof t!="string")return[t];if(context&&context.nodeType!=1&&context.nodeType!=9)return[];context=context||document;var ret=[context],done=[],last,nodeName;while(t&&last!=t){
                var r=[];
                last=t;
                t=jQuery.trim(t);
                var foundToken=false,re=quickChild,m=re.exec(t);
                if(m){
                    nodeName=m[1].toUpperCase();for(var i=0;ret[i];i++)for(var c=ret[i].firstChild;c;c=c.nextSibling)if(c.nodeType==1&&(nodeName=="*"||c.nodeName.toUpperCase()==nodeName))r.push(c);ret=r;t=t.replace(re,"");if(t.indexOf(" ")==0)continue;foundToken=true
                }
                else{
                    re=/^([&gt;
                    +~])\s*(\w*)/i;
                    if((m=re.exec(t))!=null){
                        r=[];
                        var merge={

                        }
                        ;nodeName=m[2].toUpperCase();m=m[1];for(var j=0,rl=ret.length;j&lt;rl;j++){
                            var n=m=="~"||m=="+"?ret[j].nextSibling:ret[j].firstChild;for(;n;n=n.nextSibling)if(n.nodeType==1){
                                var id=jQuery.data(n);if(m=="~"&&merge[id])break;if(!nodeName||n.nodeName.toUpperCase()==nodeName){
                                    if(m=="~")merge[id]=true;r.push(n)
                                }
                                if(m=="+")break
                            }

                        }
                        ret=r;t=jQuery.trim(t.replace(re,""));foundToken=true
                    }

                }
                if(t&&!foundToken){
                    if(!t.indexOf(",")){
                        if(context==ret[0])ret.shift();done=jQuery.merge(done,ret);r=ret=[context];t=" "+t.substr(1,t.length)
                    }
                    else{
                        var re2=quickID;
                        var m=re2.exec(t);
                        if(m){
                            m=[0,m[2],m[3],m[1]]
                        }
                        else{
                            re2=quickClass;
                            m=re2.exec(t)
                        }
                        m[2]=m[2].replace(/\\/g,"");var elem=ret[ret.length-1];if(m[1]=="#"&&elem&&elem.getElementById&&!jQuery.isXMLDoc(elem)){
                            var oid=elem.getElementById(m[2]);if((jQuery.browser.msie||jQuery.browser.opera)&&oid&&typeof oid.id=="string"&&oid.id!=m[2])oid=jQuery('[@id="'+m[2]+'"]',elem)[0];ret=r=oid&&(!m[3]||jQuery.nodeName(oid,m[3]))?[oid]:[]
                        }
                        else{
                            for(var i=0;ret[i];i++){
                                var tag=m[1]=="#"&&m[3]?m[3]:m[1]!=""||m[0]==""?"*":m[2];if(tag=="*"&&ret[i].nodeName.toLowerCase()=="object")tag="param";r=jQuery.merge(r,ret[i].getElementsByTagName(tag))
                            }
                            if(m[1]==".")r=jQuery.classFilter(r,m[2]);if(m[1]=="#"){
                                var tmp=[];for(var i=0;r[i];i++)if(r[i].getAttribute("id")==m[2]){
                                    tmp=[r[i]];
                                    break
                                }
                                r=tmp
                            }
                            ret=r
                        }
                        t=t.replace(re2,"")
                    }

                }
                if(t){
                    var val=jQuery.filter(t,r);
                    ret=r=val.r;
                    t=jQuery.trim(val.t)
                }

            }
            if(t)ret=[];
            if(ret&&context==ret[0])ret.shift();
            done=jQuery.merge(done,ret);
            return done
        }
        ,classFilter:function(r,m,not){
            m=" "+m+" ";var tmp=[];for(var i=0;r[i];i++){
                var pass=(" "+r[i].className+" ").indexOf(m)&gt;=0;if(!not&&pass||not&&!pass)tmp.push(r[i])
            }
            return tmp
        }
        ,filter:function(t,r,not){
            var last;
            while(t&&t!=last){
                last=t;var p=jQuery.parse,m;for(var i=0;p[i];i++){
                    m=p[i].exec(t);
                    if(m){
                        t=t.substring(m[0].length);m[2]=m[2].replace(/\\/g,"");break
                    }

                }
                if(!m)break;if(m[1]==":"&&m[2]=="not")r=isSimple.test(m[3])?jQuery.filter(m[3],r,true).r:jQuery(r).not(m[3]);else if(m[1]==".")r=jQuery.classFilter(r,m[2],not);else if(m[1]=="["){
                    var tmp=[],type=m[3];for(var i=0,rl=r.length;i&lt;rl;i++){
                        var a=r[i],z=a[jQuery.props[m[2]]||m[2]];if(z==null||/href|src|selected/.test(m[2]))z=jQuery.attr(a,m[2])||'';if((type==""&&!!z||type=="="&&z==m[5]||type=="!="&&z!=m[5]||type=="^="&&z&&!z.indexOf(m[5])||type=="$="&&z.substr(z.length-m[5].length)==m[5]||(type=="*="||type=="~=")&&z.indexOf(m[5])&gt;=0)^not)tmp.push(a)
                    }
                    r=tmp
                }
                else if(m[1]==":"&&m[2]=="nth-child"){
                    var merge={

                    }
                    ,tmp=[],test=/(-?)(\d*)n((?:\+|-)?\d*)/.exec(m[3]=="even"&&"2n"||m[3]=="odd"&&"2n+1"||!/\D/.test(m[3])&&"0n+"+m[3]||m[3]),first=(test[1]+(test[2]||1))-0,last=test[3]-0;for(var i=0,rl=r.length;i&lt;rl;i++){
                        var node=r[i],parentNode=node.parentNode,id=jQuery.data(parentNode);
                        if(!merge[id]){
                            var c=1;for(var n=parentNode.firstChild;n;n=n.nextSibling)if(n.nodeType==1)n.nodeIndex=c++;merge[id]=true
                        }
                        var add=false;
                        if(first==0){
                            if(node.nodeIndex==last)add=true
                        }
                        else if((node.nodeIndex-last)%first==0&&(node.nodeIndex-last)/first&gt;
                        =0)add=true;
                        if(add^not)tmp.push(node)
                    }
                    r=tmp
                }
                else{
                    var fn=jQuery.expr[m[1]];if(typeof fn=="object")fn=fn[m[2]];if(typeof fn=="string")fn=eval("false||function(a,i){
                        return "+fn+";
                    }
                    ");r=jQuery.grep(r,function(elem,i){
                        return fn(elem,i,m,r)
                    }
                    ,not)
                }

            }
            return{
                r:r,t:t
            }

        }
        ,dir:function(elem,dir){
            var matched=[],cur=elem[dir];
            while(cur&&cur!=document){
                if(cur.nodeType==1)matched.push(cur);
                cur=cur[dir]
            }
            return matched
        }
        ,nth:function(cur,result,dir,elem){
            result=result||1;var num=0;for(;cur;cur=cur[dir])if(cur.nodeType==1&&++num==result)break;return cur
        }
        ,sibling:function(n,elem){
            var r=[];for(;n;n=n.nextSibling){
                if(n.nodeType==1&&n!=elem)r.push(n)
            }
            return r
        }

    }
    );
    jQuery.event={
        add:function(elem,types,handler,data){
            if(elem.nodeType==3||elem.nodeType==8)return;
            if(jQuery.browser.msie&&elem.setInterval)elem=window;
            if(!handler.guid)handler.guid=this.guid++;
            if(data!=undefined){
                var fn=handler;
                handler=this.proxy(fn,function(){
                    return fn.apply(this,arguments)
                }
                );
                handler.data=data
            }
            var events=jQuery.data(elem,"events")||jQuery.data(elem,"events",{

            }
            ),handle=jQuery.data(elem,"handle")||jQuery.data(elem,"handle",function(){
                if(typeof jQuery!="undefined"&&!jQuery.event.triggered)return jQuery.event.handle.apply(arguments.callee.elem,arguments)
            }
            );
            handle.elem=elem;
            jQuery.each(types.split(/\s+/),function(index,type){
                var parts=type.split(".");type=parts[0];handler.type=parts[1];var handlers=events[type];if(!handlers){
                    handlers=events[type]={

                    }
                    ;
                    if(!jQuery.event.special[type]||jQuery.event.special[type].setup.call(elem)===false){
                        if(elem.addEventListener)elem.addEventListener(type,handle,false);else if(elem.attachEvent)elem.attachEvent("on"+type,handle)
                    }

                }
                handlers[handler.guid]=handler;
                jQuery.event.global[type]=true
            }
            );
            elem=null
        }
        ,guid:1,global:{

        }
        ,remove:function(elem,types,handler){
            if(elem.nodeType==3||elem.nodeType==8)return;var events=jQuery.data(elem,"events"),ret,index;if(events){
                if(types==undefined||(typeof types=="string"&&types.charAt(0)=="."))for(var type in events)this.remove(elem,type+(types||""));else{
                    if(types.type){
                        handler=types.handler;
                        types=types.type
                    }
                    jQuery.each(types.split(/\s+/),function(index,type){
                        var parts=type.split(".");type=parts[0];if(events[type]){
                            if(handler)delete events[type][handler.guid];else for(handler in events[type])if(!parts[1]||events[type][handler].type==parts[1])delete events[type][handler];for(ret in events[type])break;if(!ret){
                                if(!jQuery.event.special[type]||jQuery.event.special[type].teardown.call(elem)===false){
                                    if(elem.removeEventListener)elem.removeEventListener(type,jQuery.data(elem,"handle"),false);else if(elem.detachEvent)elem.detachEvent("on"+type,jQuery.data(elem,"handle"))
                                }
                                ret=null;
                                delete events[type]
                            }

                        }

                    }
                    )
                }
                for(ret in events)break;if(!ret){
                    var handle=jQuery.data(elem,"handle");if(handle)handle.elem=null;jQuery.removeData(elem,"events");jQuery.removeData(elem,"handle")
                }

            }

        }
        ,trigger:function(type,data,elem,donative,extra){
            data=jQuery.makeArray(data);if(type.indexOf("!")&gt;=0){
                type=type.slice(0,-1);
                var exclusive=true
            }
            if(!elem){
                if(this.global[type])jQuery("*").add([window,document]).trigger(type,data)
            }
            else{
                if(elem.nodeType==3||elem.nodeType==8)return undefined;
                var val,ret,fn=jQuery.isFunction(elem[type]||null),event=!data[0]||!data[0].preventDefault;
                if(event){
                    data.unshift({
                        type:type,target:elem,preventDefault:function(){

                        }
                        ,stopPropagation:function(){

                        }
                        ,timeStamp:now()
                    }
                    );
                    data[0][expando]=true
                }
                data[0].type=type;if(exclusive)data[0].exclusive=true;var handle=jQuery.data(elem,"handle");if(handle)val=handle.apply(elem,data);if((!fn||(jQuery.nodeName(elem,'a')&&type=="click"))&&elem["on"+type]&&elem["on"+type].apply(elem,data)===false)val=false;if(event)data.shift();if(extra&&jQuery.isFunction(extra)){
                    ret=extra.apply(elem,val==null?data:data.concat(val));
                    if(ret!==undefined)val=ret
                }
                if(fn&&donative!==false&&val!==false&&!(jQuery.nodeName(elem,'a')&&type=="click")){
                    this.triggered=true;
                    try{
                        elem[type]()
                    }
                    catch(e){

                    }

                }
                this.triggered=false
            }
            return val
        }
        ,handle:function(event){
            var val,ret,namespace,all,handlers;event=arguments[0]=jQuery.event.fix(event||window.event);namespace=event.type.split(".");event.type=namespace[0];namespace=namespace[1];all=!namespace&&!event.exclusive;handlers=(jQuery.data(this,"events")||{

            }
            )[event.type];for(var j in handlers){
                var handler=handlers[j];
                if(all||handler.type==namespace){
                    event.handler=handler;
                    event.data=handler.data;
                    ret=handler.apply(this,arguments);
                    if(val!==false)val=ret;
                    if(ret===false){
                        event.preventDefault();
                        event.stopPropagation()
                    }

                }

            }
            return val
        }
        ,fix:function(event){
            if(event[expando]==true)return event;
            var originalEvent=event;
            event={
                originalEvent:originalEvent
            }
            ;var props="altKey attrChange attrName bubbles button cancelable charCode clientX clientY ctrlKey currentTarget data detail eventPhase fromElement handler keyCode metaKey newValue originalTarget pageX pageY prevValue relatedNode relatedTarget screenX screenY shiftKey srcElement target timeStamp toElement type view wheelDelta which".split(" ");for(var i=props.length;i;i--)event[props[i]]=originalEvent[props[i]];event[expando]=true;event.preventDefault=function(){
                if(originalEvent.preventDefault)originalEvent.preventDefault();
                originalEvent.returnValue=false
            }
            ;
            event.stopPropagation=function(){
                if(originalEvent.stopPropagation)originalEvent.stopPropagation();
                originalEvent.cancelBubble=true
            }
            ;
            event.timeStamp=event.timeStamp||now();
            if(!event.target)event.target=event.srcElement||document;
            if(event.target.nodeType==3)event.target=event.target.parentNode;
            if(!event.relatedTarget&&event.fromElement)event.relatedTarget=event.fromElement==event.target?event.toElement:event.fromElement;
            if(event.pageX==null&&event.clientX!=null){
                var doc=document.documentElement,body=document.body;
                event.pageX=event.clientX+(doc&&doc.scrollLeft||body&&body.scrollLeft||0)-(doc.clientLeft||0);
                event.pageY=event.clientY+(doc&&doc.scrollTop||body&&body.scrollTop||0)-(doc.clientTop||0)
            }
            if(!event.which&&((event.charCode||event.charCode===0)?event.charCode:event.keyCode))event.which=event.charCode||event.keyCode;
            if(!event.metaKey&&event.ctrlKey)event.metaKey=event.ctrlKey;
            if(!event.which&&event.button)event.which=(event.button&1?1:(event.button&2?3:(event.button&4?2:0)));
            return event
        }
        ,proxy:function(fn,proxy){
            proxy.guid=fn.guid=fn.guid||proxy.guid||this.guid++;
            return proxy
        }
        ,special:{
            ready:{
                setup:function(){
                    bindReady();
                    return
                }
                ,teardown:function(){
                    return
                }

            }
            ,mouseenter:{
                setup:function(){
                    if(jQuery.browser.msie)return false;jQuery(this).bind("mouseover",jQuery.event.special.mouseenter.handler);return true
                }
                ,teardown:function(){
                    if(jQuery.browser.msie)return false;jQuery(this).unbind("mouseover",jQuery.event.special.mouseenter.handler);return true
                }
                ,handler:function(event){
                    if(withinElement(event,this))return true;event.type="mouseenter";return jQuery.event.handle.apply(this,arguments)
                }

            }
            ,mouseleave:{
                setup:function(){
                    if(jQuery.browser.msie)return false;jQuery(this).bind("mouseout",jQuery.event.special.mouseleave.handler);return true
                }
                ,teardown:function(){
                    if(jQuery.browser.msie)return false;jQuery(this).unbind("mouseout",jQuery.event.special.mouseleave.handler);return true
                }
                ,handler:function(event){
                    if(withinElement(event,this))return true;event.type="mouseleave";return jQuery.event.handle.apply(this,arguments)
                }

            }

        }

    }
    ;
    jQuery.fn.extend({
        bind:function(type,data,fn){
            return type=="unload"?this.one(type,data,fn):this.each(function(){
                jQuery.event.add(this,type,fn||data,fn&&data)
            }
            )
        }
        ,one:function(type,data,fn){
            var one=jQuery.event.proxy(fn||data,function(event){
                jQuery(this).unbind(event,one);
                return(fn||data).apply(this,arguments)
            }
            );
            return this.each(function(){
                jQuery.event.add(this,type,one,fn&&data)
            }
            )
        }
        ,unbind:function(type,fn){
            return this.each(function(){
                jQuery.event.remove(this,type,fn)
            }
            )
        }
        ,trigger:function(type,data,fn){
            return this.each(function(){
                jQuery.event.trigger(type,data,this,true,fn)
            }
            )
        }
        ,triggerHandler:function(type,data,fn){
            return this[0]&&jQuery.event.trigger(type,data,this[0],false,fn)
        }
        ,toggle:function(fn){
            var args=arguments,i=1;
            while(i&lt;
            args.length)jQuery.event.proxy(fn,args[i++]);
            return this.click(jQuery.event.proxy(fn,function(event){
                this.lastToggle=(this.lastToggle||0)%i;
                event.preventDefault();
                return args[this.lastToggle++].apply(this,arguments)||false
            }
            ))
        }
        ,hover:function(fnOver,fnOut){
            return this.bind('mouseenter',fnOver).bind('mouseleave',fnOut)
        }
        ,ready:function(fn){
            bindReady();
            if(jQuery.isReady)fn.call(document,jQuery);
            else jQuery.readyList.push(function(){
                return fn.call(this,jQuery)
            }
            );
            return this
        }

    }
    );
    jQuery.extend({
        isReady:false,readyList:[],ready:function(){
            if(!jQuery.isReady){
                jQuery.isReady=true;
                if(jQuery.readyList){
                    jQuery.each(jQuery.readyList,function(){
                        this.call(document)
                    }
                    );
                    jQuery.readyList=null
                }
                jQuery(document).triggerHandler("ready")
            }

        }

    }
    );
    var readyBound=false;
    /************************************************************\
    *
    \************************************************************/
    function bindReady(){
        if(readyBound)return;readyBound=true;if(document.addEventListener&&!jQuery.browser.opera)document.addEventListener("DOMContentLoaded",jQuery.ready,false);if(jQuery.browser.msie&&window==top)(function(){
            if(jQuery.isReady)return;
            try{
                document.documentElement.doScroll("left")
            }
            catch(error){
                setTimeout(arguments.callee,0);
                return
            }
            jQuery.ready()
        }
        )();if(jQuery.browser.opera)document.addEventListener("DOMContentLoaded",function(){
            if(jQuery.isReady)return;for(var i=0;i&lt;document.styleSheets.length;i++)if(document.styleSheets[i].disabled){
                setTimeout(arguments.callee,0);
                return
            }
            jQuery.ready()
        }
        ,false);
        if(jQuery.browser.safari){
            var numStyles;
            (function(){
                if(jQuery.isReady)return;if(document.readyState!="loaded"&&document.readyState!="complete"){
                    setTimeout(arguments.callee,0);
                    return
                }
                if(numStyles===undefined)numStyles=jQuery("style, link[rel=stylesheet]").length;if(document.styleSheets.length!=numStyles){
                    setTimeout(arguments.callee,0);
                    return
                }
                jQuery.ready()
            }
            )()
        }
        jQuery.event.add(window,"load",jQuery.ready)
    }
    jQuery.each(("blur,focus,load,resize,scroll,unload,click,dblclick,"+"mousedown,mouseup,mousemove,mouseover,mouseout,change,select,"+"submit,keydown,keypress,keyup,error").split(","),function(i,name){
        jQuery.fn[name]=function(fn){
            return fn?this.bind(name,fn):this.trigger(name)
        }

    }
    );
    var withinElement=function(event,elem){
        var parent=event.relatedTarget;
        while(parent&&parent!=elem)try{
            parent=parent.parentNode
        }
        catch(error){
            parent=elem
        }
        return parent==elem
    }
    ;jQuery(window).bind("unload",function(){
        jQuery("*").add(document).unbind()
    }
    );
    jQuery.fn.extend({
        _load:jQuery.fn.load,load:function(url,params,callback){
            if(typeof url!='string')return this._load(url);var off=url.indexOf(" ");if(off&gt;=0){
                var selector=url.slice(off,url.length);
                url=url.slice(0,off)
            }
            callback=callback||function(){

            }
            ;var type="GET";if(params)if(jQuery.isFunction(params)){
                callback=params;
                params=null
            }
            else{
                params=jQuery.param(params);type="POST"
            }
            var self=this;
            jQuery.ajax({
                url:url,type:type,dataType:"html",data:params,complete:function(res,status){
                    if(status=="success"||status=="notmodified")self.html(selector?jQuery("&lt;div/&gt;").append(res.responseText.replace(/&lt;script(.|\s)*?\/script&gt;/g,"")).find(selector):res.responseText);self.each(callback,[res.responseText,status,res])
                }

            }
            );
            return this
        }
        ,serialize:function(){
            return jQuery.param(this.serializeArray())
        }
        ,serializeArray:function(){
            return this.map(function(){
                return jQuery.nodeName(this,"form")?jQuery.makeArray(this.elements):this
            }
            ).filter(function(){
                return this.name&&!this.disabled&&(this.checked||/select|textarea/i.test(this.nodeName)||/text|hidden|password/i.test(this.type))
            }
            ).map(function(i,elem){
                var val=jQuery(this).val();
                return val==null?null:val.constructor==Array?jQuery.map(val,function(val,i){
                    return{
                        name:elem.name,value:val
                    }

                }
                ):{
                    name:elem.name,value:val
                }

            }
            ).get()
        }

    }
    );jQuery.each("ajaxStart,ajaxStop,ajaxComplete,ajaxError,ajaxSuccess,ajaxSend".split(","),function(i,o){
        jQuery.fn[o]=function(f){
            return this.bind(o,f)
        }

    }
    );
    var jsc=now();
    jQuery.extend({
        get:function(url,data,callback,type){
            if(jQuery.isFunction(data)){
                callback=data;
                data=null
            }
            return jQuery.ajax({
                type:"GET",url:url,data:data,success:callback,dataType:type
            }
            )
        }
        ,getScript:function(url,callback){
            return jQuery.get(url,null,callback,"script")
        }
        ,getJSON:function(url,data,callback){
            return jQuery.get(url,data,callback,"json")
        }
        ,post:function(url,data,callback,type){
            if(jQuery.isFunction(data)){
                callback=data;
                data={

                }

            }
            return jQuery.ajax({
                type:"POST",url:url,data:data,success:callback,dataType:type
            }
            )
        }
        ,ajaxSetup:function(settings){
            jQuery.extend(jQuery.ajaxSettings,settings)
        }
        ,ajaxSettings:{
            url:location.href,global:true,type:"GET",timeout:0,contentType:"application/x-www-form-urlencoded",processData:true,async:true,data:null,username:null,password:null,accepts:{
                xml:"application/xml, text/xml",html:"text/html",script:"text/javascript, application/javascript",json:"application/json, text/javascript",text:"text/plain",_default:"*/*"
            }

        }
        ,lastModified:{

        }
        ,ajax:function(s){
            s=jQuery.extend(true,s,jQuery.extend(true,{

            }
            ,jQuery.ajaxSettings,s));var jsonp,jsre=/=\?(&|$)/g,status,data,type=s.type.toUpperCase();if(s.data&&s.processData&&typeof s.data!="string")s.data=jQuery.param(s.data);if(s.dataType=="jsonp"){
                if(type=="GET"){
                    if(!s.url.match(jsre))s.url+=(s.url.match(/\?/)?"&":"?")+(s.jsonp||"callback")+"=?"
                }
                else if(!s.data||!s.data.match(jsre))s.data=(s.data?s.data+"&":"")+(s.jsonp||"callback")+"=?";s.dataType="json"
            }
            if(s.dataType=="json"&&(s.data&&s.data.match(jsre)||s.url.match(jsre))){
                jsonp="jsonp"+jsc++;if(s.data)s.data=(s.data+"").replace(jsre,"="+jsonp+"$1");s.url=s.url.replace(jsre,"="+jsonp+"$1");s.dataType="script";window[jsonp]=function(tmp){
                    data=tmp;
                    success();
                    complete();
                    window[jsonp]=undefined;
                    try{
                        delete window[jsonp]
                    }
                    catch(e){

                    }
                    if(head)head.removeChild(script)
                }

            }
            if(s.dataType=="script"&&s.cache==null)s.cache=false;if(s.cache===false&&type=="GET"){
                var ts=now();var ret=s.url.replace(/(\?|&)_=.*?(&|$)/,"$1_="+ts+"$2");s.url=ret+((ret==s.url)?(s.url.match(/\?/)?"&":"?")+"_="+ts:"")
            }
            if(s.data&&type=="GET"){
                s.url+=(s.url.match(/\?/)?"&":"?")+s.data;s.data=null
            }
            if(s.global&&!jQuery.active++)jQuery.event.trigger("ajaxStart");var remote=/^(?:\w+:)?\/\/([^\/?#]+)/;if(s.dataType=="script"&&type=="GET"&&remote.test(s.url)&&remote.exec(s.url)[1]!=location.host){
                var head=document.getElementsByTagName("head")[0];var script=document.createElement("script");script.src=s.url;if(s.scriptCharset)script.charset=s.scriptCharset;if(!jsonp){
                    var done=false;
                    script.onload=script.onreadystatechange=function(){
                        if(!done&&(!this.readyState||this.readyState=="loaded"||this.readyState=="complete")){
                            done=true;
                            success();
                            complete();
                            head.removeChild(script)
                        }

                    }

                }
                head.appendChild(script);
                return undefined
            }
            var requestDone=false;var xhr=window.ActiveXObject?new ActiveXObject("Microsoft.XMLHTTP"):new XMLHttpRequest();if(s.username)xhr.open(type,s.url,s.async,s.username,s.password);else xhr.open(type,s.url,s.async);try{
                if(s.data)xhr.setRequestHeader("Content-Type",s.contentType);if(s.ifModified)xhr.setRequestHeader("If-Modified-Since",jQuery.lastModified[s.url]||"Thu, 01 Jan 1970 00:00:00 GMT");xhr.setRequestHeader("X-Requested-With","XMLHttpRequest");xhr.setRequestHeader("Accept",s.dataType&&s.accepts[s.dataType]?s.accepts[s.dataType]+", */*":s.accepts._default)
            }
            catch(e){

            }
            if(s.beforeSend&&s.beforeSend(xhr,s)===false){
                s.global&&jQuery.active--;
                xhr.abort();
                return false
            }
            if(s.global)jQuery.event.trigger("ajaxSend",[xhr,s]);var onreadystatechange=function(isTimeout){
                if(!requestDone&&xhr&&(xhr.readyState==4||isTimeout=="timeout")){
                    requestDone=true;
                    if(ival){
                        clearInterval(ival);
                        ival=null
                    }
                    status=isTimeout=="timeout"&&"timeout"||!jQuery.httpSuccess(xhr)&&"error"||s.ifModified&&jQuery.httpNotModified(xhr,s.url)&&"notmodified"||"success";if(status=="success"){
                        try{
                            data=jQuery.httpData(xhr,s.dataType,s.dataFilter)
                        }
                        catch(e){
                            status="parsererror"
                        }

                    }
                    if(status=="success"){
                        var modRes;
                        try{
                            modRes=xhr.getResponseHeader("Last-Modified")
                        }
                        catch(e){

                        }
                        if(s.ifModified&&modRes)jQuery.lastModified[s.url]=modRes;
                        if(!jsonp)success()
                    }
                    else jQuery.handleError(s,xhr,status);
                    complete();
                    if(s.async)xhr=null
                }

            }
            ;
            if(s.async){
                var ival=setInterval(onreadystatechange,13);
                if(s.timeout&gt;
                0)setTimeout(function(){
                    if(xhr){
                        xhr.abort();if(!requestDone)onreadystatechange("timeout")
                    }

                }
                ,s.timeout)
            }
            try{
                xhr.send(s.data)
            }
            catch(e){
                jQuery.handleError(s,xhr,null,e)
            }
            if(!s.async)onreadystatechange();
            /************************************************************\
            *
            \************************************************************/
            function success(){
                if(s.success)s.success(data,status);if(s.global)jQuery.event.trigger("ajaxSuccess",[xhr,s])
            }
            /************************************************************\
            *
            \************************************************************/
            function complete(){
                if(s.complete)s.complete(xhr,status);if(s.global)jQuery.event.trigger("ajaxComplete",[xhr,s]);if(s.global&&!--jQuery.active)jQuery.event.trigger("ajaxStop")
            }
            return xhr
        }
        ,handleError:function(s,xhr,status,e){
            if(s.error)s.error(xhr,status,e);if(s.global)jQuery.event.trigger("ajaxError",[xhr,s,e])
        }
        ,active:0,httpSuccess:function(xhr){
            try{
                return!xhr.status&&location.protocol=="file:"||(xhr.status&gt;=200&&xhr.status&lt;300)||xhr.status==304||xhr.status==1223||jQuery.browser.safari&&xhr.status==undefined
            }
            catch(e){

            }
            return false
        }
        ,httpNotModified:function(xhr,url){
            try{
                var xhrRes=xhr.getResponseHeader("Last-Modified");return xhr.status==304||xhrRes==jQuery.lastModified[url]||jQuery.browser.safari&&xhr.status==undefined
            }
            catch(e){

            }
            return false
        }
        ,httpData:function(xhr,type,filter){
            var ct=xhr.getResponseHeader("content-type"),xml=type=="xml"||!type&&ct&&ct.indexOf("xml")&gt;=0,data=xml?xhr.responseXML:xhr.responseText;if(xml&&data.documentElement.tagName=="parsererror")throw"parsererror";if(filter)data=filter(data,type);if(type=="script")jQuery.globalEval(data);if(type=="json")data=eval("("+data+")");return data
        }
        ,param:function(a){
            var s=[];
            if(a.constructor==Array||a.jquery)jQuery.each(a,function(){
                s.push(encodeURIComponent(this.name)+"="+encodeURIComponent(this.value))
            }
            );else for(var j in a)if(a[j]&&a[j].constructor==Array)jQuery.each(a[j],function(){
                s.push(encodeURIComponent(j)+"="+encodeURIComponent(this))
            }
            );else s.push(encodeURIComponent(j)+"="+encodeURIComponent(jQuery.isFunction(a[j])?a[j]():a[j]));return s.join("&").replace(/%20/g,"+")
        }

    }
    );
    jQuery.fn.extend({
        show:function(speed,callback){
            return speed?this.animate({
                height:"show",width:"show",opacity:"show"
            }
            ,speed,callback):this.filter(":hidden").each(function(){
                this.style.display=this.oldblock||"";if(jQuery.css(this,"display")=="none"){
                    var elem=jQuery("&lt;"+this.tagName+" /&gt;").appendTo("body");this.style.display=elem.css("display");if(this.style.display=="none")this.style.display="block";elem.remove()
                }

            }
            ).end()
        }
        ,hide:function(speed,callback){
            return speed?this.animate({
                height:"hide",width:"hide",opacity:"hide"
            }
            ,speed,callback):this.filter(":visible").each(function(){
                this.oldblock=this.oldblock||jQuery.css(this,"display");this.style.display="none"
            }
            ).end()
        }
        ,_toggle:jQuery.fn.toggle,toggle:function(fn,fn2){
            return jQuery.isFunction(fn)&&jQuery.isFunction(fn2)?this._toggle.apply(this,arguments):fn?this.animate({
                height:"toggle",width:"toggle",opacity:"toggle"
            }
            ,fn,fn2):this.each(function(){
                jQuery(this)[jQuery(this).is(":hidden")?"show":"hide"]()
            }
            )
        }
        ,slideDown:function(speed,callback){
            return this.animate({
                height:"show"
            }
            ,speed,callback)
        }
        ,slideUp:function(speed,callback){
            return this.animate({
                height:"hide"
            }
            ,speed,callback)
        }
        ,slideToggle:function(speed,callback){
            return this.animate({
                height:"toggle"
            }
            ,speed,callback)
        }
        ,fadeIn:function(speed,callback){
            return this.animate({
                opacity:"show"
            }
            ,speed,callback)
        }
        ,fadeOut:function(speed,callback){
            return this.animate({
                opacity:"hide"
            }
            ,speed,callback)
        }
        ,fadeTo:function(speed,to,callback){
            return this.animate({
                opacity:to
            }
            ,speed,callback)
        }
        ,animate:function(prop,speed,easing,callback){
            var optall=jQuery.speed(speed,easing,callback);return this[optall.queue===false?"each":"queue"](function(){
                if(this.nodeType!=1)return false;
                var opt=jQuery.extend({

                }
                ,optall),p,hidden=jQuery(this).is(":hidden"),self=this;for(p in prop){
                    if(prop[p]=="hide"&&hidden||prop[p]=="show"&&!hidden)return opt.complete.call(this);if(p=="height"||p=="width"){
                        opt.display=jQuery.css(this,"display");opt.overflow=this.style.overflow
                    }

                }
                if(opt.overflow!=null)this.style.overflow="hidden";opt.curAnim=jQuery.extend({

                }
                ,prop);
                jQuery.each(prop,function(name,val){
                    var e=new jQuery.fx(self,opt,name);if(/toggle|show|hide/.test(val))e[val=="toggle"?hidden?"show":"hide":val](prop);else{
                        var parts=val.toString().match(/^([+-]=)?([\d+-.]+)(.*)$/),start=e.cur(true)||0;
                        if(parts){
                            var end=parseFloat(parts[2]),unit=parts[3]||"px";if(unit!="px"){
                                self.style[name]=(end||1)+unit;
                                start=((end||1)/e.cur(true))*start;
                                self.style[name]=start+unit
                            }
                            if(parts[1])end=((parts[1]=="-="?-1:1)*end)+start;e.custom(start,end,unit)
                        }
                        else e.custom(start,val,"")
                    }

                }
                );
                return true
            }
            )
        }
        ,queue:function(type,fn){
            if(jQuery.isFunction(type)||(type&&type.constructor==Array)){
                fn=type;type="fx"
            }
            if(!type||(typeof type=="string"&&!fn))return queue(this[0],type);return this.each(function(){
                if(fn.constructor==Array)queue(this,type,fn);
                else{
                    queue(this,type).push(fn);
                    if(queue(this,type).length==1)fn.call(this)
                }

            }
            )
        }
        ,stop:function(clearQueue,gotoEnd){
            var timers=jQuery.timers;
            if(clearQueue)this.queue([]);
            this.each(function(){
                for(var i=timers.length-1;i&gt;=0;i--)if(timers[i].elem==this){
                    if(gotoEnd)timers[i](true);
                    timers.splice(i,1)
                }

            }
            );
            if(!gotoEnd)this.dequeue();
            return this
        }

    }
    );
    var queue=function(elem,type,array){
        if(elem){
            type=type||"fx";var q=jQuery.data(elem,type+"queue");if(!q||array)q=jQuery.data(elem,type+"queue",jQuery.makeArray(array))
        }
        return q
    }
    ;
    jQuery.fn.dequeue=function(type){
        type=type||"fx";return this.each(function(){
            var q=queue(this,type);
            q.shift();
            if(q.length)q[0].call(this)
        }
        )
    }
    ;
    jQuery.extend({
        speed:function(speed,easing,fn){
            var opt=speed&&speed.constructor==Object?speed:{
                complete:fn||!fn&&easing||jQuery.isFunction(speed)&&speed,duration:speed,easing:fn&&easing||easing&&easing.constructor!=Function&&easing
            }
            ;
            opt.duration=(opt.duration&&opt.duration.constructor==Number?opt.duration:jQuery.fx.speeds[opt.duration])||jQuery.fx.speeds.def;
            opt.old=opt.complete;
            opt.complete=function(){
                if(opt.queue!==false)jQuery(this).dequeue();
                if(jQuery.isFunction(opt.old))opt.old.call(this)
            }
            ;
            return opt
        }
        ,easing:{
            linear:function(p,n,firstNum,diff){
                return firstNum+diff*p
            }
            ,swing:function(p,n,firstNum,diff){
                return((-Math.cos(p*Math.PI)/2)+0.5)*diff+firstNum
            }

        }
        ,timers:[],timerId:null,fx:function(elem,options,prop){
            this.options=options;
            this.elem=elem;
            this.prop=prop;
            if(!options.orig)options.orig={

            }

        }

    }
    );
    jQuery.fx.prototype={
        update:function(){
            if(this.options.step)this.options.step.call(this.elem,this.now,this);(jQuery.fx.step[this.prop]||jQuery.fx.step._default)(this);if(this.prop=="height"||this.prop=="width")this.elem.style.display="block"
        }
        ,cur:function(force){
            if(this.elem[this.prop]!=null&&this.elem.style[this.prop]==null)return this.elem[this.prop];var r=parseFloat(jQuery.css(this.elem,this.prop,force));return r&&r&gt;-10000?r:parseFloat(jQuery.curCSS(this.elem,this.prop))||0
        }
        ,custom:function(from,to,unit){
            this.startTime=now();this.start=from;this.end=to;this.unit=unit||this.unit||"px";this.now=this.start;this.pos=this.state=0;this.update();var self=this;/************************************************************\
            *
            \************************************************************/
            function t(gotoEnd){
                return self.step(gotoEnd)
            }
            t.elem=this.elem;
            jQuery.timers.push(t);
            if(jQuery.timerId==null){
                jQuery.timerId=setInterval(function(){
                    var timers=jQuery.timers;for(var i=0;i&lt;timers.length;i++)if(!timers[i]())timers.splice(i--,1);if(!timers.length){
                        clearInterval(jQuery.timerId);
                        jQuery.timerId=null
                    }

                }
                ,13)
            }

        }
        ,show:function(){
            this.options.orig[this.prop]=jQuery.attr(this.elem.style,this.prop);this.options.show=true;this.custom(0,this.cur());if(this.prop=="width"||this.prop=="height")this.elem.style[this.prop]="1px";jQuery(this.elem).show()
        }
        ,hide:function(){
            this.options.orig[this.prop]=jQuery.attr(this.elem.style,this.prop);
            this.options.hide=true;
            this.custom(this.cur(),0)
        }
        ,step:function(gotoEnd){
            var t=now();
            if(gotoEnd||t&gt;
            this.options.duration+this.startTime){
                this.now=this.end;this.pos=this.state=1;this.update();this.options.curAnim[this.prop]=true;var done=true;for(var i in this.options.curAnim)if(this.options.curAnim[i]!==true)done=false;if(done){
                    if(this.options.display!=null){
                        this.elem.style.overflow=this.options.overflow;this.elem.style.display=this.options.display;if(jQuery.css(this.elem,"display")=="none")this.elem.style.display="block"
                    }
                    if(this.options.hide)this.elem.style.display="none";if(this.options.hide||this.options.show)for(var p in this.options.curAnim)jQuery.attr(this.elem.style,p,this.options.orig[p])
                }
                if(done)this.options.complete.call(this.elem);
                return false
            }
            else{
                var n=t-this.startTime;this.state=n/this.options.duration;this.pos=jQuery.easing[this.options.easing||(jQuery.easing.swing?"swing":"linear")](this.state,n,0,1,this.options.duration);this.now=this.start+((this.end-this.start)*this.pos);this.update()
            }
            return true
        }

    }
    ;
    jQuery.extend(jQuery.fx,{
        speeds:{
            slow:600,fast:200,def:400
        }
        ,step:{
            scrollLeft:function(fx){
                fx.elem.scrollLeft=fx.now
            }
            ,scrollTop:function(fx){
                fx.elem.scrollTop=fx.now
            }
            ,opacity:function(fx){
                jQuery.attr(fx.elem.style,"opacity",fx.now)
            }
            ,_default:function(fx){
                fx.elem.style[fx.prop]=fx.now+fx.unit
            }

        }

    }
    );
    jQuery.fn.offset=function(){
        var left=0,top=0,elem=this[0],results;
        if(elem)with(jQuery.browser){
            var parent=elem.parentNode,offsetChild=elem,offsetParent=elem.offsetParent,doc=elem.ownerDocument,safari2=safari&&parseInt(version)&lt;522&&!/adobeair/i.test(userAgent),css=jQuery.curCSS,fixed=css(elem,"position")=="fixed";if(elem.getBoundingClientRect){
                var box=elem.getBoundingClientRect();
                add(box.left+Math.max(doc.documentElement.scrollLeft,doc.body.scrollLeft),box.top+Math.max(doc.documentElement.scrollTop,doc.body.scrollTop));
                add(-doc.documentElement.clientLeft,-doc.documentElement.clientTop)
            }
            else{
                add(elem.offsetLeft,elem.offsetTop);
                while(offsetParent){
                    add(offsetParent.offsetLeft,offsetParent.offsetTop);if(mozilla&&!/^t(able|d|h)$/i.test(offsetParent.tagName)||safari&&!safari2)border(offsetParent);if(!fixed&&css(offsetParent,"position")=="fixed")fixed=true;offsetChild=/^body$/i.test(offsetParent.tagName)?offsetChild:offsetParent;offsetParent=offsetParent.offsetParent
                }
                while(parent&&parent.tagName&&!/^body|html$/i.test(parent.tagName)){
                    if(!/^inline|table.*$/i.test(css(parent,"display")))add(-parent.scrollLeft,-parent.scrollTop);if(mozilla&&css(parent,"overflow")!="visible")border(parent);parent=parent.parentNode
                }
                if((safari2&&(fixed||css(offsetChild,"position")=="absolute"))||(mozilla&&css(offsetChild,"position")!="absolute"))add(-doc.body.offsetLeft,-doc.body.offsetTop);if(fixed)add(Math.max(doc.documentElement.scrollLeft,doc.body.scrollLeft),Math.max(doc.documentElement.scrollTop,doc.body.scrollTop))
            }
            results={
                top:top,left:left
            }

        }
        /************************************************************\
        *
        \************************************************************/
        function border(elem){
            add(jQuery.curCSS(elem,"borderLeftWidth",true),jQuery.curCSS(elem,"borderTopWidth",true))
        }
        /************************************************************\
        *
        \************************************************************/
        function add(l,t){
            left+=parseInt(l,10)||0;
            top+=parseInt(t,10)||0
        }
        return results
    }
    ;
    jQuery.fn.extend({
        position:function(){
            var left=0,top=0,results;
            if(this[0]){
                var offsetParent=this.offsetParent(),offset=this.offset(),parentOffset=/^body|html$/i.test(offsetParent[0].tagName)?{
                    top:0,left:0
                }
                :offsetParent.offset();
                offset.top-=num(this,'marginTop');
                offset.left-=num(this,'marginLeft');
                parentOffset.top+=num(offsetParent,'borderTopWidth');
                parentOffset.left+=num(offsetParent,'borderLeftWidth');
                results={
                    top:offset.top-parentOffset.top,left:offset.left-parentOffset.left
                }

            }
            return results
        }
        ,offsetParent:function(){
            var offsetParent=this[0].offsetParent;
            while(offsetParent&&(!/^body|html$/i.test(offsetParent.tagName)&&jQuery.css(offsetParent,'position')=='static'))offsetParent=offsetParent.offsetParent;
            return jQuery(offsetParent)
        }

    }
    );
    jQuery.each(['Left','Top'],function(i,name){
        var method='scroll'+name;
        jQuery.fn[method]=function(val){
            if(!this[0])return;
            return val!=undefined?this.each(function(){
                this==window||this==document?window.scrollTo(!i?val:jQuery(window).scrollLeft(),i?val:jQuery(window).scrollTop()):this[method]=val
            }
            ):this[0]==window||this[0]==document?self[i?'pageYOffset':'pageXOffset']||jQuery.boxModel&&document.documentElement[method]||document.body[method]:this[0][method]
        }

    }
    );jQuery.each(["Height","Width"],function(i,name){
        var tl=i?"Left":"Top",br=i?"Right":"Bottom";jQuery.fn["inner"+name]=function(){
            return this[name.toLowerCase()]()+num(this,"padding"+tl)+num(this,"padding"+br)
        }
        ;jQuery.fn["outer"+name]=function(margin){
            return this["inner"+name]()+num(this,"border"+tl+"Width")+num(this,"border"+br+"Width")+(margin?num(this,"margin"+tl)+num(this,"margin"+br):0)
        }

    }
    )
}
)();


/*
* jQuery Form Plugin
* version: 2.03 (01/20/2008)
* @requires jQuery v1.1 or later
*
* Examples at: http://malsup.com/jquery/form/
* Dual licensed under the MIT and GPL licenses:
*   http://www.opensource.org/licenses/mit-license.php
*   http://www.gnu.org/licenses/gpl.html
*
* Revision: $Id$
*/
;
(function($){
    $.fn.ajaxSubmit=function(options){
        if(typeof options=='function')options={
            success:options
        }
        ;
        options=$.extend({
            url:this.attr('action')||window.location.toString(),type:this.attr('method')||'GET'
        }
        ,options||{

        }
        );
        var veto={

        }
        ;$.event.trigger('form.pre.serialize',[this,options,veto]);if(veto.veto)return this;var a=this.formToArray(options.semantic);if(options.data){
            for(var n in options.data)a.push({
                name:n,value:options.data[n]
            }
            )
        }
        if(options.beforeSubmit&&options.beforeSubmit(a,this,options)===false)return this;$.event.trigger('form.submit.validate',[a,this,options,veto]);if(veto.veto)return this;var q=$.param(a);if(options.type.toUpperCase()=='GET'){
            options.url+=(options.url.indexOf('?')&gt;
            =0?'&':'?')+q;
            options.data=null
        }
        else options.data=q;var $form=this,callbacks=[];if(options.resetForm)callbacks.push(function(){
            $form.resetForm()
        }
        );if(options.clearForm)callbacks.push(function(){
            $form.clearForm()
        }
        );
        if(!options.dataType&&options.target){
            var oldSuccess=options.success||function(){

            }
            ;
            callbacks.push(function(data){
                if(this.evalScripts)$(options.target).attr("innerHTML",data).evalScripts().each(oldSuccess,arguments);else $(options.target).html(data).each(oldSuccess,arguments)
            }
            )
        }
        else if(options.success)callbacks.push(options.success);
        options.success=function(data,status){
            for(var i=0,max=callbacks.length;i&lt;max;i++)callbacks[i](data,status,$form)
        }
        ;var files=$('input:file',this).fieldValue();var found=false;for(var j=0;j&lt;files.length;j++)if(files[j])found=true;if(options.iframe||found){
            if($.browser.safari&&options.closeKeepAlive)$.get(options.closeKeepAlive,fileUpload);
            else fileUpload()
        }
        else $.ajax(options);$.event.trigger('form.submit.notify',[this,options]);return this;/************************************************************\
        *
        \************************************************************/
        function fileUpload(){
            var form=$form[0];var opts=$.extend({

            }
            ,$.ajaxSettings,options);var id='jqFormIO'+$.fn.ajaxSubmit.counter++;var $io=$('&lt;iframe id="'+id+'" name="'+id+'" /&gt;');var io=$io[0];var op8=$.browser.opera&&window.opera.version()&lt;9;if($.browser.msie||op8)io.src='javascript:false;document.write("");';$io.css({
                position:'absolute',top:'-1000px',left:'-1000px'
            }
            );
            var xhr={
                responseText:null,responseXML:null,status:0,statusText:'n/a',getAllResponseHeaders:function(){

                }
                ,getResponseHeader:function(){

                }
                ,setRequestHeader:function(){

                }

            }
            ;var g=opts.global;if(g&&!$.active++)$.event.trigger("ajaxStart");if(g)$.event.trigger("ajaxSend",[xhr,opts]);var cbInvoked=0;var timedOut=0;setTimeout(function(){
                var encAttr=form.encoding?'encoding':'enctype';var t=$form.attr('target'),a=$form.attr('action');$form.attr({
                    target:id,method:'POST',action:opts.url
                }
                );form[encAttr]='multipart/form-data';if(opts.timeout)setTimeout(function(){
                    timedOut=true;
                    cb()
                }
                ,opts.timeout);$io.appendTo('body');io.attachEvent?io.attachEvent('onload',cb):io.addEventListener('load',cb,false);form.submit();$form.attr({
                    action:a,target:t
                }
                )
            }
            ,10);
            /************************************************************\
            *
            \************************************************************/
            function cb(){
                if(cbInvoked++)return;
                io.detachEvent?io.detachEvent('onload',cb):io.removeEventListener('load',cb,false);
                var ok=true;
                try{
                    if(timedOut)throw'timeout';
                    var data,doc;
                    doc=io.contentWindow?io.contentWindow.document:io.contentDocument?io.contentDocument:io.document;
                    xhr.responseText=doc.body?doc.body.innerHTML:null;
                    xhr.responseXML=doc.XMLDocument?doc.XMLDocument:doc;
                    if(opts.dataType=='json'||opts.dataType=='script'){
                        var ta=doc.getElementsByTagName('textarea')[0];data=ta?ta.value:xhr.responseText;if(opts.dataType=='json')eval("data = "+data);else $.globalEval(data)
                    }
                    else if(opts.dataType=='xml'){
                        data=xhr.responseXML;
                        if(!data&&xhr.responseText!=null)data=toXml(xhr.responseText)
                    }
                    else{
                        data=xhr.responseText
                    }

                }
                catch(e){
                    ok=false;
                    $.handleError(opts,xhr,'error',e)
                }
                if(ok){
                    opts.success(data,'success');if(g)$.event.trigger("ajaxSuccess",[xhr,opts])
                }
                if(g)$.event.trigger("ajaxComplete",[xhr,opts]);if(g&&!--$.active)$.event.trigger("ajaxStop");if(opts.complete)opts.complete(xhr,ok?'success':'error');setTimeout(function(){
                    $io.remove();
                    xhr.responseXML=null
                }
                ,100)
            }
            ;
            /************************************************************\
            *
            \************************************************************/
            function toXml(s,doc){
                if(window.ActiveXObject){
                    doc=new ActiveXObject('Microsoft.XMLDOM');
                    doc.async='false';
                    doc.loadXML(s)
                }
                else doc=(new DOMParser()).parseFromString(s,'text/xml');
                return(doc&&doc.documentElement&&doc.documentElement.tagName!='parsererror')?doc:null
            }

        }

    }
    ;$.fn.ajaxSubmit.counter=0;$.fn.ajaxForm=function(options){
        return this.ajaxFormUnbind().submit(submitHandler).each(function(){
            this.formPluginId=$.fn.ajaxForm.counter++;$.fn.ajaxForm.optionHash[this.formPluginId]=options;$(":submit,input:image",this).click(clickHandler)
        }
        )
    }
    ;$.fn.ajaxForm.counter=1;$.fn.ajaxForm.optionHash={

    }
    ;
    /************************************************************\
    *
    \************************************************************/
    function clickHandler(e){
        var $form=this.form;$form.clk=this;if(this.type=='image'){
            if(e.offsetX!=undefined){
                $form.clk_x=e.offsetX;$form.clk_y=e.offsetY
            }
            else if(typeof $.fn.offset=='function'){
                var offset=$(this).offset();$form.clk_x=e.pageX-offset.left;$form.clk_y=e.pageY-offset.top
            }
            else{
                $form.clk_x=e.pageX-this.offsetLeft;$form.clk_y=e.pageY-this.offsetTop
            }

        }
        setTimeout(function(){
            $form.clk=$form.clk_x=$form.clk_y=null
        }
        ,10)
    }
    ;
    /************************************************************\
    *
    \************************************************************/
    function submitHandler(){
        var id=this.formPluginId;var options=$.fn.ajaxForm.optionHash[id];$(this).ajaxSubmit(options);return false
    }
    ;$.fn.ajaxFormUnbind=function(){
        this.unbind('submit',submitHandler);
        return this.each(function(){
            $(":submit,input:image",this).unbind('click',clickHandler)
        }
        )
    }
    ;$.fn.formToArray=function(semantic){
        var a=[];if(this.length==0)return a;var form=this[0];var els=semantic?form.getElementsByTagName('*'):form.elements;if(!els)return a;for(var i=0,max=els.length;i&lt;max;i++){
            var el=els[i];var n=el.name;if(!n)continue;if(semantic&&form.clk&&el.type=="image"){
                if(!el.disabled&&form.clk==el)a.push({
                    name:n+'.x',value:form.clk_x
                }
                ,{
                    name:n+'.y',value:form.clk_y
                }
                );
                continue
            }
            var v=$.fieldValue(el,true);
            if(v&&v.constructor==Array){
                for(var j=0,jmax=v.length;j&lt;jmax;j++)a.push({
                    name:n,value:v[j]
                }
                )
            }
            else if(v!==null&&typeof v!='undefined')a.push({
                name:n,value:v
            }
            )
        }
        if(!semantic&&form.clk){
            var inputs=form.getElementsByTagName("input");for(var i=0,max=inputs.length;i&lt;max;i++){
                var input=inputs[i];var n=input.name;if(n&&!input.disabled&&input.type=="image"&&form.clk==input)a.push({
                    name:n+'.x',value:form.clk_x
                }
                ,{
                    name:n+'.y',value:form.clk_y
                }
                )
            }

        }
        return a
    }
    ;$.fn.formSerialize=function(semantic){
        return $.param(this.formToArray(semantic))
    }
    ;
    $.fn.fieldSerialize=function(successful){
        var a=[];
        this.each(function(){
            var n=this.name;
            if(!n)return;
            var v=$.fieldValue(this,successful);
            if(v&&v.constructor==Array){
                for(var i=0,max=v.length;i&lt;max;i++)a.push({
                    name:n,value:v[i]
                }
                )
            }
            else if(v!==null&&typeof v!='undefined')a.push({
                name:this.name,value:v
            }
            )
        }
        );
        return $.param(a)
    }
    ;
    $.fn.fieldValue=function(successful){
        for(var val=[],i=0,max=this.length;i&lt;max;i++){
            var el=this[i];
            var v=$.fieldValue(el,successful);
            if(v===null||typeof v=='undefined'||(v.constructor==Array&&!v.length))continue;
            v.constructor==Array?$.merge(val,v):val.push(v)
        }
        return val
    }
    ;
    $.fieldValue=function(el,successful){
        var n=el.name,t=el.type,tag=el.tagName.toLowerCase();if(typeof successful=='undefined')successful=true;if(successful&&(!n||el.disabled||t=='reset'||t=='button'||(t=='checkbox'||t=='radio')&&!el.checked||(t=='submit'||t=='image')&&el.form&&el.form.clk!=el||tag=='select'&&el.selectedIndex==-1))return null;if(tag=='select'){
            var index=el.selectedIndex;if(index&lt;0)return null;var a=[],ops=el.options;var one=(t=='select-one');var max=(one?index+1:ops.length);for(var i=(one?index:0);i&lt;max;i++){
                var op=ops[i];
                if(op.selected){
                    var v=$.browser.msie&&!(op.attributes['value'].specified)?op.text:op.value;
                    if(one)return v;
                    a.push(v)
                }

            }
            return a
        }
        return el.value
    }
    ;$.fn.clearForm=function(){
        return this.each(function(){
            $('input,select,textarea',this).clearFields()
        }
        )
    }
    ;
    $.fn.clearFields=$.fn.clearInputs=function(){
        return this.each(function(){
            var t=this.type,tag=this.tagName.toLowerCase();
            if(t=='text'||t=='password'||tag=='textarea')this.value='';
            else if(t=='checkbox'||t=='radio')this.checked=false;
            else if(tag=='select')this.selectedIndex=-1
        }
        )
    }
    ;$.fn.resetForm=function(){
        return this.each(function(){
            if(typeof this.reset=='function'||(typeof this.reset=='object'&&!this.reset.nodeType))this.reset()
        }
        )
    }
    ;
    $.fn.enable=function(b){
        if(b==undefined)b=true;
        return this.each(function(){
            this.disabled=!b
        }
        )
    }
    ;
    $.fn.select=function(select){
        if(select==undefined)select=true;
        return this.each(function(){
            var t=this.type;
            if(t=='checkbox'||t=='radio')this.checked=select;
            else if(this.tagName.toLowerCase()=='option'){
                var $sel=$(this).parent('select');
                if(select&&$sel[0]&&$sel[0].type=='select-one'){
                    $sel.find('option').select(false)
                }
                this.selected=select
            }

        }
        )
    }

}
)(jQuery);


/* Copyright (c) 2007 Paul Bakaus (paul.bakaus@googlemail.com) and Brandon Aaron (brandon.aaron@gmail.com || http://brandonaaron.net)
* Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
* and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
*
* $LastChangedDate: 2007-12-20 08:46:55 -0600 (Thu, 20 Dec 2007) $
* $Rev: 4259 $
*
* Version: 1.2
*
* Requires: jQuery 1.2+
*/
;
(function($){
    $.dimensions={
        version:'1.2'
    }
    ;
    $.each(['Height','Width'],function(i,name){
        $.fn['inner'+name]=function(){
            if(!this[0])return;
            var torl=name=='Height'?'Top':'Left',borr=name=='Height'?'Bottom':'Right';
            return this.is(':visible')?this[0]['client'+name]:num(this,name.toLowerCase())+num(this,'padding'+torl)+num(this,'padding'+borr)
        }
        ;
        $.fn['outer'+name]=function(options){
            if(!this[0])return;
            var torl=name=='Height'?'Top':'Left',borr=name=='Height'?'Bottom':'Right';
            options=$.extend({
                margin:false
            }
            ,options||{

            }
            );
            var val=this.is(':visible')?this[0]['offset'+name]:num(this,name.toLowerCase())+num(this,'border'+torl+'Width')+num(this,'border'+borr+'Width')+num(this,'padding'+torl)+num(this,'padding'+borr);
            return val+(options.margin?(num(this,'margin'+torl)+num(this,'margin'+borr)):0)
        }

    }
    );
    $.each(['Left','Top'],function(i,name){
        $.fn['scroll'+name]=function(val){
            if(!this[0])return;
            return val!=undefined?this.each(function(){
                this==window||this==document?window.scrollTo(name=='Left'?val:$(window)['scrollLeft'](),name=='Top'?val:$(window)['scrollTop']()):this['scroll'+name]=val
            }
            ):this[0]==window||this[0]==document?self[(name=='Left'?'pageXOffset':'pageYOffset')]||$.boxModel&&document.documentElement['scroll'+name]||document.body['scroll'+name]:this[0]['scroll'+name]
        }

    }
    );
    $.fn.extend({
        position:function(){
            var left=0,top=0,elem=this[0],offset,parentOffset,offsetParent,results;
            if(elem){
                offsetParent=this.offsetParent();
                offset=this.offset();
                parentOffset=offsetParent.offset();
                offset.top-=num(elem,'marginTop');
                offset.left-=num(elem,'marginLeft');
                parentOffset.top+=num(offsetParent,'borderTopWidth');
                parentOffset.left+=num(offsetParent,'borderLeftWidth');
                results={
                    top:offset.top-parentOffset.top,left:offset.left-parentOffset.left
                }

            }
            return results
        }
        ,offsetParent:function(){
            var offsetParent=this[0].offsetParent;
            while(offsetParent&&(!/^body|html$/i.test(offsetParent.tagName)&&$.css(offsetParent,'position')=='static'))offsetParent=offsetParent.offsetParent;
            return $(offsetParent)
        }

    }
    );
    /************************************************************\
    *
    \************************************************************/
    function num(el,prop){
        return parseInt($.curCSS(el.jquery?el[0]:el,prop,true))||0
    }

}
)(jQuery);


/*
* positionBy 1.0.7 (2008-01-29)
*
* Copyright (c) 2006,2007 Jonathan Sharp (http://jdsharp.us)
* Dual licensed under the MIT (MIT-LICENSE.txt)
* and GPL (GPL-LICENSE.txt) licenses.
*
* http://jdsharp.us/
*
* Built upon jQuery 1.2.2 (http://jquery.com)
* This also requires the jQuery dimensions plugin
*/
;
(function($){
    var Range=function(x1,y1,x2,y2){
        this.x1=x1;
        this.x2=x2;
        this.y1=y1;
        this.y2=y2
    }
    ;
    Range.prototype.contains=function(range){
        return(this.x1&lt;
        =range.x1&&range.x2&lt;
        =this.x2)&&(this.y1&lt;
        =range.y1&&range.y2&lt;
        =this.y2)
    }
    ;Range.prototype.transform=function(x,y){
        return new Range(this.x1+x,this.y1+y,this.x2+x,this.y2+y)
    }
    ;
    $.fn.positionBy=function(args){
        var date1=new Date();
        if(this.length==0){
            return this
        }
        var args=$.extend({
            target:null,targetPos:null,elementPos:null,x:null,y:null,positions:null,addClass:false,force:false,container:window,hideAfterPosition:false
        }
        ,args);
        if(args.x!=null){
            var tLeft=args.x;
            var tTop=args.y;
            var tWidth=0;
            var tHeight=0
        }
        else{
            var $target=$($(args.target)[0]);
            var tWidth=$target.outerWidth();
            var tHeight=$target.outerHeight();
            var tOffset=$target.offset();
            var tLeft=tOffset.left;
            var tTop=tOffset.top
        }
        var tRight=tLeft+tWidth;
        var tBottom=tTop+tHeight;
        return this.each(function(){
            var $element=$(this);
            if(!$element.is(':visible')){
                $element.css({
                    left:-3000,top:-3000
                }
                ).show()
            }
            var eWidth=$element.outerWidth();
            var eHeight=$element.outerHeight();
            var position=[];
            var next=[];
            position[0]=new Range(tRight,tTop,tRight+eWidth,tTop+eHeight);
            next[0]=[1,7,4];
            position[1]=new Range(tRight,tBottom-eHeight,tRight+eWidth,tBottom);
            next[1]=[0,6,4];
            position[2]=new Range(tRight,tBottom,tRight+eWidth,tBottom+eHeight);
            next[2]=[1,3,10];
            position[3]=new Range(tRight-eWidth,tBottom,tRight,tBottom+eHeight);
            next[3]=[1,6,10];
            position[4]=new Range(tLeft,tBottom,tLeft+eWidth,tBottom+eHeight);
            next[4]=[1,6,9];
            position[5]=new Range(tLeft-eWidth,tBottom,tLeft,tBottom+eHeight);
            next[5]=[6,4,9];
            position[6]=new Range(tLeft-eWidth,tBottom-eHeight,tLeft,tBottom);
            next[6]=[7,1,4];
            position[7]=new Range(tLeft-eWidth,tTop,tLeft,tTop+eHeight);
            next[7]=[6,0,4];
            position[8]=new Range(tLeft-eWidth,tTop-eHeight,tLeft,tTop);
            next[8]=[7,9,4];
            position[9]=new Range(tLeft,tTop-eHeight,tLeft+eWidth,tTop);
            next[9]=[0,7,4];
            position[10]=new Range(tRight-eWidth,tTop-eHeight,tRight,tTop);
            next[10]=[0,7,3];
            position[11]=new Range(tRight,tTop-eHeight,tRight+eWidth,tTop);
            next[11]=[0,10,3];
            position[12]=new Range(tRight-eWidth,tTop,tRight,tTop+eHeight);
            next[12]=[13,7,10];
            position[13]=new Range(tRight-eWidth,tBottom-eHeight,tRight,tBottom);
            next[13]=[12,6,3];
            position[14]=new Range(tLeft,tBottom-eHeight,tLeft+eWidth,tBottom);
            next[14]=[15,1,4];
            position[15]=new Range(tLeft,tTop,tLeft+eWidth,tTop+eHeight);
            next[15]=[14,0,9];
            if(args.positions!==null){
                var pos=args.positions[0]
            }
            else if(args.targetPos!=null&&args.elementPos!=null){
                var pos=[];
                pos[0]=[];
                pos[0][0]=15;
                pos[0][1]=7;
                pos[0][2]=8;
                pos[0][3]=9;
                pos[1]=[];
                pos[1][0]=0;
                pos[1][1]=12;
                pos[1][2]=10;
                pos[1][3]=11;
                pos[2]=[];
                pos[2][0]=2;
                pos[2][1]=3;
                pos[2][2]=13;
                pos[2][3]=1;
                pos[3]=[];
                pos[3][0]=4;
                pos[3][1]=5;
                pos[3][2]=6;
                pos[3][3]=14;
                var pos=pos[args.targetPos][args.elementPos]
            }
            var ePos=position[pos];var fPos=pos;if(!args.force){
                $window=$(window);
                var sx=$window.scrollLeft();
                var sy=$window.scrollTop();
                var container=new Range(sx,sy,sx+$window.width(),sy+$window.height());
                var stack;
                if(args.positions){
                    stack=args.positions
                }
                else{
                    stack=[pos]
                }
                var test=[];
                while(stack.length&gt;
                0){
                    var p=stack.shift();
                    if(test[p]){
                        continue
                    }
                    test[p]=true;
                    if(!container.contains(position[p])){
                        if(args.positions===null){
                            stack=jQuery.merge(stack,next[p])
                        }

                    }
                    else{
                        ePos=position[p];
                        break
                    }

                }

            }
            $element.parents().each(function(){
                var $this=$(this);
                if($this.css('position')!='static'){
                    var abs=$this.offset();ePos=ePos.transform(-abs.left,-abs.top);return false
                }

            }
            );
            var css={
                left:ePos.x1,top:ePos.y1
            }
            ;
            if(args.hideAfterPosition){
                css['display']='none'
            }
            $element.css(css);
            if(args.addClass){
                $element.removeClass('positionBy0 positionBy1 positionBy2 positionBy3 positionBy4 positionBy5 '+'positionBy6 positionBy7 positionBy8 positionBy9 positionBy10 positionBy11 '+'positionBy12 positionBy13 positionBy14 positionBy15').addClass('positionBy'+p)
            }

        }
        )
    }

}
)(jQuery);


/* Copyright (c) 2006 Brandon Aaron (http://brandonaaron.net)
* Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
* and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
*
* $LastChangedDate: 2007-07-11 23:14:51 -0500 (Wed, 11 Jul 2007) $
* $Rev: 2323 $
*
* Version 2.1
*/
;
(function($){
    $.fn.bgIframe=$.fn.bgiframe=function(s){
        if($.browser.msie&&/6.0/.test(navigator.userAgent)){
            s=$.extend({
                top:'auto',left:'auto',width:'auto',height:'auto',opacity:true,src:'javascript:false;
                '
            }
            ,s||{

            }
            );
            var prop=function(n){
                return n&&n.constructor==Number?n+'px':n
            }
            ,html='&lt;iframe class="bgiframe"frameborder="0"tabindex="-1"src="'+s.src+'"'+'style="display:block;position:absolute;z-index:-1;'+(s.opacity!==false?'filter:Alpha(Opacity=\'0\');':'')+'top:'+(s.top=='auto'?'expression(((parseInt(this.parentNode.currentStyle.borderTopWidth)||0)*-1)+\'px\')':prop(s.top))+';'+'left:'+(s.left=='auto'?'expression(((parseInt(this.parentNode.currentStyle.borderLeftWidth)||0)*-1)+\'px\')':prop(s.left))+';'+'width:'+(s.width=='auto'?'expression(this.parentNode.offsetWidth+\'px\')':prop(s.width))+';'+'height:'+(s.height=='auto'?'expression(this.parentNode.offsetHeight+\'px\')':prop(s.height))+';'+'"/&gt;';return this.each(function(){
                if($('&gt; iframe.bgiframe',this).length==0)this.insertBefore(document.createElement(html),this.firstChild)
            }
            )
        }
        return this
    }

}
)(jQuery);


/*
* jdMenu 1.4.1 (2008-03-31)
*
* Copyright (c) 2006,2007 Jonathan Sharp (http://jdsharp.us)
* Dual licensed under the MIT (MIT-LICENSE.txt)
* and GPL (GPL-LICENSE.txt) licenses.
*
* http://jdsharp.us/
*
* Built upon jQuery 1.2.1 (http://jquery.com)
* This also requires the jQuery dimensions &gt;
= 1.2 plugin
*/
$(function(){
    $('ul.jd_menu').jdMenu()
}
);
(function($){
    /************************************************************\
    *
    \************************************************************/
    function addEvents(ul){
        var settings=$.data($(ul).parents().andSelf().filter('ul.jd_menu')[0],'jdMenuSettings');
        $('&gt;
        li',ul).bind('mouseenter.jdmenu mouseleave.jdmenu',function(evt){
            $(this).toggleClass('jdm_hover');
            var ul=$('&gt;
            ul',this);
            if(ul.length==1){
                clearTimeout(this.$jdTimer);
                var enter=(evt.type=='mouseenter');
                var fn=(enter?showMenu:hideMenu);
                this.$jdTimer=setTimeout(function(){
                    fn(ul[0],settings.onAnimate,settings.isVertical)
                }
                ,enter?settings.showDelay:settings.hideDelay)
            }

        }
        ).bind('click.jdmenu',function(evt){
            var ul=$('&gt;
            ul',this);
            if(ul.length==1&&(settings.disableLinks==true||$(this).hasClass('accessible'))){
                showMenu(ul,settings.onAnimate,settings.isVertical);
                return false
            }
            if(evt.target==this){
                var link=$('&gt;
                a',evt.target).not('.accessible');
                if(link.length&gt;
                0){
                    var a=link[0];
                    if(!a.onclick){
                        window.open(a.href,a.target||'_self')
                    }
                    else{
                        $(a).trigger('click')
                    }

                }

            }
            if(settings.disableLinks||(!settings.disableLinks&&!$(this).parent().hasClass('jd_menu'))){
                $(this).parent().jdMenuHide();
                evt.stopPropagation()
            }

        }
        ).find('&gt;
        a').bind('focus.jdmenu blur.jdmenu',function(evt){
            var p=$(this).parents('li:eq(0)');
            if(evt.type=='focus'){
                p.addClass('jdm_hover')
            }
            else{
                p.removeClass('jdm_hover')
            }

        }
        ).filter('.accessible').bind('click.jdmenu',function(evt){
            evt.preventDefault()
        }
        )
    }
    /************************************************************\
    *
    \************************************************************/
    function showMenu(ul,animate,vertical){
        var ul=$(ul);
        if(ul.is(':visible')){
            return
        }
        ul.bgiframe();
        var li=ul.parent();
        ul.trigger('jdMenuShow').positionBy({
            target:li[0],targetPos:(vertical===true||!li.parent().hasClass('jd_menu')?1:3),elementPos:0,hideAfterPosition:true
        }
        );
        if(!ul.hasClass('jdm_events')){
            ul.addClass('jdm_events');
            addEvents(ul)
        }
        li.addClass('jdm_active').siblings('li').find('&gt;
        ul:eq(0):visible').each(function(){
            hideMenu(this)
        }
        );
        if(animate===undefined){
            ul.show()
        }
        else{
            animate.apply(ul[0],[true])
        }

    }
    /************************************************************\
    *
    \************************************************************/
    function hideMenu(ul,animate){
        var ul=$(ul);
        $('.bgiframe',ul).remove();
        ul.filter(':not(.jd_menu)').find('&gt;
        li &gt;
        ul:eq(0):visible').each(function(){
            hideMenu(this)
        }
        ).end();
        if(animate===undefined){
            ul.hide()
        }
        else{
            animate.apply(ul[0],[false])
        }
        ul.trigger('jdMenuHide').parents('li:eq(0)').removeClass('jdm_active jdm_hover').end().find('&gt;
        li').removeClass('jdm_active jdm_hover')
    }
    $.fn.jdMenu=function(settings){
        var settings=$.extend({
            showDelay:200,hideDelay:500,disableLinks:true
        }
        ,settings);
        if(!$.isFunction(settings.onAnimate)){
            settings.onAnimate=undefined
        }
        return this.filter('ul.jd_menu').each(function(){
            $.data(this,'jdMenuSettings',$.extend({
                isVertical:$(this).hasClass('jd_menu_vertical')
            }
            ,settings));
            addEvents(this)
        }
        )
    }
    ;
    $.fn.jdMenuUnbind=function(){
        $('ul.jdm_events',this).unbind('.jdmenu').find('&gt;
        a').unbind('.jdmenu')
    }
    ;
    $.fn.jdMenuHide=function(){
        return this.filter('ul').each(function(){
            hideMenu(this)
        }
        )
    }
    ;
    $(window).bind('click.jdmenu',function(){
        $('ul.jd_menu ul:visible').jdMenuHide()
    }
    )
}
)(jQuery);


/*
*
* Copyright (c) 2006-2008 Sam Collett (http://www.texotela.co.uk)
* Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
* and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
*
* Version 2.2.3
* Demo: http://www.texotela.co.uk/code/jquery/select/
*
* $LastChangedDate$
* $Rev$
*
*/
;
(function($){
    $.fn.addOption=function(){
        var add=function(el,v,t,sO){
            var option=document.createElement("option");option.value=v,option.text=t;var o=el.options;var oL=o.length;if(!el.cache){
                el.cache={

                }
                ;for(var i=0;i&lt;oL;i++){
                    el.cache[o[i].value]=i
                }

            }
            if(typeof el.cache[v]=="undefined")el.cache[v]=oL;el.options[el.cache[v]]=option;if(sO){
                option.selected=true
            }

        }
        ;var a=arguments;if(a.length==0)return this;var sO=true;var m=false;var items,v,t;if(typeof(a[0])=="object"){
            m=true;
            items=a[0]
        }
        if(a.length&gt;
        =2){
            if(typeof(a[1])=="boolean")sO=a[1];else if(typeof(a[2])=="boolean")sO=a[2];if(!m){
                v=a[0];
                t=a[1]
            }

        }
        this.each(function(){
            if(this.nodeName.toLowerCase()!="select")return;if(m){
                for(var item in items){
                    add(this,item,items[item],sO)
                }

            }
            else{
                add(this,v,t,sO)
            }

        }
        );
        return this
    }
    ;
    $.fn.ajaxAddOption=function(url,params,select,fn,args){
        if(typeof(url)!="string")return this;if(typeof(params)!="object")params={

        }
        ;if(typeof(select)!="boolean")select=true;this.each(function(){
            var el=this;
            $.getJSON(url,params,function(r){
                $(el).addOption(r,select);if(typeof fn=="function"){
                    if(typeof args=="object"){
                        fn.apply(el,args)
                    }
                    else{
                        fn.call(el)
                    }

                }

            }
            )
        }
        );
        return this
    }
    ;
    $.fn.removeOption=function(){
        var a=arguments;if(a.length==0)return this;var ta=typeof(a[0]);var v,index;if(ta=="string"||ta=="object"||ta=="function"){
            v=a[0];
            if(v.constructor==Array){
                var l=v.length;for(var i=0;i&lt;l;i++){
                    this.removeOption(v[i],a[1])
                }
                return this
            }

        }
        else if(ta=="number")index=a[0];else return this;this.each(function(){
            if(this.nodeName.toLowerCase()!="select")return;if(this.cache)this.cache=null;var remove=false;var o=this.options;if(!!v){
                var oL=o.length;for(var i=oL-1;i&gt;=0;i--){
                    if(v.constructor==RegExp){
                        if(o[i].value.match(v)){
                            remove=true
                        }

                    }
                    else if(o[i].value==v){
                        remove=true
                    }
                    if(remove&&a[1]===true)remove=o[i].selected;
                    if(remove){
                        o[i]=null
                    }
                    remove=false
                }

            }
            else{
                if(a[1]===true){
                    remove=o[index].selected
                }
                else{
                    remove=true
                }
                if(remove){
                    this.remove(index)
                }

            }

        }
        );
        return this
    }
    ;
    $.fn.sortOptions=function(ascending){
        var a=typeof(ascending)=="undefined"?true:!!ascending;this.each(function(){
            if(this.nodeName.toLowerCase()!="select")return;var o=this.options;var oL=o.length;var sA=[];for(var i=0;i&lt;oL;i++){
                sA[i]={
                    v:o[i].value,t:o[i].text
                }

            }
            sA.sort(function(o1,o2){
                o1t=o1.t.toLowerCase(),o2t=o2.t.toLowerCase();
                if(o1t==o2t)return 0;
                if(a){
                    return o1t&lt;
                    o2t?-1:1
                }
                else{
                    return o1t&gt;
                    o2t?-1:1
                }

            }
            );for(var i=0;i&lt;oL;i++){
                o[i].text=sA[i].t;
                o[i].value=sA[i].v
            }

        }
        );
        return this
    }
    ;
    $.fn.selectOptions=function(value,clear){
        var v=value;var vT=typeof(value);var c=clear||false;if(vT!="string"&&vT!="function"&&vT!="object")return this;this.each(function(){
            if(this.nodeName.toLowerCase()!="select")return this;var o=this.options;var oL=o.length;for(var i=0;i&lt;oL;i++){
                if(v.constructor==RegExp){
                    if(o[i].value.match(v)){
                        o[i].selected=true
                    }
                    else if(c){
                        o[i].selected=false
                    }

                }
                else{
                    if(o[i].value==v){
                        o[i].selected=true
                    }
                    else if(c){
                        o[i].selected=false
                    }

                }

            }

        }
        );
        return this
    }
    ;
    $.fn.copyOptions=function(to,which){
        var w=which||"selected";if($(to).size()==0)return this;this.each(function(){
            if(this.nodeName.toLowerCase()!="select")return this;var o=this.options;var oL=o.length;for(var i=0;i&lt;oL;i++){
                if(w=="all"||(w=="selected"&&o[i].selected)){
                    $(to).addOption(o[i].value,o[i].text)
                }

            }

        }
        );
        return this
    }
    ;
    $.fn.containsOption=function(value,fn){
        var found=false;var v=value;var vT=typeof(v);var fT=typeof(fn);if(vT!="string"&&vT!="function"&&vT!="object")return fT=="function"?this:found;this.each(function(){
            if(this.nodeName.toLowerCase()!="select")return this;if(found&&fT!="function")return false;var o=this.options;var oL=o.length;for(var i=0;i&lt;oL;i++){
                if(v.constructor==RegExp){
                    if(o[i].value.match(v)){
                        found=true;if(fT=="function")fn.call(o[i],i)
                    }

                }
                else{
                    if(o[i].value==v){
                        found=true;if(fT=="function")fn.call(o[i],i)
                    }

                }

            }

        }
        );return fT=="function"?this:found
    }
    ;
    $.fn.selectedValues=function(){
        var v=[];this.find("option:selected").each(function(){
            v[v.length]=this.value
        }
        );
        return v
    }
    ;
    $.fn.selectedOptions=function(){
        return this.find("option:selected")
    }

}
)(jQuery);


/**
* Ajax Queue Plugin
*
* Homepage: http://jquery.com/plugins/project/ajaxqueue
* Documentation: http://docs.jquery.com/AjaxQueue
*/
;
(function($){
    var ajax=$.ajax;
    var pendingRequests={

    }
    ;
    var pendingRequestSettings={

    }
    ;
    var synced=[];
    var syncedData=[];
    $.ajaxAbort=function(port){
        if(pendingRequests[port]){
            pendingRequests[port].abort();
            if(pendingRequestSettings[port].global&&!--jQuery.active){
                jQuery.event.trigger("ajaxStop")
            }
            if(jQuery.active&lt;
            0){
                jQuery.active=0
            }

        }

    }
    ;
    $.ajax=function(settings){
        settings=jQuery.extend(settings,jQuery.extend({

        }
        ,jQuery.ajaxSettings,settings));
        var port=settings.port;
        pendingRequestSettings[port]=settings;
        switch(settings.mode){
            case"abort":if(pendingRequests[port]){
                pendingRequests[port].abort();
                if(settings.global&&!--jQuery.active){
                    jQuery.event.trigger("ajaxStop")
                }
                if(jQuery.active&lt;
                0){
                    jQuery.active=0
                }

            }
            return pendingRequests[port]=ajax.apply(this,arguments);case"queue":var _old=settings.complete;settings.complete=function(){
                if(_old)_old.apply(this,arguments);jQuery([ajax]).dequeue("ajax"+port)
            }
            ;jQuery([ajax]).queue("ajax"+port,function(){
                ajax(settings)
            }
            );return;case"sync":var pos=synced.length;synced[pos]={
                error:settings.error,success:settings.success,complete:settings.complete,done:false
            }
            ;
            syncedData[pos]={
                error:[],success:[],complete:[]
            }
            ;
            settings.error=function(){
                syncedData[pos].error=arguments
            }
            ;
            settings.success=function(){
                syncedData[pos].success=arguments
            }
            ;
            settings.complete=function(){
                syncedData[pos].complete=arguments;synced[pos].done=true;if(pos==0||!synced[pos-1])for(var i=pos;i&lt;synced.length&&synced[i].done;i++){
                    if(synced[i].error)synced[i].error.apply(jQuery,syncedData[i].error);
                    if(synced[i].success)synced[i].success.apply(jQuery,syncedData[i].success);
                    if(synced[i].complete)synced[i].complete.apply(jQuery,syncedData[i].complete);
                    synced[i]=null;
                    syncedData[i]=null
                }

            }

        }
        return ajax.apply(this,arguments)
    }

}
)(jQuery);


/*
* jQuery.ScrollTo
* Copyright (c) 2007-2008 Ariel Flesler - aflesler(at)gmail(dot)com | http://flesler.blogspot.com
* Dual licensed under MIT and GPL.
* Date: 2/19/2008
*/
;
(function($){
    var $scrollTo=$.scrollTo=function(target,duration,settings){
        $scrollTo.window().scrollTo(target,duration,settings)
    }
    ;
    $scrollTo.defaults={
        axis:'y',duration:1
    }
    ;
    $scrollTo.window=function(){
        return $($.browser.safari?'body':'html')
    }
    ;
    $.fn.scrollTo=function(target,duration,settings){
        if(typeof duration=='object'){
            settings=duration;
            duration=0
        }
        settings=$.extend({

        }
        ,$scrollTo.defaults,settings);
        duration=duration||settings.speed||settings.duration;
        settings.queue=settings.queue&&settings.axis.length&gt;
        1;
        if(settings.queue)duration/=2;
        settings.offset=both(settings.offset);
        settings.over=both(settings.over);
        return this.each(function(){
            var elem=this,$elem=$(elem),t=target,toff,attr={

            }
            ,win=$elem.is('html,body');
            switch(typeof t){
                case'number':case'string':if(/^([+-]=)?\d+(px)?$/.test(t)){
                    t=both(t);
                    break
                }
                t=$(t,this);
                case'object':if(t.is||t.style)toff=(t=$(t)).offset()
            }
            $.each(settings.axis.split(''),function(i,axis){
                var Pos=axis=='x'?'Left':'Top',pos=Pos.toLowerCase(),key='scroll'+Pos,act=elem[key],Dim=axis=='x'?'Width':'Height',dim=Dim.toLowerCase();
                if(toff){
                    attr[key]=toff[pos]+(win?0:act-$elem.offset()[pos]);
                    if(settings.margin){
                        attr[key]-=parseInt(t.css('margin'+Pos))||0;
                        attr[key]-=parseInt(t.css('border'+Pos+'Width'))||0
                    }
                    attr[key]+=settings.offset[pos]||0;
                    if(settings.over[pos])attr[key]+=t[dim]()*settings.over[pos]
                }
                else attr[key]=t[pos];
                if(/^\d+$/.test(attr[key]))attr[key]=attr[key]&lt;
                =0?0:Math.min(attr[key],max(Dim));
                if(!i&&settings.queue){
                    if(act!=attr[key])animate(settings.onAfterFirst);
                    delete attr[key]
                }

            }
            );
            animate(settings.onAfter);
            /************************************************************\
            *
            \************************************************************/
            function animate(callback){
                $elem.animate(attr,duration,settings.easing,callback&&function(){
                    callback.call(this,target)
                }
                )
            }
            ;
            /************************************************************\
            *
            \************************************************************/
            function max(Dim){
                var el=win?$.browser.opera?document.body:document.documentElement:elem;
                return el['scroll'+Dim]-el['client'+Dim]
            }

        }
        )
    }
    ;
    /************************************************************\
    *
    \************************************************************/
    function both(val){
        return typeof val=='object'?val:{
            top:val,left:val
        }

    }

}
)(jQuery);


/*
* jqModal - Minimalist Modaling with jQuery
*
* Copyright (c) 2007 Brice Burgess &lt;
bhb@iceburg.net&gt;
, http://www.iceburg.net
* Licensed under the MIT License:
* http://www.opensource.org/licenses/mit-license.php
*
* $Version: 2007.??.?? +r12 beta
* Requires: jQuery 1.1.3+
*/
(function($){
    $.fn.jqm=function(p){
        var o={
            zIndex:3000,overlay:50,overlayClass:'jqmOverlay',closeClass:'jqmClose',trigger:'.jqModal',ajax:false,target:false,modal:false,toTop:false,onShow:false,onHide:false,onLoad:false
        }
        ;
        return this.each(function(){
            if(this._jqm)return;
            s++;
            this._jqm=s;
            H[s]={
                c:$.extend(o,p),a:false,w:$(this).addClass('jqmID'+s),s:s
            }
            ;
            o.trigger&&$(this).jqmAddTrigger(o.trigger)
        }
        )
    }
    ;
    $.fn.jqmAddClose=function(e){
        return HS(this,e,'jqmHide')
    }
    ;
    $.fn.jqmAddTrigger=function(e){
        return HS(this,e,'jqmShow')
    }
    ;
    $.fn.jqmShow=function(t){
        return this.each(function(){
            !H[this._jqm].a&&$.jqm.open(this._jqm,t)
        }
        )
    }
    ;
    $.fn.jqmHide=function(t){
        return this.each(function(){
            H[this._jqm].a&&$.jqm.close(this._jqm,t)
        }
        )
    }
    ;
    $.jqm={
        hash:{

        }
        ,open:function(s,t){
            var h=H[s],c=h.c,cc='.'+c.closeClass,z=/^\d+$/.test(h.w.css('z-index'))&&h.w.css('z-index')||c.zIndex,o=$('<div></div>').css({
                height:'100%',width:'100%',position:'fixed',left:0,top:0,'z-index':z-1,opacity:c.overlay/100
            }
            );
            h.t=t;
            h.a=true;
            h.w.css('z-index',z);
            if(c.modal){
                !A[0]&&F('bind');
                A.push(s);
                o.css('cursor','wait')
            }
            else if(c.overlay&gt;
            0)h.w.jqmAddClose(o);
            else o=false;
            h.o=(o)?o.addClass(c.overlayClass).prependTo('body'):false;
            if(ie6&&$('html,body').css({
                height:'100%',width:'100%'
            }
            )&&o){
                o=o.css({
                    position:'absolute'
                }
                )[0];for(var y in{
                    Top:1,Left:1
                }
                )o.style.setExpression(y.toLowerCase(),"(_=(document.documentElement.scroll"+y+" || document.body.scroll"+y+"))+'px'")
            }
            if(c.ajax){
                var r=c.target||h.w,u=c.ajax,r=(typeof r=='string')?$(r,h.w):$(r),u=(u.substr(0,1)=='@')?$(t).attr(u.substring(1)):u;
                r.load(u,function(){
                    c.onLoad&&c.onLoad.call(this,h);
                    cc&&h.w.jqmAddClose($(cc,h.w));
                    O(h)
                }
                )
            }
            else cc&&h.w.jqmAddClose($(cc,h.w));c.toTop&&h.o&&h.w.before('<span id="jqmP'+h.w[0]._jqm+'"></span>').insertAfter(h.o);(c.onShow)?c.onShow(h):h.w.show();O(h);return false
        }
        ,close:function(s){
            var h=H[s];
            h.a=false;
            if(h.c.modal){
                A.pop();
                !A[0]&&F('unbind')
            }
            h.c.toTop&&h.o&&$('#jqmP'+h.w[0]._jqm).after(h.w).remove();
            if(h.c.onHide)h.c.onHide(h);
            else{
                h.w.hide()&&h.o&&h.o.remove()
            }
            return false
        }

    }
    ;var s=0,H=$.jqm.hash,A=[],ie6=$.browser.msie&&($.browser.version=="6.0"),i=$('&lt;iframe src="javascript:false;document.write(\'\');" class="jqm"&gt;&lt;/iframe&gt;').css({
        opacity:0
    }
    ),O=function(h){
        if(ie6)h.o&&h.o.html('&lt;p style="width:100%;height:100%"/&gt;').prepend(i)||(!$('iframe.jqm',h.w)[0]&&h.w.prepend(i));f(h)
    }
    ,f=function(h){
        try{
            $(':input:visible',h.w)[0].focus()
        }
        catch(e){

        }

    }
    ,F=function(t){
        $()[t]("keypress",x)[t]("keydown",x)[t]("mousedown",x)
    }
    ,x=function(e){
        var h=H[A[A.length-1]],r=(!$(e.target).parents('.jqmID'+h.s)[0]);
        r&&f(h);
        return!r
    }
    ,HS=function(w,e,y){
        var s=[];
        w.each(function(){
            s.push(this._jqm)
        }
        );
        $(e).each(function(){
            if(this[y])$.extend(this[y],s);
            else{
                this[y]=s;
                $(this).click(function(){
                    for(var i in{
                        jqmShow:1,jqmHide:1
                    }
                    )for(var s in this[i])if(H[this[i][s]])H[this[i][s]].w[i](this);return false
                }
                )
            }

        }
        );
        return w
    }

}
)(jQuery);


/*
* jQuery UI Effects 1.5.2
*
* Copyright (c) 2008 Aaron Eisenberger (aaronchi@gmail.com)
* Dual licensed under the MIT (MIT-LICENSE.txt)
* and GPL (GPL-LICENSE.txt) licenses.
*
* http://docs.jquery.com/UI/Effects/
*/
;
(function($){
    $.effects=$.effects||{

    }
    ;
    $.extend($.effects,{
        save:function(el,set){
            for(var i=0;i&lt;set.length;i++){
                if(set[i]!==null)$.data(el[0],"ec.storage."+set[i],el[0].style[set[i]])
            }

        }
        ,restore:function(el,set){
            for(var i=0;i&lt;set.length;i++){
                if(set[i]!==null)el.css(set[i],$.data(el[0],"ec.storage."+set[i]))
            }

        }
        ,setMode:function(el,mode){
            if(mode=='toggle')mode=el.is(':hidden')?'show':'hide';
            return mode
        }
        ,getBaseline:function(origin,original){
            var y,x;
            switch(origin[0]){
                case'top':y=0;
                break;
                case'middle':y=0.5;
                break;
                case'bottom':y=1;
                break;
                default:y=origin[0]/original.height
            }
            ;
            switch(origin[1]){
                case'left':x=0;
                break;
                case'center':x=0.5;
                break;
                case'right':x=1;
                break;
                default:x=origin[1]/original.width
            }
            ;
            return{
                x:x,y:y
            }

        }
        ,createWrapper:function(el){
            if(el.parent().attr('id')=='fxWrapper')return el;
            var props={
                width:el.outerWidth({
                    margin:true
                }
                ),height:el.outerHeight({
                    margin:true
                }
                ),'float':el.css('float')
            }
            ;el.wrap('<div id="fxWrapper" style="font-size:100%;background:transparent;border:none;margin:0;padding:0"></div>');var wrapper=el.parent();if(el.css('position')=='static'){
                wrapper.css({
                    position:'relative'
                }
                );
                el.css({
                    position:'relative'
                }
                )
            }
            else{
                var top=el.css('top');
                if(isNaN(parseInt(top)))top='auto';
                var left=el.css('left');
                if(isNaN(parseInt(left)))left='auto';
                wrapper.css({
                    position:el.css('position'),top:top,left:left,zIndex:el.css('z-index')
                }
                ).show();
                el.css({
                    position:'relative',top:0,left:0
                }
                )
            }
            wrapper.css(props);
            return wrapper
        }
        ,removeWrapper:function(el){
            if(el.parent().attr('id')=='fxWrapper')return el.parent().replaceWith(el);
            return el
        }
        ,setTransition:function(el,list,factor,val){
            val=val||{

            }
            ;
            $.each(list,function(i,x){
                unit=el.cssUnit(x);
                if(unit[0]&gt;
                0)val[x]=unit[0]*factor+unit[1]
            }
            );
            return val
        }
        ,animateClass:function(value,duration,easing,callback){
            var cb=(typeof easing=="function"?easing:(callback?callback:null));var ea=(typeof easing=="object"?easing:null);return this.each(function(){
                var offset={

                }
                ;var that=$(this);var oldStyleAttr=that.attr("style")||'';if(typeof oldStyleAttr=='object')oldStyleAttr=oldStyleAttr["cssText"];if(value.toggle){
                    that.hasClass(value.toggle)?value.remove=value.toggle:value.add=value.toggle
                }
                var oldStyle=$.extend({

                }
                ,(document.defaultView?document.defaultView.getComputedStyle(this,null):this.currentStyle));
                if(value.add)that.addClass(value.add);
                if(value.remove)that.removeClass(value.remove);
                var newStyle=$.extend({

                }
                ,(document.defaultView?document.defaultView.getComputedStyle(this,null):this.currentStyle));if(value.add)that.removeClass(value.add);if(value.remove)that.addClass(value.remove);for(var n in newStyle){
                    if(typeof newStyle[n]!="function"&&newStyle[n]&&n.indexOf("Moz")==-1&&n.indexOf("length")==-1&&newStyle[n]!=oldStyle[n]&&(n.match(/color/i)||(!n.match(/color/i)&&!isNaN(parseInt(newStyle[n],10))))&&(oldStyle.position!="static"||(oldStyle.position=="static"&&!n.match(/left|top|bottom|right/))))offset[n]=newStyle[n]
                }
                that.animate(offset,duration,ea,function(){
                    if(typeof $(this).attr("style")=='object'){
                        $(this).attr("style")["cssText"]="";$(this).attr("style")["cssText"]=oldStyleAttr
                    }
                    else $(this).attr("style",oldStyleAttr);if(value.add)$(this).addClass(value.add);if(value.remove)$(this).removeClass(value.remove);if(cb)cb.apply(this,arguments)
                }
                )
            }
            )
        }

    }
    );
    $.fn.extend({
        _show:$.fn.show,_hide:$.fn.hide,__toggle:$.fn.toggle,_addClass:$.fn.addClass,_removeClass:$.fn.removeClass,_toggleClass:$.fn.toggleClass,effect:function(fx,o,speed,callback){
            return $.effects[fx]?$.effects[fx].call(this,{
                method:fx,options:o||{

                }
                ,duration:speed,callback:callback
            }
            ):null
        }
        ,show:function(){
            if(!arguments[0]||(arguments[0].constructor==Number||/(slow|normal|fast)/.test(arguments[0])))return this._show.apply(this,arguments);
            else{
                var o=arguments[1]||{

                }
                ;
                o['mode']='show';
                return this.effect.apply(this,[arguments[0],o,arguments[2]||o.duration,arguments[3]||o.callback])
            }

        }
        ,hide:function(){
            if(!arguments[0]||(arguments[0].constructor==Number||/(slow|normal|fast)/.test(arguments[0])))return this._hide.apply(this,arguments);
            else{
                var o=arguments[1]||{

                }
                ;
                o['mode']='hide';
                return this.effect.apply(this,[arguments[0],o,arguments[2]||o.duration,arguments[3]||o.callback])
            }

        }
        ,toggle:function(){
            if(!arguments[0]||(arguments[0].constructor==Number||/(slow|normal|fast)/.test(arguments[0]))||(arguments[0].constructor==Function))return this.__toggle.apply(this,arguments);
            else{
                var o=arguments[1]||{

                }
                ;
                o['mode']='toggle';
                return this.effect.apply(this,[arguments[0],o,arguments[2]||o.duration,arguments[3]||o.callback])
            }

        }
        ,addClass:function(classNames,speed,easing,callback){
            return speed?$.effects.animateClass.apply(this,[{
                add:classNames
            }
            ,speed,easing,callback]):this._addClass(classNames)
        }
        ,removeClass:function(classNames,speed,easing,callback){
            return speed?$.effects.animateClass.apply(this,[{
                remove:classNames
            }
            ,speed,easing,callback]):this._removeClass(classNames)
        }
        ,toggleClass:function(classNames,speed,easing,callback){
            return speed?$.effects.animateClass.apply(this,[{
                toggle:classNames
            }
            ,speed,easing,callback]):this._toggleClass(classNames)
        }
        ,morph:function(remove,add,speed,easing,callback){
            return $.effects.animateClass.apply(this,[{
                add:add,remove:remove
            }
            ,speed,easing,callback])
        }
        ,switchClass:function(){
            return this.morph.apply(this,arguments)
        }
        ,cssUnit:function(key){
            var style=this.css(key),val=[];
            $.each(['em','px','%','pt'],function(i,unit){
                if(style.indexOf(unit)&gt;
                0)val=[parseFloat(style),unit]
            }
            );
            return val
        }

    }
    );
    jQuery.each(['backgroundColor','borderBottomColor','borderLeftColor','borderRightColor','borderTopColor','color','outlineColor'],function(i,attr){
        jQuery.fx.step[attr]=function(fx){
            if(fx.state==0){
                fx.start=getColor(fx.elem,attr);
                fx.end=getRGB(fx.end)
            }
            fx.elem.style[attr]="rgb("+[Math.max(Math.min(parseInt((fx.pos*(fx.end[0]-fx.start[0]))+fx.start[0]),255),0),Math.max(Math.min(parseInt((fx.pos*(fx.end[1]-fx.start[1]))+fx.start[1]),255),0),Math.max(Math.min(parseInt((fx.pos*(fx.end[2]-fx.start[2]))+fx.start[2]),255),0)].join(",")+")"
        }

    }
    );
    /************************************************************\
    *
    \************************************************************/
    function getRGB(color){
        var result;
        if(color&&color.constructor==Array&&color.length==3)return color;
        if(result=/rgb\(\s*([0-9]{
            1,3
        }
        )\s*,\s*([0-9]{
            1,3
        }
        )\s*,\s*([0-9]{
            1,3
        }
        )\s*\)/.exec(color))return[parseInt(result[1]),parseInt(result[2]),parseInt(result[3])];
        if(result=/rgb\(\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*\)/.exec(color))return[parseFloat(result[1])*2.55,parseFloat(result[2])*2.55,parseFloat(result[3])*2.55];
        if(result=/#([a-fA-F0-9]{
            2
        }
        )([a-fA-F0-9]{
            2
        }
        )([a-fA-F0-9]{
            2
        }
        )/.exec(color))return[parseInt(result[1],16),parseInt(result[2],16),parseInt(result[3],16)];
        if(result=/#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])/.exec(color))return[parseInt(result[1]+result[1],16),parseInt(result[2]+result[2],16),parseInt(result[3]+result[3],16)];
        if(result=/rgba\(0, 0, 0, 0\)/.exec(color))return colors['transparent'];
        return colors[jQuery.trim(color).toLowerCase()]
    }
    /************************************************************\
    *
    \************************************************************/
    function getColor(elem,attr){
        var color;
        do{
            color=jQuery.curCSS(elem,attr);if(color!=''&&color!='transparent'||jQuery.nodeName(elem,"body"))break;attr="backgroundColor"
        }
        while(elem=elem.parentNode);
        return getRGB(color)
    }
    ;
    var colors={
        aqua:[0,255,255],azure:[240,255,255],beige:[245,245,220],black:[0,0,0],blue:[0,0,255],brown:[165,42,42],cyan:[0,255,255],darkblue:[0,0,139],darkcyan:[0,139,139],darkgrey:[169,169,169],darkgreen:[0,100,0],darkkhaki:[189,183,107],darkmagenta:[139,0,139],darkolivegreen:[85,107,47],darkorange:[255,140,0],darkorchid:[153,50,204],darkred:[139,0,0],darksalmon:[233,150,122],darkviolet:[148,0,211],fuchsia:[255,0,255],gold:[255,215,0],green:[0,128,0],indigo:[75,0,130],khaki:[240,230,140],lightblue:[173,216,230],lightcyan:[224,255,255],lightgreen:[144,238,144],lightgrey:[211,211,211],lightpink:[255,182,193],lightyellow:[255,255,224],lime:[0,255,0],magenta:[255,0,255],maroon:[128,0,0],navy:[0,0,128],olive:[128,128,0],orange:[255,165,0],pink:[255,192,203],purple:[128,0,128],violet:[128,0,128],red:[255,0,0],silver:[192,192,192],white:[255,255,255],yellow:[255,255,0],transparent:[255,255,255]
    }
    ;
    jQuery.easing['jswing']=jQuery.easing['swing'];
    jQuery.extend(jQuery.easing,{
        def:'easeOutQuad',swing:function(x,t,b,c,d){
            return jQuery.easing[jQuery.easing.def](x,t,b,c,d)
        }
        ,easeInQuad:function(x,t,b,c,d){
            return c*(t/=d)*t+b
        }
        ,easeOutQuad:function(x,t,b,c,d){
            return-c*(t/=d)*(t-2)+b
        }
        ,easeInOutQuad:function(x,t,b,c,d){
            if((t/=d/2)&lt;
            1)return c/2*t*t+b;
            return-c/2*((--t)*(t-2)-1)+b
        }
        ,easeInCubic:function(x,t,b,c,d){
            return c*(t/=d)*t*t+b
        }
        ,easeOutCubic:function(x,t,b,c,d){
            return c*((t=t/d-1)*t*t+1)+b
        }
        ,easeInOutCubic:function(x,t,b,c,d){
            if((t/=d/2)&lt;
            1)return c/2*t*t*t+b;
            return c/2*((t-=2)*t*t+2)+b
        }
        ,easeInQuart:function(x,t,b,c,d){
            return c*(t/=d)*t*t*t+b
        }
        ,easeOutQuart:function(x,t,b,c,d){
            return-c*((t=t/d-1)*t*t*t-1)+b
        }
        ,easeInOutQuart:function(x,t,b,c,d){
            if((t/=d/2)&lt;
            1)return c/2*t*t*t*t+b;
            return-c/2*((t-=2)*t*t*t-2)+b
        }
        ,easeInQuint:function(x,t,b,c,d){
            return c*(t/=d)*t*t*t*t+b
        }
        ,easeOutQuint:function(x,t,b,c,d){
            return c*((t=t/d-1)*t*t*t*t+1)+b
        }
        ,easeInOutQuint:function(x,t,b,c,d){
            if((t/=d/2)&lt;
            1)return c/2*t*t*t*t*t+b;
            return c/2*((t-=2)*t*t*t*t+2)+b
        }
        ,easeInSine:function(x,t,b,c,d){
            return-c*Math.cos(t/d*(Math.PI/2))+c+b
        }
        ,easeOutSine:function(x,t,b,c,d){
            return c*Math.sin(t/d*(Math.PI/2))+b
        }
        ,easeInOutSine:function(x,t,b,c,d){
            return-c/2*(Math.cos(Math.PI*t/d)-1)+b
        }
        ,easeInExpo:function(x,t,b,c,d){
            return(t==0)?b:c*Math.pow(2,10*(t/d-1))+b
        }
        ,easeOutExpo:function(x,t,b,c,d){
            return(t==d)?b+c:c*(-Math.pow(2,-10*t/d)+1)+b
        }
        ,easeInOutExpo:function(x,t,b,c,d){
            if(t==0)return b;
            if(t==d)return b+c;
            if((t/=d/2)&lt;
            1)return c/2*Math.pow(2,10*(t-1))+b;
            return c/2*(-Math.pow(2,-10*--t)+2)+b
        }
        ,easeInCirc:function(x,t,b,c,d){
            return-c*(Math.sqrt(1-(t/=d)*t)-1)+b
        }
        ,easeOutCirc:function(x,t,b,c,d){
            return c*Math.sqrt(1-(t=t/d-1)*t)+b
        }
        ,easeInOutCirc:function(x,t,b,c,d){
            if((t/=d/2)&lt;
            1)return-c/2*(Math.sqrt(1-t*t)-1)+b;
            return c/2*(Math.sqrt(1-(t-=2)*t)+1)+b
        }
        ,easeInElastic:function(x,t,b,c,d){
            var s=1.70158;
            var p=0;
            var a=c;
            if(t==0)return b;
            if((t/=d)==1)return b+c;
            if(!p)p=d*.3;
            if(a&lt;
            Math.abs(c)){
                a=c;
                var s=p/4
            }
            else var s=p/(2*Math.PI)*Math.asin(c/a);
            return-(a*Math.pow(2,10*(t-=1))*Math.sin((t*d-s)*(2*Math.PI)/p))+b
        }
        ,easeOutElastic:function(x,t,b,c,d){
            var s=1.70158;
            var p=0;
            var a=c;
            if(t==0)return b;
            if((t/=d)==1)return b+c;
            if(!p)p=d*.3;
            if(a&lt;
            Math.abs(c)){
                a=c;
                var s=p/4
            }
            else var s=p/(2*Math.PI)*Math.asin(c/a);
            return a*Math.pow(2,-10*t)*Math.sin((t*d-s)*(2*Math.PI)/p)+c+b
        }
        ,easeInOutElastic:function(x,t,b,c,d){
            var s=1.70158;
            var p=0;
            var a=c;
            if(t==0)return b;
            if((t/=d/2)==2)return b+c;
            if(!p)p=d*(.3*1.5);
            if(a&lt;
            Math.abs(c)){
                a=c;
                var s=p/4
            }
            else var s=p/(2*Math.PI)*Math.asin(c/a);
            if(t&lt;
            1)return-.5*(a*Math.pow(2,10*(t-=1))*Math.sin((t*d-s)*(2*Math.PI)/p))+b;
            return a*Math.pow(2,-10*(t-=1))*Math.sin((t*d-s)*(2*Math.PI)/p)*.5+c+b
        }
        ,easeInBack:function(x,t,b,c,d,s){
            if(s==undefined)s=1.70158;
            return c*(t/=d)*t*((s+1)*t-s)+b
        }
        ,easeOutBack:function(x,t,b,c,d,s){
            if(s==undefined)s=1.70158;
            return c*((t=t/d-1)*t*((s+1)*t+s)+1)+b
        }
        ,easeInOutBack:function(x,t,b,c,d,s){
            if(s==undefined)s=1.70158;
            if((t/=d/2)&lt;
            1)return c/2*(t*t*(((s*=(1.525))+1)*t-s))+b;
            return c/2*((t-=2)*t*(((s*=(1.525))+1)*t+s)+2)+b
        }
        ,easeInBounce:function(x,t,b,c,d){
            return c-jQuery.easing.easeOutBounce(x,d-t,0,c,d)+b
        }
        ,easeOutBounce:function(x,t,b,c,d){
            if((t/=d)&lt;
            (1/2.75)){
                return c*(7.5625*t*t)+b
            }
            else if(t&lt;
            (2/2.75)){
                return c*(7.5625*(t-=(1.5/2.75))*t+.75)+b
            }
            else if(t&lt;
            (2.5/2.75)){
                return c*(7.5625*(t-=(2.25/2.75))*t+.9375)+b
            }
            else{
                return c*(7.5625*(t-=(2.625/2.75))*t+.984375)+b
            }

        }
        ,easeInOutBounce:function(x,t,b,c,d){
            if(t&lt;
            d/2)return jQuery.easing.easeInBounce(x,t*2,0,c,d)*.5+b;
            return jQuery.easing.easeOutBounce(x,t*2-d,0,c,d)*.5+c*.5+b
        }

    }
    )
}
)(jQuery);
(function($){
    $.effects.highlight=function(o){
        return this.queue(function(){
            var el=$(this),props=['backgroundImage','backgroundColor','opacity'];var mode=$.effects.setMode(el,o.options.mode||'show');var color=o.options.color||"#ffff99";var oldColor=el.css("backgroundColor");$.effects.save(el,props);el.show();el.css({
                backgroundImage:'none',backgroundColor:color
            }
            );
            var animation={
                backgroundColor:oldColor
            }
            ;if(mode=="hide")animation['opacity']=0;el.animate(animation,{
                queue:false,duration:o.duration,easing:o.options.easing,complete:function(){
                    if(mode=="hide")el.hide();$.effects.restore(el,props);if(mode=="show"&&jQuery.browser.msie)this.style.removeAttribute('filter');if(o.callback)o.callback.apply(this,arguments);el.dequeue()
                }

            }
            )
        }
        )
    }

}
)(jQuery);
(function($){
    $.effects.pulsate=function(o){
        return this.queue(function(){
            var el=$(this);
            var mode=$.effects.setMode(el,o.options.mode||'show');
            var times=o.options.times||5;
            if(mode=='hide')times--;
            if(el.is(':hidden')){
                el.css('opacity',0);
                el.show();
                el.animate({
                    opacity:1
                }
                ,o.duration/2,o.options.easing);
                times=times-2
            }
            for(var i=0;i&lt;times;i++){
                el.animate({
                    opacity:0
                }
                ,o.duration/2,o.options.easing).animate({
                    opacity:1
                }
                ,o.duration/2,o.options.easing)
            }
            ;
            if(mode=='hide'){
                el.animate({
                    opacity:0
                }
                ,o.duration/2,o.options.easing,function(){
                    el.hide();
                    if(o.callback)o.callback.apply(this,arguments)
                }
                )
            }
            else{
                el.animate({
                    opacity:0
                }
                ,o.duration/2,o.options.easing).animate({
                    opacity:1
                }
                ,o.duration/2,o.options.easing,function(){
                    if(o.callback)o.callback.apply(this,arguments)
                }
                )
            }
            ;
            el.queue('fx',function(){
                el.dequeue()
            }
            );
            el.dequeue()
        }
        )
    }

}
)(jQuery);
(function($){
    $.effects.slide=function(o){
        return this.queue(function(){
            var el=$(this),props=['position','top','left'];
            var mode=$.effects.setMode(el,o.options.mode||'show');
            var direction=o.options.direction||'left';
            $.effects.save(el,props);
            el.show();
            $.effects.createWrapper(el).css({
                overflow:'hidden'
            }
            );
            var ref=(direction=='up'||direction=='down')?'top':'left';
            var motion=(direction=='up'||direction=='left')?'pos':'neg';
            var distance=o.options.distance||(ref=='top'?el.outerHeight({
                margin:true
            }
            ):el.outerWidth({
                margin:true
            }
            ));
            if(mode=='show')el.css(ref,motion=='pos'?-distance:distance);
            var animation={

            }
            ;
            animation[ref]=(mode=='show'?(motion=='pos'?'+=':'-='):(motion=='pos'?'-=':'+='))+distance;
            el.animate(animation,{
                queue:false,duration:o.duration,easing:o.options.easing,complete:function(){
                    if(mode=='hide')el.hide();
                    $.effects.restore(el,props);
                    $.effects.removeWrapper(el);
                    if(o.callback)o.callback.apply(this,arguments);
                    el.dequeue()
                }

            }
            )
        }
        )
    }

}
)(jQuery);
(function($){
    $.ui={
        plugin:{
            add:function(module,option,set){
                var proto=$.ui[module].prototype;for(var i in set){
                    proto.plugins[i]=proto.plugins[i]||[];
                    proto.plugins[i].push([option,set[i]])
                }

            }
            ,call:function(instance,name,args){
                var set=instance.plugins[name];
                if(!set){
                    return
                }
                for(var i=0;i&lt;set.length;i++){
                    if(instance.options[set[i][0]]){
                        set[i][1].apply(instance.element,args)
                    }

                }

            }

        }
        ,cssCache:{

        }
        ,css:function(name){
            if($.ui.cssCache[name]){
                return $.ui.cssCache[name]
            }
            var tmp=$('<div class="ui-gen">').addClass(name).css({
                position:'absolute',top:'-5000px',left:'-5000px',display:'block'
            }
            ).appendTo('body');
            $.ui.cssCache[name]=!!((!(/auto|default/).test(tmp.css('cursor'))||(/^[1-9]/).test(tmp.css('height'))||(/^[1-9]/).test(tmp.css('width'))||!(/none/).test(tmp.css('backgroundImage'))||!(/transparent|rgba\(0, 0, 0, 0\)/).test(tmp.css('backgroundColor'))));
            try{
                $('body').get(0).removeChild(tmp.get(0))
            }
            catch(e){

            }
            return $.ui.cssCache[name]
        }
        ,disableSelection:function(el){
            $(el).attr('unselectable','on').css('MozUserSelect','none')
        }
        ,enableSelection:function(el){
            $(el).attr('unselectable','off').css('MozUserSelect','')
        }
        ,hasScroll:function(e,a){
            var scroll=/top/.test(a||"top")?'scrollTop':'scrollLeft',has=false;if(e[scroll]&gt;0)return true;e[scroll]=1;has=e[scroll]&gt;0?true:false;e[scroll]=0;return has
        }

    }
    ;
    var _remove=$.fn.remove;
    $.fn.remove=function(){
        $("*",this).add(this).triggerHandler("remove");return _remove.apply(this,arguments)
    }
    ;
    /************************************************************\
    *
    \************************************************************/
    function getter(namespace,plugin,method){
        var methods=$[namespace][plugin].getter||[];methods=(typeof methods=="string"?methods.split(/,?\s+/):methods);return($.inArray(method,methods)!=-1)
    }
    $.widget=function(name,prototype){
        var namespace=name.split(".")[0];name=name.split(".")[1];$.fn[name]=function(options){
            var isMethodCall=(typeof options=='string'),args=Array.prototype.slice.call(arguments,1);
            if(isMethodCall&&getter(namespace,name,options)){
                var instance=$.data(this[0],name);
                return(instance?instance[options].apply(instance,args):undefined)
            }
            return this.each(function(){
                var instance=$.data(this,name);
                if(isMethodCall&&instance&&$.isFunction(instance[options])){
                    instance[options].apply(instance,args)
                }
                else if(!isMethodCall){
                    $.data(this,name,new $[namespace][name](this,options))
                }

            }
            )
        }
        ;
        $[namespace][name]=function(element,options){
            var self=this;
            this.widgetName=name;
            this.widgetBaseClass=namespace+'-'+name;
            this.options=$.extend({

            }
            ,$.widget.defaults,$[namespace][name].defaults,options);
            this.element=$(element).bind('setData.'+name,function(e,key,value){
                return self.setData(key,value)
            }
            ).bind('getData.'+name,function(e,key){
                return self.getData(key)
            }
            ).bind('remove',function(){
                return self.destroy()
            }
            );
            this.init()
        }
        ;
        $[namespace][name].prototype=$.extend({

        }
        ,$.widget.prototype,prototype)
    }
    ;
    $.widget.prototype={
        init:function(){

        }
        ,destroy:function(){
            this.element.removeData(this.widgetName)
        }
        ,getData:function(key){
            return this.options[key]
        }
        ,setData:function(key,value){
            this.options[key]=value;
            if(key=='disabled'){
                this.element[value?'addClass':'removeClass'](this.widgetBaseClass+'-disabled')
            }

        }
        ,enable:function(){
            this.setData('disabled',false)
        }
        ,disable:function(){
            this.setData('disabled',true)
        }

    }
    ;
    $.widget.defaults={
        disabled:false
    }
    ;
    $.ui.mouse={
        mouseInit:function(){
            var self=this;
            this.element.bind('mousedown.'+this.widgetName,function(e){
                return self.mouseDown(e)
            }
            );
            if($.browser.msie){
                this._mouseUnselectable=this.element.attr('unselectable');
                this.element.attr('unselectable','on')
            }
            this.started=false
        }
        ,mouseDestroy:function(){
            this.element.unbind('.'+this.widgetName);
            ($.browser.msie&&this.element.attr('unselectable',this._mouseUnselectable))
        }
        ,mouseDown:function(e){
            (this._mouseStarted&&this.mouseUp(e));this._mouseDownEvent=e;var self=this,btnIsLeft=(e.which==1),elIsCancel=(typeof this.options.cancel=="string"?$(e.target).parents().add(e.target).filter(this.options.cancel).length:false);if(!btnIsLeft||elIsCancel||!this.mouseCapture(e)){
                return true
            }
            this._mouseDelayMet=!this.options.delay;
            if(!this._mouseDelayMet){
                this._mouseDelayTimer=setTimeout(function(){
                    self._mouseDelayMet=true
                }
                ,this.options.delay)
            }
            if(this.mouseDistanceMet(e)&&this.mouseDelayMet(e)){
                this._mouseStarted=(this.mouseStart(e)!==false);
                if(!this._mouseStarted){
                    e.preventDefault();
                    return true
                }

            }
            this._mouseMoveDelegate=function(e){
                return self.mouseMove(e)
            }
            ;
            this._mouseUpDelegate=function(e){
                return self.mouseUp(e)
            }
            ;
            $(document).bind('mousemove.'+this.widgetName,this._mouseMoveDelegate).bind('mouseup.'+this.widgetName,this._mouseUpDelegate);
            return false
        }
        ,mouseMove:function(e){
            if($.browser.msie&&!e.button){
                return this.mouseUp(e)
            }
            if(this._mouseStarted){
                this.mouseDrag(e);
                return false
            }
            if(this.mouseDistanceMet(e)&&this.mouseDelayMet(e)){
                this._mouseStarted=(this.mouseStart(this._mouseDownEvent,e)!==false);
                (this._mouseStarted?this.mouseDrag(e):this.mouseUp(e))
            }
            return!this._mouseStarted
        }
        ,mouseUp:function(e){
            $(document).unbind('mousemove.'+this.widgetName,this._mouseMoveDelegate).unbind('mouseup.'+this.widgetName,this._mouseUpDelegate);
            if(this._mouseStarted){
                this._mouseStarted=false;
                this.mouseStop(e)
            }
            return false
        }
        ,mouseDistanceMet:function(e){
            return(Math.max(Math.abs(this._mouseDownEvent.pageX-e.pageX),Math.abs(this._mouseDownEvent.pageY-e.pageY))&gt;
            =this.options.distance)
        }
        ,mouseDelayMet:function(e){
            return this._mouseDelayMet
        }
        ,mouseStart:function(e){

        }
        ,mouseDrag:function(e){

        }
        ,mouseStop:function(e){

        }
        ,mouseCapture:function(e){
            return true
        }

    }
    ;
    $.ui.mouse.defaults={
        cancel:null,distance:1,delay:0
    }

}
)(jQuery);
(function($){
    $.fn.unwrap=$.fn.unwrap||function(expr){
        return this.each(function(){
            $(this).parents(expr).eq(0).after(this).remove()
        }
        )
    }
    ;$.widget("ui.slider",{
        plugins:{

        }
        ,ui:function(e){
            return{
                options:this.options,handle:this.currentHandle,value:this.options.axis!="both"||!this.options.axis?Math.round(this.value(null,this.options.axis=="vertical"?"y":"x")):{
                    x:Math.round(this.value(null,"x")),y:Math.round(this.value(null,"y"))
                }
                ,range:this.getRange()
            }

        }
        ,propagate:function(n,e){
            $.ui.plugin.call(this,n,[e,this.ui()]);this.element.triggerHandler(n=="slide"?n:"slide"+n,[e,this.ui()],this.options[n])
        }
        ,destroy:function(){
            this.element.removeClass("ui-slider ui-slider-disabled").removeData("slider").unbind(".slider");if(this.handle&&this.handle.length){
                this.handle.unwrap("a");this.handle.each(function(){
                    $(this).data("mouse").mouseDestroy()
                }
                )
            }
            this.generated&&this.generated.remove()
        }
        ,setData:function(key,value){
            $.widget.prototype.setData.apply(this,arguments);
            if(/min|max|steps/.test(key)){
                this.initBoundaries()
            }
            if(key=="range"){
                value?this.handle.length==2&&this.createRange():this.removeRange()
            }

        }
        ,init:function(){
            var self=this;this.element.addClass("ui-slider");this.initBoundaries();this.handle=$(this.options.handle,this.element);if(!this.handle.length){
                self.handle=self.generated=$(self.options.handles||[0]).map(function(){
                    var handle=$("&lt;div/&gt;").addClass("ui-slider-handle").appendTo(self.element);if(this.id)handle.attr("id",this.id);return handle[0]
                }
                )
            }
            var handleclass=function(el){
                this.element=$(el);this.element.data("mouse",this);this.options=self.options;this.element.bind("mousedown",function(){
                    if(self.currentHandle)this.blur(self.currentHandle);
                    self.focus(this,1)
                }
                );
                this.mouseInit()
            }
            ;
            $.extend(handleclass.prototype,$.ui.mouse,{
                mouseStart:function(e){
                    return self.start.call(self,e,this.element[0])
                }
                ,mouseStop:function(e){
                    return self.stop.call(self,e,this.element[0])
                }
                ,mouseDrag:function(e){
                    return self.drag.call(self,e,this.element[0])
                }
                ,mouseCapture:function(){
                    return true
                }
                ,trigger:function(e){
                    this.mouseDown(e)
                }

            }
            );
            $(this.handle).each(function(){
                new handleclass(this)
            }
            ).wrap('<a href="javascript:void(0)" style="outline:none;border:none;"></a>').parent().bind('focus',function(e){
                self.focus(this.firstChild)
            }
            ).bind('blur',function(e){
                self.blur(this.firstChild)
            }
            ).bind('keydown',function(e){
                if(!self.options.noKeyboard)self.keydown(e.keyCode,this.firstChild)
            }
            );
            this.element.bind('mousedown.slider',function(e){
                self.click.apply(self,[e]);self.currentHandle.data("mouse").trigger(e);self.firstValue=self.firstValue+1
            }
            );
            $.each(this.options.handles||[],function(index,handle){
                self.moveTo(handle.start,index,true)
            }
            );
            if(!isNaN(this.options.startValue))this.moveTo(this.options.startValue,0,true);
            this.previousHandle=$(this.handle[0]);
            if(this.handle.length==2&&this.options.range)this.createRange()
        }
        ,initBoundaries:function(){
            var element=this.element[0],o=this.options;
            this.actualSize={
                width:this.element.outerWidth(),height:this.element.outerHeight()
            }
            ;
            $.extend(o,{
                axis:o.axis||(element.offsetWidth&lt;
                element.offsetHeight?'vertical':'horizontal'),max:!isNaN(parseInt(o.max,10))?{
                    x:parseInt(o.max,10),y:parseInt(o.max,10)
                }
                :({
                    x:o.max&&o.max.x||100,y:o.max&&o.max.y||100
                }
                ),min:!isNaN(parseInt(o.min,10))?{
                    x:parseInt(o.min,10),y:parseInt(o.min,10)
                }
                :({
                    x:o.min&&o.min.x||0,y:o.min&&o.min.y||0
                }
                )
            }
            );
            o.realMax={
                x:o.max.x-o.min.x,y:o.max.y-o.min.y
            }
            ;
            o.stepping={
                x:o.stepping&&o.stepping.x||parseInt(o.stepping,10)||(o.steps?o.realMax.x/(o.steps.x||parseInt(o.steps,10)||o.realMax.x):0),y:o.stepping&&o.stepping.y||parseInt(o.stepping,10)||(o.steps?o.realMax.y/(o.steps.y||parseInt(o.steps,10)||o.realMax.y):0)
            }

        }
        ,keydown:function(keyCode,handle){
            if(/(37|38|39|40)/.test(keyCode)){
                this.moveTo({
                    x:/(37|39)/.test(keyCode)?(keyCode==37?'-':'+')+'='+this.oneStep("x"):0,y:/(38|40)/.test(keyCode)?(keyCode==38?'-':'+')+'='+this.oneStep("y"):0
                }
                ,handle)
            }

        }
        ,focus:function(handle,hard){
            this.currentHandle=$(handle).addClass('ui-slider-handle-active');
            if(hard)this.currentHandle.parent()[0].focus()
        }
        ,blur:function(handle){
            $(handle).removeClass('ui-slider-handle-active');
            if(this.currentHandle&&this.currentHandle[0]==handle){
                this.previousHandle=this.currentHandle;
                this.currentHandle=null
            }

        }
        ,click:function(e){
            var pointer=[e.pageX,e.pageY];
            var clickedHandle=false;
            this.handle.each(function(){
                if(this==e.target)clickedHandle=true
            }
            );
            if(clickedHandle||this.options.disabled||!(this.currentHandle||this.previousHandle))return;
            if(!this.currentHandle&&this.previousHandle)this.focus(this.previousHandle,true);
            this.offset=this.element.offset();
            this.moveTo({
                y:this.convertValue(e.pageY-this.offset.top-this.currentHandle[0].offsetHeight/2,"y"),x:this.convertValue(e.pageX-this.offset.left-this.currentHandle[0].offsetWidth/2,"x")
            }
            ,null,!this.options.distance)
        }
        ,createRange:function(){
            if(this.rangeElement)return;
            this.rangeElement=$('<div></div>').addClass('ui-slider-range').css({
                position:'absolute'
            }
            ).appendTo(this.element);
            this.updateRange()
        }
        ,removeRange:function(){
            this.rangeElement.remove();
            this.rangeElement=null
        }
        ,updateRange:function(){
            var prop=this.options.axis=="vertical"?"top":"left";var size=this.options.axis=="vertical"?"height":"width";this.rangeElement.css(prop,(parseInt($(this.handle[0]).css(prop),10)||0)+this.handleSize(0,this.options.axis=="vertical"?"y":"x")/2);this.rangeElement.css(size,(parseInt($(this.handle[1]).css(prop),10)||0)-(parseInt($(this.handle[0]).css(prop),10)||0))
        }
        ,getRange:function(){
            return this.rangeElement?this.convertValue(parseInt(this.rangeElement.css(this.options.axis=="vertical"?"height":"width"),10),this.options.axis=="vertical"?"y":"x"):null
        }
        ,handleIndex:function(){
            return this.handle.index(this.currentHandle[0])
        }
        ,value:function(handle,axis){
            if(this.handle.length==1)this.currentHandle=this.handle;if(!axis)axis=this.options.axis=="vertical"?"y":"x";var curHandle=$(handle!=undefined&&handle!==null?this.handle[handle]||handle:this.currentHandle);if(curHandle.data("mouse").sliderValue){
                return parseInt(curHandle.data("mouse").sliderValue[axis],10)
            }
            else{
                return parseInt(((parseInt(curHandle.css(axis=="x"?"left":"top"),10)/(this.actualSize[axis=="x"?"width":"height"]-this.handleSize(handle,axis)))*this.options.realMax[axis])+this.options.min[axis],10)
            }

        }
        ,convertValue:function(value,axis){
            return this.options.min[axis]+(value/(this.actualSize[axis=="x"?"width":"height"]-this.handleSize(null,axis)))*this.options.realMax[axis]
        }
        ,translateValue:function(value,axis){
            return((value-this.options.min[axis])/this.options.realMax[axis])*(this.actualSize[axis=="x"?"width":"height"]-this.handleSize(null,axis))
        }
        ,translateRange:function(value,axis){
            if(this.rangeElement){
                if(this.currentHandle[0]==this.handle[0]&&value&gt;
                =this.translateValue(this.value(1),axis))value=this.translateValue(this.value(1,axis)-this.oneStep(axis),axis);
                if(this.currentHandle[0]==this.handle[1]&&value&lt;
                =this.translateValue(this.value(0),axis))value=this.translateValue(this.value(0,axis)+this.oneStep(axis),axis)
            }
            if(this.options.handles){
                var handle=this.options.handles[this.handleIndex()];
                if(value&lt;
                this.translateValue(handle.min,axis)){
                    value=this.translateValue(handle.min,axis)
                }
                else if(value&gt;
                this.translateValue(handle.max,axis)){
                    value=this.translateValue(handle.max,axis)
                }

            }
            return value
        }
        ,translateLimits:function(value,axis){
            if(value&gt;=this.actualSize[axis=="x"?"width":"height"]-this.handleSize(null,axis))value=this.actualSize[axis=="x"?"width":"height"]-this.handleSize(null,axis);if(value&lt;=0)value=0;return value
        }
        ,handleSize:function(handle,axis){
            return $(handle!=undefined&&handle!==null?this.handle[handle]:this.currentHandle)[0]["offset"+(axis=="x"?"Width":"Height")]
        }
        ,oneStep:function(axis){
            return this.options.stepping[axis]||1
        }
        ,start:function(e,handle){
            var o=this.options;
            if(o.disabled)return false;
            this.actualSize={
                width:this.element.outerWidth(),height:this.element.outerHeight()
            }
            ;
            if(!this.currentHandle)this.focus(this.previousHandle,true);
            this.offset=this.element.offset();
            this.handleOffset=this.currentHandle.offset();
            this.clickOffset={
                top:e.pageY-this.handleOffset.top,left:e.pageX-this.handleOffset.left
            }
            ;
            this.firstValue=this.value();
            this.propagate('start',e);
            this.drag(e,handle);
            return true
        }
        ,stop:function(e){
            this.propagate('stop',e);
            if(this.firstValue!=this.value())this.propagate('change',e);
            this.focus(this.currentHandle,true);
            return false
        }
        ,drag:function(e,handle){
            var o=this.options;
            var position={
                top:e.pageY-this.offset.top-this.clickOffset.top,left:e.pageX-this.offset.left-this.clickOffset.left
            }
            ;if(!this.currentHandle)this.focus(this.previousHandle,true);position.left=this.translateLimits(position.left,"x");position.top=this.translateLimits(position.top,"y");if(o.stepping.x){
                var value=this.convertValue(position.left,"x");value=Math.round(value/o.stepping.x)*o.stepping.x;position.left=this.translateValue(value,"x")
            }
            if(o.stepping.y){
                var value=this.convertValue(position.top,"y");value=Math.round(value/o.stepping.y)*o.stepping.y;position.top=this.translateValue(value,"y")
            }
            position.left=this.translateRange(position.left,"x");position.top=this.translateRange(position.top,"y");if(o.axis!="vertical")this.currentHandle.css({
                left:position.left
            }
            );if(o.axis!="horizontal")this.currentHandle.css({
                top:position.top
            }
            );this.currentHandle.data("mouse").sliderValue={
                x:Math.round(this.convertValue(position.left,"x"))||0,y:Math.round(this.convertValue(position.top,"y"))||0
            }
            ;
            if(this.rangeElement)this.updateRange();
            this.propagate('slide',e);
            return false
        }
        ,moveTo:function(value,handle,noPropagation){
            var o=this.options;
            this.actualSize={
                width:this.element.outerWidth(),height:this.element.outerHeight()
            }
            ;
            if(handle==undefined&&!this.currentHandle&&this.handle.length!=1)return false;
            if(handle==undefined&&!this.currentHandle)handle=0;
            if(handle!=undefined)this.currentHandle=this.previousHandle=$(this.handle[handle]||handle);
            if(value.x!==undefined&&value.y!==undefined){
                var x=value.x,y=value.y
            }
            else{
                var x=value,y=value
            }
            if(x!==undefined&&x.constructor!=Number){
                var me=/^\-\=/.test(x),pe=/^\+\=/.test(x);
                if(me||pe){
                    x=this.value(null,"x")+parseInt(x.replace(me?'=':'+=',''),10)
                }
                else{
                    x=isNaN(parseInt(x,10))?undefined:parseInt(x,10)
                }

            }
            if(y!==undefined&&y.constructor!=Number){
                var me=/^\-\=/.test(y),pe=/^\+\=/.test(y);
                if(me||pe){
                    y=this.value(null,"y")+parseInt(y.replace(me?'=':'+=',''),10)
                }
                else{
                    y=isNaN(parseInt(y,10))?undefined:parseInt(y,10)
                }

            }
            if(o.axis!="vertical"&&x!==undefined){
                if(o.stepping.x)x=Math.round(x/o.stepping.x)*o.stepping.x;x=this.translateValue(x,"x");x=this.translateLimits(x,"x");x=this.translateRange(x,"x");o.animate?this.currentHandle.stop().animate({
                    left:x
                }
                ,(Math.abs(parseInt(this.currentHandle.css("left"))-x))*(!isNaN(parseInt(o.animate))?o.animate:5)):this.currentHandle.css({
                    left:x
                }
                )
            }
            if(o.axis!="horizontal"&&y!==undefined){
                if(o.stepping.y)y=Math.round(y/o.stepping.y)*o.stepping.y;y=this.translateValue(y,"y");y=this.translateLimits(y,"y");y=this.translateRange(y,"y");o.animate?this.currentHandle.stop().animate({
                    top:y
                }
                ,(Math.abs(parseInt(this.currentHandle.css("top"))-y))*(!isNaN(parseInt(o.animate))?o.animate:5)):this.currentHandle.css({
                    top:y
                }
                )
            }
            if(this.rangeElement)this.updateRange();this.currentHandle.data("mouse").sliderValue={
                x:Math.round(this.convertValue(x,"x"))||0,y:Math.round(this.convertValue(y,"y"))||0
            }
            ;
            if(!noPropagation){
                this.propagate('start',null);this.propagate('stop',null);this.propagate('change',null);this.propagate("slide",null)
            }

        }

    }
    );$.ui.slider.getter="value";$.ui.slider.defaults={
        handle:".ui-slider-handle",distance:1,animate:false
    }

}
)(jQuery);


/**
*
*  Base64 encode / decode
*  http://www.webtoolkit.info/
*
**/
(function(){
    window.Base64={
        _keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(input){
            var output="";var chr1,chr2,chr3,enc1,enc2,enc3,enc4;var i=0;input=Base64._utf8_encode(input);while(i&lt;input.length){
                chr1=input.charCodeAt(i++);
                chr2=input.charCodeAt(i++);
                chr3=input.charCodeAt(i++);
                enc1=chr1&gt;
                &gt;
                2;
                enc2=((chr1&3)&lt;
                &lt;
                4)|(chr2&gt;
                &gt;
                4);
                enc3=((chr2&15)&lt;
                &lt;
                2)|(chr3&gt;
                &gt;
                6);
                enc4=chr3&63;
                if(isNaN(chr2)){
                    enc3=enc4=64
                }
                else if(isNaN(chr3)){
                    enc4=64
                }
                output=output+this._keyStr.charAt(enc1)+this._keyStr.charAt(enc2)+this._keyStr.charAt(enc3)+this._keyStr.charAt(enc4)
            }
            return output
        }
        ,decode:function(input){
            var output="";var chr1,chr2,chr3;var enc1,enc2,enc3,enc4;var i=0;input=input.replace(/[^A-Za-z0-9\+\/\=]/g,"");while(i&lt;input.length){
                enc1=this._keyStr.indexOf(input.charAt(i++));
                enc2=this._keyStr.indexOf(input.charAt(i++));
                enc3=this._keyStr.indexOf(input.charAt(i++));
                enc4=this._keyStr.indexOf(input.charAt(i++));
                chr1=(enc1&lt;
                &lt;
                2)|(enc2&gt;
                &gt;
                4);
                chr2=((enc2&15)&lt;
                &lt;
                4)|(enc3&gt;
                &gt;
                2);
                chr3=((enc3&3)&lt;
                &lt;
                6)|enc4;
                output=output+String.fromCharCode(chr1);
                if(enc3!=64){
                    output=output+String.fromCharCode(chr2)
                }
                if(enc4!=64){
                    output=output+String.fromCharCode(chr3)
                }

            }
            output=Base64._utf8_decode(output);
            return output
        }
        ,_utf8_encode:function(string){
            string=string.replace(/\r\n/g,"\n");var utftext="";for(var n=0;n&lt;string.length;n++){
                var c=string.charCodeAt(n);
                if(c&lt;
                128){
                    utftext+=String.fromCharCode(c)
                }
                else if((c&gt;
                127)&&(c&lt;
                2048)){
                    utftext+=String.fromCharCode((c&gt;
                    &gt;
                    6)|192);
                    utftext+=String.fromCharCode((c&63)|128)
                }
                else{
                    utftext+=String.fromCharCode((c&gt;
                    &gt;
                    12)|224);
                    utftext+=String.fromCharCode(((c&gt;
                    &gt;
                    6)&63)|128);
                    utftext+=String.fromCharCode((c&63)|128)
                }

            }
            return utftext
        }
        ,_utf8_decode:function(utftext){
            var string="";var i=0;var c=c1=c2=0;while(i&lt;utftext.length){
                c=utftext.charCodeAt(i);
                if(c&lt;
                128){
                    string+=String.fromCharCode(c);
                    i++
                }
                else if((c&gt;
                191)&&(c&lt;
                224)){
                    c2=utftext.charCodeAt(i+1);
                    string+=String.fromCharCode(((c&31)&lt;
                    &lt;
                    6)|(c2&63));
                    i+=2
                }
                else{
                    c2=utftext.charCodeAt(i+1);
                    c3=utftext.charCodeAt(i+2);
                    string+=String.fromCharCode(((c&15)&lt;
                    &lt;
                    12)|((c2&63)&lt;
                    &lt;
                    6)|(c3&63));
                    i+=3
                }

            }
            return string
        }

    }

}
)();


/*
* OpenX 2.6.4 "Single Page Call" Flash Library - http://www.openx.org
*/
if(typeof org=="undefined"){
    var org=new Object()
}
if(typeof org.openx=="undefined"){
    org.openx=new Object()
}
if(typeof org.openx.util=="undefined"){
    org.openx.util=new Object()
}
if(typeof org.openx.SWFObjectUtil=="undefined"){
    org.openx.SWFObjectUtil=new Object()
}
org.openx.SWFObject=function(_1,id,w,h,_5,c,_7,_8,_9,_a){
    if(!document.getElementById){
        return
    }
    this.DETECT_KEY=_a?_a:"detectflash";this.skipDetect=org.openx.util.getRequestParameter(this.DETECT_KEY);this.params=new Object();this.variables=new Object();this.attributes=new Array();if(_1){
        this.setAttribute("swf",_1)
    }
    if(id){
        this.setAttribute("id",id)
    }
    if(w){
        this.setAttribute("width",w)
    }
    if(h){
        this.setAttribute("height",h)
    }
    if(_5){
        this.setAttribute("version",new org.openx.PlayerVersion(_5.toString().split(".")))
    }
    this.installedVer=org.openx.SWFObjectUtil.getPlayerVersion();
    if(!window.opera&&document.all&&this.installedVer.major&gt;
    7){
        org.openx.SWFObject.doPrepUnload=true
    }
    if(c){
        this.addParam("bgcolor",c)
    }
    var q=_7?_7:"high";this.addParam("quality",q);this.setAttribute("useExpressInstall",false);this.setAttribute("doExpressInstall",false);var _c=(_8)?_8:window.location;this.setAttribute("xiRedirectUrl",_c);this.setAttribute("redirectUrl","");if(_9){
        this.setAttribute("redirectUrl",_9)
    }

}
;
org.openx.SWFObject.prototype={
    useExpressInstall:function(_d){
        this.xiSWFPath=!_d?"expressinstall.swf":_d;this.setAttribute("useExpressInstall",true)
    }
    ,setAttribute:function(_e,_f){
        this.attributes[_e]=_f
    }
    ,getAttribute:function(_10){
        return this.attributes[_10]
    }
    ,addParam:function(_11,_12){
        this.params[_11]=_12
    }
    ,getParams:function(){
        return this.params
    }
    ,addVariable:function(_13,_14){
        this.variables[_13]=_14
    }
    ,getVariable:function(_15){
        return this.variables[_15]
    }
    ,getVariables:function(){
        return this.variables
    }
    ,getVariablePairs:function(){
        var _16=new Array();var key;var _18=this.getVariables();for(key in _18){
            _16[_16.length]=key+"="+_18[key]
        }
        return _16
    }
    ,getSWFHTML:function(){
        var _19="";if(navigator.plugins&&navigator.mimeTypes&&navigator.mimeTypes.length){
            if(this.getAttribute("doExpressInstall")){
                this.addVariable("MMplayerType","PlugIn");this.setAttribute("swf",this.xiSWFPath)
            }
            _19="&lt;embed type=\"application/x-shockwave-flash\" src=\""+this.getAttribute("swf")+"\" width=\""+this.getAttribute("width")+"\" height=\""+this.getAttribute("height")+"\" style=\""+this.getAttribute("style")+"\"";_19+=" id=\""+this.getAttribute("id")+"\" name=\""+this.getAttribute("id")+"\" ";var _1a=this.getParams();for(var key in _1a){
                _19+=[key]+"=\""+_1a[key]+"\" "
            }
            var _1c=this.getVariablePairs().join("&");if(_1c.length&gt;0){
                _19+="flashvars=\""+_1c+"\""
            }
            _19+="/&gt;"
        }
        else{
            if(this.getAttribute("doExpressInstall")){
                this.addVariable("MMplayerType","ActiveX");this.setAttribute("swf",this.xiSWFPath)
            }
            _19="&lt;object id=\""+this.getAttribute("id")+"\" classid=\"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000\" width=\""+this.getAttribute("width")+"\" height=\""+this.getAttribute("height")+"\" style=\""+this.getAttribute("style")+"\"&gt;";_19+="&lt;param name=\"movie\" value=\""+this.getAttribute("swf")+"\" /&gt;";var _1d=this.getParams();for(var key in _1d){
                _19+="&lt;param name=\""+key+"\" value=\""+_1d[key]+"\" /&gt;"
            }
            var _1f=this.getVariablePairs().join("&");if(_1f.length&gt;0){
                _19+="&lt;param name=\"flashvars\" value=\""+_1f+"\" /&gt;"
            }
            _19+="&lt;/object&gt;"
        }
        return _19
    }
    ,write:function(_20){
        if(this.getAttribute("useExpressInstall")){
            var _21=new org.openx.PlayerVersion([6,0,65]);if(this.installedVer.versionIsValid(_21)&&!this.installedVer.versionIsValid(this.getAttribute("version"))){
                this.setAttribute("doExpressInstall",true);this.addVariable("MMredirectURL",escape(this.getAttribute("xiRedirectUrl")));document.title=document.title.slice(0,47)+" - Flash Player Installation";this.addVariable("MMdoctitle",document.title)
            }

        }
        if(this.skipDetect||this.getAttribute("doExpressInstall")||this.installedVer.versionIsValid(this.getAttribute("version"))){
            var n=(typeof _20=="string")?document.getElementById(_20):_20;n.innerHTML=this.getSWFHTML();return true
        }
        else{
            if(this.getAttribute("redirectUrl")!=""){
                document.location.replace(this.getAttribute("redirectUrl"))
            }

        }
        return false
    }

}
;
org.openx.SWFObjectUtil.getPlayerVersion=function(){
    var _23=new org.openx.PlayerVersion([0,0,0]);
    if(navigator.plugins&&navigator.mimeTypes.length){
        var x=navigator.plugins["Shockwave Flash"];if(x&&x.description){
            _23=new org.openx.PlayerVersion(x.description.replace(/([a-zA-Z]|\s)+/,"").replace(/(\s+r|\s+b[0-9]+)/,".").split("."))
        }

    }
    else{
        if(navigator.userAgent&&navigator.userAgent.indexOf("Windows CE")&gt;=0){
            var axo=1;
            var _26=3;
            while(axo){
                try{
                    _26++;axo=new ActiveXObject("ShockwaveFlash.ShockwaveFlash."+_26);_23=new org.openx.PlayerVersion([_26,0,0])
                }
                catch(e){
                    axo=null
                }

            }

        }
        else{
            try{
                var axo=new ActiveXObject("ShockwaveFlash.ShockwaveFlash.7")
            }
            catch(e){
                try{
                    var axo=new ActiveXObject("ShockwaveFlash.ShockwaveFlash.6");_23=new org.openx.PlayerVersion([6,0,21]);axo.AllowScriptAccess="always"
                }
                catch(e){
                    if(_23.major==6){
                        return _23
                    }

                }
                try{
                    axo=new ActiveXObject("ShockwaveFlash.ShockwaveFlash")
                }
                catch(e){

                }

            }
            if(axo!=null){
                _23=new org.openx.PlayerVersion(axo.GetVariable("$version").split(" ")[1].split(","))
            }

        }

    }
    return _23
}
;
org.openx.PlayerVersion=function(_29){
    this.major=_29[0]!=null?parseInt(_29[0]):0;
    this.minor=_29[1]!=null?parseInt(_29[1]):0;
    this.rev=_29[2]!=null?parseInt(_29[2]):0
}
;
org.openx.PlayerVersion.prototype.versionIsValid=function(fv){
    if(this.major&lt;
    fv.major){
        return false
    }
    if(this.major&gt;
    fv.major){
        return true
    }
    if(this.minor&lt;
    fv.minor){
        return false
    }
    if(this.minor&gt;
    fv.minor){
        return true
    }
    if(this.rev&lt;
    fv.rev){
        return false
    }
    return true
}
;
org.openx.util={
    getRequestParameter:function(_2b){
        var q=document.location.search||document.location.hash;
        if(_2b==null){
            return q
        }
        if(q){
            var _2d=q.substring(1).split("&");for(var i=0;i&lt;_2d.length;i++){
                if(_2d[i].substring(0,_2d[i].indexOf("="))==_2b){
                    return _2d[i].substring((_2d[i].indexOf("=")+1))
                }

            }

        }
        return""
    }

}
;
org.openx.SWFObjectUtil.cleanupSWFs=function(){
    var _2f=document.getElementsByTagName("OBJECT");for(var i=_2f.length-1;i&gt;=0;i--){
        _2f[i].style.display="none";for(var x in _2f[i]){
            if(typeof _2f[i][x]=="function"){
                _2f[i][x]=function(){

                }

            }

        }

    }

}
;
if(org.openx.SWFObject.doPrepUnload){
    if(!org.openx.unloadSet){
        org.openx.SWFObjectUtil.prepUnload=function(){
            __flash_unloadHandler=function(){

            }
            ;
            __flash_savedUnloadHandler=function(){

            }
            ;window.attachEvent("onunload",org.openx.SWFObjectUtil.cleanupSWFs)
        }
        ;window.attachEvent("onbeforeunload",org.openx.SWFObjectUtil.prepUnload);org.openx.unloadSet=true
    }

}
if(!document.getElementById&&document.all){
    document.getElementById=function(id){
        return document.all[id]
    }

}
var getQueryParamValue=org.openx.util.getRequestParameter;
var FlashObject=org.openx.SWFObject;
var SWFObject=org.openx.SWFObject;
document.mmm_fo=1;


/*
* Copyright (c) 2007-2009 Id Software, Inc.  All rights reserved.
*/
;
(function($){
    var ql={

    }
    ;
    window.quakelive=ql;
    ql.modules={

    }
    ;
    ql.hooks={

    }
    ;
    ql.skipEndGame=false;
    ql.pathParts=[];
    ql.activeModule=null;
    ql.defaultSiteConfig={
        xmppDomain:'xmpp-dev.idsoftware.com',realm:'qztest',cdnUrl:'http://%LOCATION%',baseUrl:'http://%LOCATION%',staticUrl:'http://%LOCATION%',trackPageViews:false
    }
    ;
    ql.PlayerAvatarPath={
        SM:"/images/players/icon_sm/",MD:"/images/players/icon_md/",LG:"/images/players/icon_lg/",XL:"/images/players/icon_xl/",G_SM:"/images/players/icon_gray_sm/",G_MD:"/images/players/icon_gray_md/",G_LG:"/images/players/icon_gray_lg/",G_XL:"/images/players/icon_gray_xl/"
    }
    ;
    ql.SwapAvatarPath=function(str,neo){
        for(var i in ql.PlayerAvatarPath){
            str=str.replace(ql.PlayerAvatarPath[i],neo)
        }
        return str
    }
    ;
    ql.resource=function(path){
        var lastIndex=path.lastIndexOf('.');
        if(lastIndex!=-1){
            var fileRevision=0;
            if(ql.siteConfig.realm=='qztest'){
                fileRevision=Math.floor(Math.random()*99999999)
            }
            path=path.substring(0,lastIndex)+'_v'+ql.siteConfig.resourceRevision+'.'+fileRevision+path.substring(lastIndex)
        }
        return ql.siteConfig.staticUrl+path
    }
    ;
    ql.CleanupPath=function(path){
        while(path.charAt(0)=='/'||path.charAt(0)=='#'){
            path=path.substring(1)
        }
        while(path.charAt(path.length-1)=='/'){
            path=path.substring(0,path.length-1)
        }
        return path
    }
    ;
    ql.ExtractParams=function(params,startIndex,dest){
        var extractedParams=dest||{

        }
        ;for(var paramIndex=startIndex;paramIndex&lt;params.length;++paramIndex){
            var param=params[paramIndex];
            var paramParts=param.split('=',2);
            extractedParams[paramParts[0]]=paramParts[1]
        }
        return extractedParams
    }
    ;
    ql.MergeParams=function(params){
        var str='';var count=0;for(var paramIndex in params){
            if(count++&gt;
            0){
                str+=';
                '
            }
            str+=paramIndex+'='+params[paramIndex]
        }
        return str
    }
    ;
    ql.AddParam=function(key,value){
        ql.params[key]=value
    }
    ;
    ql.RemoveParam=function(key){
        if(ql.params[key])delete ql.params[key]
    }
    ;
    ql.HasParam=function(key){
        if(ql.params[key])return true;
        else return false
    }
    ;
    ql.GetParam=function(key){
        return ql.params[key]
    }
    ;
    ql.BuildSubPath=function(numArgs){
        var path="";for(var i=0;i&lt;numArgs;++i){
            if(typeof(quakelive.pathParts[i])!='undefined'){
                if(i&gt;
                0){
                    path+="/"
                }
                path+=quakelive.pathParts[i]
            }

        }
        return path
    }
    ;ql.ParsePath=function(forcePath){
        var hash=forcePath||document.location.hash;if(hash.length&gt;0){
            var parts=hash.split(';
            ');
            ql.path=ql.CleanupPath(parts[0]);
            if(parts.length&gt;
            1){
                ql.params=ql.ExtractParams(parts,1)
            }
            else{
                ql.params={

                }

            }

        }
        else{
            ql.path=ql.CleanupPath(document.location.pathname);
            if(!ql.path){
                ql.path='home'
            }
            ql.params={

            }

        }
        ql.location=document.location;
        ql.pathParts=ql.path.split('/')||[];
        ql.prevActiveModule=ql.activeModule;
        if(ql.pathParts.length&gt;
        0){
            ql.activeModule=ql['mod_'+ql.pathParts[0]]
        }
        else{
            ql.activeModule=null
        }
        if(!ql.activeModule&&forcePath!="sorry"){
            ql.ParsePath("sorry")
        }

    }
    ;
    ql.Goto=function(path,args,skipPath){
        if(typeof(window.onbeforeunload)=='function'){
            var msg="Are you sure you want to navigate away from this page?\n\n"+window.onbeforeunload()+"\n\nPress OK to continue, or Cancel to stay on the current page.";if(!confirm(msg)){
                return
            }
            window.onbeforeunload=null
        }
        if(!quakelive.userid&&ReadCookie('QLALU')!==null&&ReadCookie('QLALP')!==null){
            window.location='/user/login_redirect';
            return
        }
        if(quakelive.userid&&path=='register'){
            path='home'
        }
        if(ql.querystring.standby){
            path='register/2b';
            skipPath=false;
            args=null
        }
        ql.HideOverlay();
        ql.ShutdownGame();
        var params={

        }
        ;
        if(args){
            ql.ExtractParams(args.split(';
            '),0,params)
        }
        var hash='#'+path;
        var paramString=ql.MergeParams(params);
        if(paramString){
            hash+=';
            '+paramString
        }
        if(!skipPath){
            ql.SetMonitorPath(hash);
            document.location.hash=hash
        }
        ql.ParsePath(path);
        ql.LoadLayout(ql.activeModule.GetLayout());
        ql.ReloadAds();
        ql.TrackPageView(path);
        ql.ScrollToTop()
    }
    ;
    ql.ScrollToTop=function(){
        window.scrollBy(-99999,-99999)
    }
    ;
    ql.GetLoadingBar=function(){
        return"<div id='loading-outer'><div id='loading-inner'>Loading…<div id='loading-image'></div></div></div>"
    }
    ;
    ql.ConfirmInstallClose=function(){
        var msg="This QUAKE LIVE update is mandatory. Are you sure you want to close?\n\nYou will be logged out of QUAKE LIVE if you proceed.";if(confirm(msg)){
            window.location="/user/logout"
        }

    }
    ;
    ql.Overlay=function(path,onCloseCode,skipHash){
        ql.TrackPageView(path);
        $('#overlay-content').html(ql.GetLoadingBar());
        $.get(path,null,function(data){
            $('#overlay-content').html(data);
            ql.SendModuleMessage('OnOverlayLoaded',path.split('/'))
        }
        );
        $('#overlay-bg').css('display','inline');
        if(!onCloseCode){
            if(ql.querystring.standby){
                onCloseCode='return quakelive.ConfirmInstallClose()'
            }
            else{
                onCloseCode='quakelive.CloseOverlay();
                return false'
            }

        }
        $('#overlay-close').html('<a href="javascript:;" uuups="'+onCloseCode+'"><img src="'+quakelive.resource('/images/site/close.png')+'" class="pngfix" border="0" width="71" height="13"  alt=""></a>');$('#overlay').css('display','inline');if(!skipHash){
            ql.params['overlay']=path;
            var paramString=ql.MergeParams(ql.params);
            if(paramString){
                paramString=';
                '+paramString
            }
            document.location.hash='#'+quakelive.path+paramString
        }

    }
    ;
    ql.OverlayHtml=function(html,onCloseCode){
        $('#overlay-bg').css('display','inline');
        $('#overlay-content').html(html);
        if(!onCloseCode){
            if(ql.querystring.standby){
                onCloseCode='return quakelive.ConfirmInstallClose()'
            }
            else{
                onCloseCode='quakelive.CloseOverlay();
                return false'
            }

        }
        $('#overlay-close').html('<a href="javascript:;" uuups="'+onCloseCode+'"><img src="'+quakelive.resource("/images/site/close.png")+'" class="pngfix" border="0" width="71" height="13"  alt=""></a>');$('#overlay').css('display','inline')
    }
    ;
    ql.OverlayRaw=function(path,onLoad){
        ql.TrackPageView(path);
        $('#overlay-raw').html(ql.GetLoadingBar());
        $.get(path,null,function(data){
            $('#overlay-raw').html(data);
            if(onLoad){
                onLoad()
            }

        }
        );
        $('#overlay-bg').css('display','inline');
        $('#overlay-raw').css('display','inline')
    }
    ;
    ql.CloseOverlay=function(){
        $('#overlay-bg').hide();
        $('#overlay').hide();
        if(ql.path){
            document.location.hash='#'+ql.path;
            ql.ParsePath()
        }

    }
    ;
    ql.CURRENT_LAYOUT=null;
    ql.LAYOUT_CACHE={

    }
    ;
    ql.LoadLayout=function(layout,callback){
        if(ql.CURRENT_LAYOUT==layout){
            ql.OnLayoutLoaded();
            if(callback){
                callback()
            }
            return
        }
        ql.CURRENT_LAYOUT=layout;
        if(!ql.LAYOUT_CACHE[layout]){
            $.ajax({
                type:'get',url:'/layout/'+layout,dataType:'html',success:function(data){
                    ql.LAYOUT_CACHE[layout]=data;
                    ql.LoadLayout_Success(data,layout,callback)
                }
                ,error:ql.LoadLayout_Error
            }
            )
        }
        else{
            ql.LoadLayout_Success(ql.LAYOUT_CACHE[layout],layout,callback)
        }

    }
    ;
    ql.LoadLayout_Error=function(){

    }
    ;
    ql.LoadLayout_Success=function(data,layout,callback){
        $('#body-container').html(data);
        $('body').attr('class','lyt_'+layout);
        ql.OnLayoutLoaded();
        if(callback){
            callback()
        }

    }
    ;
    ql.ConfirmEulaClose=function(){
        if(confirm("You must agree to the license changes in order to continue playing Quake Live. If you do not wish to agree at this time you will be logged out.\n\nAre you sure you want to log out?")){
            window.location.replace('/user/logout')
        }
        else{

        }

    }
    ;
    ql.ConfirmEula=function(){
        $.ajax({
            url:'/legals/accept_eula',type:'post',complete:function(){
                window.location='/user/login_redirect'
            }

        }
        )
    }
    ;
    var lastTime=0;
    ql.Tick=function(){
        lastTime=new Date().getTime()
    }
    ;
    var TIMEOUT=20*60*1000;
    var CHECKTIME=60*1000;
    var Monitor=function(){
        var now=new Date().getTime();
        if(ql.IsGameRunning()){
            lastTime=now
        }
        var delta=now-lastTime;
        if(delta&gt;
        TIMEOUT){
            window.location="/user/logout/session_expired";window.onmousemove=null
        }
        else{
            setTimeout(Monitor,CHECKTIME)
        }

    }
    ;
    ql.OnPluginInstalled=function(){
        if(ql.userstatus=='ACTIVE'){
            ql.ParsePath();
            ql.LoadLayout(ql.activeModule.GetLayout(),function(){
                ql.SendModuleMessage('OnAuthenticatedInit',ql.userinfo);
                window.onmousemove=ql.Tick;
                ql.Tick();
                Monitor()
            }
            )
        }
        else{
            ql.mod_register.OnPluginInstalled()
        }

    }
    ;
    ql.OnPluginOutdated=function(mode,current_version,new_version){
        ql.IsPluginOutdated=true;
        document.location='/?standby='+(new Date()).getTime()+'#register/2b'
    }
    ;
    ql.OnLayoutLoaded=function(){
        ql.LoadPathContent();
        if(ql.params.overlay){
            ql.Overlay(ql.params.overlay)
        }
        ql.SendModuleMessage('OnLayoutLoaded')
    }
    ;
    ql.ShowContent=function(content){
        $('#qlv_contentBody').html(content)
    }
    ;
    ql.GetLoadPath=function(){
        return ql.path+'?'+(new Date().getTime())
    }
    ;
    ql.LoadPathContent=function(){
        $.ajax({
            url:ql.activeModule.GetLoadPath(),mode:'abort',port:'ql_goto',success:ql.LoadPathContent_Success,error:ql.LoadPathContent_Error
        }
        )
    }
    ;
    ql.LoadPathContent_Error=function(xmlHttp,errType,exc){

    }
    ;
    ql.LoadPathContent_Success=function(data){
        var module=ql.GetModule(ql.pathParts[0]);
        module.ShowContent(data);
        if(module.DISPLAY.friends&&!ql.IsGameRunning()){
            ql.mod_friends.MoveTo(module.DISPLAY.friends)
        }
        ql.HideTooltip();
        var selNode=$('#qlv_navBackground .selected');
        var navNode=$('#qlv_navBackground .nav_'+ql.pathParts[0]);
        selNode.toggleClass('selected');
        navNode.toggleClass('selected');
        ql.SendModuleMessage('OnContentLoaded',module)
    }
    ;
    ql.IsGameRunning=function(){
        if(!ql.IsPluginOutdated&&typeof(qz_instance)!='undefined'&&qz_instance.IsGameRunning()){
            return true
        }
        else{
            return false
        }

    }
    ;
    ql.ShutdownGame=function(){
        if(ql.IsGameRunning()){
            qz_instance.SendGameCommand("quit;")
        }

    }
    ;
    ql.RegisterModule=function(name,module){
        if(ql.modules[name]!=null){
            return
        }
        ql['mod_'+name]=ql.modules[name]=module;
        if(!module.DISPLAY){
            module.DISPLAY={
                content:true,friends:"#sidebar",bottom:false
            }

        }
        if(!module.LAYOUT){
            module.LAYOUT='default'
        }
        if(!module.ShowContent){
            module.ShowContent=quakelive.ShowContent
        }
        if(!module.GetLoadPath){
            module.GetLoadPath=quakelive.GetLoadPath
        }
        if(!module.GetLayout){
            var self=module;
            module.GetLayout=function(){
                return self.LAYOUT
            }

        }

    }
    ;
    ql.InitPlugin=function(){
        run_plugin(quakelive.username,quakelive.xaid)
    }
    ;
    ql.Init=function(){
        $('#ajax_loading_indicator').ajaxStart(function(){
            $(this).fadeIn('fast')
        }
        ).ajaxStop(function(){
            $(this).fadeOut('fast')
        }
        );for(var index in ql.siteConfig){

        }
        for(var modName in ql.modules){
            var module=ql.modules[modName];
            if(module.Init){
                module.Init()
            }

        }
        if(ql.userinfo&&parseInt(ql.userinfo.EULA_OUTDATED)){
            ql.ParsePath('legals/eula_updated');
            ql.LoadLayout(ql.activeModule.GetLayout())
        }
        else if(quakelive.userstatus=='UNVERIFIED'){
            ql.ParsePath('register/2a');
            ql.LoadLayout(ql.activeModule.GetLayout())
        }
        else if(quakelive.userid&&!quakelive.querystring.standby){
            ql.InitPlugin()
        }
        else if(quakelive.querystring.standby){
            ql.ParsePath();
            if(ql.path!='register/2b'){
                document.location='/?standby='+quakelive.querystring.standby+'#register/2b';
                ql.ParsePath()
            }
            ql.LoadLayout(ql.activeModule.GetLayout())
        }
        else{
            ql.ParsePath();
            ql.LoadLayout(ql.activeModule.GetLayout())
        }
        ql.StartPathMonitor()
    }
    ;
    ql.SendModuleMessage=function(msg,args,specificModuleName){
        var handled=false;for(var modName in ql.modules){
            if(specificModuleName&&modName!=specificModuleName){
                continue
            }
            var module=ql.modules[modName];
            if(!module[msg]){
                continue
            }
            if(module[msg](args)){
                handled=true
            }

        }
        if(ql.hooks[msg]){
            for(var i in ql.hooks[msg]){
                ql.hooks[msg][i](args)
            }

        }
        return handled
    }
    ;
    ql.GetModule=function(name){
        return ql.modules[name]||{

        }

    }
    ;
    ql.ShowTooltip=function(html){
        overlib(html,VAUTO,FULLHTML)
    }
    ;
    ql.HideTooltip=function(){
        ql.matchtip.HideMatchTooltip(-1);
        ql.statstip.HideStatsTooltip()
    }
    ;
    ql.HideOverlay=function(){
        $('#overlay').hide();
        $('#overlay-bg').hide();
        $('#qlv_OverlayContent').empty();
        quakelive.mod_prefs.CloseOverlay();
        $('.jqmWindow').jqmHide()
    }
    ;
    ql.Eval=function(json){
        try{
            var obj=JSON.parse(json);
            return obj
        }
        catch(e){
            return null
        }

    }
    ;
    ql.IsFirefox3=function(){
        try{
            var matches=navigator.userAgent.match(/Firefox\/([0-9\.]+)/);
            var version=0;
            if(matches.length==2){
                version=parseInt(matches[1]);
                if(version==3){
                    return true
                }

            }
            return false
        }
        catch(e){
            return false
        }

    }
    ;
    ql.IsChrome=function(){
        try{
            var matches=navigator.userAgent.match(/Chrome\/([0-9\.]+)/);
            if(matches&&matches.length==2){
                var version=parseInt(matches[1]);
                if(version&gt;
                =1){
                    return true
                }

            }
            return false
        }
        catch(e){
            return false
        }

    }
    ;
    ql.IsCompatibleBrowser=function(){
        if(ql.siteConfig.realm=='qztest'){
            return true
        }
        if(IsWindows()){
            var version=parseFloat($.browser.version);
            if($.browser.msie){
                if(version&gt;
                =7||navigator.userAgent.match(/MSIE [78]/)){
                    return true
                }

            }
            else if($.browser.mozilla){
                var matches=navigator.userAgent.match(/Firefox\/([0-9\.]+)/);
                var version=0;
                if(matches.length==2){
                    version=parseFloat(matches[1]);
                    if(version&gt;
                    =1.5){
                        return true
                    }

                }

            }

        }
        return false
    }
    ;
    ql.CheckBrowserCompat=function(){
        if(!ql.IsCompatibleBrowser()){
            quakelive.Overlay('home/compat');
            return false
        }
        return true
    }
    ;
    ql.AddHook=function(name,fn){
        if(!ql.hooks[name]){
            ql.hooks[name]=[]
        }
        ql.hooks[name][ql.hooks[name].length]=fn
    }
    ;
    ql.PreloadImages=function(){
        for(var i=0;i&lt;arguments.length;++i){
            $('<img alt="">').attr('src',arguments[i])
        }

    }
    ;
    ql.PreloadClasses=function(){
        for(var i=0;i&lt;arguments.length;++i){
            $('<div>').attr('class',arguments[i])
        }

    }
    ;
    ql.TrackPageView=function(path){
        if(ql.siteConfig.trackPageViews&&typeof(pageTracker)!='undefined'){
            if(path[0]!='/'){
                pageTracker._trackPageview('/'+path)
            }
            else{
                pageTracker._trackPageview(path)
            }

        }

    }
    ;
    ql.querystring={

    }
    ;
    if(document.location.search){
        var search=document.location.search.substring(1);var parts=search.split('&');for(var i=0;i&lt;parts.length;++i){
            var varval=parts[i].split('=',2);
            ql.querystring[varval[0]]=varval[1]
        }

    }
    ;
    ql.Logout=function(){
        document.location='/user/logout'
    }
    ;
    ql.DbGameTypes={
        Dm:0,Duel:1,Single:2,TeamDm:3,ClanArena:4,Ctf:5,Invalid:255
    }
    ;
    var gameTypes=[{
        id:ql.DbGameTypes.Dm,name:'dm',title:'Death Match'
    }
    ,{
        id:ql.DbGameTypes.Duel,name:'duel',title:'Duel'
    }
    ,{
        id:ql.DbGameTypes.Single,name:'single',title:'Single Player'
    }
    ,{
        id:ql.DbGameTypes.TeamDm,name:'tdm',title:'Team DM'
    }
    ,{
        id:ql.DbGameTypes.ClanArena,name:'ca',title:'Clan Arena'
    }
    ,{
        id:ql.DbGameTypes.Ctf,name:'ctf',title:'Capture the Flag'
    }
    ];
    var INVALID_GAMETYPE={
        'id':ql.DbGameTypes.Invalid,'name':'uk','title':'Unknown Gametype'
    }
    ;
    ql.GetGameTypeByID=function(id){
        for(var gtIndex in gameTypes){
            var elem=gameTypes[gtIndex];
            if(elem.id==id){
                return elem
            }

        }
        return INVALID_GAMETYPE
    }
    ;
    ql.GetGameTypeByName=function(name){
        for(var gtIndex in gameTypes){
            var elem=gameTypes[gtIndex];
            if(elem.name==name){
                return elem
            }

        }
        return INVALID_GAMETYPE
    }
    ;
    ql.IsTeamGameType=function(type){
        return(type==ql.DbGameTypes.TeamDm||type==ql.DbGameTypes.ClanArena||type==ql.DbGameTypes.Ctf)
    }
    ;
    ql.ShowLoadingPacifier=function(){
        $('#loading_pacifier').show()
    }
    ;
    ql.HideLoadingPacifier=function(){
        $('#loading_pacifier').hide()
    }
    ;
    var PATH_MONITOR_TIME=100;
    var pathMonInfo={

    }
    ;
    ql.SetMonitorPath=function(path){
        pathMonInfo.lastPath=path
    }
    ;
    ql.StartPathMonitor=function(){
        ql.StopPathMonitor();pathMonInfo.lastPath=document.location.hash;pathMonInfo.thHandle=setTimeout(ql.CheckPathForUpdates,PATH_MONITOR_TIME)
    }
    ;
    ql.StopPathMonitor=function(){
        if(pathMonInfo.thHandle){
            clearTimeout(pathMonInfo.thHandle);
            pathMonInfo.thHandle=0
        }

    }
    ;ql.CheckPathForUpdates=function(){
        if(pathMonInfo.lastPath!=document.location.hash){
            var skipGoto=false;
            if(ql.activeModule.skipMatchingPathUpdates){
                if(ql.activeModule.skipMatchingPathUpdates.test(document.location.hash)){
                    skipGoto=true
                }

            }
            if(!skipGoto){
                quakelive.Goto(document.location.hash.substring(1))
            }
            pathMonInfo.lastPath=document.location.hash
        }
        pathMonInfo.thHandle=setTimeout(ql.CheckPathForUpdates,PATH_MONITOR_TIME)
    }
    ;
    ql.LoadSiteConfig=function(config){
        var siteConfig=$.extend({

        }
        ,ql.defaultSiteConfig,config);for(var index in siteConfig){
            if(typeof(siteConfig[index])!='string'){
                continue
            }
            var str=siteConfig[index];str=str.replace(/%LOCATION%/g,document.location.hostname);var hostParts=document.location.hostname.toLowerCase().split(".");str=str.replace(/%HOSTNAME%/g,hostParts[0]);siteConfig[index]=str
        }
        ql.siteConfig=siteConfig
    }
    ;
    ql.LoadSiteConfig(window.SITECONFIG)
}
)(jQuery);
/************************************************************\
*
\************************************************************/
function EncodeURL(str){
    str=str.replace(/\+/g,"%2B");str=str.replace(/\ /g,"%20");str=str.replace(/\&/g,"%26");str=str.replace(/\?/g,"%3F");str=str.replace(/\//g,"%2F");return str
}
/************************************************************\
*
\************************************************************/
function CreateCookie(name,value,days){
    if(days){
        var date=new Date();date.setTime(date.getTime()+(days*24*60*60*1000));var expires="; expires="+date.toGMTString()
    }
    else var expires="";s=name+"="+value+expires+"; path=/";document.cookie=s
}
/************************************************************\
*
\************************************************************/
function ReadCookie(name){
    var nameEQ=name+"=";var ca=document.cookie.split(';');for(var i=0;i&lt;ca.length;i++){
        var c=ca[i];
        while(c.charAt(0)==' '){
            c=c.substring(1,c.length)
        }
        if(c.indexOf(nameEQ)==0){
            return c.substring(nameEQ.length,c.length)
        }

    }
    return null
}
/************************************************************\
*
\************************************************************/
function EraseCookie(name){
    CreateCookie(name,"",-1)
}
/************************************************************\
*
\************************************************************/
function tt_show(html){
    overlib(html,VAUTO,FULLHTML)
}
/************************************************************\
*
\************************************************************/
function tt_hide(){
    nd()
}
/************************************************************\
*
\************************************************************/
function FormatError(e){
    return'Name:'+e.name+' Num:'+e.number+' Desc:'+e.description+": "+e
}
/************************************************************\
*
\************************************************************/
function StartPacifier(selector,msg){
    $(selector).html("<span class='pacifier-active'>"+msg+"</span>").show()
}
/************************************************************\
*
\************************************************************/
function StopPacifier(selector,msg,timeout){
    $(selector).html("<span class='pacifier-inactive'>"+msg+"</span>");if(timeout){
        setTimeout("ClearPacifier(\""+selector+"\")",timeout)
    }

}
/************************************************************\
*
\************************************************************/
function ClearPacifier(selector){
    $(selector).empty()
}
/************************************************************\
*
\************************************************************/
function StripColors(str){
    if(str==null||str.length==0)return'';return str.replace(/(\^[0-9])/g,"").replace(/\^/g,"")
}
/************************************************************\
*
\************************************************************/
function PlayerIconSet(model,skin){
    this.model=model.toLowerCase();this.skin=skin.toLowerCase();this.modelskin=this.model+'_'+this.skin;this.small=("<img src='"+quakelive.resource("/images/players/icon_sm/"+this.model+"_"+this.skin+".jpg")+"' width='18' height='18'  alt="">");this.medium=("<img src='"+quakelive.resource("/images/players/icon_md/"+this.model+"_"+this.skin+".jpg")+"' width='30' height='30'  alt="">");this.large=("<img src='"+quakelive.resource("/images/players/icon_lg/"+this.model+"_"+this.skin+".jpg")+"' width='43' height='43'  alt="">");this.friend_large=("<img src='"+quakelive.resource("/images/players/icon_xl/"+this.model+"_"+this.skin+".jpg")+"' width='62' height='62'  alt="">")
}
/************************************************************\
*
\************************************************************/
function RemoveArrayIndex(inputArray,removeIndex){
    var newArray=null;
    if(removeIndex==0){
        newArray=inputArray.slice(1)
    }
    else if(removeIndex==inputArray.length-1){
        newArray=inputArray.slice(0,inputArray.length-1)
    }
    else{
        newArray=inputArray.slice(0,removeIndex).concat(inputArray.slice(removeIndex+1))
    }
    return newArray
}
/************************************************************\
*
\************************************************************/
function ECODE_SUCCESS(eCode){
    if(typeof(eCode)=='number'){
        return eCode==0
    }
    else if(typeof(eCode)=='string'){
        return(eCode.length==1&&eCode.charAt(0)=='0')
    }
    else{
        return false
    }

}
;
/************************************************************\
*
\************************************************************/
function FormatNumber(num){
    return""+(1*num)
}
;
/************************************************************\
*
\************************************************************/
function isEmailValid(e){
    var filter=/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{
        2,4
    }
    )+$/;
    if(filter.test(e)){
        return true
    }
    else{
        return false
    }

}
var SECS_IN_MINUTE=60;
var SECS_IN_HOUR=60*60;
var SECS_IN_DAY=86400;
var SECS_IN_WEEK=86400*7;
var SECS_IN_YEAR=86400*365;
var SECS_IN_MONTH=86400*30;
/************************************************************\
*
\************************************************************/
function DecomposeTimeDelta(secs){
    var years=parseInt(secs/SECS_IN_YEAR);
    secs-=years*SECS_IN_YEAR;
    var months=parseInt(secs/SECS_IN_MONTH);
    secs-=months*SECS_IN_MONTH;
    var weeks=parseInt(secs/SECS_IN_WEEK);
    secs-=weeks*SECS_IN_WEEK;
    var days=parseInt(secs/SECS_IN_DAY);
    secs-=days*SECS_IN_DAY;
    var hours=parseInt(secs/SECS_IN_HOUR);
    secs-=hours*SECS_IN_HOUR;
    var mins=parseInt(secs/SECS_IN_MINUTE);
    secs-=mins*SECS_IN_MINUTE;
    var struct={
        'years':years,'months':months,'weeks':weeks,'days':days,'hours':hours,'mins':mins,'secs':secs
    }
    ;
    return struct
}
/************************************************************\
*
\************************************************************/
function FormatDuration(secs){
    var mins=parseInt(secs/60);secs-=mins*60;var timeString="";if(mins&lt;10){
        timeString+="0"
    }
    timeString+=mins;timeString+=":";if(secs&lt;10){
        timeString+="0"
    }
    timeString+=secs;
    return timeString
}
/************************************************************\
*
\************************************************************/
function FormatNumberNicely(num){
    var niceNames=[0,'one','two','three','four','five','six'];
    if(niceNames[num]){
        return niceNames[num]
    }
    else{
        return num
    }

}
/************************************************************\
*
\************************************************************/
function GetFriendlyTimeDelta(delta){
    var det=DecomposeTimeDelta(delta);
    if(det.years&gt;
    0){
        if(det.years==1){
            return'last year'
        }
        else{
            return FormatNumberNicely(det.years)+' years ago'
        }

    }
    if(det.months&gt;
    0){
        if(det.months==1){
            return'last month'
        }
        else{
            return FormatNumberNicely(det.months)+' months ago'
        }

    }
    if(det.weeks&gt;
    0){
        if(det.weeks==1){
            return'last week'
        }
        else{
            return FormatNumberNicely(det.weeks)+' weeks ago'
        }

    }
    if(det.days&gt;
    0){
        if(det.days==1){
            return'yesterday'
        }
        else{
            return FormatNumberNicely(det.days)+' days ago'
        }

    }
    if(det.hours&gt;
    0){
        if(det.hours==1){
            return'1 hour ago'
        }
        else{
            return FormatNumberNicely(det.days)+' hours ago'
        }

    }
    if(det.mins&gt;
    45){
        return'about an hour ago'
    }
    else if(det.mins&gt;
    =25){
        return'about half an hour ago'
    }
    else{
        return'just now'
    }

}
/************************************************************\
*
\************************************************************/
function GetSkillRankInfo(server,userSkill){
    if(!server.ranked){
        return{
            delta:-1,img:quakelive.resource("/images/sf/login/rank_unranked.png"),desc:"<span style='color: #ff0'>Unranked Server</span>",color:"#ffffff"
        }

    }
    if(server.skillTooHigh){
        return{
            delta:-1,img:quakelive.resource("/images/sf/login/rank_x.png"),desc:"<span style='color: #fff'>Your Skill Too High</span>",color:"#ffffff"
        }

    }
    var skillDelta=server.skillDelta;
    var result={
        delta:skillDelta,img:quakelive.resource("/images/sf/login/rank_"+skillDelta+".png")
    }
    ;
    switch(skillDelta){
        case 0:result.desc="Your Skill Higher";result.color="#ffffff";break;case 1:result.desc="Skill Matched";result.color="#39c50a";break;case 2:result.desc="More Challenging";result.color="#f5c276";break;case 3:result.desc="Very Difficult";result.color="#ef422e";break;default:result.desc="Unknown";result.color="#ffffff";break
    }
    return result
}
;
/************************************************************\
*
\************************************************************/
function FormatRank(rank){
    var mod100=rank%100;
    var mod10=rank%10;
    var suffix;
    if(mod10==1&&mod100!=11){
        suffix='st'
    }
    else if(mod10==2&&mod100!=12){
        suffix='nd'
    }
    else if(mod10==3&&mod100!=13){
        suffix='rd'
    }
    else{
        suffix='th'
    }
    return rank+suffix
}
/************************************************************\
*
\************************************************************/
function cloneObject(obj){
    for(i in obj){
        this[i]=obj[i]
    }

}
/************************************************************\
*
\************************************************************/
function FormatTimeDelta(delta){
    if(delta&gt;
    =86400*30){
        num=Math.round(delta/(86400*30));if(num!=1)return num+" months";else return num+" month"
    }
    else if(delta&gt;
    =86400){
        num=Math.round(delta/86400);if(num!=1)return num+" days";else return num+" day"
    }
    else if(delta&gt;
    =3600){
        num=Math.round(delta/3600);if(num!=1)return num+" hours";else return num+" hour"
    }
    else if(delta&gt;
    =60){
        num=Math.round(delta/60);if(num!=1)return num+" minutes";else return num+" minute"
    }
    else{
        return"1 minute"
    }

}
/************************************************************\
*
\************************************************************/
function Clamp(val_in,min_in,max_in){
    if(val_in&lt;
    min_in){
        return min_in
    }
    else if(val_in&gt;
    max_in){
        return max_in
    }
    return val_in
}
/************************************************************\
*
\************************************************************/
function ChangeModelSkin(modelSkin,newSkin){
    var parts=modelSkin.split("_");var result="";for(var i=0;i&lt;parts.length-1;++i){
        result+=parts[i]+"_"
    }
    result+=newSkin;
    return result
}
/************************************************************\
*
\************************************************************/
function FirstDefined(){
    for(var i=0;i&lt;arguments.length;++i){
        if(typeof(arguments[i])!='undefined'){
            return arguments[i]
        }

    }

}
/************************************************************\
*
\************************************************************/
function StripSlashes(str){
    str=str.replace(/\\'/g,'\'');str=str.replace(/\\"/g,'"');str=str.replace(/\\\\/g,'\\');str=str.replace(/\\0/g,'\0');return str
}
;
(function($){
    /************************************************************\
    *
    \************************************************************/
    function idBetaCenter(){
        this.CollapseBar=function(){
            $('#betabar').slideUp('fast',function(){
                $('#betabar_mini').slideDown('fast')
            }
            )
        }
        ;
        this.ExpandBar=function(){
            $('#betabar_mini').slideUp('fast',function(){
                $('#betabar').slideDown('fast')
            }
            )
        }

    }
    window.betacenter=new idBetaCenter()
}
)(jQuery);var version=[0,1,0,225];var CLSID='70A1ADC3-9C2D-4F7C-B189-55C5CF397F1C';var MIME_TYPE='application/x-id-quakelive';var check_version=version.join(".");var check_version_comma=version.join(",");var current_version='NA';var ie_cookie_string='quakelive_upgrade';var qluser='';var qlpass='';var debug_install=false;window.handshakeSuccess=false;/************************************************************\
*
\************************************************************/
function MakeObjectTag(id){
    var str='&lt;obj'+'ect id="'+id+'" class="game_viewport" width="100%" height="100%" ';if($.browser.msie){
        str+='classid="CLSID:'+CLSID+'"'
    }
    else{
        str+='type="'+MIME_TYPE+'"'
    }
    str+=' /&gt;
    ';
    return str
}
/************************************************************\
*
\************************************************************/
function IsVista(){
    return navigator.userAgent.match(/Win(dows)? ?(NT 6.0)/)!=null
}
/************************************************************\
*
\************************************************************/
function IsIE6(){
    return(navigator.userAgent.match(/MSIE 6/)!=null)
}
/************************************************************\
*
\************************************************************/
function IsMacintosh(){
    var userAgent=navigator.userAgent;if(userAgent.indexOf("Mac")!=-1){
        return true
    }
    else{
        return false
    }

}
/************************************************************\
*
\************************************************************/
function IsWindows(){
    return navigator.userAgent.indexOf("Win")!=-1
}
/************************************************************\
*
\************************************************************/
function IsLinux(){
    return navigator.userAgent.indexOf("Linux")!=-1
}
/************************************************************\
*
\************************************************************/
function GetInstallMode(){
    if($.browser.msie){
        return'ie_msi'
    }
    else{
        return'npapi_msi'
    }

}
/************************************************************\
*
\************************************************************/
function doInstall(){
    switch(GetInstallMode()){
        case'npapi_msi':document.location=quakelive.siteConfig.cdnUrl+'/QuakeLiveNP.msi?v='+check_version_comma;
        break;
        case'ie_msi':document.location=quakelive.siteConfig.cdnUrl+'/QuakeLiveIE.msi?v='+check_version_comma;
        break
    }

}
/************************************************************\
*
\************************************************************/
function upgrade(){
    $.ajax({
        url:'/register/upgrade/'+GetInstallMode(),complete:doInstall
    }
    )
}
window.GROUP_MINIMUM=1;
window.GROUP_BASE=2;
window.GROUP_EXTRA=3;
window.GROUP_DONE=4;
/************************************************************\
*
\************************************************************/
function XferStatus(numfiles,size){
    this.groupTitle='Downloading…';
    this.fileName='';
    this.fileIndex=0;
    this.fileSize=0;
    this.transferredAmount=0;
    this.totalTransferredAmount=0;
    this.totalDownloads=numfiles;
    this.totalDownloadsSize=size;
    this.totalDownloadsFrac=0;
    this.totalFrac=0;
    this.frac=0;
    this.group=GROUP_MINIMUM;
    this.currentGroup=GROUP_MINIMUM;
    this.groups=[]
}
qlXfer=new XferStatus(1,0);
/************************************************************\
*
\************************************************************/
function OnDownloadGroup(group,numfiles,size){
    if(!qlXfer.groups[group]){
        qlXfer.fileName='';
        qlXfer.fileIndex=0;
        qlXfer.fileSize=0;
        qlXfer.transferredAmount=0;
        qlXfer.totalTransferredAmount=0;
        qlXfer.totalDownloads=numfiles;
        qlXfer.totalDownloadsSize=size;
        qlXfer.totalDownloadsFrac=0;
        qlXfer.totalFrac=0;
        qlXfer.frac=0;
        qlXfer.currentGroup=group;
        while(qlXfer.group&lt;
        =group){
            switch(qlXfer.group){
                case GROUP_MINIMUM:qlXfer.groupTitle="Minimum Set…";break;case GROUP_BASE:qlXfer.groupTitle="Base Set…";break;case GROUP_EXTRA:qlXfer.groupTitle="Extra Set…";break;case GROUP_DONE:qlXfer.groupTitle="Complete.";SetPluginStatus(QL_STATUS_GAMEREADY);break
            }
            if(qlXfer.group==group){
                quakelive.SendModuleMessage('OnDownloadGroup',{
                    group:qlXfer.group,numfiles:qlXfer.totalDownloads,size:qlXfer.totalDownloadsSize
                }
                )
            }
            else{
                quakelive.SendModuleMessage('OnDownloadGroup',{
                    group:qlXfer.group,numfiles:0,size:0
                }
                )
            }
            qlXfer.groups[qlXfer.group]=true;
            qlXfer.group++
        }

    }

}
/************************************************************\
*
\************************************************************/
function OnDownloadError(error){
    ShowPluginError(error)
}
/************************************************************\
*
\************************************************************/
function XferUpdateStatus(){
    SetPluginStatus(QL_STATUS_GAMEXFERUPDATE,qlXfer)
}
/************************************************************\
*
\************************************************************/
function OnFileXferStarted(fileName,fileSize){
    qlXfer.fileName=fileName;
    qlXfer.fileSize=fileSize;
    qlXfer.transferredAmount=0;
    qlXfer.lastTransferredAmount=0;
    XferUpdateStatus()
}
var RATE_SAMPLE_TIME=1000*10;
/************************************************************\
*
\************************************************************/
function OnFileXferUpdate(transferredAmount){
    var curTime=new Date().getTime();
    if(qlXfer.lastSampleTime){
        qlXfer.sampleBytesAccum+=transferredAmount-qlXfer.lastTransferredAmount;
        if(curTime-qlXfer.lastSampleTime&gt;
        =RATE_SAMPLE_TIME){
            qlXfer.bytesPerSec=(1000*qlXfer.sampleBytesAccum)/(curTime-qlXfer.lastSampleTime);
            qlXfer.lastSampleTime=curTime;
            qlXfer.sampleBytesAccum=0
        }

    }
    else{
        qlXfer.lastSampleTime=curTime;
        qlXfer.sampleBytesAccum=0
    }
    qlXfer.lastTransferredAmount=transferredAmount;
    qlXfer.transferredAmount=transferredAmount;
    if(qlXfer.fileSize&gt;
    0){
        qlXfer.frac=transferredAmount/qlXfer.fileSize
    }
    else{
        qlXfer.frac=0
    }
    if(qlXfer.totalDownloadsSize&gt;
    0){
        qlXfer.totalDownloadsFrac=(transferredAmount+qlXfer.totalTransferredAmount)/qlXfer.totalDownloadsSize
    }
    else{
        qlXfer.totalDownloadsFrac=0
    }
    XferUpdateStatus()
}
/************************************************************\
*
\************************************************************/
function OnFileXferDone(result){
    qlXfer.fileIndex++;
    qlXfer.totalTransferredAmount+=qlXfer.fileSize;
    XferUpdateStatus()
}
/************************************************************\
*
\************************************************************/
function OnHeartbeatTimeout(){

}
/************************************************************\
*
\************************************************************/
function OnHeartbeat(){
    setTimeout(OnHeartbeatTimeout,10)
}
/************************************************************\
*
\************************************************************/
function IM_OnConnected(){
    quakelive.SendModuleMessage('IM_OnConnected')
}
/************************************************************\
*
\************************************************************/
function IM_OnDisconnected(){
    quakelive.SendModuleMessage('IM_OnDisconnected')
}
/************************************************************\
*
\************************************************************/
function VersionCompare(v1,v2){
    var vlist1=v1.split('.');var vlist2=v2.split('.');var max=vlist1.length&gt;vlist2.length?vlist2.length:vlist1.length;for(var i=0;i&lt;max;++i){
        if(vlist1[i]&lt;
        vlist2[i]){
            return-1
        }
        else if(vlist1[i]&gt;
        vlist2[i]){
            return 1
        }

    }
    return 0
}
/************************************************************\
*
\************************************************************/
function OnPluginReady(plugversion){
    handshakeSuccess=true;
    current_version=plugversion;
    var versionCmp=VersionCompare(plugversion,check_version);
    if(versionCmp&lt;
    0){
        newInstall=false;
        SetupInstall()
    }
    else if(versionCmp&gt;
    0){
        ShowError("Newer version of plugin already installed. Please uninstall before your current version before continuing.",0)
    }
    else{
        VerifyGameInstall()
    }

}
/************************************************************\
*
\************************************************************/
function OnGameExit(exitCode){
    quakelive.Tick();
    quakelive.TrackPageView('/ExitGame/'+exitCode);
    if(quakelive.skipEndGame){
        $('#qz_handshake').css('width',1).css('height',1)
    }
    else{
        EndGameMode()
    }
    quakelive.skipEndGame=false;
    quakelive.SendModuleMessage('OnGameExited',exitCode)
}
/************************************************************\
*
\************************************************************/
function OnVidRestart(){
    var cvar=quakelive.cvars.Get('r_inBrowserMode');
    if(cvar.latched){
        if(typeof(quakelive.cvars.screenModes[cvar.value])!='undefined'){
            w=quakelive.cvars.screenModes[cvar.value][0];
            h=quakelive.cvars.screenModes[cvar.value][1]
        }
        else{
            w=800;
            h=600
        }
        StartGameMode(w,h);
        cvar.latched=false
    }

}
/************************************************************\
*
\************************************************************/
function join_server(server_address){
    var cmdString=BuildCmdString();cmdString+="+connect "+server_address;LaunchGame(cmdString)
}
/************************************************************\
*
\************************************************************/
function ShowPluginError(r){
    ShowError(qz_instance.GetErrorCodeString(r)||"Unknown Error",r)
}
/************************************************************\
*
\************************************************************/
function LaunchGame(cmdString,isBotGame){
    if(!isBotGame&&qlXfer.currentGroup&lt;
    GROUP_EXTRA){
        alert('You are downloading required data and must let it finish before you can join an online match.');return
    }
    quakelive.HideTooltip();var w,h;var cvar=quakelive.cvars.Get("r_inBrowserMode");if(typeof(quakelive.cvars.screenModes[cvar.value])!='undefined'){
        w=quakelive.cvars.screenModes[cvar.value][0];
        h=quakelive.cvars.screenModes[cvar.value][1]
    }
    else{
        w=800;
        h=600
    }
    StartGameMode(w,h);
    quakelive.SendModuleMessage('OnGameStarted',isBotGame);
    if(!isBotGame){
        qz_instance.StopDownloads()
    }
    setTimeout(function(){
        var r=qz_instance.LaunchGameWithCmdBuffer(cmdString);
        if(r){
            OnGameExit(666);
            ShowPluginError(r)
        }

    }
    ,100);CheckForPreGameAd();quakelive.ScrollToTop();quakelive.TrackPageView('/LaunchGame'+(isBotGame?'/Bot':'/Live'))
}
/************************************************************\
*
\************************************************************/
function BuildCmdString(){
    var cvar=quakelive.cvars.Get("model");quakelive.cvars.Set("headmodel",cvar.value);quakelive.cvars.Set("team_model",cvar.value);quakelive.cvars.Set("team_headmodel",cvar.value);quakelive.cfgUpdater.StoreConfig(quakelive.cfgUpdater.CFG_BIT_REP);var cmdString="";cmdString+="+set gt_user \""+qluser+"\" ";cmdString+="+set gt_pass \""+qlpass+"\" ";cmdString+="+set gt_realm \""+quakelive.siteConfig.realm+"\" ";return cmdString
}
/************************************************************\
*
\************************************************************/
function HandleCrashReport(){
    if(qz_instance.IsCrashDumpPresent()){
        quakelive.Overlay('home/crashed','CloseCrashReport()',true);
        return true
    }
    return false
}
/************************************************************\
*
\************************************************************/
function CloseCrashReport(){
    qz_instance.CancelBugReport();
    quakelive.CloseOverlay();
    quakelive.OnPluginInstalled()
}
/************************************************************\
*
\************************************************************/
function SubmitCrashReport(){
    if(qz_instance){
        var usermsg=[$('#USERAGENT').val(),$('#IP').val(),$('#URI').val(),$('#crashed-usermsg').val()].join("\n");qz_instance.SubmitBugReport("http://"+document.location.hostname+"/home/crashed",usermsg);alert("Thanks for the report!")
    }
    quakelive.CloseOverlay();
    quakelive.OnPluginInstalled()
}
var gameInstallHandle=null;
/************************************************************\
*
\************************************************************/
function StopGameInstall(){
    if(gameInstallHandle!=null){
        clearTimeout(gameInstallHandle);
        gameInstallHandle=null
    }

}
var verificationAttempt=0;
/************************************************************\
*
\************************************************************/
function VerifyGameInstall(){
    if(typeof(qz_instance)=='undefined'){
        try{
            qz_instance=document.getElementById('qz_instance')
        }
        catch(err){

        }

    }
    try{
        qz_instance.SetDeveloperRoot(quakelive.siteConfig.realm);
        if(quakelive.querystring.standby){
            EraseCookie(ie_cookie_string);
            window.location='/user/login_redirect';
            return
        }
        qz_instance.SetSessionID(ReadCookie('IDQZ')||"",qluser,qlpass);if(!HandleCrashReport()){
            quakelive.OnPluginInstalled()
        }
        verificationAttempt=0
    }
    catch(err){
        if(verificationAttempt++&lt;
        200){
            gameInstallHandle=setTimeout(VerifyGameInstall,1000)
        }
        else{
            EraseCookie(ie_cookie_string);
            window.location='/user/login_redirect'
        }

    }

}
qz_downloadsStarted=false;
quakelive.AddHook('OnContentLoaded',function(){
    if(quakelive.userstatus=='UNVERIFIED'){
        return
    }
    if(typeof(qz_instance)!='undefined'){
        if(!qz_downloadsStarted){
            var r=qz_instance.StartDownloads(quakelive.siteConfig.staticUrl,quakelive.siteConfig.cdnUrl);
            if(r){
                ShowPluginError(r)
            }
            qz_downloadsStarted=true
        }

    }

}
);
/************************************************************\
*
\************************************************************/
function IE_CheckUpgrade(){
    if(!$.browser.msie){
        return
    }
    var ie_reload=ReadCookie(ie_cookie_string);
    if(ie_reload){
        quakelive.ie_resume_install=true;
        EraseCookie(ie_cookie_string)
    }

}
var pluginHandshakeAttempts=0;
/************************************************************\
*
\************************************************************/
function PluginTimeout(){
    if(!handshakeSuccess){
        pluginHandshakeAttempts++;
        if(pluginHandshakeAttempts&lt;
        5){
            setTimeout(PluginTimeout,1000)
        }
        else{
            newInstall=true;
            SetupInstall()
        }

    }

}
/************************************************************\
*
\************************************************************/
function StartHandshake(){
    $('#qz_handshake').html(MakeObjectTag('qz_instance'));
    setTimeout(PluginTimeout,1000)
}
/************************************************************\
*
\************************************************************/
function SetupInstall(){
    var installMode=GetInstallMode();
    quakelive.OnPluginOutdated(installMode,current_version,check_version_comma)
}
var newInstall;
var pluginAlreadyRun=false;
/************************************************************\
*
\************************************************************/
function run_plugin(username,password){
    if(pluginAlreadyRun){
        return
    }
    pluginAlreadyRun=true;
    var install=false;
    newInstall=false;
    qluser=username;
    qlpass=password;
    if($.browser.msie){
        try{
            $('#qz_handshake').html('&lt;object id="qz_instance" width="1" height="1" classid="CLSID:'+CLSID+'" /&gt;')
        }
        catch(e){
            install=true;
            newInstall=true
        }
        if(!install){
            try{
                current_version=qz_instance.GetVersion()
            }
            catch(e){
                install=true;
                newInstall=true
            }
            if(!install){
                if(current_version!=check_version){
                    $('#qz_handshake').empty();
                    install=true
                }
                else{
                    VerifyGameInstall();
                    return
                }

            }

        }

    }
    else if(typeof(window.InstallTrigger)=='object'){
        newInstall=true;
        install=true;
        try{
            for(i=0;i&lt;navigator.mimeTypes.length;++i){
                if(navigator.mimeTypes[i].type==MIME_TYPE){
                    newInstall=false;
                    install=false;
                    break
                }

            }

        }
        catch(e){
            newInstall=true;
            install=true
        }
        if(install){

        }

    }
    if(install==true){
        SetupInstall()
    }
    else{
        StartHandshake()
    }

}
var QL_STATUS_GAMEXFERUPDATE=4;
var QL_STATUS_GAMEREADY=5;
/************************************************************\
*
\************************************************************/
function SetPluginStatus(status,param){
    var bot=$('#qlv_statusBottom');
    if(qlXfer.group==0){
        return
    }
    switch(status){
        case QL_STATUS_GAMEXFERUPDATE:if(!quakelive.IsGameRunning()&&param.totalDownloads&gt;
        0){
            var downloadPercent=parseInt(100*param.totalDownloadsFrac);
            if(downloadPercent&lt;
            0){
                downloadPercent=0
            }
            else if(downloadPercent&gt;
            100){
                downloadPercent=100
            }
            bot.html("Auto-Updating "+(param.fileIndex+1)+"/"+param.totalDownloads+" files… "+downloadPercent+"% Complete");$('.dl-bar-fill').css('width',downloadPercent+"%");$('.dl-percent').text(downloadPercent+"%");var html="<span class='t-hilite'>"+downloadPercent+"% Complete</span>";if(qlXfer.bytesPerSec){
                var xferAmt=param.totalTransferredAmount+param.transferredAmount;
                var secsLeft=parseInt((param.totalDownloadsSize-xferAmt)/(qlXfer.bytesPerSec));
                if(secsLeft&lt;
                0){
                    secsLeft=0
                }
                var minsLeft=parseInt((59+secsLeft)/60);
                if(minsLeft&lt;
                0){
                    minsLeft=0
                }
                var str;
                if(secsLeft&lt;
                60){
                    if(secsLeft==1){
                        str="1 second left"
                    }
                    else{
                        str=secsLeft+" seconds left"
                    }

                }
                else if(minsLeft==1){
                    str="1 minute left"
                }
                else{
                    str=minsLeft+" minutes left"
                }
                html+="   &lt;small class='t-lolite'&gt;"+str+"</small>";$('.dl-timeleft').text(str)
            }
            $('.dl-progress-text').html(html)
        }
        break;
        case QL_STATUS_GAMEREADY:bot.empty();
        break
    }

}
/************************************************************\
*
\************************************************************/
function ShowError(resultMsg,resultCode){
    var html="<div id='error-popup'><img src='"+quakelive.resource('/images/site/erroroccurred.png')+"' width='514' height='24' class='pngfix'  alt=""><p>";html+="<p>"+resultMsg+"</p>";html+="<p>Error Code: "+resultCode+"</p>";html+="<br>Click <b>close</b> to reload the page.</div>";quakelive.OverlayHtml(html,"window.location = '/user/login_redirect'; return false")
}
/************************************************************\
*
\************************************************************/
function OnBeforeUnload(){
    return'Pressing OK will disconnect you from the current server.'
}
var PREGAME_COUNTDOWN_TIME=5;
var POSTGAME_COUNTDOWN_TIME=20;
var POSTGAME_FREQUENCY=2;
var postgame_countdown=0;
var postgame_countdown_handle=null;
var pregame_countdown=0;
var pregame_countdown_handle=null;
/************************************************************\
*
\************************************************************/
function StopPreGameAd(){
    $('.interestitial_ad_container').remove();
    SetGameModeDefaults()
}
/************************************************************\
*
\************************************************************/
function PreGameCountdown(){
    if(--pregame_countdown==0){
        StopPreGameAd();
        return
    }
    $('#qlv_game_mode').find('.action_txt').html(pregame_countdown).unbind("click");pregame_countdown_handle=setTimeout(PreGameCountdown,1000)
}
/************************************************************\
*
\************************************************************/
function CheckForPreGameAd(){
    var self=this;
    quakelive.LoadAds({
        'zone':quakelive.AD_ZONES.pre_game_interstitial,'display':function(ad,adNode,isDefault){
            if(isDefault){
                StopPreGameAd()
            }
            else{
                $('#qz_handshake').css('width','1px').css('height','1px');
                ShowPreGameAd(adNode)
            }

        }

    }
    ,{
        timeout:1000
    }
    )
}
/************************************************************\
*
\************************************************************/
function ShowPreGameAd(adNode){
    var n=$('#qlv_game_mode');n.find('.greeting_txt').html('Quake Live is loading now…');var action=$("<a>").click(EndGameMode);n.find('.action_txt').unbind("click");n.find('.action_img').unbind("click").html("<img src='"+quakelive.resource("/images/lgi/server_details_time.png")+"' width='16' height='16'  alt="">");pregame_countdown=PREGAME_COUNTDOWN_TIME+1;if(pregame_countdown_handle){
        clearTimeout(pregame_countdown_handle);
        pregame_countdown_handle=null
    }
    PreGameCountdown();var ad=$('<div class="interestitial_ad_container pregame_container"><div class="header"></div><div class="content"></div><small>Clicking advertisement will not interrupt Quake Live loading.</small></div>');ad.find(".content").append(adNode);$('#qlv_game_mode_viewport').append(ad)
}
/************************************************************\
*
\************************************************************/
function PostGameCountdown(){
    if(--postgame_countdown==0){
        CreateCookie('QLPGA',1,POSTGAME_FREQUENCY/24.0);
        var self=this;
        quakelive.LoadAds({
            'zone':quakelive.AD_ZONES.post_game_interstitial_tracker,'display':function(ad,adNode,isDefault){

            }

        }
        ,{
            timeout:15000
        }
        );
        $('.interestitial_ad_container').remove();
        ActualEndGameMode();
        return
    }
    $('#qlv_game_mode').find('.action_txt').html('Returning in… '+postgame_countdown).unbind("click");postgame_countdown_handle=setTimeout(PostGameCountdown,1000)
}
/************************************************************\
*
\************************************************************/
function ShowPostGameAd(adNode){
    var n=$('#qlv_game_mode');n.find('.greeting_txt').html('Now a word from our sponsors…');var action=$("<a>").click(EndGameMode);n.find('.action_txt').unbind("click");n.find('.action_img').unbind("click").html("<img src='"+quakelive.resource("/images/lgi/server_details_time.png")+"' width='16' height='16'  alt="">");postgame_countdown=POSTGAME_COUNTDOWN_TIME+1;if(postgame_countdown_handle){
        clearTimeout(postgame_countdown_handle);
        postgame_countdown_handle=null
    }
    PostGameCountdown();var ad=$('<div class="interestitial_ad_container postgame_container"><div class="header"></div><div class="content"></div><small>Clicking advertisement will not interrupt Quake Live loading.</small></div>');ad.find(".content").append(adNode);$('#qlv_game_mode_viewport').append(ad)
}
/************************************************************\
*
\************************************************************/
function ActualEndGameMode(){
    $('#qlv_game_mode').css('top','-9999px');$('#body-container').show();quakelive.mod_friends.MoveTo(quakelive.activeModule.DISPLAY.friends);qz_instance.StartDownloads(quakelive.siteConfig.staticUrl,quakelive.siteConfig.cdnUrl);quakelive.ReloadAds();window.onbeforeunload=null
}
/************************************************************\
*
\************************************************************/
function EndGameMode(){
    quakelive.ShutdownGame();
    $('#qz_handshake').css('height','1px').css('width','1px');
    if(ReadCookie('QLPGA')!==null){
        ActualEndGameMode();
        return
    }
    var self=this;
    quakelive.LoadAds({
        'zone':quakelive.AD_ZONES.post_game_interstitial,'display':function(ad,adNode,isDefault){
            if(isDefault){
                ActualEndGameMode()
            }
            else{
                ShowPostGameAd(adNode)
            }

        }

    }
    ,{
        timeout:1000
    }
    )
}
/************************************************************\
*
\************************************************************/
function SetGameModeDefaults(){
    var n=$('#qlv_game_mode').css('top','0');n.find('.greeting_txt').text('Quake Live');var action=$("<a>").click(EndGameMode);n.find('.action_txt').text('Back to Website').unbind("click").click(EndGameMode);n.find('.action_img').html("<img src='"+quakelive.resource("/images/sf/general/close_xpic.gif")+"' width='18' height='16'  alt="">").unbind("click").click(EndGameMode);$('#qz_handshake').css('height','100%').css('width','100%')
}
/************************************************************\
*
\************************************************************/
function StartGameMode(w,h){
    window.onbeforeunload=OnBeforeUnload;$('#body-container').hide();quakelive.mod_friends.MoveTo('#qlv_game_mode_chatlist');SetGameModeDefaults();var decor_class='';if(w&lt;=640){
        decor_class='game_decoration_640'
    }
    else if(w&lt;
    =800){
        decor_class='game_decoration_800'
    }
    else{
        decor_class='game_decoration_1024'
    }
    var n=$('#qlv_game_mode');
    n.attr('class',decor_class)
}
window.OnCommNotice=function(errorCode,json){
    if(errorCode!=0){
        return
    }
    var msg=quakelive.Eval(json);
    if(!msg){
        return
    }
    switch(msg.MSG_TYPE){
        case'award_notice':if(!quakelive.siteConfig.xyzzy){
            break
        }
        if(msg.MSG_SOURCE.toLowerCase()==quakelive.username.toLowerCase()){
            quakelive.notifier.Notify(quakelive.notifier.SelfAwardEarnedNotice(msg.AWARD_TYPE_ID,msg.AWARD_ID,msg.AWARD_NAME,msg.AWARD_IMG,msg.AWARD_DESC,msg.AWARD_FLAVOR))
        }
        else{
            quakelive.notifier.Notify(quakelive.notifier.FriendAwardEarnedNotice(msg.MSG_SOURCE,msg.AWARD_TYPE_ID,msg.AWARD_ID,msg.AWARD_NAME,msg.AWARD_IMG,msg.AWARD_DESC,msg.AWARD_FLAVOR,msg.PLAYER_MODEL))
        }
        break
    }

}
;
$(document).ready(function(){
    IE_CheckUpgrade()
}
);
if(!this.JSON){
    JSON=function(){
        /************************************************************\
        *
        \************************************************************/
        function f(n){
            return n&lt;
            10?'0'+n:n
        }
        Date.prototype.toJSON=function(key){
            return this.getUTCFullYear()+'-'+f(this.getUTCMonth()+1)+'-'+f(this.getUTCDate())+'T'+f(this.getUTCHours())+':'+f(this.getUTCMinutes())+':'+f(this.getUTCSeconds())+'Z'
        }
        ;
        String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(key){
            return this.valueOf()
        }
        ;var cx=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,escapeable=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,gap,indent,meta={
            '\b':'\\b','\t':'\\t','\n':'\\n','\f':'\\f','\r':'\\r','"':'\\"','\\':'\\\\'
        }
        ,rep;
        /************************************************************\
        *
        \************************************************************/
        function quote(string){
            escapeable.lastIndex=0;return escapeable.test(string)?'"'+string.replace(escapeable,function(a){
                var c=meta[a];
                if(typeof c==='string'){
                    return c
                }
                return'\\u'+('0000'+(+(a.charCodeAt(0))).toString(16)).slice(-4)
            }
            )+'"':'"'+string+'"'
        }
        /************************************************************\
        *
        \************************************************************/
        function str(key,holder){
            var i,k,v,length,mind=gap,partial,value=holder[key];
            if(value&&typeof value==='object'&&typeof value.toJSON==='function'){
                value=value.toJSON(key)
            }
            if(typeof rep==='function'){
                value=rep.call(holder,key,value)
            }
            switch(typeof value){
                case'string':return quote(value);
                case'number':return isFinite(value)?String(value):'null';
                case'boolean':case'null':return String(value);
                case'object':if(!value){
                    return'null'
                }
                gap+=indent;
                partial=[];
                if(typeof value.length==='number'&&!(value.propertyIsEnumerable('length'))){
                    length=value.length;for(i=0;i&lt;length;i+=1){
                        partial[i]=str(i,value)||'null'
                    }
                    v=partial.length===0?'[]':gap?'[\n'+gap+partial.join(',\n'+gap)+'\n'+mind+']':'['+partial.join(',')+']';
                    gap=mind;
                    return v
                }
                if(rep&&typeof rep==='object'){
                    length=rep.length;for(i=0;i&lt;length;i+=1){
                        k=rep[i];
                        if(typeof k==='string'){
                            v=str(k,value);
                            if(v){
                                partial.push(quote(k)+(gap?': ':':')+v)
                            }

                        }

                    }

                }
                else{
                    for(k in value){
                        if(Object.hasOwnProperty.call(value,k)){
                            v=str(k,value);
                            if(v){
                                partial.push(quote(k)+(gap?': ':':')+v)
                            }

                        }

                    }

                }
                v=partial.length===0?'{

                }
                ':gap?'{
                    \n'+gap+partial.join(',\n'+gap)+'\n'+mind+'
                }
                ':'{
                    '+partial.join(',')+'
                }
                ';
                gap=mind;
                return v
            }

        }
        return{
            stringify:function(value,replacer,space){
                var i;
                gap='';
                indent='';
                if(typeof space==='number'){
                    for(i=0;i&lt;space;i+=1){
                        indent+=' '
                    }

                }
                else if(typeof space==='string'){
                    indent=space
                }
                rep=replacer;
                if(replacer&&typeof replacer!=='function'&&(typeof replacer!=='object'||typeof replacer.length!=='number')){
                    throw new Error('JSON.stringify')
                }
                return str('',{
                    '':value
                }
                )
            }
            ,parse:function(text,reviver){
                var j;
                /************************************************************\
                *
                \************************************************************/
                function walk(holder,key){
                    var k,v,value=holder[key];
                    if(value&&typeof value==='object'){
                        for(k in value){
                            if(Object.hasOwnProperty.call(value,k)){
                                v=walk(value,k);
                                if(v!==undefined){
                                    value[k]=v
                                }
                                else{
                                    delete value[k]
                                }

                            }

                        }

                    }
                    return reviver.call(holder,key,value)
                }
                cx.lastIndex=0;
                if(cx.test(text)){
                    text=text.replace(cx,function(a){
                        return'\\u'+('0000'+(+(a.charCodeAt(0))).toString(16)).slice(-4)
                    }
                    )
                }
                if(/^[\],:{

                }
                \s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{
                    4
                }
                )/g,'@').replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,']').replace(/(?:^|:|,)(?:\s*\[)+/g,''))){
                    j=eval('('+text+')');
                    return typeof reviver==='function'?walk({
                        '':j
                    }
                    ,''):j
                }
                throw new SyntaxError('JSON.parse')
            }

        }

    }
    ()
}
(function(){
    /************************************************************\
    *
    \************************************************************/
    function ConfigUpdater(){
        var MIN_DELAY=1;
        var MAX_DELAY=600;
        this.commitData={

        }
        ;
        this.commitHandle=null;
        this.commitDelay=MIN_DELAY;
        this.handlers=[];
        this.Commit=function(delay){
            if(this.commitHandle){
                return
            }
            this.changeCount=0;
            if(delay){
                this.commitDelay=delay;
                var me=this;
                this.commitHandle=setTimeout(function(){
                    me.TryCommit()
                }
                ,1000*delay)
            }
            else{
                this.commitDelay=MIN_DELAY;
                this.TryCommit()
            }

        }
        ;
        this.Commit_Success=function(json){
            if(ECODE_SUCCESS(json.ECODE)){
                this.commitHandle=null;
                this.commitData={

                }

            }
            else{
                this.Commit_Error()
            }

        }
        ;
        this.Commit_Error=function(){
            var me=this;
            this.commitHandle=setTimeout(function(){
                me.TryCommit()
            }
            ,1000*this.commitDelay);
            this.commitDelay*=2;
            if(this.commitDelay&gt;
            MAX_DELAY){
                this.commitDelay=MAX_DELAY
            }

        }
        ;
        this.TryCommit=function(){
            for(var index in this.handlers){
                var handler=this.handlers[index];
                this.changeCount=handler.MergeChangedFields(this.commitData,this.changeCount)
            }
            if(this.changeCount&gt;
            0){
                var me=this;
                $.ajax({
                    type:'post',dataType:'json',url:'/prefs/update',data:this.commitData,success:function(json){
                        me.Commit_Success(json)
                    }
                    ,error:function(){
                        me.Commit_Error()
                    }

                }
                )
            }
            else{
                this.commitHandle=null
            }

        }
        ;
        this.CFG_BIT_HW=1;
        this.CFG_BIT_REP=2;
        this.StoreConfig=function(arg0){
            var cmdString="";for(var index in this.handlers){
                var handler=this.handlers[index];
                cmdString+=handler.GetConfigString(arg0)
            }
            qz_instance.WriteTextFile("/repconfig.cfg",cmdString)
        }
        ;
        this.AddSource=function(src){
            this.handlers[this.handlers.length]=src
        }

    }
    quakelive.cfgUpdater=new ConfigUpdater()
}
)();
/************************************************************\
*
\************************************************************/
function BindInfo(action,name,index){
    this.action=action;
    this.name=name;
    this.index=index;
    this.changed=false;
    this.keys=[undefined,undefined]
}
BindInfo.prototype.Bind=function(keyName,skipFlag){
    if(this.keys[1]){
        this.keys[0]=this.keys[1];
        this.keys[1]=keyName
    }
    else if(this.keys[0]){
        this.keys[1]=keyName
    }
    else{
        this.keys[0]=keyName
    }
    if(!skipFlag){
        this.changed=true
    }

}
;
BindInfo.prototype.Remove=function(keyName){
    if(this.keys[0]==keyName){
        this.keys[0]=this.keys[1];
        this.keys[1]=undefined
    }
    else if(this.keys[1]==keyName){
        this.keys[1]=undefined
    }
    else{

    }

}
;
/************************************************************\
*
\************************************************************/
function BindManager(){
    this.handlers=[]
}
BindManager.prototype.keyLookup={

}
;
BindManager.prototype.actionLookup={

}
;
BindManager.prototype.bindNames={
    'centerview':'Center View','+zoom':'Zoom View','+forward':'Forward','+back':'Back','+moveleft':'Move Left','+moveright':'Move Right','+moveup':'Move Up / Jump','+movedown':'Move Down','+speed':'Silent Walk / Run','+attack':'Shoot','weapnext':'Weapon Next','weapprev':'Weapon Prev','weapon 1':'Gauntlet','weapon 2':'Machinegun','weapon 3':'Shotgun','weapon 4':'Grenade Launcher','weapon 5':'Rocket Launcher','weapon 6':'Lightning Gun','weapon 7':'Railgun','weapon 8':'Plasma Gun','weapon 9':'BFG','weapon 10':'Nailgun','weapon 11':'Prox Launcher','weapon 12':'Chaingun','+scores':'Show Scores','+button2':'Use Item','+button3':'Taunt','messagemode':'Chat','messagemode2':'Team Chat','dropweapon':'Drop Weapon','dropflag':'Drop Flag'
}
;
BindManager.prototype.list=[];
BindManager.prototype.Get=function(action){
    var index=this.actionLookup[action];
    if(index===undefined){
        index=this.list.length;
        this.list[index]=new BindInfo(action,this.bindNames[action]||'user bind',index);
        this.actionLookup[action]=index
    }
    return this.list[index]
}
;
BindManager.prototype.GetByKey=function(keyName){
    var index=this.keyLookup[keyName];
    if(index!==undefined){
        return this.list[index]
    }
    else{
        return null
    }

}
;
BindManager.prototype.Bind=function(userKey,action,skipFlag){
    var keyName=userKey.toLowerCase();
    this.Remove(keyName);
    var bindInfo=this.Get(action);
    bindInfo.Bind(keyName,skipFlag);
    this.keyLookup[keyName]=bindInfo.index
}
;
BindManager.prototype.Remove=function(userKey){
    var keyName=userKey.toLowerCase();
    if(this.keyLookup[keyName]===undefined){
        return
    }
    var bind=this.GetByKey(keyName);
    if(bind){
        bind.Remove(keyName)
    }
    this.keyLookup[keyName]=undefined
}
;
BindManager.prototype.Import=function(importBinds){
    for(var keyName in importBinds){
        this.Bind(keyName,importBinds[keyName],true)
    }

}
;
BindManager.prototype.MergeChangedFields=function(postData,changeCount){
    for(var bindIndex in this.list){
        var bind=this.list[bindIndex];
        if(bind.changed){
            for(var i=0;i&lt;bind.keys.length;++i){
                if(bind.keys[i]){
                    postData['addtype'+changeCount]=1;
                    postData['addkey'+changeCount]=bind.keys[i];
                    postData['addvalue'+changeCount]=bind.action;
                    changeCount++
                }

            }
            bind.changed=false
        }

    }
    return changeCount
}
;
BindManager.prototype.GetConfigString=function(param){
    var cmdString="unbindall\n";for(var bindIndex in this.list){
        var bind=this.list[bindIndex];for(var q=0;q&lt;2;++q){
            if(bind.keys[q]){
                cmdString+="bind "+bind.keys[q]+" \""+bind.action+"\"\n"
            }

        }

    }
    return cmdString
}
;
window.SetBind=window.OnBindChanged=function(name,val){
    quakelive.binds.Bind(name,val);
    quakelive.cfgUpdater.Commit(1)
}
;
quakelive.binds=new BindManager();
quakelive.cfgUpdater.AddSource(quakelive.binds);
(function(){
    var cvars=window.quakelive.cvars={

    }
    ;
    /************************************************************\
    *
    \************************************************************/
    function CvarInfo(name,defaultValue,replicate){
        this.name=name;
        this.replicate=replicate;
        this.defaultValue=defaultValue.toString();
        this.value=this.defaultValue;
        this.changed=false
    }
    CvarInfo.prototype.MarkChanged=function(){
        this.changed=true
    }
    ;
    /************************************************************\
    *
    \************************************************************/
    function CvarManager(){
        this.cvarLookup={

        }
        ;this.cvarList=[new CvarInfo('name','UnnamedPlayer',true),new CvarInfo('clan','',true),new CvarInfo('model','sarge/default',true),new CvarInfo('cg_forceEnemyModel','',true),new CvarInfo('cg_forceTeamModel','',true),new CvarInfo('color1','1',true),new CvarInfo('color2','1',true),new CvarInfo('cg_autoswitch','1',true),new CvarInfo('cg_simpleitems','0',true),new CvarInfo('cg_marks','1',true),new CvarInfo('cg_scorePlums','1',true),new CvarInfo('cg_brassTime','1',true),new CvarInfo('r_dynamiclight','1',true),new CvarInfo('cg_drawCrosshairNames','1',true),new CvarInfo('r_fastsky','0',true),new CvarInfo('cg_forceModel','0',true),new CvarInfo('cg_drawTeamOverlay','1',true),new CvarInfo('cg_drawTimer','0',true),new CvarInfo('cg_noVoiceChats','0',true),new CvarInfo('cg_noVoiceText','0',true),new CvarInfo('cg_noTaunts','0',true),new CvarInfo('cl_freelook','1',true),new CvarInfo('m_pitch','0.022',true),new CvarInfo('cg_drawCrosshair','5',true),new CvarInfo('cl_run','1',true),new CvarInfo('web_configVersion','0',true),new CvarInfo('cg_viewsize','100',true),new CvarInfo('cg_thirdPerson','0',true),new CvarInfo('com_allowConsole','0',true),new CvarInfo('cg_fov','90',true),new CvarInfo('cg_drawtargetnames',1,true),new CvarInfo('cg_playvoicechats',1,true),new CvarInfo('cg_showvoicetext',1,true),new CvarInfo('cg_allowtaunt',1,true),new CvarInfo('cg_newWeaponBar',1,true),new CvarInfo('cg_crosshairSize',24,true),new CvarInfo('cg_kickScale',1,true),new CvarInfo('cg_bob',1,true),new CvarInfo('cg_drawgun',1,true),new CvarInfo('cg_draw2D',1,true),new CvarInfo('r_picmip','0',true),new CvarInfo('m_filter','0',false),new CvarInfo('sensitivity','6',false),new CvarInfo('r_fullscreen','0',false),new CvarInfo('r_mode','-2',false),new CvarInfo('r_inBrowserMode','9',true),new CvarInfo('r_vertexlight','0',true),new CvarInfo('r_fullbright','0',true),new CvarInfo('r_lodbias','0',false),new CvarInfo('r_texturemode','GL_LINEAR_MIPMAP_LINEAR',false),new CvarInfo('r_ext_compressed_textures','0',false),new CvarInfo('r_texturebits','32',false),new CvarInfo('r_gamma','1',false),new CvarInfo('s_volume','0.7',false),new CvarInfo('s_musicvolume','0.4',false),new CvarInfo('s_doppler','1',false),new CvarInfo('rate','25000',false)];for(var i=0;i&lt;this.cvarList.length;++i){
            var cvar=this.cvarList[i];
            if(cvar.value===undefined){
                cvar.value=cvar.defaultValue
            }
            this.cvarLookup[cvar.name.toLowerCase()]=cvar
        }
        this.screenModes={
            0:[320,240],1:[400,300],2:[512,384],3:[640,360],4:[640,400],5:[640,480],6:[800,450],7:[852,480],8:[800,500],9:[800,600],10:[1024,640],11:[1024,576],12:[1024,768],13:[1152,864],14:[1280,720],15:[1280,768],16:[1280,800],17:[1280,1024],18:[1440,900],19:[1600,900],20:[1600,1000],21:[1680,1050],22:[1600,1200],23:[1920,1080],24:[1920,1200],25:[1920,1440],26:[2048,1536],27:[2560,1600]
        }

    }
    CvarManager.prototype.Get=function(name,defaultValue){
        var lookupKey=name.toLowerCase();
        if(this.cvarLookup[lookupKey]===undefined){
            this.Set(name,arguments.length==1?'':defaultValue)
        }
        return this.cvarLookup[lookupKey]
    }
    ;
    CvarManager.prototype.GetIntegerValue=function(name,defaultValue){
        var cvar=this.Get(name,defaultValue||0);
        return parseInt(cvar.value)
    }
    ;
    CvarManager.prototype.Set=function(name,value,skipChanged,skipReplicate){
        var lookupKey=name.toLowerCase();
        var cvar=this.cvarLookup[lookupKey];
        if(cvar===undefined){
            cvar=new CvarInfo(name,value,skipReplicate?false:true);
            this.cvarList[this.cvarList.length]=cvar;
            this.cvarLookup[lookupKey]=cvar
        }
        else{
            cvar.value=value.toString()
        }
        if(!skipChanged){
            cvar.MarkChanged();
            if(name=='model'){
                quakelive.SendModuleMessage('OnModelIconChanged',cvar)
            }

        }
        return cvar
    }
    ;
    CvarManager.prototype.Parse=function(data){
        if(typeof(data)!='string'){
            return
        }
        var regexp=/set.?\s+(\w+)\s+\"?([^\"]*)\"?/;var lines=data.split(/\r?\n/);for(var i=0;i&lt;lines.length;++i){
            var match=lines[i].match(regexp);
            if(match==null||match.length!=3){
                continue
            }
            this.Set(match[1],match[2],true,true)
        }

    }
    ;
    CvarManager.prototype.Import=function(list){
        for(var key in list){
            this.Set(key,list[key],true)
        }

    }
    ;
    CvarManager.prototype.MergeChangedFields=function(postData,changeCount){
        var hasChangedHWCvar=false;for(var cvarIndex in this.cvarList){
            var cvar=this.cvarList[cvarIndex];
            if(cvar.changed){
                if(cvar.replicate){
                    postData['addtype'+changeCount]=2;
                    postData['addkey'+changeCount]=cvar.name;
                    postData['addvalue'+changeCount]=cvar.value;
                    changeCount++
                }
                else{
                    hasChangedHWCvar=true
                }
                cvar.changed=false
            }

        }
        if(hasChangedHWCvar){
            this.StoreHardwareCvars()
        }
        return changeCount
    }
    ;
    CvarManager.prototype.StoreHardwareCvars=function(){
        var str=this.GetConfigString(quakelive.cfgUpdater.CFG_BIT_HW);qz_instance.WriteTextFile("/qzconfig.cfg",str)
    }
    ;
    CvarManager.prototype.GetConfigString=function(arg0){
        var storeHw=(arg0&quakelive.cfgUpdater.CFG_BIT_HW)!=0;var storeRep=(arg0&quakelive.cfgUpdater.CFG_BIT_REP)!=0;var str="";for(var cvarIndex in this.cvarList){
            var cvar=this.cvarList[cvarIndex];
            if((storeRep&&cvar.replicate)||(storeHw&&!cvar.replicate)){
                str+="seta "+cvar.name+" \""+cvar.value+"\"\n"
            }

        }
        return str
    }
    ;
    CvarManager.prototype.LoadHardwareCvars=function(){
        this.Parse(qz_instance.GetHardwareCvars())
    }
    ;
    window.SetCvar=window.OnCvarChanged=function(name,val){
        quakelive.cvars.Set(name,val);
        quakelive.cfgUpdater.Commit(1)
    }
    ;
    quakelive.cvars=new CvarManager();
    quakelive.cfgUpdater.AddSource(quakelive.cvars)
}
)();
(function($){
    /************************************************************\
    *
    \************************************************************/
    function MatchCache(){
        this.cache={

        }
        ;
        this.Add=function(key,value){
            this.cache[key]={
                'value':value,'time':new Date()
            }

        }
        ;
        this.Get=function(key){
            if(this.cache[key]){
                var elapsed=new Date()-this.cache[key].time;
                if(elapsed&lt;
                15000){
                    return this.cache[key].value
                }
                this.Remove(key)
            }
            return null
        }
        ;
        this.Remove=function(key){
            this.cache[key].value=undefined;
            this.cache[key]=undefined
        }

    }
    ;
    var matchCache=new MatchCache();
    var PLAYERLIST_WIDTH=236;
    /************************************************************\
    *
    \************************************************************/
    function MatchTip(){
        var pinnedTip=null;
        this.GetTooltipOffset=function(node,tip){
            var rval={

            }
            ;
            var viewvec={
                left:$(document).scrollLeft(),top:$(document).scrollTop(),right:$(document).scrollLeft()+$('body').width(),bottom:$(document).scrollTop()+$('body').height(),width:$('body').width(),height:$('body').height()
            }
            ;
            var nodevec={
                left:node.offset().left,top:node.offset().top,right:node.offset().left+node.innerWidth(),bottom:node.offset().top+node.innerHeight(),width:node.innerWidth(),height:node.innerHeight()
            }
            ;
            var tipvec={
                width:tip.innerWidth(),height:tip.innerHeight()
            }
            ;
            var ARROW_OFFSET=24;
            var ARROW_SPACING=2;
            var ARROW_HEIGHT=150;
            var HEADER_HEIGHT=28;
            var FOOTER_HEIGHT=28;
            if(nodevec.right+tipvec.width+PLAYERLIST_WIDTH+ARROW_OFFSET&gt;
            viewvec.right){
                rval.left=nodevec.left-tipvec.width-ARROW_OFFSET+4;
                rval.arrowDirection='right';
                rval.arrowLeft=nodevec.left-ARROW_OFFSET;
                tip.orientation='left'
            }
            else{
                rval.left=nodevec.left+nodevec.width+ARROW_OFFSET;
                rval.arrowDirection='left';
                rval.arrowLeft=nodevec.right+ARROW_SPACING;
                tip.orientation='right'
            }
            rval.arrowTop=nodevec.top+nodevec.height/2-(ARROW_HEIGHT/2);
            if(rval.arrowTop&lt;
            viewvec.top){
                var delta=viewvec.top-rval.arrowTop;
                if(delta&gt;
                nodevec.height/2){
                    delta=nodevec.height/2
                }
                rval.arrowTop+=delta
            }
            rval.top=rval.arrowTop-(tipvec.height-HEADER_HEIGHT-FOOTER_HEIGHT)/3;
            if(rval.top+tipvec.height&gt;
            viewvec.bottom){
                rval.top-=(rval.top+tipvec.height)-viewvec.bottom
            }
            rval.arrowLeft=rval.arrowLeft-rval.left;
            rval.arrowTop=rval.arrowTop-rval.top-HEADER_HEIGHT;
            return rval
        }
        ;
        this.DisplayMatchTooltip=function(node,json){
            var tip=$('#lgi_tip');
            if(tip.size()){
                tip.remove()
            }
            var tip=$("<div id='lgi_tip'>"+"<div id='lgi_srv_top'></div>"+"<div id='lgi_srv_fill'>"+"</div>"+"<div id='lgi_srv_bot'></div>"+"</div>");var tipContent=$("<div id='lgi_srv_content'></div>");var skillColor="#fff";if(json&&json.ECODE==0){
                var gametype=quakelive.GetGameTypeByID(json.game_type);var skill=GetSkillRankInfo(json);skillColor=skill.color;var html="<div id='lgi_map_name' class='lgi_big'></div>"+"<div id='lgi_map_group'>"+"<div id='lgi_map'>"+"<div id='lgi_map_pic'></div>"+"<div id='lgi_map_frame' class='frame_skill"+skill.delta+"'></div>"+"<img id='lgi_skill_level' width='21' height='21' src='"+skill.img+"'  alt="">"+"<div id='lgi_skill_level_name' class='name_skill"+skill.delta+"'>"+skill.desc+"</div>"+"</div>"+"<div id='lgi_map_details' class='lgi_medbold'>"+"</div>"+"</div>";tipContent.append(html);tipContent.find('#lgi_map_name').html(json.map_title||"Unknown");tipContent.find('#lgi_map_pic').html("<img src='"+quakelive.resource("/images/levelshots/md/"+json.map.toLowerCase()+".jpg")+"' width='112' height='84' alt='"+json.map_title+"'  alt="">");var tipDetails=tipContent.find('#lgi_map_details');var AddTipDetail=function(txt,img,id){
                    tipDetails.append("&lt;p class='lgi_row'&gt;"+"<img src='"+img+"' width='16' height='16' alt=''  alt="">"+"&lt;span"+(id?" id='"+id+"'":"")+"&gt;"+txt+"</span>"+"<div class='cl'></div>"+"</p>")
                }
                ;AddTipDetail(json.game_type_title,quakelive.resource("/images/gametypes/"+gametype.name+"_sm.png"));var LimitNames={
                    fraglimit:"Frag Limit",capturelimit:"Capture Limit",roundlimit:"Round Limit"
                }
                ;
                var GameTypeLimits={

                }
                ;GameTypeLimits[quakelive.DbGameTypes.Dm]='fraglimit';GameTypeLimits[quakelive.DbGameTypes.TeamDm]='fraglimit';GameTypeLimits[quakelive.DbGameTypes.Single]='fraglimit';GameTypeLimits[quakelive.DbGameTypes.Duel]='fraglimit';GameTypeLimits[quakelive.DbGameTypes.Ctf]='capturelimit';GameTypeLimits[quakelive.DbGameTypes.ClanArena]='roundlimit';AddTipDetail(LimitNames[GameTypeLimits[json.game_type]]+": "+(json[GameTypeLimits[json.game_type]]||"None"),quakelive.resource("/images/lgi/server_details_fraglimit.png"));if(json.g_gamestate=='IN_PROGRESS'){
                    AddTipDetail("Time Left: …",quakelive.resource("/images/lgi/server_details_time.png"),"lgi_match_timeleft")
                }
                else{
                    AddTipDetail("Time Limit: "+json.timelimit,quakelive.resource("/images/lgi/server_details_time.png"))
                }
                var str="Players: "+json.num_clients+" / "+json.max_clients;var img;if(json.num_friends&gt;0){
                    if(json.num_clients&gt;
                    1){
                        str+=" ("+json.num_friends+")"
                    }
                    img=quakelive.resource("/images/lgi/server_details_friends.png")
                }
                else{
                    img=quakelive.resource("/images/lgi/server_details_players.png")
                }
                AddTipDetail(str,img);
                if(json.g_gamestate=='IN_PROGRESS'){
                    var topScores=[];
                    if(quakelive.IsTeamGameType(json.game_type)){
                        var redTeamIndex,blueTeamIndex;
                        if(json.g_redscore&gt;
                        =json.g_bluescore){
                            redTeamIndex=0;
                            blueTeamIndex=1
                        }
                        else{
                            redTeamIndex=1;
                            blueTeamIndex=0
                        }
                        topScores[redTeamIndex]={
                            name:'Red Team',score:json.g_redscore,classes:'red_team_color'
                        }
                        ;
                        topScores[blueTeamIndex]={
                            name:'Blue Team',score:json.g_bluescore,classes:'blue_team_color'
                        }

                    }
                    else{
                        var bestRanks=[99999,99999];var bestRankIndexes=[0,0];for(var i=0;i&lt;json.players.length;++i){
                            var p=json.players[i];for(var bestIndex=0;bestIndex&lt;bestRanks.length;++bestIndex){
                                if(p.rank&lt;
                                bestRanks[bestIndex]&&p.team!=ServerTeam.Spec){
                                    bestRanks[bestIndex]=p.rank;
                                    bestRankIndexes[bestIndex]=i;
                                    break
                                }

                            }

                        }
                        for(var bestIndex=0;bestIndex&lt;bestRanks.length;++bestIndex){
                            var scoreData={

                            }
                            ;
                            var p=json.players[bestRankIndexes[bestIndex]];
                            scoreData.name=p.name;
                            scoreData.clan=p.clan;
                            scoreData.score=p.score;
                            topScores[bestIndex]=scoreData
                        }

                    }
                    if(topScores.length&gt;
                    0){
                        var scoresHtml="";var playerName;tipDetails.append("&lt;p class='lgi_row tc inprogress_txt'&gt;Scoreboard</p>");scoresHtml+="<div class='lgi_scores_section'>";for(var i=0;i&lt;topScores.length;++i){
                            scoresHtml+="<div class='lgi_separator'></div>";scoresHtml+="<div class='lgi_scores_row'>";playerName=(topScores[i].clan?(topScores[i].clan+" "):"")+topScores[i].name;scoresHtml+="<div class='lgi_name'>"+StripColors(playerName)+"</div>";scoresHtml+="<div class='lgi_score'>"+topScores[i].score+"</div>";scoresHtml+="<div class='cl'></div>";scoresHtml+="</div>"
                        }
                        scoresHtml+="</div>";tipContent.append(scoresHtml)
                    }

                }
                else{
                    if(json.players.length&gt;
                    0){
                        tipDetails.append("&lt;p class='lgi_row tc pregame_txt'&gt;Pre-Game Warmup</p>")
                    }
                    else{
                        tipDetails.append("&lt;p class='lgi_row tc pregame_txt'&gt;Waiting For Players</p>")
                    }

                }

            }
            else if(json&&json.ECODE!=0){
                tipContent.append(json.MSG)
            }
            else{
                tipContent.append("<img src='"+quakelive.resource("/images/loader.gif")+"' width='62' height='13' style='padding: 5px'  alt="">")
            }
            tip.find('#lgi_srv_fill').append(tipContent);tip.find('#lgi_srv_bot').html("&lt;p style='color: "+skillColor+"'&gt;Click to Join Game!</p>");tip.appendTo('body');var ofs=this.GetTooltipOffset(node,tip);tip.css('left',ofs.left+'px');tip.css('top',ofs.top+'px');tip.show();if(json&&json.ECODE==0){
                tip.find('#lgi_srv_fill').append("<div id='lgi_arrow_"+ofs.arrowDirection+"' style='position: absolute; left: "+ofs.arrowLeft+"px; top: "+ofs.arrowTop+"px'></div>")
            }
            tip.json=json;
            return tip
        }
        ;
        var ServerTeam={
            Free:0,Red:1,Blue:2,Spec:3
        }
        ;
        this.DisplayMatchPlayers=function(node,json){
            if(!json||json.ECODE!=0){
                return
            }
            var tip=$('#lgi_cli');
            if(tip.size()){
                tip.remove()
            }
            tip=$("<div id='lgi_cli'>"+"<div id='lgi_cli_top'>"+"<div class='lgi_headcol_1'>Player Name</div>"+"<div class='lgi_headcol_2'>Score</div>"+"</div>"+"<div id='lgi_cli_fill'>"+"<div id='lgi_cli_content'></div>"+"</div>"+"<div id='lgi_cli_bot'>"+"</div>"+"</div>");var tipContent=tip.find('#lgi_cli_content');tipContent.empty();if(json.players&&json.players.length&gt;0){
                for(var i=0;i&lt;json.players.length;++i){
                    var p=json.players[i];var name,bare_name,score,classes,modelskin;classes=(i%2)==0?"lgi_med lgi_cli_row_1":"lgi_med lgi_cli_row_2";if(p.friend){
                        classes+=" lgi_is_friend"
                    }
                    else if(p.blocked){
                        classes+=" lgi_is_blocked"
                    }
                    name=p.clan?(StripColors(p.clan)+" "):"";bare_name=StripColors(p.name);name+=bare_name;if(p.bot){
                        name+=" <i>(Bot)</i>";classes+=" lgi_is_bot"
                    }
                    if(p.team==ServerTeam.Spec){
                        score="SPEC"
                    }
                    else{
                        score=p.score
                    }
                    if(p.model){
                        var parts=p.model.toLowerCase().split("/");modelskin=parts[0]+"_";if(parts[1]){
                            modelskin+=parts[1]
                        }
                        else{
                            modelskin+="default"
                        }

                    }
                    else{
                        modelskin="sarge_default"
                    }
                    if(p.team==ServerTeam.Red){
                        modelskin=ChangeModelSkin(modelskin,"red")
                    }
                    else if(p.team==ServerTeam.Blue){
                        modelskin=ChangeModelSkin(modelskin,"blue")
                    }
                    var profileLink="<a href='javascript:;' uuups='quakelive.Goto(\"profile/summary/"+StripColors(p.name)+"\"); return false'>";var dispIcon;if(quakelive.mod_friends.IsBlocked(bare_name)){
                        dispIcon="<img src='"+quakelive.resource("/images/players/icon_gray_sm/"+modelskin+".jpg")+"' class='lgi_bordercolor_"+p.team+"' width='18' height='18'  alt="">"
                    }
                    else{
                        dispIcon="<img src='"+quakelive.resource("/images/players/icon_sm/"+modelskin+".jpg")+"' class='lgi_bordercolor_"+p.team+"' width='18' height='18'  alt="">"
                    }
                    var dispName=name;
                    if(!p.bot){
                        dispIcon=profileLink+dispIcon+"</a>";dispName=profileLink+dispName+"</a>"
                    }
                    tipContent.append("<div class='"+classes+"'>"+"<div class='lgi_cli_col_1'>"+dispIcon+"<span>"+dispName+"</span><div class='cl'></div>"+"</div>"+"<div class='lgi_cli_col_2'>"+score+"</div>"+"</div>")
                }

            }
            else{
                tipContent.append('<center>No Players in Game</center>')
            }
            var viewvec={
                left:$(document).scrollLeft(),top:$(document).scrollTop(),right:$(document).scrollLeft()+$('body').width(),bottom:$(document).scrollTop()+$('body').height(),width:$('body').width(),height:$('body').height()
            }
            ;
            var nodevec={
                left:node.offset().left,top:node.offset().top,right:node.offset().left+node.innerWidth(),bottom:node.offset().top+node.innerHeight(),width:node.innerWidth(),height:node.innerHeight()
            }
            ;
            var tipvec={
                width:PLAYERLIST_WIDTH
            }
            ;
            if(node.orientation=='left'){
                tipvec.left=nodevec.left-tipvec.width
            }
            else{
                tipvec.left=nodevec.right
            }
            tipvec.top=nodevec.top;
            tip.css('left',tipvec.left+'px');
            tip.css('top',tipvec.top+'px');
            tip.appendTo('body');
            tip.show()
        }
        ;
        this.HideMatchTooltip=function(public_id){
            var data=matchCache.Get(public_id);
            if(data&&pinnedTip==data.tip){
                return
            }
            pinnedTip=null;
            $.ajaxAbort('matchdetails');
            $('#lgi_tip').remove().hide();
            $('#lgi_cli').remove().hide();
            if(this.lookupHandle){
                clearTimeout(this.lookupHandle);
                this.lookupHandle=null
            }
            if(this.updateTimeHandle){
                clearTimeout(this.updateTimeHandle);
                this.updateTimeHandle=null
            }

        }
        ;
        this.OnHoverMatchTooltip_Success=function(node,public_id,json){
            var numFriendsOnServer=0;
            var numBlockedOnServer=0;
            if(json.players){
                for(var playerIndex in json.players){
                    var p=json.players[playerIndex];
                    p.score=parseInt(p.score||0);
                    p.bot=parseInt(p.bot||0);
                    p.rank=parseInt(p.rank||0);
                    p.team=parseInt(p.team||0);
                    p.friend=false;
                    p.blocked=false;
                    if(!p.bot){
                        var strippedName=StripColors(p.name);
                        if(quakelive.mod_friends.IsOnRoster(strippedName)){
                            p.friend=true;
                            numFriendsOnServer++
                        }
                        else if(quakelive.mod_friends.IsBlocked(strippedName)){
                            p.blocked=true;
                            numBlockedOnServer++
                        }

                    }

                }
                json.players.sort(function(a,b){
                    if(a.friend==b.friend){
                        if(a.blocked==b.blocked){
                            if(a.bot==b.bot){
                                if(a.team==b.team){
                                    if(a.score&lt;
                                    b.score){
                                        return 1
                                    }
                                    else if(a.score&gt;
                                    b.score){
                                        return-1
                                    }
                                    else{
                                        return 0
                                    }

                                }
                                else{
                                    if(a.team&lt;
                                    b.team){
                                        return-1
                                    }
                                    else if(a.team&gt;
                                    b.team){
                                        return 1
                                    }
                                    else{
                                        return 0
                                    }

                                }

                            }
                            else{
                                if(a.bot&lt;
                                b.bot){
                                    return-1
                                }
                                else if(a.bot&gt;
                                b.bot){
                                    return 1
                                }
                                else{
                                    return 0
                                }

                            }

                        }
                        else if(a.blocked){
                            return 1
                        }
                        else{
                            return-1
                        }

                    }
                    else if(a.friend){
                        return-1
                    }
                    else{
                        return 1
                    }

                }
                )
            }
            json.num_friends=numFriendsOnServer;
            json.num_blocked=numBlockedOnServer;
            var tip=this.DisplayMatchTooltip(node,json);
            if(json.timelimit&gt;
            0){
                var self=this;
                var levelstarttime=json.g_levelstarttime;
                TimeUpdater=function(){
                    var now=parseInt(new Date().getTime()/1000);
                    var secsLeft=(json.timelimit*60)-(now-levelstarttime);
                    if(secsLeft&gt;
                    0){
                        var minsLeft=parseInt(secsLeft/60);
                        if(minsLeft&lt;
                        10){
                            minsLeft="0"+minsLeft
                        }
                        secsLeft-=minsLeft*60;
                        if(secsLeft&lt;
                        10){
                            secsLeft="0"+secsLeft
                        }
                        $('#lgi_match_timeleft').text("Time Left: "+minsLeft+":"+secsLeft);self.updateTimeHandle=setTimeout(TimeUpdater,1000)
                    }
                    else{
                        $('#lgi_match_timeleft').text("Time Left: None")
                    }

                }
                ;
                TimeUpdater()
            }
            return tip
        }
        ;
        this.OnHoverMatchTooltip_Error=function(){
            this.DisplayMatchTooltip(node,{
                'ECODE':-1,'MSG':'Unable to load match data'
            }
            )
        }
        ;
        this.lookupHandle=null;
        this.OnHoverMatchTooltip=function(node,public_id){
            if(pinnedTip){
                var data=matchCache.Get(public_id);
                if(data&&pinnedTip==data.tip){
                    return
                }

            }
            pinnedTip=null;
            this.HideMatchTooltip(-1);
            this.DisplayMatchTooltip(node,null);
            var cachedData=matchCache.Get(public_id);
            if(!cachedData){
                var self=this;
                if(this.lookupHandle){
                    clearTimeout(this.lookupHandle);
                    this.lookupHandle=null
                }
                this.lookupHandle=setTimeout(function(){
                    $.ajax({
                        url:'/home/matchdetails/'+public_id,dataType:'json',mode:'abort',port:'matchdetails',success:function(json){
                            var tip=self.OnHoverMatchTooltip_Success(node,public_id,json);
                            var data={
                                'json':json,'tip':tip
                            }
                            ;
                            matchCache.Add(public_id,data)
                        }
                        ,error:self.OnHoverMatchTooltip_Error
                    }
                    )
                }
                ,250)
            }
            else{
                var tip=this.OnHoverMatchTooltip_Success(node,public_id,cachedData.json);
                cachedData.tip=tip
            }

        }
        ;
        this.PinMatchTooltip=function(tip,json){
            if(!json.skillTooHigh){
                $('#lgi_map').append("<div id='lgi_play'><a href='javascript:;' uuups='quakelive.matchtip.JoinServer(); return false' class='lgi_play_btn'></a></div>")
            }
            $('#lgi_srv_top').append("<div id='lgi_srv_close'><a href='javascript:;' uuups='quakelive.matchtip.HideMatchTooltip(-1); return false' class='lgi_btn_close'></a></div>");pinnedTip=tip
        }
        ;
        this.OnClickMatchTooltip=function(node,public_id){
            var data=matchCache.Get(public_id);
            if(data&&data.tip!=pinnedTip){
                this.PinMatchTooltip(data.tip,data.json);
                this.DisplayMatchPlayers(data.tip,data.json)
            }

        }
        ;
        this.OnDblClickMatchTooltip=function(node,public_id){
            var data=matchCache.Get(public_id);
            if(data){
                if(data.tip!=pinnedTip){
                    this.PinMatchTooltip(data.tip,data.json)
                }
                quakelive.matchtip.JoinServer()
            }

        }
        ;
        this.BindMatchTooltip=function(node,public_id){
            node.unbind("hover");node.unbind("click");node.unbind("dblclick");var me=this;node.click(function(event){
                me.OnClickMatchTooltip(node,public_id);
                event.preventDefault()
            }
            );
            node.dblclick(function(event){
                me.OnDblClickMatchTooltip(node,public_id)
            }
            );
            node.hover(function(){
                me.OnHoverMatchTooltip(node,public_id)
            }
            ,function(){
                me.HideMatchTooltip(public_id)
            }
            )
        }
        ;
        this.JoinServer=function(){
            if(!pinnedTip){
                return
            }
            if(quakelive.IsGameRunning()){
                qz_instance.SendGameCommand("connect "+pinnedTip.json.host_address)
            }
            else{
                join_server(pinnedTip.json.host_address)
            }
            this.HideMatchTooltip(-1)
        }

    }
    quakelive.matchtip=new MatchTip()
}
)(jQuery);
(function($){
    /************************************************************\
    *
    \************************************************************/
    function StatsCache(){
        this.cache={

        }
        ;
        this.Add=function(key,value){
            this.cache[key]={
                'value':value,'time':new Date()
            }

        }
        ;
        this.Get=function(key){
            if(this.cache[key]){
                var elapsed=new Date()-this.cache[key].time;
                if(elapsed&lt;
                5*60000){
                    return this.cache[key].value
                }
                this.Remove(key)
            }
            return null
        }
        ;
        this.Remove=function(key){
            this.cache[key].value=undefined;
            this.cache[key]=undefined
        }

    }
    ;
    var statsCache=new StatsCache();
    /************************************************************\
    *
    \************************************************************/
    function StatsTip(){
        this.GetTooltipOffset=function(node,tip){
            var rval={

            }
            ;
            var viewvec={
                left:$(document).scrollLeft(),top:$(document).scrollTop(),right:$(document).scrollLeft()+$('body').width(),bottom:$(document).scrollTop()+$('body').height(),width:$('body').width(),height:$('body').height()
            }
            ;
            var nodevec={
                left:node.offset().left,top:node.offset().top,right:node.offset().left+node.innerWidth(),bottom:node.offset().top+node.innerHeight(),width:node.width(),height:node.height()
            }
            ;
            var tipvec={
                width:tip.innerWidth(),height:tip.innerHeight()
            }
            ;
            if(nodevec.right+tipvec.width&gt;
            viewvec.right){
                rval.left=nodevec.left-tipvec.width
            }
            else{
                rval.left=nodevec.left+nodevec.width
            }
            rval.top=nodevec.top-tipvec.height/3;
            if(rval.top+tipvec.height&gt;
            viewvec.bottom){
                rval.top-=(rval.top+tipvec.height)-viewvec.bottom
            }
            return rval
        }
        ;
        this.GetVersusFrame=function(gameType,player1,player2,team1,team2){
            var inner=$(quakelive.mod_stats.TPL_MATCH_VSCONTAINER);var gameTypeDir=(player1.TEAM?player1.TEAM.toLowerCase()+'_lg':'lg');var models=[player1.PLAYER_MODEL||'sarge_default',(player2&&player2.PLAYER_MODEL)?player2.PLAYER_MODEL:'sarge_default'];var players=[player1,player2];var teams=[team1,team2];inner.find('.gameTypeIcon').html('<img src="'+quakelive.resource('/images/gametypes/'+gameTypeDir+'/'+gameType.toLowerCase()+'.png')+'" width="75" height="75"  alt="">');for(var i=0;i&lt;2;++i){
                var player=players[i];
                var team=teams[i];
                var model=models[i];
                var ordinal=i+1;
                if(player){
                    if(player.TEAM){
                        inner.find('.scoreNum'+ordinal).addClass('text_team_'+player.TEAM.toLowerCase()).text(FirstDefined(team.ROUNDS_WON,team.CAPTURES,team.SCORE));model=ChangeModelSkin(model,player.TEAM.toLowerCase());inner.find('.flagNum'+ordinal).hide();inner.find('.nameNum'+ordinal).text("Team "+player.TEAM)
                    }
                    else{
                        if(player.PLAYER_COUNTRY){
                            inner.find('.flagNum'+ordinal).html('<img src="'+quakelive.resource('/images/flags/'+player.PLAYER_COUNTRY.toLowerCase()+'.gif')+'" width="16" height="11"  alt="">').show()
                        }
                        inner.find('.nameNum'+ordinal).text(player.PLAYER_NICK);
                        inner.find('.scoreNum'+ordinal).text(player.SCORE)
                    }
                    var imgpath;if(quakelive.mod_friends.IsBlocked(player.PLAYER_NICK))imgpath=quakelive.PlayerAvatarPath.G_XL;else imgpath=quakelive.PlayerAvatarPath.XL;inner.find('.headNum'+ordinal).html('<img src="'+quakelive.resource(imgpath+model+'.jpg')+'"  alt="">')
                }
                else{
                    inner.find('.headNum'+ordinal).html('<img src="'+quakelive.resource('/images/players/icon_xl/none.jpg')+'" width="62" height="62"  alt="">');inner.find('.scoreNum'+ordinal).text("--");inner.find('.flagNum'+ordinal).hide();inner.find('.nameNum'+ordinal).text("N/A");inner.find('.rankNum'+ordinal).hide();inner.find('.noPlayer'+ordinal).show()
                }

            }
            return inner
        }
        ;
        this.DisplayStatsTooltip=function(node,json){
            var tip=$('#stats_tip');
            if(tip.size()){
                tip.remove()
            }
            var tip=$(quakelive.mod_stats.TPL_MATCH_SUMMARY);var tipContent=$("<div id='stats_srv_content'></div>");if(json){
                var tipDef=this.TIP_DEFS[json.GAME_TYPE.toUpperCase()];
                if(!tipDef){
                    return
                }
                var topPlayers=[];
                var topTeams=[null,null];
                if(json.WINNING_TEAM){
                    var teamId=json.WINNING_TEAM.toUpperCase();var teamScoreboard=json[teamId+"_SCOREBOARD"];var oppScoreboard=json[(teamId=="RED"?"BLUE":"RED")+"_SCOREBOARD"];topPlayers[0]=teamScoreboard[0];topPlayers[1]=oppScoreboard[0];if(json.WINNING_TEAM==json.TEAM_SCOREBOARD[0].TEAM){
                        topTeams[0]=json.TEAM_SCOREBOARD[0];
                        topTeams[1]=json.TEAM_SCOREBOARD[1]
                    }
                    else{
                        topTeams[0]=json.TEAM_SCOREBOARD[1];
                        topTeams[1]=json.TEAM_SCOREBOARD[0]
                    }
                    winner=json.WINNING_TEAM
                }
                else{
                    topPlayers[0]=json.SCOREBOARD[0];
                    topPlayers[1]=json.SCOREBOARD[1];
                    winner=topPlayers[0]
                }
                tip.find('#stats_datacontainer').empty().append(this.GetVersusFrame(json.GAME_TYPE,topPlayers[0],topPlayers[1],topTeams[0],topTeams[1])).append(quakelive.mod_stats.TPL_MATCH_SUMMARY_INNER);tip.find('#match_mapshot').html("<img alt="" src=""+quakelive.resource("/images/levelshots/md/"+json.MAP_NAME_SHORT+".jpg")+"" width="112" height="84" class="placeImg"  alt="">");var html="<span class=\"grayNameTxt\">"+json.MAP_NAME+"</span><br>";html+="<span class=\"Norm11px\"><b>Game Type:</b> "+this.FormatGameType(json)+"</span><br>";html+="<span class=\"Norm11px\"><b>Date:</b> "+json.GAME_TIMESTAMP_NICE+" ago</span><br>";html+="<span class=\"Norm11px\"><b>Winner:</b> ";if(json.WINNING_TEAM){
                    html+=json.WINNING_TEAM
                }
                else{
                    html+=json.SCOREBOARD[0].PLAYER_NICK
                }
                html+="</span><br>";html+="<span class=\"Norm11px\"><b>Duration:</b> "+json.GAME_LENGTH_NICE+"</span><br>";tip.find('#match_maindata').html(html);var count=0;for(var i=0;i&lt;tipDef.length;++i){
                    var def=tipDef[i];
                    if(!json[def.key]){
                        continue
                    }
                    var rowClass=(count++%2==0)?"lghtgrayBG":"drkgrayBG";var html="<div class=\""+rowClass+"\">"+"<div class='leftCol'>"+def.name+"</div>";html+="<div class='midCol'>";html+="<img src='"+quakelive.resource("/images/flags/"+json[def.key].PLAYER_COUNTRY.toLowerCase()+".gif")+"' width='16' height='11' class='tipPlayerFlag fl'  alt="">";var modelskin=json[def.key].PLAYER_MODEL;if(json[def.key].PLAYER_TEAM){
                        modelskin=ChangeModelSkin(modelskin,json[def.key].PLAYER_TEAM.toLowerCase())
                    }
                    var imgpath;
                    if(quakelive.mod_friends.IsBlocked(json[def.key].PLAYER_NICK)){
                        imgpath=quakelive.PlayerAvatarPath.G_SM
                    }
                    else{
                        imgpath=quakelive.PlayerAvatarPath.SM
                    }
                    html+="<img src='"+quakelive.resource(imgpath+modelskin+".jpg")+"' width='18' height='18' class='tipPlayerIcon fl'  alt="">";html+=json[def.key].PLAYER_NICK;html+="</div>";html+="<div class='rightCol'>"+(def.fmt?def.fmt(json[def.key].NUM,json):json[def.key].NUM)+"</div>";html+="<div class='cl'></div>"+"</div>";tip.find(".match_highlights").append(html)
                }
                var rowClass=(count++%2==0)?"lghtgrayBG":"drkgrayBG";tip.find(".match_highlights").append("<div class=\""+rowClass+"\"></div>")
            }
            tip.find('#stats_srv_fill').append(tipContent);
            tip.appendTo('body');
            var ofs=this.GetTooltipOffset(node,tip);
            tip.css('left',ofs.left+'px');
            tip.css('top',ofs.top+'px');
            return tip
        }
        ;
        this.HideStatsTooltip=function(){
            loading_public_id=0;
            $('#stats_tip').remove().hide();
            $('#stats_cli').remove().hide()
        }
        ;
        this.OnHoverStatsTooltip_Success=function(node,public_id,game_type,json){
            return this.DisplayStatsTooltip(node,json)
        }
        ;
        this.OnHoverStatsTooltip_Error=function(){
            $('#stats_datacontainer').html('<div class="error">The match you have requested is invalid or has expired.</div>')
        }
        ;
        this.loading_public_id=0;
        var HOVER_STATS_DELAY=250;
        this.OnHoverStatsTooltip=function(node,public_id,game_type){
            this.DisplayStatsTooltip(node,null);
            loading_public_id=public_id;
            var cachedData=statsCache.Get(public_id);
            if(!cachedData){
                var self=this;
                setTimeout(function(){
                    if(loading_public_id!=public_id){
                        return
                    }
                    $.ajax({
                        url:'/stats/matchdetails/'+public_id+'/'+game_type,dataType:'json',mode:'abort',port:'statstip',success:function(json){
                            if(public_id==loading_public_id){
                                var tip=self.OnHoverStatsTooltip_Success(node,public_id,game_type,json);
                                tip.show()
                            }
                            var data={
                                'json':json,'tip':null
                            }
                            ;
                            statsCache.Add(public_id,data);
                            loading_public_id=0
                        }
                        ,error:self.OnHoverStatsTooltip_Error
                    }
                    )
                }
                ,HOVER_STATS_DELAY)
            }
            else{
                var tip=this.OnHoverStatsTooltip_Success(node,public_id,game_type,cachedData.json);
                cachedData.tip=tip;
                tip.show();
                loading_public_id=0
            }

        }
        ;this.FormatProfileLink=function(value,json,board){
            if(value=='QUITTERS'){
                return'<i>'+value+'</i>'
            }
            else{
                var html="";var modelskin=json.PLAYER_MODEL;if(json.TEAM){
                    modelskin=ChangeModelSkin(json.PLAYER_MODEL,json.TEAM.toLowerCase())
                }
                var imgpath;if(quakelive.mod_friends.IsBlocked(json.PLAYER_NICK))imgpath=quakelive.PlayerAvatarPath.G_SM;else imgpath=quakelive.PlayerAvatarPath.SM;html+="<img src='"+quakelive.resource("/images/flags/"+json.PLAYER_COUNTRY.toLowerCase()+".gif")+"' width='16' height='11' class='boardPlayerFlag fl'  alt="">";html+="<img src='"+quakelive.resource(imgpath+modelskin+".jpg")+"' width='18' height='18' class='boardPlayerIcon fl'  alt="">";html+='<a href="javascript:;" uuups="quakelive.Goto('profile/summary/'+value+''); return false" class="fl">'+value+'</a>';html+='<div class="cl"></div>';return html
            }

        }
        ;this.FormatRank=function(value){
            if((typeof(value)=='string'&&value[0]=='Q')||value==-1){
                return'--'
            }
            return FormatRank(value)
        }
        ;this.FormatWeaponNumber=function(value){
            if(value==0||value=='N/A'){
                return'--'
            }
            else{
                return value
            }

        }
        ;this.FormatTime=function(value){
            return FormatDuration(value)
        }
        ;this.FormatPercent=function(value){
            if(value!=0&&value!='N/A'){
                return value+"%"
            }
            else{
                return"--"
            }

        }
        ;
        var PLAYER_WEAPON_FIELDS=[{
            field:'RANK',title:'Finish',extraClass:'tc',fmt:this.FormatRank
        }
        ,{
            field:'PLAYER_NICK',title:'Player',extraClass:'tl',fmt:this.FormatProfileLink
        }
        ,{
            field:'GT',title:'GT',extraClass:'tc',fmt:this.FormatWeaponNumber,alt:"Gauntlet"
        }
        ,{
            field:'MG',title:'MG',extraClass:'tc',fmt:this.FormatWeaponNumber,alt:"Machine Gun"
        }
        ,{
            field:'SG',title:'SG',extraClass:'tc',fmt:this.FormatWeaponNumber,alt:"Shot Gun"
        }
        ,{
            field:'GL',title:'GL',extraClass:'tc',fmt:this.FormatWeaponNumber,alt:"Grenade Launcher"
        }
        ,{
            field:'LG',title:'LG',extraClass:'tc',fmt:this.FormatWeaponNumber,alt:"Lightning Gun"
        }
        ,{
            field:'RL',title:'RL',extraClass:'tc',fmt:this.FormatWeaponNumber,alt:"Rocket Launcher"
        }
        ,{
            field:'RG',title:'RG',extraClass:'tc',fmt:this.FormatWeaponNumber,alt:"Rail Gun"
        }
        ,{
            field:'PG',title:'PG',extraClas:'tc',fmt:this.FormatWeaponNumber,alt:"Plasma Gun"
        }
        ,{
            field:'BFG',title:'BFG',extraClass:'tc',fmt:this.FormatWeaponNumber,alt:"BFG"
        }
        ,{
            field:'CG',title:'CG',extraClass:'tc',fmt:this.FormatWeaponNumber,alt:"Chain Gun"
        }
        ,{
            field:'NG',title:'NG',extraClass:'tc',fmt:this.FormatWeaponNumber,alt:"Nail Gun"
        }
        ,{
            field:'PM',title:'PL',extraClass:'tc',fmt:this.FormatWeaponNumber,alt:"Prox Launcher"
        }
        ];
        var REDBLUE_WEAPON_FIELDS=[{
            field:'TEAM_RANK',title:'Finish',extraClass:'tc',fmt:this.FormatRank
        }
        ,{
            field:'PLAYER_NICK',title:'Player',extraClass:'tl',fmt:this.FormatProfileLink
        }
        ,{
            field:'GT',title:'GT',extraClass:'tc',fmt:this.FormatWeaponNumber,alt:"Gauntlet"
        }
        ,{
            field:'MG',title:'MG',extraClass:'tc',fmt:this.FormatWeaponNumber,alt:"Machine Gun"
        }
        ,{
            field:'SG',title:'SG',extraClass:'tc',fmt:this.FormatWeaponNumber,alt:"Shot Gun"
        }
        ,{
            field:'GL',title:'GL',extraClass:'tc',fmt:this.FormatWeaponNumber,alt:"Grenade Launcher"
        }
        ,{
            field:'LG',title:'LG',extraClass:'tc',fmt:this.FormatWeaponNumber,alt:"Lightning Gun"
        }
        ,{
            field:'RL',title:'RL',extraClass:'tc',fmt:this.FormatWeaponNumber,alt:"Rocket Launcher"
        }
        ,{
            field:'RG',title:'RG',extraClass:'tc',fmt:this.FormatWeaponNumber,alt:"Rail Gun"
        }
        ,{
            field:'PG',title:'PG',extraClas:'tc',fmt:this.FormatWeaponNumber,alt:"Plasma Gun"
        }
        ,{
            field:'BFG',title:'BFG',extraClass:'tc',fmt:this.FormatWeaponNumber,alt:"BFG"
        }
        ,{
            field:'CG',title:'CG',extraClass:'tc',fmt:this.FormatWeaponNumber,alt:"Chain Gun"
        }
        ,{
            field:'NG',title:'NG',extraClass:'tc',fmt:this.FormatWeaponNumber,alt:"Nail Gun"
        }
        ,{
            field:'PM',title:'PL',extraClass:'tc',fmt:this.FormatWeaponNumber,alt:"Prox Launcher"
        }
        ];
        var TEAM_WEAPON_FIELDS=[{
            field:'TEAM',title:'Team',extraClass:'tl',fmt:null
        }
        ,{
            field:'GT',title:'GT',extraClass:'tc',fmt:this.FormatWeaponNumber,alt:"Gauntlet"
        }
        ,{
            field:'MG',title:'MG',extraClass:'tc',fmt:this.FormatWeaponNumber,alt:"Machine Gun"
        }
        ,{
            field:'SG',title:'SG',extraClass:'tc',fmt:this.FormatWeaponNumber,alt:"Shot Gun"
        }
        ,{
            field:'GL',title:'GL',extraClass:'tc',fmt:this.FormatWeaponNumber,alt:"Grenade Launcher"
        }
        ,{
            field:'LG',title:'LG',extraClass:'tc',fmt:this.FormatWeaponNumber,alt:"Lightning Gun"
        }
        ,{
            field:'RL',title:'RL',extraClass:'tc',fmt:this.FormatWeaponNumber,alt:"Rocket Launcher"
        }
        ,{
            field:'RG',title:'RG',extraClass:'tc',fmt:this.FormatWeaponNumber,alt:"Rail Gun"
        }
        ,{
            field:'PG',title:'PG',extraClas:'tc',fmt:this.FormatWeaponNumber,alt:"Plasma Gun"
        }
        ,{
            field:'BFG',title:'BFG',extraClass:'tc',fmt:this.FormatWeaponNumber,alt:"BFG"
        }
        ,{
            field:'CG',title:'CG',extraClass:'tc',fmt:this.FormatWeaponNumber,alt:"Chain Gun"
        }
        ,{
            field:'NG',title:'NG',extraClass:'tc',fmt:this.FormatWeaponNumber,alt:"Nail Gun"
        }
        ,{
            field:'PM',title:'PL',extraClass:'tc',fmt:this.FormatWeaponNumber,alt:"Prox Launcher"
        }
        ];
        var PLAYER_WEAPON_ACC_FIELDS=[{
            field:'RANK',title:'Finish',extraClass:'tc',fmt:this.FormatRank
        }
        ,{
            field:'PLAYER_NICK',title:'Player',extraClass:'tl',fmt:this.FormatProfileLink
        }
        ,{
            field:'GT_A',title:'GT',extraClass:'tc',fmt:this.FormatPercent,alt:"Gauntlet"
        }
        ,{
            field:'MG_A',title:'MG',extraClass:'tc',fmt:this.FormatPercent,alt:"Machine Gun"
        }
        ,{
            field:'SG_A',title:'SG',extraClass:'tc',fmt:this.FormatPercent,alt:"Shot Gun"
        }
        ,{
            field:'GL_A',title:'GL',extraClass:'tc',fmt:this.FormatPercent,alt:"Grenade Launcher"
        }
        ,{
            field:'LG_A',title:'LG',extraClass:'tc',fmt:this.FormatPercent,alt:"Lightning Gun"
        }
        ,{
            field:'RL_A',title:'RL',extraClass:'tc',fmt:this.FormatPercent,alt:"Rocket Launcher"
        }
        ,{
            field:'RG_A',title:'RG',extraClass:'tc',fmt:this.FormatPercent,alt:"Rail Gun"
        }
        ,{
            field:'PG_A',title:'PG',extraClas:'tc',fmt:this.FormatPercent,alt:"Plasma Gun"
        }
        ,{
            field:'BFG_A',title:'BFG',extraClass:'tc',fmt:this.FormatPercent,alt:"BFG"
        }
        ,{
            field:'CG_A',title:'CG',extraClass:'tc',fmt:this.FormatPercent,alt:"Chain Gun"
        }
        ,{
            field:'NG_A',title:'NG',extraClass:'tc',fmt:this.FormatPercent,alt:"Nail Gun"
        }
        ,{
            field:'PM_A',title:'PL',extraClass:'tc',fmt:this.FormatPercent,alt:"Prox Launcher"
        }
        ];
        var REDBLUE_WEAPON_ACC_FIELDS=[{
            field:'TEAM_RANK',title:'Finish',extraClass:'tc',fmt:this.FormatRank
        }
        ,{
            field:'PLAYER_NICK',title:'Player',extraClass:'tl',fmt:this.FormatProfileLink
        }
        ,{
            field:'GT_A',title:'GT',extraClass:'tc',fmt:this.FormatPercent,alt:"Gauntlet"
        }
        ,{
            field:'MG_A',title:'MG',extraClass:'tc',fmt:this.FormatPercent,alt:"Machine Gun"
        }
        ,{
            field:'SG_A',title:'SG',extraClass:'tc',fmt:this.FormatPercent,alt:"Shot Gun"
        }
        ,{
            field:'GL_A',title:'GL',extraClass:'tc',fmt:this.FormatPercent,alt:"Grenade Launcher"
        }
        ,{
            field:'LG_A',title:'LG',extraClass:'tc',fmt:this.FormatPercent,alt:"Lightning Gun"
        }
        ,{
            field:'RL_A',title:'RL',extraClass:'tc',fmt:this.FormatPercent,alt:"Rocket Launcher"
        }
        ,{
            field:'RG_A',title:'RG',extraClass:'tc',fmt:this.FormatPercent,alt:"Rail Gun"
        }
        ,{
            field:'PG_A',title:'PG',extraClas:'tc',fmt:this.FormatPercent,alt:"Plasma Gun"
        }
        ,{
            field:'BFG_A',title:'BFG',extraClass:'tc',fmt:this.FormatPercent,alt:"BFG"
        }
        ,{
            field:'CG_A',title:'CG',extraClass:'tc',fmt:this.FormatPercent,alt:"Chain Gun"
        }
        ,{
            field:'NG_A',title:'NG',extraClass:'tc',fmt:this.FormatPercent,alt:"Nail Gun"
        }
        ,{
            field:'PM_A',title:'PL',extraClass:'tc',fmt:this.FormatPercent,alt:"Prox Launcher"
        }
        ];
        var TEAM_WEAPON_ACC_FIELDS=[{
            field:'TEAM',title:'Team',extraClass:'tl',fmt:null
        }
        ,{
            field:'GT_A',title:'GT',extraClass:'tc',fmt:this.FormatPercent,alt:"Gauntlet"
        }
        ,{
            field:'MG_A',title:'MG',extraClass:'tc',fmt:this.FormatPercent,alt:"Machine Gun"
        }
        ,{
            field:'SG_A',title:'SG',extraClass:'tc',fmt:this.FormatPercent,alt:"Shot Gun"
        }
        ,{
            field:'GL_A',title:'GL',extraClass:'tc',fmt:this.FormatPercent,alt:"Grenade Launcher"
        }
        ,{
            field:'LG_A',title:'LG',extraClass:'tc',fmt:this.FormatPercent,alt:"Lightning Gun"
        }
        ,{
            field:'RL_A',title:'RL',extraClass:'tc',fmt:this.FormatPercent,alt:"Rocket Launcher"
        }
        ,{
            field:'RG_A',title:'RG',extraClass:'tc',fmt:this.FormatPercent,alt:"Rail Gun"
        }
        ,{
            field:'PG_A',title:'PG',extraClas:'tc',fmt:this.FormatPercent,alt:"Plasma Gun"
        }
        ,{
            field:'BFG_A',title:'BFG',extraClass:'tc',fmt:this.FormatPercent,alt:"BFG"
        }
        ,{
            field:'CG_A',title:'CG',extraClass:'tc',fmt:this.FormatPercent,alt:"Chain Gun"
        }
        ,{
            field:'NG_A',title:'NG',extraClass:'tc',fmt:this.FormatPercent,alt:"Nail Gun"
        }
        ,{
            field:'PM_A',title:'PL',extraClass:'tc',fmt:this.FormatPercent,alt:"Prox Launcher"
        }
        ];
        var BOARD_DEFS=[{
            index:'SCOREBOARD',type:'normal',fields:[{
                field:'RANK',title:'Finish',extraClass:'tc',fmt:this.FormatRank
            }
            ,{
                field:'PLAYER_NICK',title:'Player',extraClass:'tl',fmt:this.FormatProfileLink
            }
            ,{
                field:'SCORE',title:'Score',extraClass:'tc',fmt:null
            }
            ,{
                field:'KILLS',title:'Frags',extraClass:'tc',fmt:null
            }
            ,{
                field:'DEATHS',title:'Deaths',extraClass:'tc',fmt:null
            }
            ,{
                field:'ACCURACY',title:'Accuracy',extraClass:'tc',fmt:this.FormatPercent
            }
            ,{
                field:'MIN',title:'Time',extraClas:'tc',fmt:this.FormatTime
            }
            ,{
                field:'EXCELLENT',title:'Exc',extraClass:'tc',fmt:this.FormatWeaponNumber,alt:"\"Excellent\" medals"
            }
            ,{
                field:'IMPRESSIVE',title:'Imp',extraClass:'tc',fmt:this.FormatWeaponNumber,alt:"\"Impressive\" medals"
            }
            ,{
                field:'HUMILIATION',title:'Hum',extraClass:'tc',fmt:this.FormatWeaponNumber,alt:"\"Humiliation\" medals"
            }
            ],weaponFields:PLAYER_WEAPON_FIELDS,weaponAccFields:PLAYER_WEAPON_ACC_FIELDS
        }
        ,{
            index:'TEAM_SCOREBOARD',type:'team',fields:[{
                field:'TEAM',title:'Team',extraClass:'tl',fmt:null
            }
            ,{
                field:'CAPTURES',title:'Captures',extraClass:'tc',fmt:this.FormatWeaponNumber,alt:"Flag Captures"
            }
            ,{
                field:'DEFENDS',title:'Defends',extraClass:'tc',fmt:this.FormatWeaponNumber,alt:"Flag Defends"
            }
            ,{
                field:'ASSISTS',title:'Assists',extraClass:'tc',fmt:this.FormatWeaponNumber,alt:"Flag Assists"
            }
            ,{
                field:'ROUNDS_WON',title:'Rounds',extraClass:'tc',fmt:null,alt:"Rounds Won"
            }
            ,{
                field:'SCORE',title:'Score',extraClass:'tc',fmt:null
            }
            ,{
                field:'KILLS',title:'Frags',extraClass:'tc',fmt:null
            }
            ,{
                field:'DEATHS',title:'Deaths',extraClass:'tc',fmt:null
            }
            ,{
                field:'ACCURACY',title:'Accuracy',extraClass:'tc',fmt:this.FormatPercent
            }
            ,{
                field:'EXCELLENT',title:'Exc',extraClass:'tc',fmt:this.FormatWeaponNumber,alt:"\"Excellent\" medals"
            }
            ,{
                field:'IMPRESSIVE',title:'Imp',extraClass:'tc',fmt:this.FormatWeaponNumber,alt:"\"Impressive\" medals"
            }
            ,{
                field:'HUMILIATION',title:'Hum',extraClass:'tc',fmt:this.FormatWeaponNumber,alt:"\"Humiliation\" medals"
            }
            ],weaponFields:TEAM_WEAPON_FIELDS,weaponAccFields:TEAM_WEAPON_ACC_FIELDS
        }
        ,{
            index:'RED_SCOREBOARD',type:'red',fields:[{
                field:'TEAM_RANK',title:'Finish',extraClass:'tc',fmt:this.FormatRank
            }
            ,{
                field:'PLAYER_NICK',title:'Player',extraClass:'tl',fmt:this.FormatProfileLink
            }
            ,{
                field:'CAPTURES',title:'Captures',extraClass:'tc',fmt:this.FormatWeaponNumber,alt:"Flag Captures"
            }
            ,{
                field:'DEFENDS',title:'Defends',extraClass:'tc',fmt:this.FormatWeaponNumber,alt:"Flag Defends"
            }
            ,{
                field:'ASSISTS',title:'Assists',extraClass:'tc',fmt:this.FormatWeaponNumber,alt:"Flag Assists"
            }
            ,{
                field:'ROUNDS_WON',title:'Rounds Won',extraClass:'tc',fmt:null
            }
            ,{
                field:'SCORE',title:'Score',extraClass:'tc',fmt:null
            }
            ,{
                field:'KILLS',title:'Frags',extraClass:'tc',fmt:null
            }
            ,{
                field:'DEATHS',title:'Deaths',extraClass:'tc',fmt:null
            }
            ,{
                field:'ACCURACY',title:'Accuracy',extraClass:'tc',fmt:this.FormatPercent
            }
            ,{
                field:'MIN',title:'Time',extraClas:'tc',fmt:this.FormatTime
            }
            ,{
                field:'EXCELLENT',title:'Exc',extraClass:'tc',fmt:this.FormatWeaponNumber,alt:"\"Excellent\" medals"
            }
            ,{
                field:'IMPRESSIVE',title:'Imp',extraClass:'tc',fmt:this.FormatWeaponNumber,alt:"\"Impressive\" medals"
            }
            ,{
                field:'HUMILIATION',title:'Hum',extraClass:'tc',fmt:this.FormatWeaponNumber,alt:"\"Humiliation\" medals"
            }
            ],weaponFields:REDBLUE_WEAPON_FIELDS,weaponAccFields:REDBLUE_WEAPON_ACC_FIELDS
        }
        ,{
            index:'BLUE_SCOREBOARD',type:'blue',fields:[{
                field:'TEAM_RANK',title:'Finish',extraClass:'tc',fmt:this.FormatRank
            }
            ,{
                field:'PLAYER_NICK',title:'Player',extraClass:'tl',fmt:this.FormatProfileLink
            }
            ,{
                field:'CAPTURES',title:'Captures',extraClass:'tc',fmt:this.FormatWeaponNumber,alt:"Flag Captures"
            }
            ,{
                field:'DEFENDS',title:'Defends',extraClass:'tc',fmt:this.FormatWeaponNumber,alt:"Flag Defends"
            }
            ,{
                field:'ASSISTS',title:'Assists',extraClass:'tc',fmt:this.FormatWeaponNumber,alt:"Flag Assists"
            }
            ,{
                field:'ROUNDS_WON',title:'Rounds Won',extraClass:'tc',fmt:null
            }
            ,{
                field:'SCORE',title:'Score',extraClass:'tc',fmt:null
            }
            ,{
                field:'KILLS',title:'Frags',extraClass:'tc',fmt:null
            }
            ,{
                field:'DEATHS',title:'Deaths',extraClass:'tc',fmt:null
            }
            ,{
                field:'ACCURACY',title:'Accuracy',extraClass:'tc',fmt:this.FormatPercent
            }
            ,{
                field:'MIN',title:'Time',extraClas:'tc',fmt:this.FormatTime
            }
            ,{
                field:'EXCELLENT',title:'Exc',extraClass:'tc',fmt:this.FormatWeaponNumber,alt:"\"Excellent\" medals"
            }
            ,{
                field:'IMPRESSIVE',title:'Imp',extraClass:'tc',fmt:this.FormatWeaponNumber,alt:"\"Impressive\" medals"
            }
            ,{
                field:'HUMILIATION',title:'Hum',extraClass:'tc',fmt:this.FormatWeaponNumber,alt:"\"Humiliation\" medals"
            }
            ],weaponFields:REDBLUE_WEAPON_FIELDS,weaponAccFields:REDBLUE_WEAPON_ACC_FIELDS
        }
        ];
        this.TIP_DEFS={
            'DM':[{
                name:'Most Frags',key:'MOST_FRAGS',fmt:null
            }
            ,{
                name:'Least Deaths',key:'LEAST_DEATHS',fmt:null
            }
            ,{
                name:'Most Deaths',key:'MOST_DEATHS',fmt:null
            }
            ,{
                name:'Damage Delivered',key:'DMG_DELIVERED',fmt:null
            }
            ,{
                name:'Damage Taken',key:'DMG_TAKEN',fmt:null
            }
            ,{
                name:'Most Accurate',key:'MOST_ACCURATE',fmt:this.FormatPercent
            }
            ],'CTF':[{
                name:'Least Deaths',key:'LEAST_DEATHS',fmt:null
            }
            ,{
                name:'Most Assists',key:'MOST_ASSISTS',fmt:null
            }
            ,{
                name:'Most Captures',key:'MOST_CAPTURES',fmt:null
            }
            ,{
                name:'Most Defends',key:'MOST_DEFENDS',fmt:null
            }
            ,{
                name:'Most Kills',key:'MOST_KILLS',fmt:null
            }
            ],'TDM':[{
                name:'Most Frags',key:'MOST_FRAGS',fmt:null
            }
            ,{
                name:'Least Deaths',key:'LEAST_DEATHS',fmt:null
            }
            ,{
                name:'Most Deaths',key:'MOST_DEATHS',fmt:null
            }
            ,{
                name:'Damage Delivered',key:'DMG_DELIVERED',fmt:null
            }
            ,{
                name:'Damage Taken',key:'DMG_TAKEN',fmt:null
            }
            ,{
                name:'Most Accurate',key:'MOST_ACCURATE',fmt:this.FormatPercent
            }
            ],'CA':[{
                name:'Least Deaths',key:'LEAST_DEATHS',fmt:null
            }
            ,{
                name:'Most Deaths',key:'MOST_DEATHS',fmt:null
            }
            ,{
                name:'Damage Delivered',key:'DMG_DELIVERED',fmt:null
            }
            ,{
                name:'Damage Taken',key:'DMG_TAKEN',fmt:null
            }
            ,{
                name:'Most Accurate',key:'MOST_ACCURATE',fmt:this.FormatPercent
            }
            ],'TOURNEY':[{
                name:'Most Frags',key:'MOST_FRAGS',fmt:null
            }
            ,{
                name:'Least Deaths',key:'LEAST_DEATHS',fmt:null
            }
            ,{
                name:'Most Deaths',key:'MOST_DEATHS',fmt:null
            }
            ,{
                name:'Damage Delivered',key:'DMG_DELIVERED',fmt:null
            }
            ,{
                name:'Damage Taken',key:'DMG_TAKEN',fmt:null
            }
            ,{
                name:'Most Accurate',key:'MOST_ACCURATE',fmt:this.FormatPercent
            }
            ]
        }
        ;
        this.OnShowStatsDetails_Error=function(err){
            $('#match_gametype').html('Unable to load game');$('#stats_datacontainer').html('<div class="error">The match you have requested is invalid or has expired.</div>')
        }
        ;
        this.OnShowStatsDetails_Success=function(node,public_id,game_type,json){
            $('#stats_datacontainer').html(quakelive.mod_stats.TPL_MATCH_DETAILS_INNER);
            var topPlayers=[];
            var topTeams=[null,null];
            if(json.WINNING_TEAM){
                var teamId=json.WINNING_TEAM.toUpperCase();var teamScoreboard=(json.WINNING_TEAM!='NA')?json[teamId+"_SCOREBOARD"]:json["RED_SCOREBOARD"];var oppScoreboard=(json.WINNING_TEAM!='NA')?json[(teamId=="RED"?"BLUE":"RED")+"_SCOREBOARD"]:json["BLUE_SCOREBOARD"];topPlayers[0]=teamScoreboard[0];topPlayers[1]=oppScoreboard[0];if(json.WINNING_TEAM==json.TEAM_SCOREBOARD[0].TEAM){
                    topTeams[0]=json.TEAM_SCOREBOARD[0];
                    topTeams[1]=json.TEAM_SCOREBOARD[1]
                }
                else{
                    topTeams[0]=json.TEAM_SCOREBOARD[1];
                    topTeams[1]=json.TEAM_SCOREBOARD[0]
                }
                winner=json.WINNING_TEAM
            }
            else{
                topPlayers[0]=json.SCOREBOARD[0];
                topPlayers[1]=json.SCOREBOARD[1];
                winner=topPlayers[0]
            }
            node.find('#match_vscontainer').empty().append(this.GetVersusFrame(json.GAME_TYPE,topPlayers[0],topPlayers[1],topTeams[0],topTeams[1]));node.find('#match_gametype').html(this.FormatGameType(json));node.find('#match_mapshot').html("<img alt="" src=""+quakelive.resource("/images/levelshots/md/"+json.MAP_NAME_SHORT+".jpg")+"" width="112" height="84" class="placeImg"  alt="">");var html="<span class=\"grayNameTxt\">"+json.MAP_NAME+"</span><br>";html+="<span class=\"Norm11px\"><b>Date:</b> "+json.GAME_TIMESTAMP_NICE+" ago</span><br>";html+="<span class=\"Norm11px\"><b>Winner:</b> ";if(json.WINNING_TEAM){
                html+=json.WINNING_TEAM
            }
            else{
                html+=json.SCOREBOARD[0].PLAYER_NICK
            }
            html+="</span><br>";html+="<span class=\"Norm11px\"><b>Duration:</b> "+json.GAME_LENGTH_NICE+"</span><br>";node.find('#match_maindata').html(html);var container=node.find('.match_scoreboard').empty();var wpContainer=node.find('.match_weapons').empty();var wpAccContainer=node.find('.match_weaponaccuracy').empty();var count=0;var boardOrder=['SCOREBOARD','TEAM_SCOREBOARD'];if(json.WINNING_TEAM){
                if(json.WINNING_TEAM.toLowerCase()=='red'){
                    boardOrder[boardOrder.length]='RED_SCOREBOARD';
                    boardOrder[boardOrder.length]='BLUE_SCOREBOARD'
                }
                else{
                    boardOrder[boardOrder.length]='BLUE_SCOREBOARD';
                    boardOrder[boardOrder.length]='RED_SCOREBOARD'
                }

            }
            for(var orderIndex in boardOrder){
                var boardId=boardOrder[orderIndex];var i=0;for(;i&lt;BOARD_DEFS.length;++i){
                    var boardDef=BOARD_DEFS[i];
                    if(json[boardDef.index]&&boardDef.index==boardId){
                        if(count++&gt;
                        0){
                            container.append('<br>');
                            wpContainer.append('<br>');
                            wpAccContainer.append('<br>')
                        }
                        container.append(this.GetScoreboard(json,boardDef));
                        wpContainer.append(this.GetWeaponDetails(json,boardDef));
                        wpAccContainer.append(this.GetWeaponAccuracyDetails(json,boardDef));
                        break
                    }

                }

            }
            var mailToSubj="QUAKE LIVE Game Details\n\n";var mailToText="Check out the details of this QUAKE LIVE game here:\n"+"\nhttp://"+document.location.hostname.toLowerCase()+"/"+document.location.hash+"\n\n"+"Arena: "+json.MAP_NAME+"\n"+"Game type: "+this.FormatGameType(json)+"\n"+"Date played: "+json.GAME_TIMESTAMP+"\n"+"\nNote: This link will expire at "+json.GAME_EXPIRES_FULL+"\n"+"\nQUAKE LIVE is a totally FREE online multiplayer game from id Software, the makers of DOOM and QUAKE.  Easily play against friends or others at your skill level in more than 30 arenas and 5 exciting game modes. Check us out at www.quakelive.com.\n";mailToSubj=mailToSubj.replace(/ /g,"%20");mailToText=mailToText.replace(/ /g,"%20").replace(/\n/g,"%0D").replace(/#/g,"%23");node.find('.share_email').attr('href',"mailto:?subject="+mailToSubj+"&body="+mailToText);var self=this;node.find('.share_link').click(function(){
                prompt("Copy and paste this URL to link to this match.\n\n"+"Arena: "+json.MAP_NAME+"\n"+"Game type: "+self.FormatGameType(json)+"\n"+"Date played: "+json.GAME_TIMESTAMP+"\n"+"\nNote: This link will expire at "+json.GAME_EXPIRES_FULL+"\n","http://"+document.location.hostname.toLowerCase()+"/"+document.location.hash)
            }
            );node.find('.addthis_container').html("&lt;script type=\"text/javascript\"&gt;"+"var addthis_pub=\"idsoftware\";"+"var addthis_brand = \"Quake Live\";"+"var addthis_header_color = \"#ccc\";"+"var addthis_header_background = \"#232323\";"+"var addthis_options = 'facebook, twitter, myspace, favorites, more';"+"&lt;/script&gt;"+"<a href=\"http://www.addthis.com/bookmark.php?v=20\" onmouseover=\"return addthis_open(this, '', 'http://"+document.location.hostname.toLowerCase()+"/"+document.location.hash+"', 'Quake Live Match - "+self.FormatGameType(json)+" on "+json.MAP_NAME+"')\" uuups=\"addthis_close()\" uuups=\"return addthis_sendto()\"><img src=""+quakelive.resource("/images/share_button.gif")+"" width="67" height="15" alt="Bookmark and Share" style="border:0" alt=""></a>&lt;script type=\"text/javascript\" src=\"http://s7.addthis.com/js/200/addthis_widget.js\"&gt;&lt;/script&gt;")
        }
        ;this.GetHtmlForFields=function(json,boardDef,boardFields,boardClassPrefix){
            var sb=json[boardDef.index];var html="<div class='board_"+boardDef.type+"'>";html+="<div class='"+boardDef.type+"BG'>";for(var fieldIndex in boardFields){
                var fieldDef=boardFields[fieldIndex];
                if(typeof(sb[0][fieldDef.field])!='undefined'){
                    html+="<div class='"+boardClassPrefix+boardDef.index+"_"+fieldDef.field+" "+fieldDef.extraClass+"'";if(fieldDef.alt){
                        html+=" title=\""+fieldDef.alt+"\""
                    }
                    html+="><b>"+fieldDef.title+"</b></div>"
                }

            }
            html+="</div>";var count=0;for(var playerIndex in sb){
                var className="";html+="<div class='";className=boardDef.type+"Zebra"+((count++%2)==1?"On":"Off");html+=className+"'>";for(var fieldIndex in boardFields){
                    var fieldDef=boardFields[fieldIndex];
                    if(typeof(sb[playerIndex][fieldDef.field])!='undefined'){
                        var value=sb[playerIndex][fieldDef.field];
                        if(fieldDef.fmt){
                            value=fieldDef.fmt(value,sb[playerIndex],boardDef)
                        }
                        if(typeof(value)=='undefined'||typeof(value)=='NaN'){
                            value=''
                        }
                        html+="<div class='"+boardClassPrefix+boardDef.index+"_"+fieldDef.field+" "+fieldDef.extraClass+"'>"+value+"</div>"
                    }

                }
                html+="<div class='cl'></div>";html+="</div>"
            }
            html+="</div>";return html
        }
        ;
        this.GetScoreboard=function(json,boardDef){
            return this.GetHtmlForFields(json,boardDef,boardDef.fields,"")
        }
        ;
        this.GetWeaponDetails=function(json,boardDef){
            return this.GetHtmlForFields(json,boardDef,boardDef.weaponFields,"WP_")
        }
        ;
        this.GetWeaponAccuracyDetails=function(json,boardDef){
            return this.GetHtmlForFields(json,boardDef,boardDef.weaponAccFields,"WP_")
        }
        ;
        this.SetDetailsMode=function(mode){
            var modes=['scoreboard','weapons','weaponaccuracy'];for(var modeIndex in modes){
                if(mode!=modes[modeIndex]){
                    $('.match_'+modes[modeIndex]).hide();
                    $('.nav_'+modes[modeIndex]).removeClass('selected')
                }

            }
            $('.match_'+mode).show();
            $('.nav_'+mode).addClass('selected')
        }
        ;
        this.HideStatsDetails=function(){
            $('#stats_details').remove()
        }
        ;
        this.ShowStatsDetails=function(public_id,game_type){
            this.HideStatsTooltip();
            quakelive.ScrollToTop();
            if($('#stats_details').size()){
                $('#stats_details').remove()
            }
            var node=$(quakelive.mod_stats.TPL_MATCH_DETAILS).appendTo('#qlv_contentBody');
            var cachedData=statsCache.Get(public_id);
            if(!cachedData){
                var me=this;
                $.ajax({
                    url:'/stats/matchdetails/'+public_id+'/'+game_type,dataType:'json',mode:'abort',port:'statstip',success:function(json){
                        var tip=me.OnShowStatsDetails_Success(node,public_id,game_type,json);
                        var data={
                            'json':json,'tip':tip
                        }
                        ;
                        statsCache.Add(public_id,data)
                    }
                    ,error:this.OnShowStatsDetails_Error
                }
                )
            }
            else{
                this.OnShowStatsDetails_Success(node,public_id,game_type,cachedData.json)
            }

        }
        ;
        this.OnCloseStatsTooltip=function(){
            $.ajaxAbort('statstip');
            this.HideStatsDetails();
            var path=quakelive.BuildSubPath(quakelive.pathParts.length-2);
            quakelive.StopPathMonitor();
            document.location.hash=path;
            quakelive.ParsePath();
            quakelive.StartPathMonitor()
        }
        ;
        this.OnClickStatsTooltip=function(node,publicId,gameType,subPath){
            var path=subPath+"/"+publicId+"/"+gameType;quakelive.StopPathMonitor();document.location.hash=path;quakelive.ParsePath();quakelive.StartPathMonitor();quakelive.statstip.ShowStatsDetails(publicId,gameType)
        }
        ;
        this.BindStatsTooltip=function(node,publicId,gameType,subPath){
            var self=this;node.unbind("hover").unbind("click").click(function(event){
                self.options.onClick(node,publicId,gameType,subPath);
                event.preventDefault()
            }
            ).hover(function(){
                self.OnHoverStatsTooltip(node,publicId,gameType)
            }
            ,function(){
                self.HideStatsTooltip()
            }
            )
        }
        ;
        var self=this;
        this.defaultOptions={
            onClick:function(node,publicId,gameType,subPath){
                self.OnClickStatsTooltip(node,publicId,gameType,subPath)
            }
            ,onClose:function(){
                self.OnCloseStatsTooltip()
            }

        }
        ;
        this.options=$.extend({

        }
        ,this.defaultOptions);
        this.SetOptions=function(options){
            this.options=$.extend(this.defaultOptions,options)
        }
        ;
        this.CloseStatsDetails=function(){
            this.options.onClose()
        }
        ;this.FormatGameType=function(json){
            var gameType;
            if(json.INSTAGIB){
                gameType="Unranked Instagib"
            }
            else{
                gameType=json.GAME_TYPE_FULL
            }
            return gameType
        }

    }
    quakelive.statstip=new StatsTip()
}
)(jQuery);
(function($){
    /************************************************************\
    *
    \************************************************************/
    function Notifier(){
        var defaultOptions={
            noticeHeight:'135px',animInTime:500,animOutTime:500,animEaseType:"swing",displayTime:5000,styleClass:'qln_base',allowClose:true,icon:quakelive.resource('/images/awards/lg/last_man.png'),title:'QUAKE LIVE: Notice',body:'',bodyTop:'',bodyBot:'',onNodeCreated:null
        }
        ;
        this.filters={

        }
        ;
        this.CreateNotice=function(options){
            var html='<div class="ql_notice '+options.styleClass+'">'+'<div class="notice_header">'+options.title+'</div>'+(options.allowClose?'<a href="javascript:;" class="notice_close_btn"></a>':'')+'<div class="notice_data">&lt;h1&gt;'+options.bodyTop+'&lt;/h1&gt;'+options.body+'&lt;h4&gt;'+options.bodyBot+'&lt;/h4&gt;</div>'+'<div class="notice_icon" style="background:url('+options.icon+') no-repeat"></div>'+'</div>';var node=$(html);if(options.onNodeCreated){
                options.onNodeCreated(node)
            }
            return node
        }
        ;
        this.LoadFilters=function(){
            var list=(quakelive.userinfo.IGNORED_NOTICES||"").split(",");this.filters={

            }
            ;for(var listIndex in list){
                this.filters[list[listIndex]]=true
            }

        }
        ;
        this.IsNoticeFiltered=function(id){
            return this.filters[id]||false
        }
        ;
        this.Notify=function(customOptions){
            if(quakelive.userstatus!='ACTIVE'){
                return
            }
            if(!customOptions){
                return
            }
            if(typeof(customOptions)!='object'){
                customOptions={
                    body:customOptions
                }

            }
            var options=$.extend({

            }
            ,defaultOptions,customOptions||{

            }
            ,{
                startTime:new Date().getTime()
            }
            );var notice=this.CreateNotice(options);notice.data("options",options).hover(function(){
                options.paused=true
            }
            ,function(){
                var now=new Date().getTime();
                options.paused=false;
                if(now-options.startTime&gt;
                options.displayTime/2){
                    options.startTime=now-options.displayTime/2;

                }

            }
            ).find('.notice_close_btn').click(function(){
                if(!quakelive.userinfo.IGNORED_NOTICES){
                    quakelive.userinfo.IGNORED_NOTICES=' ';$.get('/user/clearalerts');var res=confirm("Would you like to be taken to the \"Edit Account\" page to configure which alerts you see?","You are about to close an alert");if(res){
                        quakelive.Goto('user/edit')
                    }

                }
                options.startTime=0
            }
            ).end().appendTo($('#ql_notifier')).animate({
                height:options.noticeHeight
            }
            ,options.animInTime,options.animEaseType)
        }
        ;
        this.CycleNotifications=function(){
            var expiryPaused=false;
            $('#ql_notifier .ql_notice').each(function(ind,domNode){
                var notice=$(domNode);var options=notice.data("options");if(!expiryPaused&&(!options.paused||options.startTime==0)&&(options.startTime+options.displayTime&lt;new Date().getTime())){
                    expiryPaused=true;
                    notice.animate({
                        height:0
                    }
                    ,options.animOutTime,options.animEaseType,function(){
                        notice.remove();
                        expiryPaused=false
                    }
                    )
                }

            }
            );
            var self=this;
            setTimeout(function(){
                self.CycleNotifications()
            }
            ,250)
        }
        ;
        this.CycleNotifications();
        this.ContactPresenceNotice=function(name,icons){
            if(this.IsNoticeFiltered("friend_online")){
                return null
            }
            return{
                body:'A friend has come online.',bodyTop:name+" is online",bodyBot:'<a href="#profile/summary/'+name+'">View Profile</a>',title:'Your friend has come online!',icon:quakelive.resource('/images/players/icon_xl/'+icons.modelskin+'.jpg'),displayTime:5000
            }

        }
        ;
        this.PendingInviteSummaryNotice=function(numPending){
            if(this.IsNoticeFiltered("login_invites")){
                return null
            }
            var plural=numPending!=1;
            return{
                body:numPending+" friend "+(plural?"invites are":"invite is")+" waiting for you.",bodyTop:"Pending Invite",bodyBot:"<a href='#friends/incoming'>Click to view your friend "+(plural?"invites":"invite")+"</a>",title:"You have "+(plural?"pending friend invites!":"a pending friend invite!"),icon:quakelive.resource('/images/awards/lg/veteran.png'),displayTime:10000
            }

        }
        ;
        this.PendingInviteNotice=function(jid,name,modelskin){
            if(this.IsNoticeFiltered("friend_invite")){
                return null
            }
            return{
                body:name+" has requested to be your friend.",bodyTop:"New Friend Invite",bodyBot:"<a href='#profile/summary/"+name+"' class='fl'>View Profile</a><span class='fl'>  |  </span> <a href='javascript:;' uuups='quakelive.mod_friends.AnswerSubscriptionRequest(\""+jid+"\", true); return false'>Accept Invite</a><div class='cl'></div>",title:"You have a new friend invite!",icon:quakelive.resource('/images/players/icon_xl/'+modelskin+'.jpg'),displayTime:5000
            }

        }
        ;
        this.FriendInGameNotice=function(name,modelskin,address,serverId,map){
            if(this.IsNoticeFiltered("friend_ingame")){
                return null
            }
            return{
                body:name+" is playing now!",bodyTop:"Friend In-Game Now",bodyBot:"<a href='javascript:;' uuups='join_server(\""+address+"\"); return false'>Join Game</a><br>Hover over tooltip to view details.",title:"Friend in-game now!",icon:quakelive.resource('/images/players/icon_xl/'+modelskin+'.jpg'),displayTime:8000,onNodeCreated:function(node){
                    quakelive.matchtip.BindMatchTooltip(node,serverId)
                }

            }

        }
        ;
        this.SelfAwardEarnedNotice=function(awardType,awardId,awardName,awardImage,awardDesc,awardFlavor){
            if(!this.awardMarkHandle){
                var self=this;
                this.awardsToMark=this.awardsToMark||[];
                this.awardMarkHandle=setTimeout(function(){
                    var awardsData=self.awardsToMark.join(',');
                    self.awardsToMark=[];
                    $.ajax({
                        type:'post',url:'/profile/mark_awards',data:{
                            awards:awardsData
                        }
                        ,dataType:'json',success:function(json){
                            self.awardMarkHandle=null
                        }
                        ,error:function(){
                            self.awardMarkHandle=null
                        }

                    }
                    )
                }
                ,1000)
            }
            this.awardsToMark[this.awardsToMark.length]=awardId;if(this.IsNoticeFiltered("self_award")){
                return null
            }
            return{
                body:awardDesc,bodyTop:awardName,bodyBot:"<a href='javascript:;' uuups='quakelive.Goto(\"profile/awards/"+quakelive.username+";type="+awardType+";award="+awardId+"\"); return false'>View Award</a>",title:"You have earned an award!",icon:quakelive.resource('/images/awards/lg/'+awardImage+'.png'),displayTime:10000,onNodeCreated:function(node){
                    node.find('.notice_icon').attr("title",awardFlavor)
                }

            }

        }
        ;
        this.FriendAwardEarnedNotice=function(friendName,awardType,awardId,awardName,awardImage,awardDesc,awardFlavor,playerModel){
            if(this.IsNoticeFiltered("friend_award")){
                return null
            }
            var awardPath="profile/awards/"+friendName+";type="+awardType+";award="+awardId;return{
                body:awardDesc,bodyTop:"<a class='fl' href='javascript:;' uuups='quakelive.Goto(\"profile/summary/"+friendName+"\"); return false'>"+"<img src='"+quakelive.resource("/images/players/icon_sm/"+playerModel+".jpg")+"' style='border: 1px solid #666; position: relative; top: 2px; margin-right: 5px'  alt=""></a> "+friendName,bodyBot:"<a class='fl' href='javascript:;' uuups='quakelive.Goto(\""+awardPath+"\"); return false'>View Award</a> <span class='fl'>  |  </span>"+"<a class='fl' href='javascript:;' uuups='quakelive.Goto(\"profile/summary/"+friendName+"\"); return false'>View Profile</a><div class='cl'></div>",title:"<b>"+awardName+"</b> has been awarded!",icon:quakelive.resource('/images/awards/lg/'+awardImage+'.png'),displayTime:5000,onNodeCreated:function(node){
                    node.find('.notice_icon').addClass('interactive').click(function(){
                        quakelive.Goto(awardPath)
                    }
                    ).attr("title",awardFlavor)
                }

            }

        }

    }
    quakelive.notifier=new Notifier();
    quakelive.AddHook('OnAuthenticatedInit',function(){
        quakelive.notifier.LoadFilters()
    }
    )
}
)(jQuery);
(function($){
    quakelive.AD_ZONES={
        main_leaderboard:3,frontpage_square_popup:5,sidebar_half_banner:7,sidebar_square_popup:8,game_details_full_banner:9,forum_leaderboard:10,forum_wide_skyscraper:11,forum_square_popup:12,sidebar_medium_rectangle:16,frontpage_medium_rectangle:17,sidebar_half_page_ad:18,post_game_interstitial:19,pre_game_interstitial:20,post_game_interstitial_tracker:21
    }
    ;
    /************************************************************\
    *
    \************************************************************/
    function DisplayAd(ad,html){
        var isDefault=html.length==0||ad.defaultRegex.test(html);
        var adNode=$(html);
        if(ad.display){
            ad.display(ad,adNode,isDefault)
        }
        else if(isDefault){
            $(ad.target).html(ad.defaultHtml)
        }
        else{
            $(ad.target).empty().append(adNode)
        }

    }
    /************************************************************\
    *
    \************************************************************/
    function LoadAds_ShowAds(adDefs,openxAds){
        for(var i in adDefs){
            var ad=adDefs[i];DisplayAd(ad,openxAds[ad.zone]||"")
        }

    }
    /************************************************************\
    *
    \************************************************************/
    function LoadAds_ShowDefaultContent(adDefs){
        for(var i in adDefs){
            var ad=adDefs[i];DisplayAd(ad,"")
        }

    }
    ;
    var defaultAdOptions={
        defaultRegex:/\/qldefault\//,defaultHtml:''
    }
    ;
    quakelive.LoadAds=function(ads,options,callback){
        var loadOptions=$.extend({
            timeout:15000
        }
        ,options);var url="http://www.radialnetwork.com:8088/openx/www/delivery/spc.php";var zones=[];if(ads instanceof Array){
            for(var i in ads){
                var ad=$.extend({

                }
                ,defaultAdOptions,ads[i]);
                zones[zones.length]=ad.zone;
                zones[i]=ad
            }

        }
        else{
            ads=[$.extend({

            }
            ,defaultAdOptions,ads)];
            zones[0]=ads[0].zone
        }
        if(adblocked){
            LoadAds_ShowDefaultContent(ads);
            if(callback){
                callback()
            }
            return
        }
        url+="?zones="+escape(zones.join("|"));url+="&source=";url+="&r="+Math.floor(Math.random()*99999999);url+=(document.charset?'&charset='+document.charset:(document.characterSet?'&charset='+document.characterSet:''));if(window.location){
            url+="&loc="+escape(window.location)
        }
        if(document.referrer){
            url+="&referer="+escape(document.referrer)
        }
        $.ajax({
            'type':'get','cache':false,'url':url,'dataType':'script','timeout':loadOptions.timeout,'success':function(){
                LoadAds_ShowAds(ads,OA_output)
            }
            ,'error':function(){
                LoadAds_ShowDefaultContent(ads)
            }
            ,'complete':callback
        }
        )
    }
    ;
    var adCache={

    }
    ;
    var AD_RELOAD_TIME=20000;
    quakelive.ReloadAds=function(){
        var ads=[];
        $('.ql_ad_frame').each(function(){
            var node=$(this);var id=node.attr("id");var title=node.attr("title");var time=0;if(!adCache[id]){
                adCache[id]={
                    'title':title,'time':0
                }
                ;node.removeAttr("title")
            }
            else{
                title=adCache[id].title;
                time=adCache[id].time
            }
            var curTime=(new Date().getTime());
            var deltaTime=curTime-adCache[id].time;
            if(deltaTime&gt;
            =AD_RELOAD_TIME){
                adCache[id].time=curTime;
                var adParams={

                }
                ;
                var params={

                }
                ;var pairs=title.split("&");for(var i in pairs){
                    var parts=pairs[i].split("=");params[parts[0]]=parts[1]
                }
                if(quakelive.AD_ZONES[params['zone']]){
                    adParams['zone']=params['zone'];
                    if(params['default']){
                        adParams['defaultHtml']='<div style="background: url('+quakelive.resource(params['default'])+') no-repeat center center; width: 100%; height: 100%"></div>'
                    }
                    adParams['target']=node;
                    ads[ads.length]=adParams
                }
                else{

                }

            }

        }
        );
        if(ads.length&gt;
        0){
            quakelive.LoadAds(ads,{
                'timeout':15000
            }
            )
        }

    }
    ;
    quakelive.AddHook('OnContentLoaded',quakelive.ReloadAds);
    quakelive.AddHook('OnLayoutLoaded',quakelive.ReloadAds)
}
)(jQuery);
(function($){
    var module={

    }
    ;
    module.selectedServer=null;
    module.serverList=[];
    module.defaultFilter='{
        "filters":{
            "group": "any", "game_type": "any", "arena": "any", "state": "any", "difficulty": "any", "location": "any"
        }
        ,'+'"arena_type": "", "players": [], "game_types": [], "ig": 0
    }
    ';
    module.filter={

    }
    ;
    module.bHasCustomFilter=false;
    module.Tags={
        NEW:0,POPULAR:1,SPACE:2,TEAMARENA:3,ASYMETRICCTF:4,BEGINNER:5,INTERMEDIATE:6,ADVANCED:7,SMALL:10,MEDIUM:11,LARGE:12
    }
    ;
    /************************************************************\
    *
    \************************************************************/
    function GetTagId(str){
        switch(str){
            case"beginner":return module.Tags.BEGINNER;case"intermediate":return module.Tags.INTERMEDIATE;case"advanced":return module.Tags.ADVANCED;case"small":return module.Tags.SMALL;case"medium":return module.Tags.MEDIUM;case"large":return module.Tags.LARGE;case"popular":return module.Tags.POPULAR;case"space":return module.Tags.SPACE;case"team arena":return module.Tags.TEAMARENA;case"new for quake live":return module.Tags.NEW;default:return null
        }

    }
    module.GTFilters={
        0:'{
            "GT":"any", "IG":0
        }
        ',1:'{
            "GT":["CTF","CA","TDM"], "IG":0
        }
        ',2:'{
            "GT":["DM"], "IG":0
        }
        ',3:'{
            "GT":["CTF"], "IG":0
        }
        ',4:'{
            "GT":["CA"], "IG":0
        }
        ',5:'{
            "GT":["TDM"], "IG":0
        }
        ',6:'{
            "GT":["TOURNEY"], "IG":0
        }
        ',7:'{
            "GT":"any", "IG":1
        }
        '
    }
    ;
    module.waitHandle=null;
    module.refreshCount=0;
    var SERVER_ERROR_REFRESH_TIMEOUT=60;
    var SERVER_SUCCESS_REFRESH_TIMEOUT=45;
    module.GameTypes=['CA','CTF','TDM','TOURNEY','DM'];
    module.GetLayout=function(){
        if(quakelive.userid||quakelive.pathParts[1]=='advertise'){
            return'postlogin'
        }
        else{
            return'prelogin'
        }

    }
    ;
    quakelive.AddHook('OnModelIconChanged',function(cvar){
        module.LoadModelIcon(cvar)
    }
    );
    module.Init=function(){
        if(!quakelive.userid){
            module.DISPLAY={
                friends:null,lfg:null
            }

        }
        else{
            module.DISPLAY={
                friends:"#qlv_chatControl",lfg:"#lfg_content"
            }

        }
        quakelive.AddHook('OnContentLoaded',module.Hook_OnContentLoaded);
        quakelive.AddHook('OnGameStarted',module.Hook_OnGameStarted);
        quakelive.AddHook('OnGameExited',module.Hook_OnGameExited);
        if(quakelive.username){
            module.FetchFilter()
        }

    }
    ;
    module.FetchFilter=function(){
        var filter=null;
        var data=quakelive.userinfo['BROWSER_FILTER'];
        if(data.length&gt;
        0){
            filter=quakelive.Eval(data);
            if(filter){
                module.filter=filter;
                module.bHasCustomFilter=true
            }
            else{
                filter=null
            }

        }
        if(!filter){
            module.filter=quakelive.Eval(module.defaultFilter)
        }

    }
    ;
    module.Hook_OnContentLoaded=function(targetModule){
        if(targetModule!=module){
            module.StopMatchRefresh()
        }

    }
    ;
    module.OnLayoutLoaded=function(){
        if(quakelive.userid){
            module.LoadModelIcon(quakelive.cvars.Get("model"))
        }
        if(document.loginform&&document.loginform.u){
            document.loginform.u.focus()
        }

    }
    ;
    module.LoadModelIcon=function(cvar){
        var parts=cvar.value.split("/");var model,skin;if(parts.length&gt;=2){
            model=parts[0].toLowerCase();
            skin=parts[1].toLowerCase()
        }
        else{
            model=parts[0].toLowerCase();skin="default"
        }
        if(model[0]=="*"){
            model=model.substring(1)
        }
        module.playericons=new PlayerIconSet(model,skin);
        $('.nametag-icon').html(module.playericons.large);
        $('.nametag-body-md').css('background','url('+quakelive.resource('/images/players/'+model+'/body_'+skin+'_md.png')+') no-repeat')
    }
    ;
    module.ReloadServerList_Error=function(xmlobj,msg,e){
        module.ShowServerListError(msg)
    }
    ;
    module.GetServerHTML=function(server){
        var html="<div id='match-tooltip'>";if(server.players.length&gt;0){
            html+='&lt;p class="row-header"&gt;'+'<span class="num">#</span>'+'<span class="name">Name</span>'+'<span class="score">Score</span>'+'</p>';var total_players=0;for(var playerIdx in server.players){
                var player=server.players[playerIdx];
                var classes='row-content';
                if(player.ping==0){
                    classes+=' bot'
                }
                html+='&lt;p class="'+classes+'"&gt;'+'<span class="num">'+(1+total_players)+'.</span>'+'<span class="name">'+StripColors(player.name)+'</span>'+'<span class="score">'+player.score+'</span>'+'</p>';total_players++
            }

        }
        else{
            html+='No players on server'
        }
        html+='<div style="clear: both"></div> &lt;p class="footer"&gt;Click for details and to join.</p>';html+="</div>";return html
    }
    ;
    module.ReloadServerList_Success=function(data){
        var json=quakelive.Eval(data);
        if(!json||!json.servers){
            module.ShowServerListError('Internal data error');
            return
        }
        quakelive.SendModuleMessage('OnServerListReload',json);
        quakelive.HideTooltip();
        if(json.servers){
            module.serverList=json.servers;for(var serverIndex=0;serverIndex&lt;module.serverList.length;++serverIndex){
                var server=module.serverList[serverIndex];
                if(!server.players){
                    server.players=[]
                }
                var gametype=quakelive.GetGameTypeByID(server.game_type);
                var playerCountString;
                if(server.num_clients!=0){
                    playerCountString=server.num_clients+'/'+server.max_clients+' Players'
                }
                else{
                    playerCountString='Waiting For Players'
                }
                var skill=GetSkillRankInfo(server);var node=$('<div id="match_'+serverIndex+'">'+'<img src="'+quakelive.resource('/images/levelshots/lg/'+server.map.toLowerCase()+'.jpg')+'" alt="" width="165" height="124" class="thumb" >'+'<div class="qlv_inner_box">'+'<div class="gamelabel">'+server.host_name+'</div>'+'<img src="'+skill.img+'" class="gamerank"  alt="">'+'<img src="'+quakelive.resource('/images/gametypes/'+gametype.name+'_md.png')+'" class="gameicon" alt="">'+'<div class="players">'+playerCountString+'</div>'+'</div>'+'</div>');if(serverIndex&lt;3){
                    node.addClass('qlv_pls_bestpick_box ').append('<img src="'+quakelive.resource('/images/sf/login/lbl_bestpick.png')+'" class="best_pick"  alt="">')
                }
                else{
                    node.addClass('qlv_pls_box')
                }
                var matchId='#match_'+serverIndex;
                node.each(function(){
                    var server=module.serverList[serverIndex];
                    quakelive.matchtip.BindMatchTooltip($(this),server.public_id)
                }
                );
                server.node=node
            }
            module.ShowMatches();
            module.StopMatchRefresh();
            module.waitHandle=setTimeout(module.ReloadServerList,SERVER_SUCCESS_REFRESH_TIMEOUT*1000)
        }

    }
    ;
    module.ReloadServerList=function(){
        if(quakelive.username){
            module.ChangeSocialFilter(module.filter.filters.group);
            $.ajax({
                type:'get',url:'/home/matches/'+Base64.encode(JSON.stringify(module.filter)),success:module.ReloadServerList_Success,error:module.ReloadServerList_Error
            }
            )
        }

    }
    ;
    module.ShowMatches=function(){
        var list=module.serverList;var container=$('#qlv_postlogin_matches').empty();for(var matchIndex in list){
            var server=list[matchIndex];
            if(server.node.parentNode){
                server.node.remove()
            }
            container.append(server.node);
            matchIndex++
        }
        module.refreshCount++;
        if(list.length==0){
            container.append('&lt;p class="tc thirtyPxTxt sixtypxv midGrayTxt"&gt;No Games Available</p>');container.append('&lt;p class="tc TwentyPxTxt midGrayTxt"&gt;Check Your Customize Settings</p>')
        }

    }
    ;
    module.JoinServer=function(hostname){
        join_server(hostname)
    }
    ;
    module.StopMatchRefresh=function(){
        if(module.waitHandle!=null){
            clearTimeout(module.waitHandle);
            module.waitHandle=null
        }

    }
    ;
    module.ShowContent=function(content){
        quakelive.ShowContent(content);module.UpdateContentForDownloadState(qlXfer.currentGroup);if(quakelive.username){
            module.InitFilters()
        }
        module.InitTips()
    }
    ;
    var tipIndex;
    var NUM_TIPS=0;
    var TIPS=[];
    var tipWaitHandle;
    module.filtersInitialized=false;
    module.InitFilters=function(){
        module.map_obj=quakelive.Eval($('#map_json').html())||[];
        module.location_obj=quakelive.Eval($('#location_json').html())||[];
        module.location_tag_obj=quakelive.Eval($('#location_tag_json').html())||{

        }
        ;
        module.InitLocationFilter();
        $('.filterbar_content select').unbind();
        $('#ctrl_filter_social').change(function(){
            module.filter.filters.group=this.value;
            module.ChangeSocialFilter(this.value);
            UI_ChangeFilterLabel(this)
        }
        );
        $('#ctrl_filter_gametype').change(function(){
            module.ChangeGameTypeFilter(this.value,true);
            UI_ChangeFilterLabel(this)
        }
        );
        $('#ctrl_filter_arena').change(function(){
            module.ChangeArenaFilter();
            UI_ChangeFilterLabel(this)
        }
        );
        $('#ctrl_filter_gamestate').change(function(){
            module.filter.filters.state=this.value;
            UI_ChangeFilterLabel(this)
        }
        );
        $('#ctrl_filter_difficulty').change(function(){
            module.filter.filters.difficulty=this.value;
            UI_ChangeFilterLabel(this)
        }
        );
        $('#ctrl_filter_location').change(function(){
            module.filter.filters.location=this.value;
            UI_ChangeFilterLabel(this)
        }
        );
        $('.filterbar_content select').change(function(){
            module.ReloadServerList();
            module.UpdateFilterURL(this.name,this.options.selectedIndex);
            module.UI_RefreshFilter()
        }
        );
        $('.filterbar_content select').each(function(){
            if(quakelive.HasParam(this.name)){
                this.options.selectedIndex=quakelive.params[this.name];
                module.filter.filters[this.name]=this.value
            }
            else{
                this.value=module.filter.filters[this.name];
                module.UpdateFilterURL(this.name,this.options.selectedIndex)
            }
            switch(this.name){
                case"group":module.ChangeSocialFilter(module.filter.filters.group);break;case"game_type":module.ChangeGameTypeFilter(module.filter.filters.game_type,false);break;case"difficulty":module.ChangeDifficultyFilter();break;default:break
            }
            UI_ChangeFilterLabel(this)
        }
        );
        module.UI_RefreshFilter()
    }
    ;
    /************************************************************\
    *
    \************************************************************/
    function UI_ChangeFilterLabel(filter){
        if(filter.options.selectedIndex==0){
            $(filter).parent(".filter_control").find("label").removeClass("selected")
        }
        else{
            $(filter).parent(".filter_control").find("label").addClass("selected")
        }

    }
    ;
    module.ChangeSocialFilter=function(value){
        module.filter.players=[];if(value=="friends"){
            for(var i=0;i&lt;quakelive.mod_friends.roster.fullRoster.length;i++){
                if(quakelive.mod_friends.roster.fullRoster[i].IsSubscribed()&&quakelive.mod_friends.roster.fullRoster[i].IsOnline()){
                    module.filter.players.push(quakelive.mod_friends.roster.fullRoster[i].name)
                }

            }

        }

    }
    ;
    module.ChangeGameTypeFilter=function(key,bChangeArena){
        var gt;if(key!="any"){
            var gtf=quakelive.Eval(module.GTFilters[key])||module.GTFilters[0];
            gt=gtf.GT;
            module.filter.ig=gtf.IG
        }
        else{
            gt="any";module.filter.ig=0
        }
        var opt='';$('#ctrl_filter_arena &gt; optgroup:last').empty();module.filter.game_types.length=0;if(gt==null||gt=="any"){
            for(var i in module.GameTypes){
                for(var map in module.map_obj[module.GameTypes[i]].ARENAS){
                    if(!$('#ctrl_filter_arena').containsOption(module.map_obj[module.GameTypes[i]].ARENAS[map].MAP_SYSNAME)){
                        opt='&lt;option label="map" value="'+module.map_obj[module.GameTypes[i]].ARENAS[map].MAP_SYSNAME+'"&gt;'+module.map_obj[module.GameTypes[i]].ARENAS[map].MAP_NAME+'&lt;/option&gt;';$('#ctrl_filter_arena &gt; optgroup:last').append(opt);opt=''
                    }

                }

            }

        }
        else{
            for(var i in gt){
                for(var map in module.map_obj[gt[i]].ARENAS){
                    if(!$('#ctrl_filter_arena').containsOption(module.map_obj[gt[i]].ARENAS[map].MAP_SYSNAME)){
                        opt='&lt;option label="map" value="'+module.map_obj[gt[i]].ARENAS[map].MAP_SYSNAME+'"&gt;'+module.map_obj[gt[i]].ARENAS[map].MAP_NAME+'&lt;/option&gt;';$('#ctrl_filter_arena &gt; optgroup:last').append(opt);opt=''
                    }

                }
                module.filter.game_types.push(module.map_obj[gt[i]].ENGINE_NUM)
            }

        }
        var o=$('#ctrl_filter_arena &gt; optgroup:last').children();module.SortOptions(o);(key==0)?module.filter.filters.game_type="any":module.filter.filters.game_type=key;if(bChangeArena){
            $('#ctrl_filter_arena').selectOptions("any");module.filter.arena_type="";module.filter.filters.arena="any";module.UpdateFilterURL("arena",0)
        }

    }
    ;
    module.ChangeDifficultyFilter=function(){
        if(quakelive.userinfo.NEW_PLAYER&&!module.bHasCustomFilter){
            $('#ctrl_filter_difficulty').selectOptions("1");module.filter.filters.difficulty=1
        }

    }
    ;
    module.ChangeArenaFilter=function(){
        var a=$('#ctrl_filter_arena').selectedOptions()[0];
        if($(a).attr('label')=='tag')module.filter.arena_type='tag';
        else if($(a).attr('label')=='map')module.filter.arena_type='map';
        else module.filter.arena_type='';
        module.filter.filters.arena=a.value
    }
    ;
    module.InitLocationFilter=function(){
        var opt='';for(var i in module.location_tag_obj.TAG){
            if(!$('#ctrl_filter_location').containsOption(module.location_tag_obj.TAG[i])){
                opt='&lt;option value="'+module.location_tag_obj.TAG[i]+'"&gt;'+module.location_tag_obj.TAG[i]+'&lt;/option&gt;';$('#ctrl_filter_location &gt; optgroup:first').append(opt);opt=''
            }

        }
        for(var i in module.location_obj){
            if(!$('#ctrl_filter_location').containsOption(module.location_obj[i].LOCATION_ID)){
                opt='&lt;option value="'+module.location_obj[i].LOCATION_ID+'"&gt;'+module.location_obj[i].LOCATION+'&lt;/option&gt;';$('#ctrl_filter_location &gt; optgroup:last').append(opt);opt=''
            }

        }

    }
    ;
    module.UpdateFilterURL=function(key,value){
        if(value==0)quakelive.RemoveParam(key);else quakelive.AddParam(key,value);quakelive.StopPathMonitor();var filters=quakelive.MergeParams(quakelive.params);if(filters.length&gt;0)window.location.hash="home;"+filters;else window.location.hash="home";quakelive.StartPathMonitor()
    }
    ;
    module.UI_RefreshFilter=function(){
        var ac=0;
        $('.filterbar_content select').each(function(nodeIndex,node){
            if(node.options.selectedIndex!=0)ac++
        }
        );
        if(ac&gt;
        0)$('.filterbar_notice').fadeIn();
        else $('.filterbar_notice').fadeOut()
    }
    ;
    module.SortOptions=function(o){
        var oL=o.length;var sortA=[];for(var i=0;i&lt;oL;i++)sortA[i]={
            v:o[i].value,t:o[i].text
        }
        ;
        sortA.sort(function(o1,o2){
            var o1text=o1.t.toLowerCase(),o2text=o2.t.toLowerCase();
            if(o1text==o2text)return 0;
            else return o1text&lt;
            o2text?-1:1
        }
        );for(var i=0;i&lt;oL;i++){
            o[i].text=sortA[i].t;
            o[i].value=sortA[i].v
        }

    }
    ;
    module.InitTips=function(){
        if(!quakelive.userid){
            return
        }
        if(quakelive.userstatus=='ACTIVE'){
            TIPS=['tip_1.png','tip_2.png','tip_3.png','tip_4.png']
        }
        else{
            TIPS=['tip_unreg_1.png','tip_1.png']
        }
        NUM_TIPS=TIPS.length;
        tipIndex=0;
        quakelive.PreloadImages(quakelive.resource('/images/post_skill_match/tip_1.png'),quakelive.resource('/images/post_skill_match/btn_practice_off.png'),quakelive.resource('/images/post_skill_match/btn_practice_on.png'),quakelive.resource('/images/post_skill_match/btn_left_off.png'),quakelive.resource('/images/post_skill_match/btn_left_on.png'),quakelive.resource('/images/post_skill_match/btn_rt_off.png'),quakelive.resource('/images/post_skill_match/btn_rt_on.png'));
        $('.downloadingTip').fadeOut(0);
        module.ShowTip()
    }
    ;
    module.ShowTip=function(){
        if(!$('#postlogin_dataloading,#postlogin_unregistered,#postlogin_dataready').is(':visible')){
            return
        }
        if(tipWaitHandle){
            clearTimeout(tipWaitHandle);
            tipWaitHandle=null
        }
        $('.downloadingTip').fadeOut(function(){
            $(this).css('background','url('+quakelive.resource('/images/post_skill_match/'+TIPS[tipIndex])+') no-repeat 0 0').fadeIn();
            var nextTipIndex=(tipIndex+1)%NUM_TIPS;
            quakelive.PreloadImages(quakelive.resource('/images/post_skill_match/'+TIPS[nextTipIndex]))
        }
        );
        tipWaitHandle=setTimeout(module.NextTip,30*1000)
    }
    ;
    module.NextTip=function(){
        if(++tipIndex&gt;
        =NUM_TIPS){
            tipIndex=0
        }
        module.ShowTip()
    }
    ;
    module.PrevTip=function(){
        if(--tipIndex&lt;
        0){
            tipIndex=NUM_TIPS-1
        }
        module.ShowTip()
    }
    ;
    module.GotoOnlineGames=function(){
        quakelive.cvars.Set("web_skipLauncher","1",true);quakelive.Goto('home')
    }
    ;
    module.GotoOfflineGames=function(){
        quakelive.cvars.Set("web_skipLauncher","1",true);quakelive.Goto('offlinegame')
    }
    ;module.UpdateContentForDownloadState=function(group){
        if(quakelive.userstatus!='ACTIVE'){
            $('#postlogin_init').hide();
            $('#postlogin_unregistered').show();
            quakelive.mod_register.Hook_OnDownloadGroup({
                'group':group
            }
            );
            return
        }
        var allClasses='post_state_min post_state_base post_state_extra';
        var stateMap={

        }
        ;stateMap[GROUP_MINIMUM]='post_state_min';stateMap[GROUP_BASE]='post_state_base';stateMap[GROUP_EXTRA]='post_state_extra';stateMap[GROUP_DONE]='post_state_extra';var obj=$('.post_state').removeClass(allClasses).addClass(stateMap[group]);if(qlXfer.totalDownloads&gt;0||(group==GROUP_DONE&&!quakelive.cvars.GetIntegerValue("web_skipLauncher"))){
            $('#postlogin_init').hide();
            $('#postlogin_dataloading').show()
        }
        switch(group){
            case GROUP_MINIMUM:break;
            case GROUP_BASE:$('.bigbtn_left,.topbtn_play').click(function(){
                var cmdString="+set bot_dynamicSkill 1 +set com_backgroundDownload 1 +set sv_quitOnExitLevel 1 +set g_gametype 0 +set fraglimit 15 +set timelimit 10 +set bot_startingSkill 2 +map qzwarmup +wait +addbot trainer "+player_skill;LaunchGame(BuildCmdString()+cmdString,true)
            }
            );break;case GROUP_EXTRA:case GROUP_DONE:if(quakelive.cvars.GetIntegerValue("web_skipLauncher")){
                if(quakelive.activeModule==module&&!$('#postlogin_dataready').is(':visible')){
                    $('#postlogin_init').hide();
                    $('#postlogin_dataloading').hide();
                    $('#postlogin_dataready').show();
                    module.ReloadServerList()
                }
                break
            }
            $('#postlogin_dataloading .filterbar').show();
            $('#hidetips').change(function(){
                SetCvar("web_skipLauncher",this.checked?1:0)
            }
            );
            $('.bigbtn_left').css('display','none').fadeIn().unbind().hover(function(){
                $('.btn_online_games').addClass('forced_activebtn')
            }
            ,function(){
                $('.btn_online_games').removeClass('forced_activebtn')
            }
            ).click(function(){
                module.GotoOnlineGames()
            }
            );
            $('.bigbtn_right').css('display','none').fadeIn().unbind().hover(function(){
                $('.btn_offline_games').addClass('forced_activebtn')
            }
            ,function(){
                $('.btn_offline_games').removeClass('forced_activebtn')
            }
            ).click(function(){
                module.GotoOfflineGames()
            }
            );
            $('.btn_online_games').unbind().hover(function(){
                $('.bigbtn_left').addClass('forced_active_bigbtn')
            }
            ,function(){
                $('.bigbtn_left').removeClass('forced_active_bigbtn')
            }
            );
            $('.btn_offline_games').unbind().hover(function(){
                $('.bigbtn_right').addClass('forced_active_bigbtn')
            }
            ,function(){
                $('.bigbtn_right').removeClass('forced_active_bigbtn')
            }
            );
            break
        }

    }
    ;
    module.OnDownloadGroup=function(params){
        if(params.group==GROUP_MINIMUM){
            var CURRENT_WEBCONFIG_VERSION=4;var webConfig=quakelive.cvars.Get("web_configVersion");if(webConfig.value&lt;1){
                var screen=[$(window).width(),$(window).height()];
                var padding=[310,130];
                if(screen[0]&gt;
                =1024+padding[0]&&screen[1]&gt;
                =768+padding[1]){
                    quakelive.cvars.Set("r_inBrowserMode",12)
                }
                else if(screen[0]&gt;
                =800+padding[0]&&screen[1]&gt;
                =600+padding[1]){
                    quakelive.cvars.Set("r_inBrowserMode",9)
                }
                else{
                    quakelive.cvars.Set("r_inBrowserMode",5)
                }
                SetCvar("web_configVersion",1)
            }
            if(webConfig.value&lt;
            2){
                SetBind("F3","readyup");SetBind("h","+chat");SetCvar("web_configVersion",2)
            }
            if(webConfig.value&lt;
            4){
                SetCvar("m_filter",0);SetCvar("web_configVersion",4)
            }

        }
        else if(params.group==GROUP_BASE){

        }
        else if(params.group==GROUP_EXTRA){

        }
        module.UpdateContentForDownloadState(params.group)
    }
    ;
    module.OnOverlayLoaded=function(params){
        if(params[0]=='home'&&params[1]=='crashed'){
            var crashReport=qz_instance.GetCrashReport();
            $('#crashed-report').val(crashReport)
        }

    }
    ;
    module.Hook_OnGameStarted=function(){
        module.StopMatchRefresh()
    }
    ;
    module.Hook_OnGameExited=function(code){
        if(quakelive.activeModule==module){
            module.ReloadServerList()
        }

    }
    ;
    module.ShowServerListError=function(msg){
        $('#qlv_postlogin_matches').html('&lt;p class="tc thirtyPxTxt sixtypxv midGrayTxt"&gt;Unable to load the server list</p>'+'&lt;p class="tc TwentyPxTxt midGrayTxt"&gt;'+msg+'</p>'+'&lt;p class="tc TwentyPxTxt midGrayTxt"&gt;Please try again in a few minutes…</p>');module.StopMatchRefresh();module.waitHandle=setTimeout(module.ReloadServerList,SERVER_ERROR_REFRESH_TIMEOUT*1000)
    }
    ;
    module.StartWarmupGame=function(){
        if(qlXfer.currentGroup&lt;
        GROUP_BASE){
            return
        }
        quakelive.mod_offlinegame.ReplayTrainingGame()
    }
    ;
    module.ToggleFilterBar=function(){
        var node=$('#postlogin_dataready .filterbar');
        var expanded=node.hasClass('filterbar_expanded');
        var curHeight=parseInt($('#qlv_postlogin_matches').css('height'));
        var FILTERBAR_EXPAND=192;
        if(expanded){
            node.removeClass('filterbar_expanded');
            $('#qlv_postlogin_matches').css('height',(curHeight+FILTERBAR_EXPAND)+'px');
            $('.filterbar_toggle_expanded').removeClass('filterbar_toggle_expanded').addClass('filterbar_toggle')
        }
        else{
            node.addClass('filterbar_expanded');
            $('#qlv_postlogin_matches').css('height',(curHeight-FILTERBAR_EXPAND)+'px');
            $('.filterbar_toggle').removeClass('filterbar_toggle').addClass('filterbar_toggle_expanded')
        }

    }
    ;
    module.ResetBrowserFilter=function(){
        var msg="Are you sure you want to reset to the default online games view?";if(confirm(msg)){
            $.ajax({
                type:'get',url:'/home/filter/reset',success:module.ResetBrowserFilter_Success,error:module.ResetBrowserFilter_Error
            }
            )
        }

    }
    ;
    module.ResetBrowserFilter_Success=function(){
        $('.filterbar_content select').each(function(nodeIndex,node){
            node.options.selectedIndex=0;
            quakelive.RemoveParam(this.name);
            UI_ChangeFilterLabel(this)
        }
        );$('.filterbar_notice').fadeOut();quakelive.StopPathMonitor();window.location.hash="home";quakelive.StartPathMonitor();module.filter=quakelive.Eval(module.defaultFilter);module.ReloadServerList()
    }
    ;
    module.ResetBrowserFilter_Error=function(){

    }
    ;
    module.SaveBrowserFilter=function(){
        $.ajax({
            type:'post',url:'/home/filter/update',dataType:'json',data:'filter_obj='+JSON.stringify(module.filter),success:module.SaveBrowserFilter_Success,error:module.SaveBrowserFilter_Error
        }
        )
    }
    ;
    module.SaveBrowserFilter_Success=function(json){
        var modCount=0;
        $('.filterbar_content select').each(function(nodeIndex,node){
            if(node.options.selectedIndex!=0)modCount++
        }
        );
        $('.filterbar_notice &gt;
        a').text('View has been saved.');
        setTimeout(function(){
            $('.filterbar_notice &gt;
            a').text('This view has been customized.')
        }
        ,5*1000);
        if(modCount&gt;
        0)$('.filterbar_notice').fadeIn();
        else $('.filterbar_notice').fadeOut();
        module.ToggleFilterBar()
    }
    ;
    module.SaveBrowserFilter_Error=function(xmlobj,msg,e){

    }
    ;
    var tourOverlay=null;
    module.ShowTour=function(){
        if(!tourOverlay){
            var options={
                modal:true,overlay:75
            }
            ;
            tourOverlay=$(module.TPL_TOUR_OVERLAY).appendTo('body').jqm(options)
        }
        tourOverlay.jqmShow()
    }
    ;
    quakelive.RegisterModule('home',module)
}
)(jQuery);
(function($){
    var module={

    }
    ;
    module.DISPLAY={
        friends:"#qlv_chatControl",lfg:"#lfg_content"
    }
    ;
    module.GetLayout=function(){
        return'postlogin'
    }
    ;
    module.ShowContent=function(c){
        quakelive.ShowContent(c);
        var section;
        if(quakelive.pathParts.length&gt;
        1){
            section=quakelive.pathParts[1]
        }
        else{
            section='site_news'
        }
        $('.qlv_newsNav .selected').removeClass('selected');
        $('.qlv_newsNav .nav_'+section).addClass('selected')
    }
    ;
    quakelive.RegisterModule('news',module)
}
)(jQuery);
(function($){
    var module={

    }
    ;
    module.keyboardNode=null;
    module.overlayNode=null;
    module.Init=function(){
        window.OnInputEvent=module.OnInputEvent;
        module.keyboardNode=$(module.TPL_KEYBOARD);
        module.overlayNode=$(module.TPL_OVERLAY_CONTAINER)
    }
    ;
    module.OnDownloadGroup=function(params){
        if(params.group==GROUP_MINIMUM){
            quakelive.cvars.LoadHardwareCvars()
        }

    }
    ;
    module.LoadConfigPage=function(){
        module.Nav('character')
    }
    ;
    module.LoadModels_Error=function(){
        $('#character_list').html("<div style='width: 200px; height: 200px; margin: 0 auto; text-align: center'>Failed to load model list.<br><div style='cursor: pointer' uuups='quakelive.mod_prefs.LoadModels(); return false'>Click here to reload the list.</div></div>")
    }
    ;
    module.LoadModels_Success=function(json){
        if(json.ECODE==0){
            var count=0;var container=$('#character_list').empty();var row=$('<div></div>');module.models=json;var modelskin=quakelive.cvars.Get("model","sarge/default").value.toLowerCase().split("/");var selIndex=0;var selModel,selSkin;if(modelskin.length==1){
                selModel=modelskin[0];
                selSkin='default'
            }
            else{
                selModel=modelskin[0];
                selSkin=modelskin[1];
                if(selSkin=='red'||selSkin=='blue'){
                    selSkin='default'
                }

            }
            for(var modelIndex in json.MODELS){
                var model=json.MODELS[modelIndex];
                if(model.SKIN=='red'||model.SKIN=='blue'){
                    continue
                }
                if(model.MODEL==selModel&&model.SKIN==selSkin){
                    selIndex=modelIndex
                }
                if(row.size()&gt;
                8){
                    container.append(row);
                    row=$('<div></div>')
                }
                row.append("<a id='cfg_model_"+modelIndex+"' href='javascript:;' uuups='quakelive.mod_prefs.SelectPlayerModel("+modelIndex+"); return false'><img src='"+quakelive.resource("/images/players/icon_md/"+model.MODEL+"_"+model.SKIN+".jpg")+"'  alt=""></a>")
            }
            container.append(row);
            module.SelectPlayerModel(selIndex,modelskin[1])
        }
        else{
            module.LoadModels_Error()
        }

    }
    ;
    module.LoadModels=function(){
        if(module.models){
            module.LoadModels_Success(module.models);
            return
        }
        $.ajax({
            url:'/prefs/listmodels',mode:'abort',port:'listmodels',type:'post',dataType:'json',error:module.LoadModels_Error,success:module.LoadModels_Success
        }
        )
    }
    ;
    var lastColorNodes={

    }
    ;
    module.SelectColor=function(cvarName,num){
        if(lastColorNodes[cvarName]){
            lastColorNodes[cvarName].removeClass('selected')
        }
        lastColorNodes[cvarName]=$('#'+cvarName+'_'+num);
        lastColorNodes[cvarName].addClass('selected');
        SetCvar(cvarName,num)
    }
    ;
    module.InitColors=function(){
        for(var i=0;i&lt;2;++i){
            var cvarName='color'+(i+1);
            lastColorNodes[cvarName]=$('#'+cvarName+'_'+quakelive.cvars.Get(cvarName,'1').value);
            lastColorNodes[cvarName].addClass('selected')
        }

    }
    ;
    var lastCrosshairNode=null;
    module.SelectCrosshair=function(crosshairNum){
        if(lastCrosshairNode){
            lastCrosshairNode.removeClass('selected')
        }
        lastCrosshairNode=$('#crosshair_'+crosshairNum);
        lastCrosshairNode.addClass('selected');
        SetCvar('cg_drawCrosshair',crosshairNum)
    }
    ;
    module.InitCrosshairs=function(){
        var cvar=quakelive.cvars.Get('cg_drawCrosshair','1');
        lastCrosshairNode=$('#crosshair_'+cvar.value);
        lastCrosshairNode.addClass('selected')
    }
    ;module.SelectPlayerModel=function(modelIndex,forceSkin){
        var modelInfo=module.models.MODELS[modelIndex];var modelskin=modelInfo.MODEL+'/'+modelInfo.SKIN;var displaySkin=forceSkin||modelInfo.SKIN;var cmpParts=quakelive.cvars.Get('model').value.toLowerCase().split("/");if(!cmpParts){
            cmpParts=['sarge','default']
        }
        else if(cmpParts.length==1){
            cmpParts[1]='default'
        }
        else{
            if(cmpParts[1]=='red'||cmpParts[1]=='blue'){
                cmpParts[1]='default'
            }

        }
        if(modelskin!=cmpParts.join('/')){
            SetCvar('model',modelskin)
        }
        var details=module.models.DETAILS[modelInfo.DETAILS_ID]||{
            RACE:'',DESC:''
        }
        ;
        $('#character_list').find('.selected').removeClass('selected');
        $('#cfg_model_'+modelIndex).addClass('selected');
        if(modelInfo.SKIN=='default'||modelInfo.SKIN=='blue'||modelInfo.SKIN=='red'||modelInfo.SKIN=='sport'||modelInfo.SKIN=='bright'){
            $('#cfg_char_name').css("background","transparent url("+quakelive.resource("/images/player_names/"+modelInfo.MODEL+".png")+") no-repeat left top")
        }
        else{
            $('#cfg_char_name').css("background","transparent url("+quakelive.resource("/images/player_names/"+modelInfo.NAME+".png")+") no-repeat left top")
        }
        $('#cfg_char_race').css("background","url("+quakelive.resource("/images/player_races/"+details.RACE+".png")+") no-repeat left top");$('#cfg_char_description').html(details.DESC);$('#cfg_char_body').css('background',"url('"+quakelive.resource("/images/players/body_lg/"+modelInfo.MODEL+"_"+displaySkin+".png")+"') no-repeat 0 0").css('behavior','url(/js/iepngfix.htc)');$('#cfg_char_redteam').html("<div class='interactive' style='width: 116px; height: 100px; background: url("+quakelive.resource("/images/players/body_sm/"+modelInfo.MODEL+"_red.png")+") center top no-repeat; _behavior: url(/js/iepngfix.htc);'></div>").unbind('click').click(function(){
            module.SelectPlayerModel(modelIndex,"red");SetCvar('model',modelInfo.MODEL+'/red')
        }
        );$('#cfg_char_blueteam').html("<div class='interactive' style='width: 116px; height: 100px; background: url("+quakelive.resource("/images/players/body_sm/"+modelInfo.MODEL+"_blue.png")+") center top no-repeat; _behavior: url(/js/iepngfix.htc);'></div>").unbind('click').click(function(){
            module.SelectPlayerModel(modelIndex,"blue");SetCvar('model',modelInfo.MODEL+'/blue')
        }
        );$('#cfg_char_lgicon').css('background',"url('"+quakelive.resource("/images/players/icon_xl/"+modelInfo.MODEL+"_"+modelInfo.SKIN+".jpg")+"') no-repeat 0 0").unbind('click').click(function(){
            module.SelectPlayerModel(modelIndex);
            SetCvar('model',modelskin)
        }
        );
        quakelive.SendModuleMessage('OnCharacterChanged',modelIndex)
    }
    ;
    var bind_sections={
        'controls_movement':[['+forward','+back','+moveleft','+moveright'],['+moveup','+movedown','+speed','centerview']],'controls_actions':[['+attack','weapnext','weapprev','+zoom','+button2'],['messagemode','messagemode2','+button3','dropweapon','dropflag']],'controls_weapons':[['weapon 1','weapon 2','weapon 3','weapon 4','weapon 5','weapon 6'],['weapon 7','weapon 8','weapon 9','weapon 10','weapon 11','weapon 12']]
    }
    ;
    module.OnInputEvent=function(keyName){
        if(keyName!='ESCAPE'){
            if(keyName=='BACKSPACE'){
                quakelive.binds.Remove(module.targetBindKey);
                quakelive.binds.Remove(module.targetBindKey2)
            }
            else{
                quakelive.binds.Bind(keyName,module.targetBindAction)
            }
            quakelive.cfgUpdater.Commit()
        }
        module.targetBindKey=module.targetBindKey2=module.targetBindAction=null;
        module.ShowKeyboard();
        module.ShowBinds(module.selectedNav);
        $('#qlv_site_popup').hide()
    }
    ;
    module.ShowBindPopup=function(bind){
        var key;
        if(bind.keys[0]&&bind.keys[1]){
            key='<span class="orangeTxt twentyfourPxTxt"><b>'+bind.keys[0].toUpperCase()+'</b> and <b>'+bind.keys[1].toUpperCase()+'</b></span>'
        }
        else if(bind.keys[0]){
            key='<span class="orangeTxt twentyfourPxTxt"><b>'+bind.keys[0].toUpperCase()+'</b></span>'
        }
        else{
            key=null
        }
        module.targetBindKey=bind.keys[0];module.targetBindKey2=bind.keys[1];module.targetBindAction=bind.action;var html='<div id="assignKeyBox">'+'<div class="tc twentyfourPxTxt" id="assignKeyInfo">Press your desired key or button for <span class="orangeTxt twentyfourPxTxt">"'+bind.name+'"</span>'+'<br>'+'<br>'+'&lt;p class="TwentyPxTxt"&gt;'+(key?('Current assignment: '+key):'')+'</p>'+'</div>'+'<div id="escapeText">Press <span class="bold">ESCAPE</span> to cancel&lt;!-- or <span class="bold">BACKSPACE</span> to clear current binding--&gt;.</div>'+'</div>';$('#qlv_site_popup').html(html).css('z-index',99999).show();qz_instance.CaptureNextInputEvent()
    }
    ;
    module.StartBinding=function(action){
        var bind=quakelive.binds.Get(action);
        if(bind){
            module.ShowBindPopup(bind)
        }

    }
    ;
    module.keyNameToCSS={

    }
    ;
    module.HighlightBindsOnOtherPages=function(skipId){
        for(var sectionIndex in bind_sections){
            if(sectionIndex==skipId){
                continue
            }
            for(var i=0;i&lt;2;++i){
                var binds=bind_sections[sectionIndex][i];for(var bindIndex in binds){
                    var bindAction=binds[bindIndex];
                    var bind=quakelive.binds.Get(bindAction);
                    if(bind.keys[0]){
                        var mappedKey=module.keyNameToCSS[bind.keys[0]]||bind.keys[0].toUpperCase();
                        $('#qlv_keyboard').find('.key_'+mappedKey).addClass('boundOtherPage')
                    }
                    if(bind.keys[1]){
                        var mappedKey=module.keyNameToCSS[bind.keys[1]]||bind.keys[1].toUpperCase();
                        $('#qlv_keyboard').find('.key_'+mappedKey).addClass('boundOtherPage')
                    }

                }

            }

        }

    }
    ;
    module.ShowBindSection=function(id,binds){
        var html="";for(var bindIndex in binds){
            var bindAction=binds[bindIndex];
            var bind=quakelive.binds.Get(bindAction);
            var keyString=null;
            if(bind.keys[0]&&bind.keys[1]){
                keyString=bind.keys[0].toUpperCase()+' or '+bind.keys[1].toUpperCase()
            }
            else if(bind.keys[0]){
                keyString=bind.keys[0].toUpperCase()
            }
            else{
                keyString=" "
            }
            html+='<div class="row">'+'<div class="medlong fl twentypxh middleAlign">'+bind.name+'</div>'+'<div class="hundredtwentywide fl middleAlign" style="cursor: pointer" uuups="quakelive.mod_prefs.StartBinding(''+bind.action+'', this); return false">'+keyString+'</div>'+'<div class="cl"></div>'+'</div>';if(bind.keys[0]){
                var mappedKey=module.keyNameToCSS[bind.keys[0]]||bind.keys[0].toUpperCase();
                $('#qlv_keyboard').find('.key_'+mappedKey).addClass('boundThisPage')
            }
            if(bind.keys[1]){
                var mappedKey=module.keyNameToCSS[bind.keys[1]]||bind.keys[1].toUpperCase();
                $('#qlv_keyboard').find('.key_'+mappedKey).addClass('boundThisPage')
            }

        }
        $('#'+id).html(html)
    }
    ;
    module.ShowBinds=function(id){
        module.ShowBindSection(id+'_binds0',bind_sections[id][0]);
        module.ShowBindSection(id+'_binds1',bind_sections[id][1]);
        module.HighlightBindsOnOtherPages(id)
    }
    ;
    module.ShowKeyboard=function(){
        module.keyboardNode.remove().appendTo($('.keyboard_container'));
        $('#qlv_keyboard').find('.boundThisPage,.boundOtherPage').removeClass('boundThisPage').removeClass('boundOtherPage')
    }
    ;
    module.Nav=function(where){
        var tpl='';
        var container=$('#configContainer');
        switch(where){
            case'character':container.html(module.TPL_CHARACTER);
            module.LoadModels();
            break;
            case'settings_basic':container.html(module.TPL_SETTINGS_BASIC);
            module.InitColors();
            module.InitCrosshairs();
            module.InitSlider('s_volume',0,1,0.1,20,function(value){
                $('#effects_volume_value').text(parseInt(value*100)+'%')
            }
            );
            module.InitSlider('s_musicvolume',0,1,0.1,20,function(value){
                $('#music_volume_value').text(parseInt(value*100)+'%')
            }
            );
            module.InitSlider('r_gamma',0,2,0.1,50,function(value){
                $('#brightness_value').text(parseInt(value*100)+'%')
            }
            );
            module.InitYesNo('r_fullscreen');
            module.InitYesNo('cg_autoswitch');
            module.InitSelect('r_mode',[0,'320x240',1,'400x300',2,'512x384',3,'640x360',4,'640x400',5,'640x480',6,'800x450',7,'852x480',8,'800x500',9,'800x600',10,'1024x640',11,'1024x576',12,'1024x768',13,'1152x864',14,'1280x720',15,'1280x768',16,'1280x800',17,'1280x1024',18,'1440x900',19,'1600x900',20,'1600x1000',21,'1680x1050',22,'1600x1200',23,'1920x1080',24,'1920x1200',25,'1920x1440',26,'2048x1536',27,'2560x1600',-2,'Maximum']);
            module.InitSelect('r_inbrowsermode',[5,'640x480',9,'800x600',12,'1024x768']);
            break;
            case'settings_advanced':container.html(module.TPL_SETTINGS_ADVANCED);
            module.InitYesNo('s_doppler');
            module.InitYesNo('cg_drawtargetnames');
            module.InitYesNo('cg_playvoicechats');
            module.InitYesNo('cg_showvoicetext');
            module.InitYesNo('cg_allowtaunt');
            module.InitYesNo('r_ext_compressed_textures');
            module.InitSelect('r_texturemode',['GL_LINEAR_MIPMAP_NEAREST','Bilinear','GL_LINEAR_MIPMAP_LINEAR','Trilinear']);
            module.InitSelect('r_picmip',[2,'Low',1,'Normal',0,'High']);
            module.InitSelect('r_lodbias',[2,'Low',1,'Medium',0,'High']);
            module.InitSelect('r_vertexlight',[1,'Vertex',0,'Lightmap']);
            module.InitSlider('cg_fov',75,130,1,1,function(value){
                $('#fov_value').text(value+' degrees')
            }
            );
            break;
            case'controls_actions':container.html(module.TPL_CONTROLS_ACTIONS);
            module.ShowKeyboard();
            module.ShowBinds(where);
            break;
            case'controls_movement':container.html(module.TPL_CONTROLS_MOVEMENT);
            module.ShowKeyboard();
            module.ShowBinds(where);
            break;
            case'controls_weapons':container.html(module.TPL_CONTROLS_WEAPONS);
            module.ShowKeyboard();
            module.ShowBinds(where);
            break;
            case'controls_mouse':container.html(module.TPL_CONTROLS_MOUSE);
            module.ShowKeyboard();
            module.InitYesNo('m_pitch',[-0.022,0.022]);
            module.InitSlider('sensitivity',0,10,1,10,function(value){
                $('#mouse_sens_value').text(value)
            }
            );
            break
        }
        module.selectedNav=where
    }
    ;
    module.InitSlider=function(cvarName,min,max,step,scale,fnChange){
        var cvar=quakelive.cvars.Get(cvarName);
        var node=$('#slider_'+cvarName);
        scale=scale||100;
        step=step||1;
        node.slider({
            'min':{
                "x":min*scale
            }
            ,'max':{
                "x":max*scale
            }
            ,'stepping':{
                "x":step
            }
            ,'startValue':scale*cvar.value,'change':function(e,ui){
                SetCvar(cvarName,ui.value/scale);
                if(fnChange){
                    fnChange(ui.value/scale)
                }

            }

        }
        );
        if(fnChange){
            fnChange(cvar.value)
        }

    }
    ;
    module.InitSelect=function(cvarName,options){
        var cvar=quakelive.cvars.Get(cvarName);var node=$('#select_'+cvarName).empty();for(var i=0;i&lt;options.length;i+=2){
            var opt=$('&lt;option value="'+options[i]+'"&gt;'+options[i+1]+'&lt;/option&gt;');if(options[i]==cvar.value){
                opt.attr('selected','selected')
            }
            node.append(opt)
        }
        node.change(function(){
            SetCvar(node.attr('name'),node.val())
        }
        )
    }
    ;
    module.InitYesNo=function(cvarName,values){
        var cvar=quakelive.cvars.Get(cvarName);
        if(!values){
            values=[1,0]
        }
        var node=$('#'+cvarName);var isOnChecked=(cvar.value!=values[1]);node.empty();node.append("On ");var html;html="&lt;input type=\"radio\" name=\""+cvarName.toLowerCase()+"\" value=\"1\" ";if(isOnChecked){
            html+=" checked=\"checked\" "
        }
        html+=" onclick=\"SetCvar('"+cvarName+"', '"+values[0]+"')\" ";html+=" /&gt;";node.append(html);node.append("    ");node.append("Off ");html="&lt;input type=\"radio\" name=\""+cvarName.toLowerCase()+"\" value=\"0\" ";if(!isOnChecked){
            html+=" checked=\"checked\" "
        }
        html+=" onclick=\"SetCvar('"+cvarName+"', '"+values[1]+"')\" ";html+=" /&gt;";node.append(html)
    }
    ;
    module.ResetDefaults=function(){
        if(!confirm("This will reset ALL options to their default values. Are you sure you want to continue?")){
            return
        }
        qz_instance.SetHardwareCvars("");jQuery.ajax({
            cache:false,url:"/prefs/reset",success:function(html){
                window.location='/user/login_redirect'
            }
            ,error:function(request,errorType,errorException){

            }
            ,complete:function(request,completionType){

            }

        }
        )
    }
    ;
    module.overlayVisible=false;
    module.ShowOverlay=function(){
        module.CloseOverlay();
        module.overlayNode.css('position','absolute');
        module.overlayNode.css('z-index','10001');
        var container=$('#qlv_OverlayContent');
        container.append(module.overlayNode);
        module.overlayVisible=true;
        module.LoadConfigPage()
    }
    ;
    module.CloseOverlay=function(){
        if(module.overlayVisible){
            module.overlayNode.remove();
            module.overlayVisible=false
        }

    }
    ;
    quakelive.RegisterModule('prefs',module)
}
)(jQuery);
(function($){
    var module={

    }
    ;
    module.GetLayout=function(){
        if(quakelive.path=="register"){
            return'prelogin'
        }
        else if(quakelive.userid&&quakelive.userstatus=='ACTIVE'){
            return'postlogin_bare'
        }
        else{
            return'bare'
        }

    }
    ;
    module.Init=function(){
        quakelive.PreloadClasses('dl-subtitle-check','dl-subtitle-min','dl-subtitle-base','dl-subtitle-done','dl-subtitle-extra','dl-btn-play-off','dl-btn-play-on');
        quakelive.AddHook('OnDownloadGroup',module.Hook_OnDownloadGroup);
        quakelive.AddHook('OnContentLoaded',module.Hook_OnContentLoaded)
    }
    ;
    module.Hook_OnContentLoaded=function(){
        if(quakelive.ie_resume_install){
            quakelive.Goto('register/2b');
            setTimeout(upgrade,1000);
            quakelive.ie_resume_install=false
        }

    }
    ;
    module.FocusField=function(){
        var helpNode=$('#help_'+this.id);
        if(helpNode.find('.error').size()==0){
            helpNode.addClass('grayBack').addClass('grayBorder').removeClass('transBorder').removeClass('transBack').find('.help').show()
        }

    }
    ;
    module.BlurField=function(){
        var helpNode=$('#help_'+this.id);
        if(helpNode.find('.error').size()==0){
            helpNode.removeClass('grayBack').removeClass('grayBorder').addClass('transBack').addClass('transBorder').find('.help').hide()
        }

    }
    ;
    module.ShowContent=function(content){
        quakelive.ShowContent('');$('#qlv_OverlayContent').html(content).find("input").focus(module.FocusField).blur(module.BlurField);if(!quakelive.IsCompatibleBrowser()){
            quakelive.Overlay('home/compat',"quakelive.Goto('home'); return false");return
        }
        if(quakelive.path=="register"){
            if(module.savedFormData){
                for(var fieldName in module.savedFormData){
                    var field=$('#'+fieldName);
                    if(field.attr('type')&&field.attr('type').toLowerCase()=='checkbox'){
                        if(module.savedFormData[fieldName]){
                            field.attr('checked','checked')
                        }
                        else{
                            field.removeAttr('checked')
                        }

                    }
                    else{
                        field.val(module.savedFormData[fieldName])
                    }

                }

            }
            if(module.step1Errors){
                module.ShowStep1aError(module.step1Errors);
                module.step1Errors=null
            }
            $('#firstname').focus()
        }
        else{
            var formVars=module.savedFormData;switch(quakelive.path){
                case"register/1b":if(!formVars){
                    quakelive.Goto('home');
                    return
                }
                $('#fullname').html(formVars.firstname+' '+formVars.lastname);$('#email').html(formVars.email);$('#nametag').html(formVars.nametag);break;case"register/transfer":quakelive.mod_prefs.LoadConfigPage();break
            }

        }

    }
    ;
    module.thandles=[];
    module.EndGameMode=function(){
        for(var index in module.thandles){
            clearTimeout(module.thandles[index])
        }
        module.thandles=[];window.onbeforeunload=null;window.location='/user/login_redirect'
    }
    ;
    module.OnGameExited=function(code){
        if(quakelive.userstatus!='ACTIVE'){
            $('#game_verifier').remove();var html='<div id="game_verifier_container"><div id="game_verifier">'+'&lt;h1&gt;Verifying skill placement results…&lt;/h1&gt;'+'<img src="'+quakelive.resource('/images/loader.gif')+'" width="62" height="13"  alt="">'+'&lt;h3&gt;Please wait while we verify the results of your Skill Placement match.&lt;/h3&gt;'+'</div></div>';var trainingResult={

            }
            ;
            $('#qlv_game_mode_viewport').append(html);
            $.ajax({
                url:'/register/training_done/'+code,dataType:'json',success:function(data){
                    trainingResult=data
                }
                ,error:function(){
                    trainingResult.ACCOUNT_ACTIVE=false
                }
                ,complete:function(){
                    if(trainingResult.ACCOUNT_ACTIVE){
                        quakelive.mod_friends.node.find('.reg_step_2').html('<img src="'+quakelive.resource('/images/chatfill/userreg/step_2_completed.png')+'" width="300" height="117"  alt="">');quakelive.mod_friends.node.find('.reg_step_3').html('<img src="'+quakelive.resource('/images/chatfill/userreg/step_3_on.png')+'" width="300" height="117"  alt="">');$('#game_verifier').html('&lt;h1&gt;Skill placement match completed!&lt;/h1&gt;'+'<img src="'+quakelive.resource('/images/loader.gif')+'" width="62" height="13"  alt="">'+'&lt;h3&gt;Please wait while we activate your account.&lt;/h3&gt;');module.thandles[module.thandles.length]=setTimeout(function(){
                            quakelive.mod_friends.node.find('.reg_step_2').html('<img src="'+quakelive.resource('/images/chatfill/userreg/step_2_completed.png')+'" width="300" height="117"  alt="">');quakelive.mod_friends.node.find('.reg_step_3').html('<img src="'+quakelive.resource('/images/chatfill/userreg/step_3_completed.png')+'" width="300" height="117"  alt="">');$('#game_verifier').html('&lt;h1&gt;Your account is now active!&lt;/h1&gt;'+'<img src="'+quakelive.resource('/images/loader.gif')+'" width="62" height="13"  alt="">'+'&lt;h3&gt;Congratulations! Your skill placement match has been completed and your account activated. You can now start fragging your friends in online games!<br><br>Please wait as we redirect you to the full site. <a href="/">Click here</a> if you are not automatically redirected to the main site in a few moments.&lt;/h3&gt;');module.thandles[module.thandles.length]=setTimeout(function(){
                                quakelive.mod_register.EndGameMode()
                            }
                            ,9000)
                        }
                        ,3000)
                    }
                    else{
                        CreateCookie('failed_training',1,0);$('#game_verifier').html('&lt;h1&gt;Your Account is <b>NOT</b> Active!&lt;/h1&gt;'+'<img src="'+quakelive.resource('/images/loader.gif')+'" width="62" height="13"  alt="">'+'&lt;h3&gt;You <b>must</b> play the 10 minute Placement Match in order to gain full access to the site.<br><br><a href="javascript:;" uuups="quakelive.mod_register.EndGameMode(); return false">Click here</a> if you are not automatically redirected to the main site in a few moments.<br><br><small>If you are continuing to have problems with your skill placement match please visit the <a href="/forum" target="qlforum">QUAKE LIVE support forum</a> for additional help.</small>&lt;/h3&gt;');module.thandles[module.thandles.length]=setTimeout(function(){
                            quakelive.mod_register.EndGameMode()
                        }
                        ,13000)
                    }

                }

            }
            )
        }

    }
    ;
    var skillNameIdMap={
        'easy':0,'medium':1,'hard':2,'nightmare':3
    }
    ;
    module.StartBotMatch=function(defaultSkill){
        if(qlXfer.currentGroup&lt;
        GROUP_BASE){
            return
        }
        var skillVal=$('#skill').val()||'';
        if(skillVal==''){
            skillVal='easy'
        }
        quakelive.cvars.Set('web_botskill',skillVal);
        $.ajax({
            url:'/register/skiptraining/'+skillVal,complete:function(){
                $('#overlay-raw').hide();$('#overlay-bg').hide();var cmdString="+set bot_dynamicSkill 1 +set com_backgroundDownload 1 +set sv_quitOnExitLevel 1 +set g_gametype 0";if(quakelive.userstatus=='ACTIVE'){
                    cmdString+=" +arena "+skillVal
                }
                else{
                    quakelive.skipEndGame=true;cmdString+=" +set bot_startingSkill "+(skillNameIdMap[skillVal]||0)+" +map qztraining"
                }
                LaunchGame(BuildCmdString()+cmdString,true)
            }

        }
        )
    }
    ;
    module.Hook_OnDownloadGroup=function(params){
        if(quakelive.userstatus=='ACTIVE'){
            return
        }
        switch(params.group){
            case GROUP_MINIMUM:$('.dl-progress-text').empty();
            if(params.numfiles&gt;
            0){
                $('.dl-subtitle').attr('class','dl-subtitle dl-subtitle-min');$('#dl-text-header').html('A Skill Placement Match is now being downloaded. QUAKE LIVE uses the results of this 10 minute Placement Match to suggest online games with other players at your skill level. Please click the red "PLAY" button to begin.')
            }
            break;
            case GROUP_BASE:$('.dl-btn-play').removeClass('dl-btn-play-off').addClass('dl-btn-play-on').show();
            if(params.numfiles&gt;
            0){
                if(quakelive.userstatus=='ACTIVE'){
                    $('#dl-main-play').show()
                }
                $('.dl-subtitle').attr('class','dl-subtitle dl-subtitle-extra');$('#dl-text-header').html('The Skill Placement Match is now ready, and you will continue to download the rest of QUAKE LIVE as you play this match. The skill of your opponent in this match will adjust to match yours. Please click the red "PLAY" button to begin.')
            }
            else{
                $('.dl-subtitle').attr('class','dl-subtitle dl-subtitle-check');
                $('#dl-text-header').html('Checking your downloaded data… Please wait.')
            }
            break;
            case GROUP_EXTRA:$('.dl-btn-play').removeClass('dl-btn-play-off').addClass('dl-btn-play-on').show();
            if(params.numfiles&gt;
            0){
                $('.dl-subtitle').attr('class','dl-subtitle dl-subtitle-extra');$('#dl-text-header').html('The Skill Placement Match is now ready, and you will continue to download the rest of QUAKE LIVE as you play this match. The skill of your opponent in this match will adjust to match yours. Please click the red "PLAY" button to begin.')
            }
            else{
                $('.dl-subtitle').attr('class','dl-subtitle dl-subtitle-check');
                $('#dl-text-header').html('Checking your downloaded data… Please wait.')
            }
            break;case GROUP_DONE:$('.dl-btn-play').removeClass('dl-btn-play-off').addClass('dl-btn-play-on').show();$('.dl-percent-text').text('All Downloads Complete');$('.dl-timeleft').empty();$('.dl-progress-text').empty();$('.dl-progress').hide();$('.dl-subtitle').attr('class','dl-subtitle dl-subtitle-done');$('#dl-text-header').html('QUAKE LIVE is now completely downloaded. You must complete the 10 minute Placement Match so that we can suggest online games with other players at your skill level. Please click the red "PLAY" button to begin.');break
        }

    }
    ;
    module.ShowRegistration=function(){
        if(!quakelive.CheckBrowserCompat()){
            return
        }
        if(quakelive.userid){
            quakelive.Goto('home');
            return
        }
        quakelive.Goto('register')
    }
    ;
    module.GotoStep1a=function(){
        quakelive.Goto('register')
    }
    ;
    module.ShowStep1aError=function(err){
        for(var fieldName in err.ERRORS){
            $('#help_'+fieldName+' .help').hide();$('#help_'+fieldName+' .error').remove();$('#help_'+fieldName).append("<span class='error'>"+err.ERRORS[fieldName]+"</span>");module.StyleAsError(fieldName)
        }
        var msg;
        if(!err.ERRORS||err.ERRORS.length==0){
            msg=err.MSG
        }
        else{
            msg="An error has occurred. Please correct the highlighted fields and try again."
        }
        $('.reg_error_block').html(msg).effect('pulsate',{
            times:1
        }
        ,500);
        $('.orangeTxt').effect('pulsate',{
            times:1
        }
        ,500)
    }
    ;var formData={

    }
    ;var savedFormData={

    }
    ;
    module.ShowRegistration=function(){
        formData={

        }
        ;savedFormData={

        }
        ;
        if(quakelive.CheckBrowserCompat()){
            quakelive.Goto("register")
        }

    }
    ;
    module.GotoStep1b=function(){
        var formData={

        }
        ;
        $('#qlv_OverlayContent').find('input,select').each(function(){
            if($(this).attr('type').toLowerCase()=='checkbox'){
                formData[this.name]=$(this).attr('checked')?1:0
            }
            else{
                formData[this.name]=$(this).val()
            }

        }
        );
        $.ajax({
            url:'/register/checkuser',type:'post',data:formData,dataType:'json',error:function(){
                module.ClearFieldErrors();
                module.ShowStep1aError({
                    ECODE:-1,ERRORS:{

                    }
                    ,MSG:'General Error. Try again.'
                }
                )
            }
            ,success:function(json){
                module.ClearFieldErrors();
                if(parseInt(json.ECODE)==0){
                    module.savedFormData=formData;quakelive.Goto('register/1b',null,true)
                }
                else{
                    module.ShowStep1aError(json)
                }

            }

        }
        )
    }
    ;
    module.GotoStep2a=function(){
        var postData=$.extend(module.savedFormData,{
            captcha:$('#captcha').val()
        }
        );
        $.ajax({
            url:'/register/newuser',type:'post',data:postData,dataType:'json',error:function(){
                module.step1Errors={
                    ECODE:-1,ERRORS:{

                    }
                    ,MSG:'General Error. Try again.'
                }
                ;
                quakelive.Goto('register')
            }
            ,success:function(json){
                module.ClearFieldErrors();
                var code=parseInt(json.ECODE);
                module.StyleAsDefault('captcha');
                if(code==0){
                    module.savedFormData={

                    }
                    ;module.formData={

                    }
                    ;
                    window.location='/user/login_redirect'
                }
                else if(code==-1001){
                    module.ReloadCaptcha();module.StyleAsError('captcha');$('#help_captcha').append("<span class='error'>"+json.MSG+"</span>")
                }
                else{
                    module.step1Errors=json;
                    quakelive.Goto('register')
                }

            }

        }
        )
    }
    ;
    module.GotoStep2b=function(){
        module.StyleAsDefault('code');
        $.ajax({
            url:'/register/mailverify',type:'post',data:{
                action:'verify',code:$('#code').val()
            }
            ,dataType:'json',error:function(){
                $('#help_code .error').remove();$('#help_code').append("<span class='error'>Invalid verification code</span>");module.StyleAsError('code')
            }
            ,success:function(json){
                quakelive.userstatus='REGISTERED';
                if(parseInt(json.ECODE)==0){
                    if(typeof(qz_instance)!='undefined'){
                        quakelive.Goto('register/transfer',null,true)
                    }
                    else{
                        window.location='/user/login_redirect'
                    }

                }
                else{
                    $('#help_code .error').remove();$('#help_code').append("<span class='error'>"+json.MSG+"</span>");module.StyleAsError('code')
                }

            }

        }
        )
    }
    ;
    module.StyleAsDefault=function(id){
        $('#help_'+id+' .error').remove();$('#wrap_'+id).removeClass('orangeBorder');$('#label_'+id).removeClass('orangeTxt');$('#help_'+id).removeClass('orangeBack').removeClass('orangeBorder').removeClass('blackTxt').addClass('whiteTxt');$('.reg_error_block').html(" ")
    }
    ;
    module.StyleAsError=function(id){
        $('#wrap_'+id).addClass('orangeBorder');
        $('#label_'+id).addClass('orangeTxt');
        $('#help_'+id).addClass('orangeBack').addClass('orangeBorder').addClass('blackTxt').removeClass('whiteTxt')
    }
    ;
    module.ClearFieldErrors=function(){
        $('#qlv_OverlayContent').find('input').each(function(){
            module.StyleAsDefault(this.id)
        }
        );module.StyleAsDefault('birthdate');$('#help_birthdate').empty();$('.reg_error_block').html(" ")
    }
    ;
    module.Close=function(){
        if(confirm("Are you sure you want to close registraiton?")){
            quakelive.Goto('home')
        }

    }
    ;
    module.Logout=function(){
        if(confirm("Are you sure you want to log out of registration?")){
            quakelive.Logout()
        }

    }
    ;
    module.SendEmailVerify=function(){
        $.ajax({
            url:'/register/mailverify',mode:'abort',port:'verifymail',type:'post',data:{
                action:'send'
            }
            ,dataType:'json',error:function(){
                alert("Error sending verification mail. Please try again later.")
            }
            ,success:function(json){
                alert("Verification mail sent. Please check your mailbox.")
            }

        }
        )
    }
    ;
    var clickCount=0;
    module.InstallPlugin=function(){
        CreateCookie(ie_cookie_string,1,1);
        if(clickCount++&gt;
        0){
            if(!confirm("You have already clicked to download the plugin once. Please remember that you must restart your web browser after installing QUAKE LIVE before you can continue past this step.\n\nClick OK if you need to download the plugin installer again.")){
                return
            }

        }
        upgrade()
    }
    ;
    module.ReloadCaptcha=function(){
        $('#captcha_img').attr('src','/captcha.php?v='+(new Date()).getTime()+Math.random());
        $('#captcha').val('')
    }
    ;
    module.OnPluginInstalled=function(){
        if(quakelive.userstatus=='UNVERIFIED'){
            quakelive.Goto('register/2a',null,true)
        }
        else if(quakelive.userstatus=='REGISTERED'){
            if(quakelive.querystring.standby){
                window.location='/user/login_redirect'
            }
            else{
                if(ReadCookie('failed_training')){
                    quakelive.Goto('home')
                }
                else{
                    quakelive.Goto('register/transfer')
                }

            }

        }

    }
    ;
    quakelive.RegisterModule('register',module)
}
)(jQuery);
(function($){
    var PresType={
        Unknown:0,Available:1,Chat:2,Away:3,Dnd:4,Xa:5,Unavailable:6
    }
    ;
    var S10nType={
        None:0,NoneOut:1,NoneIn:2,NoneOutIn:3,To:4,ToIn:5,From:6,FromOut:7,Both:8
    }
    ;var QZ_PRIVACYLIST="quakelive";var PrivAction={
        Allow:'allow',Deny:'deny'
    }
    ;
    var PrivType={
        Undefined:'undefined',JID:'jid',Group:'group',Sub:'subscription'
    }
    ;
    var PrivPacketType={
        Message:1,PresenceIn:2,PresenceOut:4,IQ:8,All:15
    }
    ;
    var PrivResult={
        StoreSuccess:0,ActivateSuccess:1,DefaultSuccess:2,RemoveSuccess:3,RequestNamesSuccess:4,RequestListsSuccess:5,Conflict:6,ItemNotFound:7,BadRequest:8,UnknownError:9
    }
    ;
    var PrivActiveList=null;
    var Groups={
        None:'',Online:'online',Offline:'offline',Active:'active',Recent:'recent'
    }
    ;
    var Admins={
        None:'',Admin:'admin',QLive:'quake_live',Broadcast:'broadcast'
    }
    ;
    /************************************************************\
    *
    \************************************************************/
    function EscapeHTML(html){
        html=html.replace(/\&/g,'&');
        html=html.replace(/\&lt;
        /g,'&lt;
        ');
        html=html.replace(/\&gt;
        /g,'&gt;
        ');
        return html
    }
    /************************************************************\
    *
    \************************************************************/
    function JID(jid){
        this.bare=jid;
        var ofs=jid.indexOf('@');
        if(ofs!=-1){
            this.username=jid.substring(0,ofs)
        }
        else{
            this.username=jid;this.bare=jid+"@"+quakelive.siteConfig.xmppDomain
        }
        this.Clone=function(){
            return new JID(this.bare)
        }

    }
    ;
    /************************************************************\
    *
    \************************************************************/
    function Roster(){
        this.selectedContact=null;
        this.pendingRequests=[];
        this.fullRoster=[];
        this.rosterData={

        }
        ;
        this.ImportRoster=function(){
            var remoteRoster=GetRemoteRoster();this.UI_Show();for(var who in remoteRoster){
                var rosterElem=remoteRoster[who];
                var jid=new JID(who);
                var contact=new RosterItem(jid,rosterElem.NAME,rosterElem.SUBSCRIPTION,rosterElem.ONLINE?PresType.Available:PresType.Unavailable);
                roster.AddContact(contact);
                if(contact.CanDisplayOnRoster()){
                    contact.UI_PlaceInGroup(Groups.Online)
                }
                if(rosterElem.SUBSCRIPTION==S10nType.From){
                    var request={

                    }
                    ;
                    request.jid=who;
                    roster.AddPendingRequest(request)
                }

            }
            if(quakelive.activeModule==module){
                if(quakelive.pathParts[1]=="manage"){
                    module.LoadManageItems()
                }
                else if(quakelive.pathParts[1]=="pending"){
                    module.LoadPending()
                }

            }

        }
        ;
        this.ImportRosterData=function(json){
            roster.rosterData=json;
            roster.ImportRoster();
            roster.UI_OnRosterUpdated();
            roster.DisplayChatAreaHelp();
            quakelive.SendModuleMessage('IM_OnRosterChanged')
        }
        ;
        this.GetIndexByJID=function(jid){
            var rosterIndex=-1;for(var i=0;i&lt;this.fullRoster.length;++i){
                if(this.fullRoster[i].jid.bare==jid.bare){
                    rosterIndex=i;
                    break
                }

            }
            return rosterIndex
        }
        ;
        this.GetContactByJID=function(jid){
            var index=this.GetIndexByJID(jid);
            if(index!=-1){
                return this.fullRoster[index]
            }
            else{
                return null
            }

        }
        ;
        this.GetIndexByName=function(name){
            var rosterIndex=-1;var lcName=name.toLowerCase();for(var i=0;i&lt;this.fullRoster.length;++i){
                if(this.fullRoster[i].name.toLowerCase()==lcName){
                    rosterIndex=i;
                    break
                }

            }
            return rosterIndex
        }
        ;
        this.AddContact=function(item){
            var rosterIndex=this.GetIndexByJID(item.jid);
            if(rosterIndex!=-1){
                return
            }
            this.fullRoster[this.fullRoster.length]=item
        }
        ;
        this.AddPendingRequest=function(request){
            var jid=new JID(request.jid);var index=0;for(;index&lt;this.pendingRequests.length;++index){
                if(this.pendingRequests[index].bare==jid.bare){
                    break
                }

            }
            if(index==this.pendingRequests.length){
                this.pendingRequests[this.pendingRequests.length]=jid
            }
            if(quakelive.pathParts[0]=="friends"){
                if(quakelive.pathParts[1]=="pending"){
                    module.UI_AddPendingItem(jid,-1)
                }

            }

        }
        ;
        this.HasPendingRequests=function(){
            return(this.pendingRequests.length&gt;
            0)?true:false
        }
        ;
        this.RemoveContactByName=function(name){
            var rosterIndex=this.GetIndexByName(name);
            this.RemoveContactByIndex(rosterIndex)
        }
        ;
        this.RemoveContactByJID=function(jid){
            var rosterIndex=this.GetIndexByJID(jid);
            this.RemoveContactByIndex(rosterIndex)
        }
        ;
        this.RemoveContactByIndex=function(rosterIndex){
            var contact=null;
            if(rosterIndex!=-1){
                var contact=this.fullRoster[rosterIndex];
                if(this.selectedContact==contact){
                    this.DeselectContact()
                }
                this.fullRoster=RemoveArrayIndex(this.fullRoster,rosterIndex)
            }
            if(contact){
                contact.UI_RemoveFromGroup()
            }

        }
        ;
        this.GetIncomingValues=function(){
            var index=-1;var values=[];for(var i=0;i&lt;this.pendingRequests.length;i++){
                values.push(this.pendingRequests[i].bare.split('@')[0])
            }
            return values
        }
        ;
        this.GetOutgoingValues=function(){
            var index=-1;var values=[];for(var i=0;i&lt;this.fullRoster.length;++i){
                if(this.fullRoster[i].IsInvited()){
                    values.push(this.fullRoster[i].name.toLowerCase())
                }

            }
            return values
        }
        ;
        this.DeselectContact=function(){
            if(this.selectedContact!=null){
                module.node.find('#im-chat').remove();
                this.selectedContact.OnDeselected();
                this.selectedContact=null
            }
            this.DisplayChatAreaHelp()
        }
        ;
        this.DisplayChatAreaHelp=function(){
            var node=$("<div style='padding: 60px 20px; text-align: center; line-height: 22px'></div>");var msg='';if(this.fullRoster.length&gt;0){
                var tips=["Tip: You can join a friend who is playing Quake LIVE by clicking the <img src='"+quakelive.resource("/images/im/icon_qz.png")+"'  alt=""> icon next to their name.","Tip: You can find new friends to add to your roster by browsing the <a href='javascript:void(0)' uuups='quakelive.Goto(\"profile/summary/"+quakelive.username+"\")'>QUAKE LIVE Profile</a> pages."];msg=tips[Math.floor(Math.random()*tips.length)]
            }
            else{
                msg="Your friends list is empty. Use the <a href='javascript:void(0)' uuups='quakelive.Goto(\"friends\")'>Friends Manager</a> to add friends to your Quake LIVE account."
            }
            node.append(msg);
            module.node.find('#im-footer').html(node)
        }
        ;
        this.BindChatEvents=function(contact){
            module.node.find('#im-chat-close').click(function(){
                roster.DeselectContact()
            }
            );
            if(!contact.isAdmin){
                var sendChatMessage=function(){
                    var msgNode=module.node.find('#chat-msg');
                    var msg=msgNode.val();
                    if(msg.length&gt;
                    0){
                        contact.SendMessage(msg);
                        msgNode.val('')
                    }
                    module.node.find('#chat-msg').focus()
                }
                ;
                var msgNode=module.node.find('#chat-msg').keyup(function(eventObject){
                    if(eventObject.keyCode==13){
                        sendChatMessage();
                        eventObject.preventDefault()
                    }

                }
                );
                if(!quakelive.IsGameRunning()){
                    msgNode.focus()
                }
                module.node.find('#im-chat-send').click(sendChatMessage)
            }

        }
        ;
        this.UnbindChatEvents=function(){
            module.node.find('#im-chat-close').unbind("click");module.node.find('#chat-msg').unbind("keyup");module.node.find('#im-chat-send').unbind("click")
        }
        ;
        this.SelectContact=function(contact){
            if(this.selectedContact==contact){
                if(!quakelive.IsGameRunning()){
                    module.node.find('#chat-msg').focus()
                }
                return
            }
            this.DeselectContact();
            this.selectedContact=contact;
            contact.OnSelected();
            if(contact.isAdmin){
                module.node.find('#im-footer').html("<div id='im-chat'>"+"<div id='im-chat-close'></div>"+"<div id='im-chat-body'>"+"<div id='im-chat-body-bottom'></div>"+"</div>"+"</div>")
            }
            else{
                module.node.find('#im-footer').html("<div id='im-chat'>"+"<div id='im-chat-close'></div>"+"<div id='im-chat-body'>"+"<div id='im-chat-body-bottom'></div>"+"</div>"+"&lt;input id='chat-msg' type='text' /&gt;"+"<div id='im-chat-send'></div>"+"</div>")
            }
            this.UnbindChatEvents();this.BindChatEvents(contact);for(var i=0;i&lt;contact.history.length;++i){
                contact.AppendToHistory(contact.history[i])
            }
            roster.ScrollChatToBottom()
        }
        ;
        this.ScrollChatToBottom=function(){
            var pane=module.node.find('#im-chat-body');
            pane.scrollTop(10000000)
        }
        ;var OverlayTips=["You can join a friend who is playing by clicking the QUAKE LIVE icon next to their name.","Use the Duel Detective to quickly find a new game against someone at your skill level.","Your <a href='javascript:;' uuups='quakelive.Goto(\"profile/summary/%PLAYER_NICK%\"); return false'>QUAKE LIVE profile</a> displays your recent matches, awards, and <a href='javascript:;' uuups='quakelive.Goto(\"profile/stats/%PLAYER_NICK%\"); return false'>statistics.</a>"];this.GetOverlayTip=function(){
            var str=OverlayTips[Math.floor(Math.random()*OverlayTips.length)];
            str=str.replace(/%PLAYER_NICK%/g,quakelive.username);
            return str
        }
        ;
        this.SwapOverlayTip=function(){
            if(this.GetNumOnlineContacts()&gt;
            0){
                return
            }
            if(!quakelive.IsGameRunning()){
                module.node.find('#im-overlay-footer').html("<p>"+this.GetOverlayTip()+"</p>")
            }
            var self=this;
            setTimeout(function(){
                self.SwapOverlayTip()
            }
            ,30000)
        }
        ;var PreLoginTips=["QUAKE LIVE is 100% free to play. <a href='javascript:;' uuups='quakelive.mod_register.ShowRegistration(); return false'>Join now</a> to get started!","QUAKE LIVE allows you to quickly get into a game with your friends. <a href='javascript:;' uuups='quakelive.mod_register.ShowRegistration(); return false'>Join now!</a>","QUAKE LIVE will match you with equally skilled players. <a href='javascript:;' uuups='quakelive.mod_register.ShowRegistration(); return false'>Click here to join!</a>"];this.GetPreLoginTip=function(){
            return PreLoginTips[Math.floor(Math.random()*PreLoginTips.length)]
        }
        ;
        this.SwapPreLoginTip=function(){
            if($('#chatfill-footer').size()==0||quakelive.userid){
                return
            }
            $('#chatfill-footer').html("<p>"+this.GetPreLoginTip()+"</p>");var self=this;setTimeout(function(){
                self.SwapPreLoginTip()
            }
            ,30000)
        }
        ;
        var self=this;
        quakelive.AddHook('OnLayoutLoaded',function(){
            self.SwapPreLoginTip();
            self.UI_ShowAdvertisement()
        }
        );
        this.ui_state='';
        this.ui_advert_shown=false;
        this.UI_Show=function(){
            var state='';
            if(quakelive.userstatus!='ACTIVE'){
                state='userreg'
            }
            else if(this.GetNumOnlineContacts()&gt;
            0){
                state='friends'
            }
            else{
                state='nofriends'
            }
            if(state!='userreg'&&!this.ui_advert_shown){
                this.UI_ShowAdvertisement();
                return
            }
            if(state!=this.ui_state){
                switch(state){
                    case'userreg':this.UI_ShowUserReg();
                    break;
                    case'friends':this.UI_ShowApp();
                    break;
                    case'nofriends':this.UI_ShowOverlay();
                    break
                }
                this.ui_state=state
            }

        }
        ;
        this.UI_FinishAnimateAd=function(){
            if(this.ui_advert_handle){
                clearTimeout(this.ui_advert_handle);
                this.ui_advert_handle=null
            }
            self.ui_advert_shown=true;
            self.UI_Show()
        }
        ;
        this.UI_StartAnimateAd=function(){
            var self=this;
            var PX_PER_MS=1.25;
            this.ui_advert_handle=setTimeout(function(){
                $('#sponsor_large_advert').animate({
                    height:"0px"
                }
                ,600*PX_PER_MS,'linear',function(){
                    $('#sponsor_large_advert').remove();
                    $('#sponsor_advert').show();
                    $('#sponsor_advert .ql_ad_frame').show().css('height','0').animate({
                        height:'250px'
                    }
                    ,250*PX_PER_MS,'linear',function(){
                        $('#post_sponsor_content').slideUp(0).slideDown(400);
                        self.UI_FinishAnimateAd()
                    }
                    )
                }
                )
            }
            ,4000)
        }
        ;
        this.UI_ShowAdvertisement=function(){
            if(this.ui_advert_handle){
                return
            }
            this.ui_advert_handle=null;
            var self=this;
            quakelive.LoadAds({
                'zone':quakelive.AD_ZONES.sidebar_half_page_ad,'display':function(ad,adNode,isDefault){
                    if(isDefault){
                        $('#sponsor_large_advert').remove();
                        $('#sponsor_advert,#sponsor_advert .ql_ad_frame,#post_sponsor_content').show();
                        self.UI_FinishAnimateAd()
                    }
                    else{
                        $('#sponsor_large_advert').empty().append(adNode);
                        self.UI_StartAnimateAd()
                    }

                }

            }
            ,{
                timeout:1000
            }
            )
        }
        ;
        this.UI_ShowOverlay=function(){
            module.node.html("<div id='im-overlay-header'></div>"+"<div id='im-overlay-body'>"+"<p>"+"Finding friends and opponents is EASY!  <a href='javascript:;' uuups='quakelive.Goto(\"friends/search\"); return false'>Click here to start your search.</a>"+"<a class='btn_friends' href='javascript:;' uuups='quakelive.Goto(\"friends/search\"); return false'></a>"+"Click the button above to access the friends manager and <a href='javascript:;' uuups='quakelive.Goto(\"friends/search\"); return false'>add more players to your friends list</a>."+"</div>"+"<div id='im-overlay-footer'>"+"</div>");this.SwapOverlayTip();module.FitToParent()
        }
        ;
        this.UI_ShowUserReg=function(){
            $('.sponsor_media').remove();module.node.html("<div id='im-userreg'><div style='height: 100px'> </div><div class='reg_step_1'></div><div class='reg_step_2'></div><div class='reg_step_3'></div></div>");module.node.find('.reg_step_1').html('<img src="'+quakelive.resource('/images/chatfill/userreg/step_1_completed.png')+'" width="300" height="117"  alt="">');module.node.find('.reg_step_2').html('<img src="'+quakelive.resource('/images/chatfill/userreg/step_2_on.png')+'" width="300" height="117"  alt="">');module.node.find('.reg_step_3').html('<img src="'+quakelive.resource('/images/chatfill/userreg/step_3_off.png')+'" width="300" height="117"  alt="">');module.FitToParent()
        }
        ;
        this.UI_ShowApp=function(){
            module.node.html(module.TPL_FRIENDS_LIST);for(var i in this.fullRoster){
                var contact=this.fullRoster[i];
                if(contact.CanDisplayOnRoster()&&contact.group!=Groups.None){
                    contact.UI_PlaceInGroup(contact.group,true)
                }

            }
            module.FitToParent()
        }
        ;
        this.GetNumOnlineContacts=function(){
            var numOnline=0;for(var i in this.fullRoster){
                if(this.fullRoster[i].CanDisplayOnRoster()){
                    numOnline++
                }

            }
            return numOnline
        }
        ;
        this.UI_OnRosterUpdated=function(){
            var numOnline=this.GetNumOnlineContacts();
            this.UI_Show();
            if(numOnline&gt;
            0){
                module.node.find('#im-header').html("<span>"+numOnline+" friend"+(numOnline==1?"":"s")+" online</span>")
            }

        }

    }
    ;
    var rosterId=0;
    /************************************************************\
    *
    \************************************************************/
    function RosterItem(jid,name,s10nType,presType){
        this.jid=jid.Clone();
        this.name=name||this.jid.username;
        this.unreadMsgCount=0;
        this.presence=presType;
        this.subscription=s10nType;
        this.history=[];
        this.group=Groups.None;
        var data=roster.rosterData[this.name.toLowerCase()];
        this.player_id=0;
        this.player_nick=this.name;
        this.clan='';
        this.join_date=null;
        this.total_kills=0;
        this.most_played_gt='unknown';
        this.time_played=0;
        this.last_online=null;
        this.last_online_date=null;
        this.bio='';
        this.inGame=false;
        this.prevServerID=0;
        this.model='sarge';
        this.skin='default';
        this.country='US';
        this.country_name='United States';
        var node=NewItemNode(this.name);
        this.node=node;
        this.icons=new PlayerIconSet('sarge','default');
        this.UpdateDetails=function(data){
            this.player_id=data.PLAYER_ID;
            this.player_nick=data.PLAYER_NICK;
            this.clan=data.PLAYER_CLAN;
            this.join_date=data.JOIN_DATE;
            this.total_kills=data.TOTAL_KILLS;
            this.most_played_gt=data.MOST_PLAYED_GT;
            this.time_played=data.TIME_PLAYED;
            this.last_online=data.LAST_ONLINE;
            this.last_online_date=data.LAST_ONLINE_DATE;
            this.bio=data.BIO;
            this.icons=new PlayerIconSet(data.MODEL,data.SKIN);
            this.model=data.MODEL;
            this.skin=data.SKIN;
            this.country=data.COUNTRY_ABBREV;
            this.country_name=data.COUNTRY_NAME
        }
        ;
        this.DisplayChatIcon=function(){
            var link=$("<a href='javascript:;'></a>").bind("click",function(event){
                quakelive.Goto("profile/summary/"+this.player_nick);event.stopPropagation()
            }
            ).append(this.icons.small);
            this.node.find('.rosteritem-playericon').empty().append(link)
        }
        ;
        var rosterItem=this;
        if(data){
            this.UpdateDetails(data)
        }
        else{

        }
        var display_name="<span class='player_name'>";if(this.clan){
            display_name+="<small>"+StripColors(this.clan)+"</small>"
        }
        display_name+=this.player_nick;display_name+="</span>";this.node.find('.rosteritem-name').html(display_name);this.CanDisplayOnRoster=function(){
            return(this.presence!=PresType.Unavailable)&&(this.subscription==S10nType.Both)
        }
        ;
        this.IsSubscribed=function(){
            return this.subscription==S10nType.Both
        }
        ;
        this.IsInvited=function(){
            return(this.subscription==S10nType.NoneOut)||(this.subscription==S10nType.To)
        }
        ;
        this.IsOnline=function(){
            return(this.presence!=PresType.Unavailable)&&(this.presence!=PresType.Unknown)&&(this.subscription==S10nType.Both)
        }
        ;
        this.StartInactivityTimeout=function(){
            if(this.timeoutHandle){
                clearTimeout(this.timeoutHandle)
            }
            var contact=this;
            this.timeoutHandle=setTimeout(function(){
                if(roster.selectedContact!=contact){
                    if(contact.group==Groups.Active){
                        if(contact.CanDisplayOnRoster()){
                            contact.UI_PlaceInGroup(Groups.Online)
                        }
                        else{
                            contact.UI_RemoveFromGroup()
                        }
                        contact.timeoutHandle=null
                    }

                }
                else{
                    contact.StartInactivityTimeout()
                }

            }
            ,180*1000)
        }
        ;
        this.ReceivedMsg=function(what){
            this.UI_PlaceInGroup(Groups.Active);
            if(roster.selectedContact==null){
                roster.SelectContact(this)
            }
            this.history[this.history.length]={
                origin:1,'msg':what
            }
            ;
            if(roster.selectedContact==this){
                this.AppendToHistory(this.history[this.history.length-1]);
                roster.ScrollChatToBottom()
            }
            else{
                this.unreadMsgCount++;
                if(this.unreadMsgCount==1){
                    this.node.addClass('chat-unread')
                }

            }
            this.StartInactivityTimeout()
        }
        ;
        this.SendMessage=function(what){
            quakelive.Tick();
            this.history[this.history.length]={
                origin:0,'msg':what
            }
            ;
            this.AppendToHistory(this.history[this.history.length-1]);
            roster.ScrollChatToBottom();
            if(this.group!=Groups.Active){
                this.UI_PlaceInGroup(Groups.Active)
            }
            this.StartInactivityTimeout();
            qz_instance.IM_SendMessage(this.jid.bare,what)
        }
        ;
        this.prevChatOrigin=-1;
        this.prevChatNode=null;
        this.AppendToHistory=function(hist){
            var html='';
            if(this.prevChatOrigin!=hist.origin){
                var node=$('<div></div>');
                if(hist.origin==0){
                    node.attr('class','chat-history-me');node.append(quakelive.mod_home.playericons.medium);node.append("&lt;h1&gt;"+quakelive.username+"&lt;/h1&gt;")
                }
                else{
                    node.attr('class','chat-history-them');node.append(this.icons.medium);node.append("&lt;h1&gt;"+this.player_nick+"&lt;/h1&gt;")
                }
                node.append("<div>"+EscapeHTML(hist.msg)+"</div>");this.prevChatNode=node;module.node.find('#im-chat-body-bottom').before(this.prevChatNode);this.prevChatOrigin=hist.origin
            }
            else{
                this.prevChatNode.children('div').append("<br>"+EscapeHTML(hist.msg))
            }

        }
        ;this.UI_PlaceInGroup=function(groupType,force){
            if(!force){
                roster.UI_Show()
            }
            this.DisplayChatIcon();if(force||this.group!=groupType){
                var prevGroup=this.group;
                this.UI_RemoveFromGroup();
                this.group=groupType;
                var contact=this;
                this.node.click(function(){
                    roster.SelectContact(contact)
                }
                ).appendTo(module.node.find('#im-'+groupType+' .itemlist'));
                module.UI_SortRoster(groupType);
                module.node.find('#im-'+groupType).show();
                this.UI_SetGameStatus(this.gameStatus);
                if(this.group==Groups.None&&roster.selectedContact==contact){
                    roster.DeselectContact()
                }
                if(!roster.skipNotices&&this.group==Groups.Online&&(prevGroup==Groups.Offline||prevGroup==Groups.None)){
                    quakelive.notifier.Notify(quakelive.notifier.ContactPresenceNotice(this.player_nick,this.icons))
                }

            }

        }
        ;
        this.UI_RemoveFromGroup=function(){
            if(this.group==Groups.None){
                return
            }
            if(!this.node[0].nextSibling&&!this.node[0].previousSibling){
                module.node.find('#im-'+this.group).hide()
            }
            this.node.remove();
            this.group=Groups.None
        }
        ;
        this.UI_SetGameStatus=function(status){
            var container=this.node.children('.rosteritem-gameicon').empty();
            this.gameStatus=$.extend({

            }
            ,status);
            this.gameStatus.SERVER_ID=parseInt(this.gameStatus.SERVER_ID);
            this.gameStatus.BOT_GAME=parseInt(this.gameStatus.BOT_GAME);
            this.gameStatus.PUBLIC_ID=parseInt(this.gameStatus.PUBLIC_ID);
            this.gameStatus=status;
            this.inGame=false;
            if(this.gameStatus&&this.gameStatus.BOT_GAME==0){
                this.inGame=true;var iconNode=$('<img src="'+quakelive.resource("/images/im/icon_qz.png")+'" style="cursor: pointer" id="icon_'+this.jid.username+'"  alt="">');quakelive.matchtip.BindMatchTooltip(iconNode,status.SERVER_ID);container.append(iconNode);if(this.gameStatus.SERVER_ID!=0&&this.prevServerID!=this.gameStatus.SERVER_ID){
                    this.prevServerID=this.gameStatus.SERVER_ID;
                    quakelive.notifier.Notify(quakelive.notifier.FriendInGameNotice(this.player_nick,this.icons.modelskin,this.gameStatus.ADDRESS,this.gameStatus.SERVER_ID,this.gameStatus.MAP))
                }

            }

        }
        ;
        this.OnSelected=function(){
            this.node.addClass('rosteritem-selected');
            this.node.removeClass('chat-unread');
            this.unreadMsgCount=0;
            this.prevChatOrigin=-1;
            this.prevChatNode=null
        }
        ;
        this.OnDeselected=function(){
            this.node.removeClass('rosteritem-selected')
        }

    }
    /************************************************************\
    *
    \************************************************************/
    function RecentItem(id,name,status,met,game){
        this.id=id;
        this.name=name;
        this.status=status;
        this.met=met;
        this.game=game;
        var node=new NewItemNode(this.name);
        this.node=node;
        this.icons=new PlayerIconSet('sarge','default');
        var rosterItem=this;
        $.ajax({
            url:'/friends/details/'+this.name,dataType:'json',success:function(json){
                rosterItem.icons=new PlayerIconSet(json.MODEL,json.SKIN);
                rosterItem.node.find('.rosteritem-playericon').html(rosterItem.icons.small)
            }

        }
        );this.UI_PlaceInGroup=function(groupType,force){
            var contact=this;
            this.node.click(function(){
                quakelive.Goto("profile/summary/"+this.name)
            }
            ).appendTo(module.node.find('#im-'+groupType+' .itemlist'));
            module.node.find('#im-'+groupType).show()
        }

    }
    /************************************************************\
    *
    \************************************************************/
    function BroadcastItem(jid,name){
        this.jid=jid.Clone();
        this.name=name;
        this.history=[];
        this.group=Groups.None;
        this.unreadMsgCount=0;
        this.isAdmin=true;
        var node=NewAlertNode(this.name);
        this.node=node;
        var rosterItem=this;
        this.StartInactivityTimeout=function(){
            if(this.timeoutHandle)clearTimeout(this.timeoutHandle);
            var contact=this;
            this.timeoutHandle=setTimeout(function(){
                if(node.attr('id')!='rosteralert-selected'){
                    if(contact.group==Groups.Active){
                        if(contact.group==Groups.Active){
                            contact.UI_RemoveFromGroup();
                            contact.timeoutHandle=null
                        }

                    }

                }
                else{
                    contact.StartInactivityTimeout()
                }

            }
            ,15*1000)
        }
        ;
        this.ReceivedMsg=function(what){
            this.UI_PlaceInGroup(Groups.Active);
            if(roster.selectedContact==null){
                roster.SelectContact(this)
            }
            this.history[this.history.length]={
                origin:1,'msg':what
            }
            ;
            if(roster.selectedContact==this){
                this.AppendToHistory(this.history[this.history.length-1]);
                roster.ScrollChatToBottom()
            }
            else{
                this.unreadMsgCount++;
                if(this.unreadMsgCount==1){
                    this.node.addClass('chat-unread')
                }

            }
            this.StartInactivityTimeout()
        }
        ;
        this.prevChatOrigin=-1;
        this.prevChatNode=null;
        this.AppendToHistory=function(hist){
            var html='';
            if(this.prevChatOrigin!=hist.origin){
                var node=$('<div></div>');
                if(hist.origin==0){
                    node.attr('class','chat-history-me');node.append(quakelive.mod_home.playericons.medium);node.append("&lt;h1&gt;"+quakelive.username+"&lt;/h1&gt;")
                }
                else{
                    node.attr('class','chat-history-them');node.append("&lt;h1&gt;"+this.name+"&lt;/h1&gt;")
                }
                node.append("<div>"+EscapeHTML(hist.msg)+"</div>");this.prevChatNode=node;module.node.find('#im-chat-body-bottom').before(this.prevChatNode);this.prevChatOrigin=hist.origin
            }
            else{
                this.prevChatNode.children('div').append("<br>"+EscapeHTML(hist.msg))
            }

        }
        ;this.UI_PlaceInGroup=function(groupType,force){
            if(force||this.group!=groupType){
                this.UI_RemoveFromGroup();
                this.group=groupType;
                var contact=this;
                this.node.click(function(){
                    roster.SelectContact(contact)
                }
                ).appendTo(module.node.find('#im-'+groupType+' .itemlist'));
                module.UI_SortRoster(groupType);
                module.node.find('#im-'+groupType).show()
            }

        }
        ;
        this.UI_RemoveFromGroup=function(){
            if(this.group==Groups.None){
                return
            }
            if(!this.node[0].nextSibling&&!this.node[0].previousSibling){
                module.node.find('#im-'+this.group).hide()
            }
            this.node.remove();
            this.group=Groups.None
        }
        ;
        this.OnSelected=function(){
            this.node.attr('id','rosteralert-selected');
            this.node.removeClass('chat-unread');
            this.unreadMsgCount=0;
            this.prevChatOrigin=-1;
            this.prevChatNode=null
        }
        ;
        this.OnDeselected=function(){
            this.node.removeAttr('id')
        }

    }
    /************************************************************\
    *
    \************************************************************/
    function NewItemNode(name){
        this.name=name;var node=$("<div class='rosteritem'></div>");node.append("<span class='rosteritem-playericon'></span>");node.append("<span class='rosteritem-name'>"+this.name+"</span>");node.append("<span class='rosteritem-gameicon'></span>");return node
    }
    /************************************************************\
    *
    \************************************************************/
    function NewAlertNode(name){
        this.name=name;
        switch(name){
            case Admins.Admin:this.img="titleLiveAdmin.png";break;case Admins.Broadcast:this.img="titleLiveMessage.png";break;case Admins.QLive:this.img="titleQuakeLiveTeam.png";break;default:this.img="titleLiveMessage.png";break
        }
        var node=$("<div class='rosteralert'></div>");node.append("<span><img src='"+quakelive.resource("/images/im/"+img)+"' width='300' height='21'  alt=""></span>");return node
    }
    /************************************************************\
    *
    \************************************************************/
    function PrivacyList(listname){
        this.listname=listname;
        this.privItems=[];
        this.ImportPrivList=function(json){
            this.privItems.length=0;for(var i=0;i&lt;json.items.length;i++){
                var newitem=json.items[i];
                var pitem=new PrivacyItem(newitem);
                this.AddItem(pitem)
            }
            qz_instance.IM_ActivatePrivacyList(QZ_PRIVACYLIST)
        }
        ;
        this.AddItem=function(item){
            var index=this.GetIndexByValue(item.value);
            if(index!=-1)return;
            this.privItems[this.privItems.length]=item
        }
        ;
        this.RemoveItemByValue=function(value){
            var index=this.GetIndexByValue(value);
            var item=null;
            if(index!=-1){
                var item=this.privItems[index];
                this.privItems=RemoveArrayIndex(this.privItems,index)
            }

        }
        ;
        this.GetIndexByValue=function(value){
            var index=-1;for(var i=0;i&lt;this.privItems.length;++i){
                if(this.privItems[i].value==value){
                    index=i;
                    break
                }

            }
            return index
        }
        ;
        this.GetItemByValue=function(value){
            var index=this.GetIndexByValue(value);
            if(index!=-1)return this.privItems[index];
            else return null
        }
        ;
        this.GetValueList=function(){
            var index=-1;var values=[];for(var i=0;i&lt;this.privItems.length;++i){
                values.push(this.privItems[i].value.split('@')[0])
            }
            return values
        }
        ;
        this.SaveList=function(){
            if(this.privItems.length&gt;
            0){
                var list={

                }
                ;
                list.items=this.privItems;
                list.name=QZ_PRIVACYLIST;
                qz_instance.IM_SetPrivacyList(QZ_PRIVACYLIST,JSON.stringify(list));
                qz_instance.IM_ActivatePrivacyList(QZ_PRIVACYLIST)
            }
            else{
                qz_instance.IM_RemovePrivacyList(QZ_PRIVACYLIST)
            }

        }
        ;
        this.BlockUser=function(name){
            var index=this.GetIndexByValue(name);
            if(index&gt;
            -1){
                this.privItems[index].action=PrivAction.Deny
            }
            else{
                var jid=new JID(name.toLowerCase());
                var obj={
                    "type":"jid","action":PrivAction.Deny,"packet":15,"value":jid.bare
                }
                ;
                var pitem=new PrivacyItem(obj);
                this.AddItem(pitem)
            }
            this.SaveList()
        }
        ;
        this.UnblockUser=function(name){
            var index=this.GetIndexByValue(name);
            var jid=new JID(name.toLowerCase());
            this.RemoveItemByValue(jid.bare);
            this.SaveList()
        }

    }
    ;
    /************************************************************\
    *
    \************************************************************/
    function PrivacyItem(item){
        this.action=item.action;
        this.packet=item.packet;
        this.type=item.type;
        this.value=item.value
    }
    ;
    module={

    }
    ;
    var roster=module.roster=new Roster();
    var privlist=module.privlist=new PrivacyList(QZ_PRIVACYLIST);
    module.Init=function(){
        var html="<div id='im'>"+"</div>";module.node=$(html)
    }
    ;
    module.LAYOUT='postlogin';
    module.DISPLAY={
        friends:"#qlv_chatControl",lfg:"#lfg_content"
    }
    ;
    module.ShowContent=function(content){
        $('#qlv_contentBody').html(content);
        var emptymsg='';
        switch(quakelive.pathParts[1]){
            case'manage':emptymsg='No Friends to Manage';
            module.UI_SetupEmptyMessage(emptymsg);
            module.LoadManageItems();
            break;
            case'incoming':emptymsg='No Invites Received';
            module.UI_SetupEmptyMessage(emptymsg);
            module.LoadIncoming();
            break;
            case'outgoing':emptymsg='No Invites Outstanding';
            module.UI_SetupEmptyMessage(emptymsg);
            module.LoadOutgoing();
            break;
            case'search':if(quakelive.pathParts[2]){
                switch(quakelive.pathParts[2]){
                    case'email':module.UI_SetupSearchContacts();
                    break;
                    case'invite':module.UI_SetupInvite();
                    break
                }

            }
            else{
                module.UI_SetupSearchKeyword()
            }
            break;
            case'unblock':emptymsg='No Players Blocked';
            module.UI_SetupEmptyMessage(emptymsg);
            module.LoadBlockItems();
            break
        }

    }
    ;
    module.LoadManageItems=function(){
        if(roster.fullRoster.length==0){
            $("#fr_empty").show()
        }
        else{
            for(var i=0;i&lt;roster.fullRoster.length;i++){
                if(roster.fullRoster[i].IsSubscribed()){
                    module.UI_AddManagedItem(roster.fullRoster[i])
                }

            }

        }

    }
    ;
    module.LoadIncoming=function(){
        $.ajax({
            url:'/friends/outgoing/items',type:'POST',data:{
                users:JSON.stringify(roster.GetIncomingValues())
            }
            ,dataType:'json',success:function(json){
                if(json.ECODE==0){
                    if(json.PENDING.length==0){
                        $("#fr_empty").show()
                    }
                    else{
                        for(var i=0;i&lt;json.PENDING.length;i++){
                            module.UI_AddIncomingItem(json.PENDING[i])
                        }

                    }

                }

            }

        }
        )
    }
    ;
    module.LoadOutgoing=function(){
        $.ajax({
            url:'/friends/outgoing/items',type:'POST',data:{
                users:JSON.stringify(roster.GetOutgoingValues())
            }
            ,dataType:'json',success:function(json){
                if(json.ECODE==0){
                    if(json.PENDING.length==0){
                        $("#fr_empty").show()
                    }
                    else{
                        for(var i=0;i&lt;json.PENDING.length;i++){
                            module.UI_AddOutgoingItem(json.PENDING[i])
                        }

                    }

                }

            }

        }
        )
    }
    ;
    module.LoadBlockItems=function(){
        if(privlist.privItems.length&gt;
        0){
            $.ajax({
                url:'/friends/unblock/items',type:'POST',data:{
                    users:JSON.stringify(privlist.GetValueList())
                }
                ,dataType:'json',success:function(json){
                    if(json.ECODE==0){
                        if(json.BLOCKED.length==0){
                            $("#fr_empty").show()
                        }
                        else{
                            for(var i=0;i&lt;json.BLOCKED.length;i++){
                                module.UI_AddBlockedItem(json.BLOCKED[i])
                            }

                        }

                    }

                }

            }
            )
        }
        else{
            $("#fr_empty").show()
        }

    }
    ;
    module.FitToParent=function(){
        var elemStaticHeight={
            '#im-body':250,'#im-overlay-body':116,'#im-userreg':0
        }
        ;var parentHeight=module.node.parent().innerHeight();for(var elemId in elemStaticHeight){
            var h=(parentHeight-elemStaticHeight[elemId]);
            if(elemId=='#im-userreg'&&h&lt;
            550){
                h=458
            }
            module.node.find(elemId).css("height",h+"px")
        }

    }
    ;
    module.MoveTo=function(nodeId){
        var node=$(nodeId);
        if(module.node.parentNode){
            module.node.remove()
        }
        module.node.appendTo(node);
        setTimeout(function(){
            module.FitToParent()
        }
        ,100)
    }
    ;
    module.IsOnRoster=function(name){
        return roster.GetIndexByName(name)!=-1
    }
    ;
    module.IsBlocked=function(name){
        if(!privlist.privItems.length&gt;
        0)return false;
        var lowName=name.toLowerCase();
        var jid=new JID(lowName);
        var item=privlist.GetItemByValue(jid.bare);
        if(item!=null){
            if(item.type=="jid"&&item.value==jid.bare)return true
        }
        return false
    }
    ;
    module.BlockPlayer=function(name){
        privlist.BlockUser(name+'@'+quakelive.siteConfig.xmppDomain)
    }
    ;
    module.UnblockPlayer=function(name){
        privlist.UnblockUser(name+'@'+quakelive.siteConfig.xmppDomain)
    }
    ;
    module.GetRecentPlayers=function(){
        $.ajax({
            url:'/friends/recent',dataType:'json',success:function(json){
                if(json["PLAYERS"]!="NO_DATA"){
                    var arr=json["PLAYERS"];arr.sort(function(a,b){
                        var x=a.PLAYER_NICK;
                        var y=b.PLAYER_NICK;
                        return((x&lt;
                        y)?-1:((x&gt;
                        y)?1:0))
                    }
                    );for(i=0;i&lt;arr.length;i++){
                        var contact=new RecentItem(json["PLAYERS"][i].PLAYER_ID,json["PLAYERS"][i].PLAYER_NICK,json["PLAYERS"][i].STATUS,json["PLAYERS"][i].DATE_MET,json["PLAYERS"][i].PUBLIC_ID);contact.UI_PlaceInGroup(Groups.Recent)
                    }

                }

            }

        }
        )
    }
    ;
    module.ImportRosterData=function(){
        $.ajax({
            url:'/friends/manage/items',dataType:'json',success:roster.ImportRosterData
        }
        )
    }
    ;
    module.ValidateSubscribe=function(name){
        $.ajax({
            url:'/friends/validate/'+name,dataType:'text',mode:'queue',port:'friends',success:function(text){
                if(text&gt;
                0){
                    quakelive.mod_friends.Subscribe(name)
                }

            }

        }
        )
    }
    ;
    module.SendMailInvites=function(){
        var valid=validateMailInvites();
        if(valid){
            var ar=new Array();
            $('.qlv_inviteEmails &gt;
            input').each(function(i){
                if($(this).val().length&gt;
                0){
                    ar.push($(this).val())
                }

            }
            );
            $.ajax({
                url:'/friends/mail',type:'POST',dataType:'json',data:'emails='+JSON.stringify(ar)+'&subject='+$('.qlv_inviteSubject').val()+'&msg='+$('.qlv_inviteMessage').val(),success:function(json){
                    sentMailInvites()
                }

            }
            )
        }
        else{
            $('.qlv_title:eq(1)').show()
        }

    }
    ;
    /************************************************************\
    *
    \************************************************************/
    function sentMailInvites(){
        if($('.qlv_inviteEmails &gt;
        input').length==1){
            $('.qlv_title:eq(1)').text('Invite sent!')
        }
        else{
            $('.qlv_title:eq(1)').text('Invites sent!')
        }
        $('.qlv_title:eq(1)').show();
        $('.qlv_inviteEmails &gt;
        input:gt(0)').remove();
        $('.qlv_inviteEmails &gt;
        input:eq(0)').val('');
        $('.qlv_inviteSubject').val('');
        $('.qlv_inviteMessage').val('')
    }
    ;
    /************************************************************\
    *
    \************************************************************/
    function validateMailInvites(){
        var valid=true;
        var count=0;
        $('.qlv_inviteEmails &gt;
        input').each(function(i){
            if($(this).val().length&gt;
            0){
                if(!isEmailValid($(this).val())){
                    valid=false;$(this).effect("highlight",{
                        color:"#FF0000"
                    }
                    ,3000)
                }
                count++
            }

        }
        );
        if(count==0){
            valid=false;
            $('.qlv_title:eq(1)').text('Entering an email address is the point of this procedure.')
        }
        else if(!valid){
            $('.qlv_title:eq(1)').text('The following don\'t seem to be email addresses.')
        }
        return valid
    }
    ;
    module.SendSearchKeywordRequest=function(val,field){
        $.ajax({
            url:'/friends/search_items/'+val+'/100/1/'+field,dataType:'json',success:function(json){
                if(json["ECODE"]==0){
                    var msg=json["MSG"];var odd=true;$('.qlv_resultsTable &gt; tbody').empty();$('.qlv_searchFormResultsSummary').text(msg.length+' Member(s) found containing "'+$('.qlv_keywordInput').val()+'".');$('.qlv_keywordInput').val('');if(msg.length&gt;0){
                        $('.qlv_resultsListNA').hide()
                    }
                    else{
                        $('.qlv_resultsListNA').show()
                    }
                    for(var i=0;i&lt;msg.length;i++){
                        var rec;
                        if(odd==true){
                            rec=$('&lt;tr class="odd"&gt;&lt;/tr&gt;')
                        }
                        else{
                            rec=$('&lt;
                            tr&gt;
                            &lt;
                            /tr&gt;
                            ')
                        }
                        var icons=new PlayerIconSet(msg[i].MODEL,msg[i].SKIN);
                        rec.append('&lt;
                        td&gt;
                        &lt;
                        /td&gt;
                        ');
                        rec.find('td').append(icons.small);
                        rec.append('&lt;
                        td&gt;
                        '+msg[i].PLAYER_NICK+'&lt;
                        /td&gt;
                        ');
                        if(msg[i].STATUS==1){
                            rec.append('&lt;td&gt;<img alt="" src="'+quakelive.resource('/images/sf/friends/online_icon.gif')+'">&lt;/td&gt;')
                        }
                        else{
                            rec.append('&lt;
                            td&gt;
                            &lt;
                            /td&gt;
                            ')
                        }
                        rec.append('&lt;td&gt;'+FormatTimeDelta(msg[i].LAST_ONLINE)+'&lt;/td&gt;');rec.append('&lt;td&gt;'+msg[i].FNAME+'&lt;/td&gt;');rec.append('&lt;td&gt;<a class="qlv_btnSearchView" href="javascript:;" uuups="quakelive.Goto('profile/summary/'+msg[i].PLAYER_NICK+''); return false" >&lt;/td&gt;');if(module.IsOnRoster(msg[i].PLAYER_NICK.toLowerCase())||msg[i].PLAYER_NICK.toLowerCase()==quakelive.username.toLowerCase()){
                            rec.append('&lt;td&gt;<img alt="" src="'+quakelive.resource('/images/sf/friends/plus_icon_gray.gif')+'">&lt;/td&gt;')
                        }
                        else{
                            var node=$('<a class="qlv_btnSearchAdd" href="javascript:;" uuups="quakelive.mod_friends.Subscribe(''+msg[i].PLAYER_NICK.toLowerCase()+'');" >');node.click(function(){
                                $(this).parent('td').parent('tr').effect("pulsate",{
                                    times:1
                                }
                                ,1000);$(this).replaceWith('<img src="'+quakelive.resource('/images/sf/friends/plus_icon_gray.gif')+'" alt="">');$(this).attr('onclick','');$(this).unbind();return false
                            }
                            );
                            var td=$('&lt;
                            td&gt;
                            &lt;
                            /td&gt;
                            ').append(node);
                            rec.append(td)
                        }
                        $('.qlv_resultsTable &gt;
                        tbody').append(rec);
                        odd==true?odd=false:odd=true
                    }

                }

            }

        }
        )
    }
    ;
    module.AnswerSubscriptionRequest=function(jid,allow){
        var name=jid.split('@')[0];
        if(allow){

        }
        else{

        }
        var reqs=roster.pendingRequests;var index=0;for(;index&lt;reqs.length;++index){
            if(reqs[index].username==name){
                break
            }

        }
        roster.pendingRequests=RemoveArrayIndex(reqs,index);if(quakelive.pathParts[0]=="friends"&&(quakelive.pathParts[1]=="incoming"||quakelive.pathParts[1]=="outgoing")){
            module.UI_RemoveItem(jid)
        }
        qz_instance.IM_AnswerSubscribeRequest(name,allow?1:0)
    }
    ;
    module.Subscribe=function(name){
        if(name.toLowerCase()!=quakelive.username.toLowerCase()){
            qz_instance.IM_Subscribe(name)
        }

    }
    ;
    module.Unsubscribe=function(who){
        var jid=new JID(who);
        qz_instance.IM_Unsubscribe(jid.bare)
    }
    ;
    /************************************************************\
    *
    \************************************************************/
    function GetRemoteRoster(){
        var roster_json=qz_instance.IM_GetRoster();
        return quakelive.Eval(roster_json)||{

        }

    }
    ;
    module.IM_GetPrivacyListNames=function(){
        qz_instance.IM_GetPrivacyListNames()
    }
    ;
    module.IM_GetPrivacyList=function(name){
        qz_instance.IM_GetPrivacyList(name)
    }
    ;
    module.IM_RemovePrivacyList=function(name){
        qz_instance.IM_RemovePrivacyList(name)
    }
    ;
    /************************************************************\
    *
    \************************************************************/
    function IM_SendMessage(who,msg){
        qz_instance.IM_SendMessage(who,msg)
    }
    ;
    module.UI_SetupEmptyMessage=function(msg){
        $('#qlv_friendListContainer').append('&lt;p id="fr_empty" style="display:none;" class="tc thirtyPxTxt sixtypxv midGrayTxt"&gt;'+msg+'</p>')
    }
    ;
    module.UI_AddManagedItem=function(rosterItem){
        $("#fr_empty").hide();var tpl=module.TPL_MANAGE_ITEM;tpl=jQuery(tpl);tpl.attr('id',rosterItem.jid.bare);tpl.find(".head_icon").css('background','url('+quakelive.resource('/images/players/icon_lg/'+rosterItem.model+'_'+rosterItem.skin+'.jpg')+') no-repeat');tpl.find(".player_name &gt; a").html("<span class='clan'>"+StripColors(rosterItem.clan)+"</span>"+rosterItem.player_nick);tpl.find(".player_name &gt; img").attr("src",quakelive.resource("/images/flags/"+rosterItem.country.toLowerCase()+".gif"));tpl.find(".player_name &gt; img").attr("title",rosterItem.country_name);if(rosterItem.IsOnline()){
            tpl.find(".online").show();tpl.find(".info_left").html('<b>Online Now!</b>')
        }
        else{
            tpl.find(".info_left").html('<b>Last online:</b> <span title="'+rosterItem.last_online_date+'">'+FormatTimeDelta(rosterItem.last_online)+' ago</span>')
        }
        if(rosterItem.bio){
            tpl.find(".info_middle").html("<b>"+rosterItem.bio.substring(0,43)+"</b>");tpl.find(".info_middle &gt; b").after(rosterItem.bio.substring(44,120))
        }
        else{
            tpl.find(".info_middle").html("<b>This person has no bio entered yet.  </b>");tpl.find(".info_middle &gt; b").after('To view more data on this user click the "view profile" button.')
        }
        tpl.find(".head_icon").click(function(){
            quakelive.Goto("profile/summary/"+rosterItem.name)
        }
        );tpl.find(".player_name &gt; a").click(function(){
            quakelive.Goto("profile/summary/"+rosterItem.name)
        }
        );tpl.find(".btn_fr_view_profile").click(function(){
            quakelive.Goto("profile/summary/"+rosterItem.name)
        }
        );tpl.find(".btn_fr_delete_friend").click(function(){
            var msg="Are you sure you want to remove this friend?";if(confirm(msg)){
                module.UI_RemoveItem(rosterItem.jid.bare);
                module.Unsubscribe(rosterItem.jid.bare)
            }

        }
        );$("#qlv_friendListContainer").append(tpl)
    }
    ;
    module.UI_AddIncomingItem=function(item){
        $("#fr_empty").hide();var tpl=module.TPL_INCOMING_ITEM;tpl=jQuery(tpl);var jid=new JID(item.PLAYER_NICK.toLowerCase());tpl.attr('id',jid.bare);tpl.find(".head_icon").css('background','url('+quakelive.resource('/images/players/icon_lg/'+item.MODEL+'_'+item.SKIN+'.jpg')+') no-repeat');tpl.find(".player_name &gt; a").text(item.PLAYER_NICK);tpl.find(".player_name &gt; img").attr("src",quakelive.resource("/images/flags/"+item.COUNTRY_ABBREV.toLowerCase()+".gif"));tpl.find(".player_name &gt; img").attr("title",item.COUNTRY_NAME);if(item.STATUS==1){
            tpl.find(".online").show();tpl.find(".info_left").html('<b>Online Now!</b>')
        }
        else{
            tpl.find(".info_left").html('<b>Last online:</b> <span title="'+item.LAST_ONLINE_DATE+'">'+FormatTimeDelta(item.LAST_ONLINE)+' ago</span>')
        }
        tpl.find(".head_icon").click(function(){
            quakelive.Goto("profile/summary/"+item.PLAYER_NICK)
        }
        );tpl.find(".player_name &gt; a").click(function(){
            quakelive.Goto("profile/summary/"+item.PLAYER_NICK)
        }
        );tpl.find(".btn_fr_view_profile").click(function(){
            quakelive.Goto("profile/summary/"+item.PLAYER_NICK)
        }
        );tpl.find(".btn_fr_accept_invite").click(function(){
            module.AnswerSubscriptionRequest(jid.bare,true)
        }
        );tpl.find(".btn_fr_decline_invite").click(function(){
            module.AnswerSubscriptionRequest(jid.bare,false)
        }
        );tpl.find(".btn_fr_block_player").click(function(){
            privlist.BlockUser(jid.bare);
            module.AnswerSubscriptionRequest(jid.bare,false)
        }
        );$("#qlv_friendListContainer").append(tpl)
    }
    ;
    module.UI_AddOutgoingItem=function(item){
        $("#fr_empty").hide();var tpl=module.TPL_OUTGOING_ITEM;tpl=jQuery(tpl);var jid=new JID(item.PLAYER_NICK.toLowerCase());tpl.attr('id',jid.bare);tpl.find(".head_icon").css('background','url('+quakelive.resource('/images/players/icon_lg/'+item.MODEL+'_'+item.SKIN+'.jpg')+') no-repeat');tpl.find(".player_name &gt; a").text(item.PLAYER_NICK);tpl.find(".player_name &gt; img").attr("src",quakelive.resource("/images/flags/"+item.COUNTRY_ABBREV.toLowerCase()+".gif"));tpl.find(".player_name &gt; img").attr("title",item.COUNTRY_NAME);if(item.STATUS==1){
            tpl.find(".online").show();tpl.find(".info_left").html('<b>Online Now!</b>')
        }
        else{
            tpl.find(".info_left").html('<b>Last online:</b> <span title="'+item.LAST_ONLINE_DATE+'">'+FormatTimeDelta(item.LAST_ONLINE)+' ago</span>')
        }
        if(item.BIO){
            tpl.find(".info_middle").html("<b>"+item.BIO.substring(0,43)+"</b>");tpl.find(".info_middle &gt; b").after(item.BIO.substring(44,120))
        }
        else{
            tpl.find(".info_middle").html("<b>This person has no bio entered yet.  </b>");tpl.find(".info_middle &gt; b").after('To view more data on this user click the "view profile" button.')
        }
        tpl.find(".head_icon").click(function(){
            quakelive.Goto("profile/summary/"+item.PLAYER_NICK)
        }
        );tpl.find(".player_name &gt; a").click(function(){
            quakelive.Goto("profile/summary/"+item.PLAYER_NICK)
        }
        );tpl.find(".btn_fr_view_profile").click(function(){
            quakelive.Goto("profile/summary/"+item.PLAYER_NICK)
        }
        );tpl.find(".btn_fr_revoke_invite").click(function(){
            module.UI_RemoveItem(jid.bare);
            module.Unsubscribe(jid.bare)
        }
        );$("#qlv_friendListContainer").append(tpl)
    }
    ;
    module.UI_AddBlockedItem=function(item){
        $("#fr_empty").hide();var tpl=module.TPL_BLOCK_ITEM;tpl=jQuery(tpl);var jid=new JID(item.PLAYER_NICK.toLowerCase());tpl.attr('id',jid.bare);tpl.find(".head_icon").css('background','url('+quakelive.resource('/images/players/icon_gray_lg/'+item.MODEL+'_'+item.SKIN+'.jpg')+') no-repeat');tpl.find(".player_name &gt; a").text(StripColors(item.PLAYER_CLAN)+item.PLAYER_NICK);tpl.find(".player_name &gt; img").attr("src",quakelive.resource("/images/flags/"+item.COUNTRY_ABBREV.toLowerCase()+".gif"));tpl.find(".player_name &gt; img").attr("title",item.COUNTRY_NAME);if(item.STATUS==1){
            tpl.find(".online").show();tpl.find(".info_left").html('<b>Online Now!</b>')
        }
        else{
            tpl.find(".info_left").html('<b>Last online:</b> <span title="'+item.LAST_ONLINE_DATE+'">'+FormatTimeDelta(item.LAST_ONLINE)+' ago</span>')
        }
        if(item.BIO){
            tpl.find(".info_middle").html("<b>"+item.BIO.substring(0,43)+"</b>");tpl.find(".info_middle &gt; b").after(item.BIO.substring(44,120))
        }
        else{
            tpl.find(".info_middle").html("<b>This person has no bio entered yet.  </b>");tpl.find(".info_middle &gt; b").after('To view more data on this user click the "view profile" button.')
        }
        tpl.find(".head_icon").click(function(){
            quakelive.Goto("profile/summary/"+jid.username)
        }
        );tpl.find(".player_name &gt; a").click(function(){
            quakelive.Goto("profile/summary/"+jid.username)
        }
        );tpl.find(".btn_fr_view_profile").click(function(){
            quakelive.Goto("profile/summary/"+jid.username)
        }
        );tpl.find(".btn_fr_unblock_player").click(function(){
            privlist.UnblockUser(jid.bare);
            module.UI_RemoveItem(jid.bare)
        }
        );$("#qlv_friendListContainer").append(tpl)
    }
    ;
    module.UI_RemoveItem=function(name){
        $('div[id="'+name+'"]').remove();if($("#qlv_friendListContainer").children("div").length==0){
            $("#fr_empty").show()
        }

    }
    ;
    module.REMOTE_CONTACTS=new Array();
    module.LOCAL_CONTACTS=new Array();
    module.InviteRemoteContacts=function(emails){
        if(emails.length&gt;
        0){
            $.ajax({
                url:'/friends/social/invite',type:'POST',dataType:'json',data:'emails='+emails,success:module.UI_RemoteInviteSuccess
            }
            )
        }

    }
    ;
    module.UI_RemoteInviteSuccess=function(json){
        var msg='';
        if(json.COUNT==0||json.COUNT&gt;
        1)msg=json.COUNT+' Invites Sent';
        else msg=json.COUNT+' Invite Sent';
        $('.qlv_resultsListNA').text(msg);
        setTimeout(function(){
            module.UI_ResetContactSearch()
        }
        ,4000)
    }
    ;
    module.UI_ResetContactSearch=function(){
        quakelive.Goto("friends/search/email");module.LOCAL_CONTACTS=[];module.REMOTE_CONTACTS=[]
    }
    ;
    module.IsLocalContact=function(email){
        var rosterIndex=-1;var lcEmail=email.toLowerCase();for(var i=0;i&lt;module.LOCAL_CONTACTS.length;++i){
            if(module.LOCAL_CONTACTS[i].EMAIL.toLowerCase()==lcEmail){
                rosterIndex=i;
                break
            }

        }
        return rosterIndex
    }
    ;
    module.UI_SearchContactRemote=function(){
        var tpl=module.TPL_SEARCH_EMAIL_REMOTE;
        var remote=module.REMOTE_CONTACTS;
        var odd=true;
        $('.qlv_resultsBody').empty();
        $('.qlv_resultsBody').html(tpl);
        $('#qlv_selectAllEmail').click(function(){
            if($('#qlv_selectAllEmail').attr('checked')==true){
                $('.qlv_emailInviteItem:not(:disabled)').attr('checked',true)
            }
            else if($('#qlv_selectAllEmail').attr('checked')==false){
                $('.qlv_emailInviteItem:not(:disabled)').attr('checked',false)
            }

        }
        );
        $('.qlv_invitebutton').click(function(){
            var ar=new Array();
            $('.qlv_emailInviteItem:checked').each(function(i){
                ar.push(this.value)
            }
            );
            $('.qlv_resultsListNA').text('Sending Invites');
            $('.qlv_resultsListNA').show();
            $('.qlv_resultsTable').hide();
            module.InviteRemoteContacts(JSON.stringify(ar));
            module.REMOTE_CONTACTS=[];
            module.LOCAL_CONTACTS=[]
        }
        );
        $('.qlv_skipbutton &gt;
        a').click(function(){
            module.UI_ResetContactSearch()
        }
        );for(var i=0;i&lt;remote.length;i++){
            if(module.IsLocalContact(remote[i].email)&lt;
            0){
                var rec=$('&lt;tr&gt;&lt;/tr&gt;');if(odd==true)rec.addClass('odd');rec.append('&lt;td width="39"&gt;<div align="center">&lt;input type="checkbox" value="'+remote[i].email+'" class="qlv_emailInviteItem" /&gt;</div>&lt;/td&gt;');rec.append('&lt;td&gt;&lt;/td&gt;');rec.append('&lt;td width="493"&gt;'+remote[i].name+'&lt;/td&gt;');rec.append('&lt;td&gt;&lt;/td&gt;');$('.qlv_resultsTable &gt; tbody:last').append(rec);odd==true?odd=false:odd=true
            }

        }

    }
    ;
    module.UI_SearchContactSuccess=function(json){
        if(json["LOCAL"]){
            var local=module.LOCAL_CONTACTS=json["LOCAL"];var odd=true;$('.qlv_password').val('');if(local.length&gt;0){
                $('.qlv_resultsListNA').hide()
            }
            else{
                $('.qlv_resultsListNA').text('No Results');$('.qlv_resultsListNA').show();$('.qlv_resultsListNA').effect("highlight",{
                    color:"#FF0000"
                }
                ,3000)
            }
            for(var i=0;i&lt;local.length;i++){
                var rec=$('&lt;tr&gt;&lt;/tr&gt;');if(odd==true)rec.addClass('odd');if(local[i].STATUS==1)rec.addClass('online');var icons=new PlayerIconSet(local[i].MODEL,local[i].SKIN);rec.append('&lt;td&gt;&lt;input id="'+local[i].PLAYER_NICK.toLowerCase()+'" class="qlv_emailInviteItem" type="checkbox" /&gt;&lt;/td&gt;');rec.append('&lt;td&gt;&lt;/td&gt;');rec.find('td:last').append(icons.small);rec.append('&lt;td&gt;'+local[i].PLAYER_NICK+'&lt;/td&gt;');if(local[i].STATUS==1){
                    rec.append('&lt;td&gt;<img alt="" src="'+quakelive.resource('/images/sf/friends/online_icon.gif')+'">&lt;/td&gt;')
                }
                else{
                    rec.append('&lt;
                    td&gt;
                    &lt;
                    /td&gt;
                    ')
                }
                rec.append('&lt;td&gt;'+local[i].LAST_ONLINE+'&lt;/td&gt;');rec.append('&lt;td&gt;'+local[i].FNAME+'&lt;/td&gt;');rec.append('&lt;td&gt;<a class="qlv_btnSearchView" href="javascript:;" uuups="quakelive.Goto('profile/summary/'+local[i].PLAYER_NICK+''); return false" >&lt;/td&gt;');if(module.IsOnRoster(local[i].PLAYER_NICK.toLowerCase())||local[i].PLAYER_NICK.toLowerCase()==quakelive.username.toLowerCase()){
                    rec.append('&lt;td&gt;<img alt="" src="'+quakelive.resource('/images/sf/friends/plus_icon_gray.gif')+'">&lt;/td&gt;');rec.find('.qlv_emailInviteItem').attr('disabled','true')
                }
                else{
                    var node=$('<a class="qlv_btnSearchAdd" href="javascript:;" uuups="quakelive.mod_friends.Subscribe(''+local[i].PLAYER_NICK.toLowerCase()+'');" >');node.click(function(){
                        $(this).parent('td').parent('tr').find('.qlv_emailInviteItem').attr('disabled','true');$(this).parent('td').parent('tr').effect("pulsate",{
                            times:1
                        }
                        ,1000);$(this).replaceWith('<img src="'+quakelive.resource('/images/sf/friends/plus_icon_gray.gif')+'" alt="">');$(this).attr('onclick','');$(this).unbind();return false
                    }
                    );
                    var td=$('&lt;
                    td&gt;
                    &lt;
                    /td&gt;
                    ').append(node);
                    rec.append(td)
                }
                $('.qlv_resultsTable &gt;
                tbody').append(rec);
                odd==true?odd=false:odd=true
            }

        }
        if(json["REMOTE"]){
            var remote=json["REMOTE"];module.REMOTE_CONTACTS=remote;if(remote.length&gt;0){
                $('.qlv_skipbutton').show();
                $('.qlv_skipbutton &gt;
                a').click(function(){
                    module.UI_SearchContactRemote()
                }
                )
            }

        }

    }
    ;
    module.UI_SearchContactError=function(json){
        if(json["FIELDS"]){
            var fields=json["FIELDS"];for(var i=0;i&lt;fields.length;i++){
                switch(fields[i]){
                    case"account":break;case"domain":$('.qlv_email_server').effect("highlight",{
                        color:"#FF0000"
                    }
                    ,3000);break;case"network":break;case"pw":$('.qlv_password').effect("highlight",{
                        color:"#FF0000"
                    }
                    ,3000);break;case"user":$('.qlv_email_user').effect("highlight",{
                        color:"#FF0000"
                    }
                    ,3000);
                    break;
                    default:break
                }

            }
            $('.qlv_resultsListNA').text('Error with flashing fields.')
        }
        else if(json["MSG"]){
            var msg=json["MSG"];$('.qlv_resultsListNA').text(msg)
        }
        $('.qlv_resultsListNA').show();$('.qlv_resultsListNA').effect("highlight",{
            color:"#FF0000"
        }
        ,3000)
    }
    ;
    module.UI_SetupSearchContacts=function(){
        $('#qlv_selectAllEmail').click(function(){
            if($('#qlv_selectAllEmail').attr('checked')==true){
                $('.qlv_emailInviteItem:not(:disabled)').attr('checked',true)
            }
            else if($('#qlv_selectAllEmail').attr('checked')==false){
                $('.qlv_emailInviteItem:not(:disabled)').attr('checked',false)
            }

        }
        );
        var options={
            url:'/friends/social/search',type:'POST',dataType:'json',success:function(json){
                if(json["ECODE"]==0){
                    module.UI_SearchContactSuccess(json)
                }
                else{
                    module.UI_SearchContactError(json)
                }

            }
            ,beforeSubmit:function(data,form,options){
                $('.qlv_resultsTable &gt;
                tbody').empty();
                $('.qlv_resultsListNA').show();
                $('.qlv_resultsListNA').text('Searching...')
            }

        }
        ;$('#socialform').ajaxForm(options);$('.qlv_findFriendsBtn').click(function(){
            $('.qlv_resultsTable &gt; tbody').empty();$('.qlv_resultsListNA').show();$('.qlv_resultsListNA').text('Searching...');$('#socialform').submit()
        }
        );
        $('.qlv_invitebutton &gt;
        a').click(function(){
            $('.qlv_emailInviteItem').each(function(i){
                if(this.checked==true&&this.disabled==false){
                    var id=$(this).attr('id');$(this).attr('disabled','true');var parent=$(this).parent('td').parent('tr');parent.effect("pulsate",{
                        times:1
                    }
                    ,1000);parent.find('.qlv_btnSearchAdd').replaceWith('<img src="'+quakelive.resource('/images/sf/friends/plus_icon_gray.gif')+'" alt="">');module.Subscribe(id)
                }

            }
            );
            if(module.REMOTE_CONTACTS.length&gt;
            0)module.UI_SearchContactRemote();
            return false
        }
        )
    }
    ;
    module.UI_SetupInvite=function(){
        $('.qlv_plusOption &gt;
        a').click(function(){
            $('.qlv_inviteEmails &gt; input:last').after('&lt;input type="text" class="qlv_textfield" /&gt;')
        }
        );
        $('.qlv_invitebutton &gt;
        a').click(function(){
            module.SendMailInvites()
        }
        )
    }
    ;module.UI_PerformSearch=function(field){
        var val=$('.qlv_keywordInput').val();
        if(val.length&gt;
        0){
            module.SendSearchKeywordRequest(val,field)
        }

    }
    ;
    module.UI_SetupSearchKeyword=function(){
        $('.qlv_keywordInput').focus();
        $('.qlv_keywordButtonEmail').click(function(){
            module.UI_PerformSearch('EMAIL');return false
        }
        );
        $('.qlv_keywordButtonLastName').click(function(){
            module.UI_PerformSearch('LNAME');return false
        }
        );
        $('.qlv_keywordButtonNameTag').click(function(){
            module.UI_PerformSearch('PLAYER_NICK');return false
        }
        )
    }
    ;
    module.UI_SortRoster=function(groupType){
        $.each(module.node.find('#im-'+groupType+' .itemlist div'),function(i,val){
            $.each(module.node.find('#im-'+groupType+' .itemlist div'),function(i,val2){
                if($(val).find('&gt;
                span.rosteritem-name').text().toLowerCase()&lt;
                $(val2).find('&gt;
                span.rosteritem-name').text().toLowerCase()){
                    $(val2).before(val)
                }

            }
            )
        }
        )
    }
    ;
    quakelive.AddHook('IM_OnConnected',function(){
        roster.skipNotices=true;
        roster.fullRoster=[];
        module.ImportRosterData();
        module.IM_GetPrivacyList(QZ_PRIVACYLIST);
        setTimeout(function(){
            if(roster.pendingRequests.length&gt;
            0){
                quakelive.notifier.Notify(quakelive.notifier.PendingInviteSummaryNotice(roster.pendingRequests.length))
            }
            roster.skipNotices=false
        }
        ,3000)
    }
    );
    quakelive.AddHook('IM_OnDisconnected',function(){

    }
    );
    window.IM_OnMessage=function(message_json){
        var msg=quakelive.Eval(message_json);
        var jid=new JID(msg.who);
        var contact=roster.GetContactByJID(jid);
        if(jid.username==Admins.QLive||jid.username==Admins.Broadcast||jid.username==Admins.Admin){
            if(!contact){
                var contact=new BroadcastItem(jid,jid.username);
                contact.UI_PlaceInGroup(Groups.Active);
                roster.AddContact(contact)
            }

        }
        else if(!contact){
            return
        }
        contact.ReceivedMsg(msg.what)
    }
    ;
    window.IM_OnPresence=function(presence_json){
        var pres=quakelive.Eval(presence_json);
        if(pres){
            var jid=new JID(pres.who);
            var contact=roster.GetContactByJID(jid);
            if(contact){
                var status=quakelive.Eval(pres.status);
                contact.UI_SetGameStatus(status);
                contact.presence=pres.presence;
                if(contact.CanDisplayOnRoster()){
                    contact.UI_PlaceInGroup(Groups.Online)
                }
                else{
                    contact.UI_PlaceInGroup(Groups.None)
                }
                roster.UI_OnRosterUpdated()
            }
            else{

            }

        }

    }
    ;
    window.IM_OnSubscribeRequest=function(subscribe_json){
        var req=quakelive.Eval(subscribe_json);
        roster.AddPendingRequest(req);
        if(!roster.skipNotices){
            var jid=new JID(req.jid);
            $.ajax({
                url:'/friends/details/'+jid.username,dataType:'json',success:function(json){
                    var modelskin=(json.MODEL+"_"+json.SKIN).toLowerCase();quakelive.notifier.Notify(quakelive.notifier.PendingInviteNotice(req.jid,json.PLAYER_NICK,modelskin));if(quakelive.pathParts[0]=="friends"&&quakelive.pathParts[1]=="incoming")module.UI_AddIncomingItem(json)
                }

            }
            )
        }

    }
    ;
    window.IM_OnItemAdded=function(json){
        var jsob=quakelive.Eval(json);
        if(jsob){
            var jid=new JID(jsob.jid);
            var contact=new RosterItem(jid,jid.username,S10nType.None,PresType.Unavailable);
            $.ajax({
                url:'/friends/details/'+jsob.jid.split('@')[0],dataType:'json',success:function(json){
                    if(json.ECODE==0){
                        contact.UpdateDetails(json)
                    }
                    else{

                    }

                }

            }
            );
            roster.AddContact(contact)
        }

    }
    ;
    window.IM_OnItemRemoved=function(json){
        var jsob=quakelive.Eval(json);
        if(jsob){
            roster.RemoveContactByJID(new JID(jsob.jid));roster.UI_OnRosterUpdated();if(quakelive.pathParts[0]=="friends"&&quakelive.pathParts[1]=="manage"){
                module.UI_RemoveItem(jsob.jid);
                if(roster.fullRoster.length&lt;
                1){
                    quakelive.Goto('friends/search')
                }

            }
            quakelive.SendModuleMessage('IM_OnRosterChanged')
        }

    }
    ;
    window.IM_OnItemSubscribed=function(json){
        var jsob=quakelive.Eval(json);
        if(jsob){
            var contact=roster.GetContactByJID(new JID(jsob.jid));
            if(!contact){
                return
            }
            contact.subscription=jsob.subscription;roster.UI_Show();roster.UI_OnRosterUpdated();if(quakelive.pathParts[0]=="friends"&&quakelive.pathParts[1]=="manage"){
                module.UI_AddManagedItem(contact)
            }
            quakelive.SendModuleMessage('IM_OnRosterChanged')
        }

    }
    ;
    window.IM_OnItemUnsubscribed=function(json){
        var jsob=quakelive.Eval(json);
        if(jsob){
            var contact=roster.GetContactByJID(new JID(jsob.jid));
            if(!contact){
                return
            }
            contact.subscription=jsob.subscription;
            roster.UI_OnRosterUpdated();
            contact.UI_PlaceInGroup(Groups.None);
            quakelive.SendModuleMessage('IM_OnRosterChanged')
        }

    }
    ;
    window.IM_OnItemUpdated=function(json){
        var jsob=quakelive.Eval(json);
        if(jsob){
            var contact=roster.GetContactByJID(new JID(jsob.jid));
            if(!contact){
                return
            }
            contact.subscription=jsob.subscription;
            if(contact.subscription==S10nType.Both){
                if(contact.CanDisplayOnRoster()){
                    contact.UI_PlaceInGroup(Groups.Online)
                }
                roster.UI_OnRosterUpdated()
            }
            else{
                if(contact.subscription==S10nType.NoneOut||contact.subscription==S10nType.NoneOutIn){

                }

            }
            quakelive.SendModuleMessage('IM_OnRosterChanged')
        }

    }
    ;
    window.IM_OnPrivacyNames=function(json){

    }
    ;
    window.IM_OnPrivacyList=function(json){
        privlist.ImportPrivList(quakelive.Eval(json)||null)
    }
    ;
    window.IM_OnPrivacyChanged=function(name){
        module.IM_GetPrivacyList(name)
    }
    ;
    window.IM_OnPrivacyResult=function(json){
        var result=quakelive.Eval(json)||{

        }
        ;switch(result["result"]){
            case PrivResult.StoreSuccess:if(privlist.privItems.length==0){
                module.IM_GetPrivacyList(QZ_PRIVACYLIST)
            }
            break;
            case PrivResult.ActivateSuccess:break;
            case PrivResult.DefaultSuccess:break;
            case PrivResult.RemoveSuccess:PrivActiveList=null;
            break;
            case PrivResult.ItemNotFound:PrivActiveList=null;
            break
        }

    }
    ;
    window.IM_OnSelfPresence=function(json){

    }
    ;
    window.IM_OnConnectFail=function(){
        var html="<div id='error-popup'><img src='"+quakelive.resource("/images/site/erroroccurred.png")+"' width='514' height='24' class='pngfix'  alt=""><p>";html+="<p>We're sorry, but it appears you are having problems connecting to the QUAKE LIVE network. If you are behind a firewall you must make sure that it permits the following connection:<br><br>Protocol: TCP<br>Host: xmpp.quakelive.com<br>Port: 5222<br><br>Contact your network administrator for further instructions, or visit the <a href='/forum/'>QUAKE LIVE forums</a> to look for help.<br><br>Click <b>close</b> to reload this page or <a href='javascript:;' uuups='quakelive.Logout(); return false'>click here</a> to log out.</p>";html+="</div>";$.post('/user/xmpp_connect_fail');quakelive.OverlayHtml(html,"document.location.reload(); return false")
    }
    ;
    window.IM_OnKicked=function(){
        quakelive.ShutdownGame();
        window.location='/user/logout/kicked'
    }
    ;
    quakelive.RegisterModule('friends',module)
}
)(jQuery);
(function($){
    var module={

    }
    ;
    var stepStage=0;
    /************************************************************\
    *
    \************************************************************/
    function nextStage(){
        $('#step'+stepStage).slideDown('fast',function(){
            $('#step'+stepStage+'_c').fadeIn('fast',function(){
                if(stepStage++&lt;
                2){
                    setTimeout(nextStage,800)
                }

            }
            )
        }
        )
    }
    module.OnOverlayLoaded=function(params){
        if(params[0]=='install'){
            stepStage=0;
            setTimeout(nextStage,500)
        }

    }
    ;
    quakelive.RegisterModule('install',module)
}
)(jQuery);
(function($){
    var module={

    }
    ;
    module.Init=function(){

    }
    ;
    module.DISPLAY={
        friends:"#qlv_chatControl",lfg:"#lfg_content"
    }
    ;
    module.LAYOUT='postlogin';
    quakelive.AddHook('OnCharacterChanged',function(index){
        module.UI_ChangeCharacter(index)
    }
    );
    module.UI_ChangeCharacter=function(index){
        var mi=quakelive.mod_prefs.models.MODELS[index];
        var details=quakelive.mod_prefs.models.DETAILS[mi.DETAILS_ID]||{
            RACE:'',DESC:''
        }
        ;
        $('#qlv_MainContent').find('.characterImg &gt;
        img').attr('src',quakelive.resource('/images/players/body_lg/'+mi.MODEL+'_'+mi.SKIN+'.png'));
        $('#qlv_MainContent').find('.charTypeLarge').text(mi.NAME.substr(0,1).toUpperCase()+mi.NAME.substr(1));
        $('#qlv_MainContent').find('.charType &gt;
        img').attr('src',quakelive.resource('/images/player_races/'+details.RACE+'.png'));
        $('#qlv_MainContent').find('.charProfile').text(details.DESC)
    }
    ;
    module.FocusField=function(){
        var helpNode=$('#help_'+this.id);
        if(helpNode.find('.error').size()==0&&helpNode.find('.success').size()==0){
            helpNode.addClass('lgrayBack').addClass('lgrayBorder').removeClass('transBorder').find('.help').show()
        }

    }
    ;
    module.BlurField=function(){
        var helpNode=$('#help_'+this.id);
        if(helpNode.find('.error').size()==0&&helpNode.find('.success').size()==0){
            helpNode.removeClass('lgrayBack').removeClass('lgrayBorder').addClass('transBorder').find('.help').hide()
        }

    }
    ;
    module.ShowContent=function(content){
        switch(quakelive.pathParts[1]){
            case'edit':module.UI_SetupEditAccount(content);
            break;
            case'delete':module.UI_SetupDeleteProfile(content);
            break
        }

    }
    ;
    var lastChosenReason=0;
    module.UI_SetupDeleteProfile=function(content){
        $('#qlv_contentBody').html(content).find("input,textarea").focus(module.FocusField).blur(module.BlurField);$('#qlv_contentBody').find("input[type='radio']").click(function(){
            lastChosenReason=$(this).val()
        }
        );
        $('#deletebtn').click(function(){
            if(!lastChosenReason){
                alert("You must choose a reason before you can deactivate.");return
            }
            if(confirm("Are you sure you want to deactivate your account?")){
                var data={
                    reason:lastChosenReason,password:$('#password').val(),comments:$('#comments').val()
                }
                ;
                $.ajax({
                    url:'/user/delete/zap',type:'post',data:data,dataType:'json',success:function(json){
                        if(json["ECODE"]==0){
                            window.location="/user/logout/deleted"
                        }

                    }

                }
                )
            }

        }
        )
    }
    ;
    module.UI_SetupEditAccount=function(content){
        $('#qlv_contentBody').html(content).find("input,textarea").focus(module.FocusField).blur(module.BlurField);$('#state').find('option[value="'+$("#edit_hstate").val()+'"]').attr('selected',true);$('#country').find('option[value="'+$("#edit_hcountry").val()+'"]').attr('selected',true);$('#day').find('option[value="'+$("#edit_hday").val()+'"]').attr('selected',true);$('#month').find('option[value="'+$("#edit_hmonth").val()+'"]').attr('selected',true);$('#year').find('option[value="'+$("#edit_hyear").val()+'"]').attr('selected',true);$('input[name="shirtSize"][value="'+$("#edit_htsize").val()+'"]').attr('checked',true);var maxlen=500;var remainder=maxlen-$('#bio').val().length;$('#help_bio &gt; span').html(" "+remainder+" Characters");$('#bio').keyup(function(){
            var $bio=$(this).val();var $rem=maxlen-$('#bio').val().length;$('#help_bio &gt; span').html(" "+$rem+" Characters")
        }
        );
        $('#updatebtn').click(function(){
            module.SendAccountEdit()
        }
        )
    }
    ;
    module.SendAccountEdit=function(){
        $.ajax({
            url:'/user/update',type:'POST',data:$("#profile_form").formToArray(),dataType:'json',success:function(json){
                module.ClearFields();if(json["ECODE"]==0){
                    module.EditSuccess(json)
                }
                else{
                    module.EditFail(json)
                }

            }

        }
        )
    }
    ;
    module.EditSuccess=function(json){
        quakelive.userinfo.IGNORED_NOTICES=json.IGNORED_NOTICES;quakelive.notifier.LoadFilters();for(var fieldName in json.FIELDS){
            $('#help_'+fieldName+' .error').remove();$('#help_'+fieldName+' .success').remove();$('#help_'+fieldName).append("<span class='success'>"+json.FIELDS[fieldName]+"</span>");module.StyleAsSuccess(fieldName)
        }

    }
    ;
    module.EditFail=function(err){
        for(var fieldName in err.ERRORS){
            $('#help_'+fieldName+' .error').remove();$('#help_'+fieldName+' .success').remove();$('#help_'+fieldName).append("<span class='error'>"+err.ERRORS[fieldName]+"</span>");module.StyleAsError(fieldName)
        }

    }
    ;
    var specialErrorIds=['bio','shirtSize'];
    var selectErrorIds=['birthdate','country'];
    module.StyleAsError=function(id){
        $('#wrap_'+id).addClass('orangeBorder');
        $('#label_'+id).addClass('orangeTxt');
        $('#help_'+id).addClass('orangeBack').addClass('orangeBorder')
    }
    ;
    module.StyleAsSuccess=function(id){
        $('#wrap_'+id).addClass('greenBorder');
        $('#label_'+id).addClass('greenTxt');
        $('#help_'+id).addClass('greenBack').addClass('greenBorder')
    }
    ;
    module.StyleAsDefault=function(id){
        $('#help_'+id+' .error').remove();
        $('#help_'+id+' .success').remove();
        $('#wrap_'+id).removeClass('orangeBorder');
        $('#wrap_'+id).removeClass('greenBorder');
        $('#label_'+id).removeClass('orangeTxt');
        $('#label_'+id).removeClass('greenTxt');
        $('#help_'+id).removeClass('orangeBack').removeClass('orangeBorder');
        $('#help_'+id).removeClass('greenBack').removeClass('greenBorder')
    }
    ;
    module.ClearFields=function(){
        $('#profile_form').find('input').each(function(){
            module.StyleAsDefault(this.id)
        }
        );for(var index in selectErrorIds){
            module.StyleAsDefault(selectErrorIds[index])
        }
        for(var index in specialErrorIds){
            $('#error_'+specialErrorIds[index]).empty();
            $('#label_'+specialErrorIds[index]).removeClass('orangeTxt');
            $('#label_'+specialErrorIds[index]).removeClass('greenTxt')
        }

    }
    ;
    /************************************************************\
    *
    \************************************************************/
    function OnResetFormSubmitted(responseText,statusText){
        if(responseText!=null&&responseText.ECODE==0){
            quakelive.Overlay("user/forgot/validate")
        }
        else{
            $('#page-forgot-error').show().html(responseText?responseText.MSG:'Unknown Error - Try again');setTimeout(function(){
                $('#page-forgot-error').html(' ')
            }
            ,10000)
        }

    }
    module.SubmitPasswordReset=function(){
        var options={
            url:'/user/forgot/handlereset',success:OnResetFormSubmitted,dataType:'json',clearForm:false
        }
        ;$("#forgotform").ajaxSubmit(options)
    }
    ;
    /************************************************************\
    *
    \************************************************************/
    function OnValidateFormSubmitted(responseText,statusText){
        if(responseText!=null&&responseText.ECODE==0){
            quakelive.Overlay("user/forgot/success")
        }
        else{
            $('#page-forgot-error').show().html(responseText?responseText.MSG:'Unknown Error - Try again');setTimeout(function(){
                $('#page-forgot-error').html(' ')
            }
            ,10000)
        }

    }
    module.SubmitPasswordValidate=function(){
        var options={
            url:'/user/forgot/handlevalidate',success:OnValidateFormSubmitted,dataType:'json',clearForm:false
        }
        ;$("#validateform").ajaxSubmit(options)
    }
    ;module.SubmitLoginForm=function(){
        if(!quakelive.CheckBrowserCompat()){
            return
        }
        var formData={
            u:$('#in_email').val(),p:$('#in_password').val(),r:$('#in_remember').attr('checked')?1:0
        }
        ;if(formData.u.length==0||formData.p.length==0){
            module.ShowLoginError("You must enter your email and password.");return
        }
        $.ajax({
            url:'/user/login',mode:'abort',port:'login',type:'post',data:formData,dataType:'json',error:module.SubmitLoginForm_Error,success:module.SubmitLoginForm_Success
        }
        )
    }
    ;
    var loginErrorFxHandle=null;
    module.ShowLoginError=function(msg){
        if(loginErrorFxHandle){
            clearTimeout(loginErrorFxHandle);
            loginErrorFxHandle=null
        }
        $('#qlv_badLogin').fadeIn().html("<p>"+msg+"</p>");$('#qlv_badLogin p').effect('pulsate',{
            times:1
        }
        ,1000);
        loginErrorFxHandle=setTimeout(function(){
            loginErrorFxHandle=null;
            $('#qlv_badLogin').fadeOut()
        }
        ,30000)
    }
    ;var DEFAULT_LOGIN_ERROR="Unable to log in. Please try again later.";module.SubmitLoginForm_Error=function(){
        module.ShowLoginError(DEFAULT_LOGIN_ERROR)
    }
    ;module.SubmitLoginForm_Success=function(json){
        if(typeof(json)=='object'){
            if(json.ECODE===0){
                $('#qlv_badLogin').fadeOut();
                if(json.RESULT_CODE){
                    window.location="/queue.php"
                }
                else{
                    window.location="/user/login_redirect"
                }

            }
            else{
                module.ShowLoginError(json.MSG||DEFAULT_LOGIN_ERROR)
            }

        }
        else{
            module.ShowLoginError(DEFAULT_LOGIN_ERROR)
        }

    }
    ;
    quakelive.RegisterModule('user',module)
}
)(jQuery);
(function($){
    var module={

    }
    ;
    var Cache={

    }
    ;
    /************************************************************\
    *
    \************************************************************/
    function CacheMatchData(public_id){
        if(!Cache[public_id]){
            return null
        }
        return Cache[public_id].data
    }
    /************************************************************\
    *
    \************************************************************/
    function LoadMatchData(public_id,game_type){
        $.ajax({
            url:'/stats/matchdetails/'+public_id+'/'+game_type,dataType:'json',mode:'abort',port:'matchdata',success:function(json){
                Cache[public_id]=module.TPL_MATCH_SUMMARY;
                $('.match_'+public_id).html(Cache[public_id])
            }
            ,error:function(json){
                Cache[public_id]='ERROR LOADING DATA';
                $('.match_'+public_id).html(Cache[public_id])
            }

        }
        )
    }
    $.fn.extend({
        match_tooltip:function(){
            return this.each(function(){
                var matchdata=this.id.split("_");var self=this;$(this).tooltip({
                    extraClass:"match_"+matchdata[1],bodyHandler:function(){
                        var cacheData=CacheMatchData(matchdata[1]);
                        if(cacheData){

                        }
                        LoadMatchData(matchdata[1],matchdata[0]);return"<img src='"+quakelive.resource('/images/loader.gif')+"' width='62' height='13'  alt="">"
                    }

                }
                )
            }
            )
        }

    }
    );
    module.ReloadOverallStats=function(autoDisplay){
        $.ajax({
            type:'get',url:'/stats/overall',success:function(data){
                module.ReloadOverallStats_Success(data);
                if(autoDisplay){
                    module.DisplayStatsData()
                }

            }
            ,error:module.ReloadOverallStats_Error
        }
        )
    }
    ;
    module.Init=function(){
        quakelive.AddHook('OnLayoutLoaded',function(){
            if(!quakelive.userid){
                return
            }
            if(!module.overallStatsData){
                module.overallStatsData={

                }
                ;
                module.ReloadOverallStats(true)
            }

        }
        )
    }
    ;
    module.WpnDisplayText={
        'GAUNTLET':"Gauntlet",'MACHINEGUN':"Machine Gun",'SHOTGUN':"Shotgun",'GRENADE':"Grenade Launcher",'ROCKET':"Rocket Launcher",'LIGHTNING':"Lightning Gun",'RAILGUN':"Railgun",'PLASMA':"Plasma Gun",'BFG':"BFG",'CHAINGUN':"Chaingun",'NAILGUN':"Nailgun",'PROXMINE':"Proximity Mine",'None':"None",'N/A':"N/A"
    }
    ;
    module.GameTypeDisplayText={
        'DM':"Free For All",'TDM':"Team Death Match",'CTF':"Capture The Flag",'Tourney':"Duel",'TOURNEY':"Duel",'TOTAL':"TOTAL",'CA':"Clan Arena",'None':"None"
    }
    ;
    module.GameTypeDisplayShortText={
        'DM':"FFA",'TDM':"TDM",'CTF':"CTF",'Tourney':"Duel",'TOURNEY':"Duel",'CA':"CA",'TOTAL':"TOTAL",'None':"None"
    }
    ;module.format_number=function(n){
        return Number(n)
    }
    ;module.format_seconds=function(secs,fstr){
        fstr=typeof(fstr)!='undefined'?fstr:'hms';
        var mins=((secs/60)|0)%60;
        var nsecs=Math.round(secs%60);
        var hours=((secs/3600)|0)%24;
        var days=(secs/86400)|0;
        var msg='';
        if(fstr.search('d')&gt;
        =0){
            msg+=String(days)+'d '
        }
        if(fstr.search('h')&gt;
        =0){
            msg+=String(hours)+'h '
        }
        if(fstr.search('m')&gt;
        =0){
            msg+=String(mins)+'m '
        }
        if(fstr.search('s')&gt;
        =0){
            msg+=String(nsecs)+'s '
        }
        return msg
    }
    ;
    module.FinishString=function(json){
        var finish_str='TBD';
        /************************************************************\
        *
        \************************************************************/
        function played_in_match(){
            if(json.PLAYER_RANK==null){
                return false
            }
            return true
        }
        switch(json.GAME_TYPE.toLowerCase()){
            case'dm':case'tourney':if(played_in_match()){
                if(json.PLAYER_RANK!=1){
                    if(json.PLAYER_RANK==1){
                        finish_str='Win'
                    }
                    else{
                        finish_str='Loss'
                    }

                }
                else{
                    finish_str='DNF'
                }

            }
            else{
                finish_str=json.SCOREBOARD[0].PLAYER_NICK
            }
            break;
            case'tdm':case'ctf':case'ca':if(played_in_match()){
                if(json.I_COMPETED){
                    if(json.I_WIN){
                        finish_str='Win'
                    }
                    else{
                        finish_str='Loss'
                    }

                }
                else{
                    finish_str='DNF'
                }

            }
            else{
                finish_str=json.WINNING_TEAM+' Wins'
            }
            break;
            default:return finish_str
        }
        return finish_str
    }
    ;
    module.RankString=function(rank){
        var mod100=rank%100;
        var mod10=rank%10;
        var suffix;
        if(mod10==1&&mod100!=11){
            suffix='st'
        }
        else if(mod10==2&&mod100!=12){
            suffix='nd'
        }
        else if(mod10==3&&mod100!=13){
            suffix='rd'
        }
        else{
            suffix='th'
        }
        return rank+suffix
    }
    ;
    module.WinString=function(winlossflag){
        if(winlossflag==1){
            return'Win'
        }
        return'Loss'
    }
    ;
    module.StyleRank=function(rank){
        if(rank&gt;
        =1&&rank&lt;
        =3){
            return"<b>"+module.RankString(rank)+"</b>"
        }
        return module.RankString(rank)
    }
    ;
    module.FillQuickStats=function(container){
        var node=$(module.TPL_QUICKSTATS);var details=module.quickstats.playerdetails.DETAILS[0];var records=module.quickstats.recordstats;node.find('.qlv_pltslb_title').html(quakelive.username);var lastMatch=details.LAST_MATCH[0];if(lastMatch!="None"){
            node.find('.qlv_pltslb_last_played').html('Last Played: '+lastMatch)
        }
        node.find('.qlv_pltslb_character').css('background','url('+quakelive.resource('/images/players/body_md/'+details.PLAYER_MODEL[0]+'_'+details.PLAYER_SKIN[0]+'.png')+') no-repeat');var favGameType=details.FAV_GAMETYPE[0];if(favGameType!="None"){
            node.find('.fav_gametype_txt').html(module.GameTypeDisplayText[favGameType]);node.find('.fav_gametype_img').html('<div style="background: url('+quakelive.resource('/images/gametypes/'+favGameType.toLowerCase()+'.png')+') no-repeat center center; width: 100%; height: 100%"></div>')
        }
        else{
            node.find('.fav_gametype_txt').html("None");node.find('.fav_gametype_img').html('<div style="background: url('+quakelive.resource('/images/gametypes/no_data_icon.png')+') no-repeat center center; width: 100%; height: 100%"></div>')
        }
        if(details.FAV_ARENA[0]!="None"){
            node.find('.fav_map_txt').html(details.FAV_ARENA[0]);node.find('.fav_map_img').html('<div style="background: url('+quakelive.resource('/images/levelshots/ci/'+details.FAV_ARENA_SYSNAME[0]+'.png')+') no-repeat center center; width: 100%; height: 100%"></div>')
        }
        else{
            node.find('.fav_map_txt').html("None");node.find('.fav_map_img').html('<div style="background: url('+quakelive.resource('/images/gametypes/no_data_icon.png')+') no-repeat center center; width: 100%; height: 100%"></div>')
        }
        var favWeapon=details.FAV_WPN[0];if(favWeapon!="None"){
            node.find('.fav_weapon_txt').html(module.WpnDisplayText[favWeapon]);node.find('.fav_weapon_img').html('<div style="background: url('+quakelive.resource('/images/weapons/3d/'+favWeapon.toLowerCase()+'.png')+') no-repeat center center; width: 100%; height: 100%"></div>')
        }
        else{
            node.find('.fav_weapon_txt').html("None");node.find('.fav_weapon_img').html('<div style="background: url('+quakelive.resource('/images/gametypes/no_data_icon.png')+') no-repeat center center; width: 100%; height: 100%"></div>')
        }
        node.find('.total_games').html(FormatNumber(details.GAMES_PLAYED[0]));node.find('.total_frags').html(FormatNumber(details.TOTAL_KILLS[0]));node.find('.total_time').html(module.format_seconds(details.TIME_PLAYED[0]));var recordMap={
            'tdm':'TDM_RECORD','ctf':'CTF_RECORD','dm':'DM_RECORD','duel':'TRNY_RECORD','total':'TOTAL_RECORD'
        }
        ;for(var gameType in recordMap){
            var recordIndex=recordMap[gameType];var rec=records[recordIndex][0];node.find('.played_'+gameType).html(FormatNumber(rec.GAMES_FINISHED[0]));node.find('.wins_'+gameType).html(FormatNumber(rec.WINS[0]))
        }
        container.empty().append(node)
    }
    ;
    module.LoadQuickStats=function(stats_playerid,container){
        module.quickstats={
            'playerdetails':null,'recordstats':null
        }
        ;
        $.getJSON('/stats/playerdetails/'+stats_playerid,null,function(json){
            module.quickstats.playerdetails=json;
            if(module.quickstats.recordstats){
                module.FillQuickStats(container)
            }

        }
        );
        $.getJSON('/stats/recordstats/'+stats_playerid,null,function(json){
            module.quickstats.recordstats=json;
            if(module.quickstats.playerdetails){
                module.FillQuickStats(container)
            }

        }
        )
    }
    ;
    module.overallStatsData=null;
    module.reloadCount=0;
    module.DisplayStatsData=function(){
        var json=module.overallStatsData;
        var html='';
        if(json){
            var fields={
                'NUM_PLAYERS':'Online Players','NUM_FRAGS':'Frags Last Hour','NUM_GAMES':'Games Last Hour'
            }
            ;var validFields=[];for(var fieldName in fields){
                if(json[fieldName]&gt;
                1){
                    validFields[validFields.length]=fieldName
                }

            }
            if(validFields.length&gt;
            0){
                var fieldName=validFields[module.reloadCount++%validFields.length];
                html+=json[fieldName]+' '+fields[fieldName]
            }

        }
        $('#qlv_siteStatus').fadeOut('fast',function(){
            $('#qlv_siteStatus .front,#qlv_siteStatus .outline').html(html);
            $('#qlv_siteStatus').fadeIn()
        }
        );
        setTimeout(module.DisplayStatsData,60000)
    }
    ;
    module.ReloadOverallStats_Success=function(data){
        var json=quakelive.Eval(data);
        module.overallStatsData=json;
        setTimeout(module.ReloadOverallStats,10*60*1000)
    }
    ;
    module.ReloadOverallStats_Error=function(){
        setTimeout(module.ReloadOverallStats,10*60*1000)
    }
    ;
    quakelive.RegisterModule('stats',module)
}
)(jQuery);
(function($){
    var module={

    }
    ;
    module.LAYOUT='postlogin';
    module.DISPLAY={
        friends:"#qlv_chatControl",lfg:"#lfg_content",bottom:true,content:true
    }
    ;
    module.BASE_FILTERS={
        'view':'FRAGS','startrec':1,'numrecs':50,'gt':'ALL','tf':'LAST30','map':'ALL','ctry':'ALL','plys':'ALL','tier':'ALL','wpn':'ALL','hili':0
    }
    ;
    module.FILTER_ORDER=['view','startrec','numrecs','gt','tf','map','ctry','plys','tier','wpn','hili'];
    module.SUMMARY_FILTER_ORDER=['gt','tf','map','ctry','plys','tier','wpn'];
    module.Init=function(){
        module.filter_params=$.extend({

        }
        ,module.BASE_FILTERS)
    }
    ;
    module.ShowContent=function(content){
        if(quakelive.prevActiveModule!=this){
            module.filter_params=$.extend({

            }
            ,module.BASE_FILTERS)
        }
        $('#qlv_contentBody').html(content);for(var each in quakelive.params){
            if(quakelive.params[each]){
                module.filter_params[each]=quakelive.params[each]
            }

        }
        switch(quakelive.pathParts[1]){
            case'summary':$('.corner_img').each(function(index,domNode){
                var leadNode=$(domNode);if(quakelive.mod_friends.IsBlocked(leadNode.attr("id"))){
                    var imgpath=quakelive.SwapAvatarPath(leadNode.attr("style"),quakelive.PlayerAvatarPath.G_LG);leadNode.attr("style",imgpath)
                }

            }
            );
            break
        }

    }
    ;
    module.GetLoadPath=function(){
        if(quakelive.pathParts[1]=='summary'){
            var path='/leaders/summary';
            return path
        }
        else{
            var path='/leaders/details/full';for(var i=0;i&lt;this.FILTER_ORDER.length;++i){
                path+='/'+(quakelive.params[this.FILTER_ORDER[i]]||this.filter_params[this.FILTER_ORDER[i]])
            }
            return path
        }

    }
    ;
    module.set_filter_params=function(key,val){
        module.filter_params[key]=val;
        module.RefreshLeaderBoardView()
    }
    ;
    module.SetFilter=function(domNode,filterName){
        $('#navNcustom_sel').removeAttr('id');
        $(domNode).attr('id','navNcustom_sel');
        module.filter_params.startrec=1;
        module.set_filter_params('view',filterName)
    }
    ;
    module.make_lb_urlhash=function(basepath){
        var hash_parts=['#'+basepath];for(var each in module.filter_params){
            param_string=each+'='+module.filter_params[each];
            hash_parts.push(param_string)
        }
        return hash_parts.join(';
        ')
    }
    ;
    module.set_lb_url=function(basepath){
        var hash=module.make_lb_urlhash(basepath);
        quakelive.SetMonitorPath(hash);
        document.location.hash=hash;
        quakelive.ParsePath()
    }
    ;
    module.LoadLeaderBoard=function(board,startRec,numRecs,hilight_player){
        quakelive.ReloadAds();
        startRec=startRec||module.filter_params.startrec;
        numRecs=numRecs||module.filter_params.numrecs;
        module.filter_params.startrec=startRec;
        module.filter_params.numrecs=numRecs;
        if(hilight_player!=null)module.filter_params.hili=hilight_player.POS;
        module.set_lb_url('leaders/details');
        var urlParts=[board,startRec,numRecs,module.filter_params.gt,module.filter_params.tf,module.filter_params.map,module.filter_params.ctry,module.filter_params.plys,module.filter_params.tier,module.filter_params.wpn,module.filter_params.hili];
        if($('#leaderboard_data').size()&gt;
        0){
            var requrl='/leaders/details/part/'+urlParts.join('/');
            $.ajax({
                url:requrl,mode:'abort',port:'leaders',type:'get',error:function(){
                    module.SetFindPlayerMsg("Error loading leaderboard")
                }
                ,success:function(data){
                    $('#lb_section_header').attr("src",quakelive.resource("/images/sf/leaderboard/hdr_"+board.toLowerCase()+".gif"));$('#leaderboard_data').html(data)
                }

            }
            )
        }
        else{
            var requrl='/leaders/details/full/'+urlParts.join('/');
            $.ajax({
                url:requrl,mode:'abort',port:'leaders',type:'get',error:function(){
                    module.SetFindPlayerMsg("Error loading leaderboard")
                }
                ,success:function(data){
                    $('#qlv_contentBody').html(data)
                }

            }
            )
        }

    }
    ;
    module.LoadMiniLeaderBoards=function(){
        quakelive.ReloadAds();
        var requrl='/leaders/summary/'+module.filter_params.gt+'/'+module.filter_params.tf+'/'+module.filter_params.map+'/'+module.filter_params.ctry+'/'+module.filter_params.plys+'/'+module.filter_params.tier+'/'+module.filter_params.wpn;
        $.ajax({
            url:requrl,mode:'abort',port:'leaders',type:'get',error:function(){
                module.SetFindPlayerMsg("Error loading leaderboard summary")
            }
            ,success:function(data){
                $('#lb_section_header').attr("src",quakelive.resource("/images/sf/leaderboard/hdr_summary.gif"));$('#leaderboard_data').html(data)
            }

        }
        )
    }
    ;
    module.RefreshLeaderBoardView=function(){
        var view=module.filter_params['view'];
        if(view.toUpperCase()=='SUMMARY'){
            module.set_lb_url('leaders/summary');
            module.LoadMiniLeaderBoards()
        }
        else{
            module.set_lb_url('leaders/details');
            module.LoadLeaderBoard(view.toUpperCase())
        }

    }
    ;
    module.SetFindPlayerMsg=function(msg){
        $('#find_player_msg').text(msg);
        if(msg.length&gt;
        0){
            setTimeout(function(){
                $('#find_player_msg').fadeOut()
            }
            ,15000)
        }

    }
    ;
    module.FindPlayerClick=function(){
        module.SetFindPlayerMsg("");var view=module.filter_params['view'];if(view=='SUMMARY'){
            view='WINS'
        }
        var player_name=$('#find_player_input').val();
        if(typeof(player_name)=='undefined'){
            module.SetFindPlayerMsg("Missing Player Name");return
        }
        player_name=$.trim(player_name);
        if(player_name.length==0){
            module.SetFindPlayerMsg("Empty Player Name");return
        }
        var requrl='/leaders/findplayer/'+player_name+'/'+view+'/'+module.filter_params.gt+'/'+module.filter_params.tf+'/'+module.filter_params.map+'/'+module.filter_params.ctry+'/'+module.filter_params.plys+'/'+module.filter_params.tier+'/'+module.filter_params.wpn;
        $.ajax({
            url:requrl,mode:'abort',port:'leaders',type:'get',dataType:'json',error:function(){
                module.SetFindPlayerMsg("Internal error - try again")
            }
            ,success:function(json){
                if(json.POS==-1){
                    module.SetFindPlayerMsg("Player not found");return
                }
                var player_rank=json.POS;
                var recsPerPage=module.filter_params.numrecs;
                var start_record=(Math.floor(player_rank/recsPerPage)*recsPerPage)+1;
                if(player_rank%recsPerPage==0){
                    start_record-=recsPerPage
                }
                module.LoadLeaderBoard(view,start_record,recsPerPage,json)
            }

        }
        );
        return false
    }
    ;
    module.ToggleCustomize=function(){
        if($('#customize_bar_filters').css('display')=='none'){
            $('#toggle_customize').removeClass('customize_btn').addClass('close_btn')
        }
        else{
            $('#toggle_customize').addClass('customize_btn').removeClass('close_btn')
        }
        $('#customize_bar_filters').slideToggle()
    }
    ;var focusCount=0;var focusDefault="";module.FocusFindPlayer=function(input){
        var node=$(input);
        if(focusCount++==0){
            focusDefault=node.val()
        }
        if(node.val()==focusDefault){
            node.val('').removeClass('input_default')
        }

    }
    ;
    module.BlurFindPlayer=function(input){
        var node=$(input);
        if(node.val()==''){
            node.val(focusDefault).addClass('input_default')
        }

    }
    ;
    quakelive.RegisterModule('leaders',module)
}
)(jQuery);
(function($){
    var NOTIFY_TIMEOUT_DURATION=60;var NOTIFY_ERROR_DURATION=20;var GAMETYPENAMES=["FFA","DUEL","SP","TDM","CTF","CA"];var MenuStates={
        MINIMIZED:0,NORMAL:1,INQUEUE:2,READY:3
    }
    ;
    var LFGStates={
        DISABLED:0,ENABLED:1,IN_CANCELLED:2,OUT_CANCELLED:3,ACCEPTED:4,DECLINED:5
    }
    ;
    var module={

    }
    ;
    module.MenuStates=MenuStates;
    var currentState=MenuStates.MINIMIZED;
    module.haveAssets=false;
    module.isConnected=true;
    module.lastLFGType=-1;
    module.lastLFGState=0;
    module.lastLFGRequests=0;
    module.cancelMessage=null;
    module.cancelTimeoutHandle=null;
    module.shown=false;
    module.ShowLFG=function(){
        if(module.shown){
            return
        }
        if(module.isConnected&&module.haveAssets&&quakelive.cvars.GetIntegerValue("web_skipLauncher")!=0&&!quakelive.userinfo.NEW_PLAYER){
            module.UpdateLFGMessage(module.lastLFGRequests);
            module.SetQueue(module.lastLFGType,LFGStates.DISABLED,true);
            module.shown=true
        }

    }
    ;
    module.OnAuthenticatedInit=function(){
        quakelive.AddHook('IM_OnConnected',function(){
            module.isConnected=true;
            module.ShowLFG()
        }
        );
        quakelive.AddHook('OnDownloadGroup',function(params){
            if(params.group==GROUP_DONE){
                module.haveAssets=true;
                module.ShowLFG()
            }

        }
        );
        quakelive.AddHook('OnGameStarted',function(){
            if(currentState!=MenuStates.MINIMIZED&&currentState!=MenuStates.NORMAL){
                module.CloseGameNotify(LFGStates.DISABLED)
            }

        }
        );
        quakelive.AddHook('OnServerListReload',function(json){
            module.UpdateLFGMessage(json.lfg_requests)
        }
        );
        quakelive.AddHook('OnContentLoaded',module.ShowLFG)
    }
    ;
    module.SetQueue=function(gameType,newState,bChangeState){
        module.lastLFGType=gameType;
        module.lastLFGState=newState;
        $.ajax({
            url:'/lfg/setqueue',data:{
                'type':gameType,'state':newState
            }
            ,type:'post',dataType:'json',mode:'abort',port:'lfg_queue',success:function(json){
                if(bChangeState){
                    if(newState==LFGStates.DISABLED||newState==LFGStates.DECLINED){
                        if(currentState==MenuStates.MINIMIZED){
                            module.ChangeState(MenuStates.MINIMIZED)
                        }
                        else{
                            module.ChangeState(MenuStates.NORMAL)
                        }

                    }
                    else{
                        if(currentState==MenuStates.NORMAL||currentState==MenuStates.READY){
                            module.ChangeState(MenuStates.INQUEUE)
                        }
                        else{
                            module.ChangeState(MenuStates.NORMAL)
                        }

                    }

                }

            }
            ,error:function(){

            }

        }
        )
    }
    ;
    module.UpdateLFGMessage=function(lfg_requests){
        module.lastLFGRequests=lfg_requests;
        if(currentState!=MenuStates.NORMAL){
            return
        }
        var msg;
        if(lfg_requests&gt;
        1){
            msg='<b>'+lfg_requests+'</b> players requesting games'
        }
        else{
            msg='Let us find a match for you!'
        }
        $('#lfg_normal .footer').html(msg)
    }
    ;
    module.CloseGameNotify=function(cancelState){
        if(module.notifyTimeoutHandle){
            clearTimeout(module.notifyTimeoutHandle);
            module.notifyTimeoutHandle=null
        }
        module.notifyServer=null;
        if(cancelState&gt;
        -1){
            module.SetQueue(module.lastLFGType,cancelState,true)
        }
        else{
            module.ChangeState(MenuStates.NORMAL)
        }

    }
    ;
    module.JoinGame=function(){
        var cmdString='+connect '+module.notifyServer.host_address;
        module.SetQueue(module.lastLFGType,LFGStates.ACCEPTED,false);
        LaunchGame(BuildCmdString()+cmdString)
    }
    ;
    module.WatchNotifyTimer=function(){
        $('#lfg').find('.timer').text(module.notifyTimeLeft);
        if(module.notifyTimeLeft==0){
            module.cancelMessage="Timed out waiting for user input. You must join your match within 60 seconds of being found.";module.CloseGameNotify(LFGStates.DISABLED)
        }
        else{
            module.notifyTimeoutHandle=setTimeout(module.WatchNotifyTimer,1000)
        }
        module.notifyTimeLeft--
    }
    ;
    module.CancelNotifyTimer=function(){
        if(module.notifyTimeoutHandle){
            clearTimeout(module.notifyTimeoutHandle);
            module.notifyTimeoutHandle=null
        }

    }
    ;
    module.ChangeState=function(state){
        var $lfg=$('#lfg');
        currentState=state;
        switch(state){
            case MenuStates.MINIMIZED:$lfg.html(module.TPL_MODE_MINIMIZED);
            $lfg.find('.lfg_content').click(function(){
                module.ChangeState(MenuStates.NORMAL)
            }
            );
            break;
            case MenuStates.NORMAL:$lfg.html(module.TPL_MODE_NORMAL);
            $lfg.find('ul.jd_menu').jdMenu();
            $lfg.find('.collapse_proxy').click(function(){
                module.ChangeState(MenuStates.MINIMIZED)
            }
            );
            module.UpdateLFGMessage(module.lastLFGRequests);
            $lfg.find('.select_gt_5').click(function(){
                module.SetQueue(5,LFGStates.ENABLED,true)
            }
            );
            var hideCancelBlurb=function(){
                $lfg.find('.cancel_blurb').hide();
                $lfg.find('.blurb').show()
            }
            ;
            if(module.cancelMessage){
                $lfg.find('.blurb').hide();
                $lfg.find('.cancel_blurb').text(module.cancelMessage).show();
                if(module.cancelTimeoutHandle){
                    clearTimeout(module.cancelTimeoutHandle)
                }
                module.cancelTimeoutHandle=setTimeout(hideCancelBlurb,NOTIFY_ERROR_DURATION*1000);
                module.cancelMessage=null
            }
            else{
                hideCancelBlurb()
            }
            break;
            case MenuStates.INQUEUE:$lfg.html(module.TPL_MODE_INQUEUE);
            var stopSearch=function(){
                if(confirm("Stop searching for a Duel?")){
                    module.SetQueue(module.lastLFGType,LFGStates.DISABLED,true)
                }

            }
            ;
            $lfg.find('.collapse_proxy, .btn_stop').click(stopSearch);
            module.UpdateLFGMessage(module.lastLFGRequests);
            break;
            case MenuStates.READY:$lfg.html(module.TPL_MODE_READY);
            $lfg.find('.levelshot').css('background-image','url('+quakelive.resource('/images/levelshots/sm/'+module.notifyServer.map+'.jpg')+')');
            $lfg.find('.description').text(module.notifyServer.map_title+' / '+module.notifyServer.game_type_title);
            $lfg.find('.play').click(module.JoinGame);
            $lfg.find('.decline').click(function(){
                module.CloseGameNotify(LFGStates.DECLINED)
            }
            );
            quakelive.matchtip.BindMatchTooltip($('#lfg_ready_tooltip'),module.notifyServer.public_id);
            module.notifyTimeLeft=NOTIFY_TIMEOUT_DURATION;
            module.WatchNotifyTimer();
            break;
            default:return
        }
        $lfg.show()
    }
    ;
    window.OnLFGNotify=function(errorCode,json){
        if(module.notifyTimeoutHandle!=null){
            return
        }
        var jsob=quakelive.Eval(json);
        server=quakelive.Eval(jsob.DATA);
        module.SetQueue(module.lastLFGType,LFGStates.ENABLED,false);
        module.notifyServer=server;
        module.ChangeState(MenuStates.READY)
    }
    ;
    window.OnLFGCancel=function(json){
        var msg=quakelive.Eval(json);
        if(msg.MESSAGE=='OK'){
            module.cancelMessage=null
        }
        else{
            module.cancelMessage=msg.MESSAGE
        }
        module.CloseGameNotify(-1)
    }
    ;
    quakelive.RegisterModule('lfg',module)
}
)(jQuery);
(function($){
    var module={

    }
    ;
    module.LAYOUT='postlogin';
    module.DISPLAY={
        friends:"#qlv_chatControl",lfg:"#lfg_content",bottom:true,content:true
    }
    ;
    module.BindRecentMatches=function(){
        var basePath=quakelive.BuildSubPath(3);
        quakelive.statstip.SetOptions(null);
        $('.recent_match').each(function(){
            var matchdata=this.id.split("_");quakelive.statstip.BindStatsTooltip($(this),matchdata[1],matchdata[0],basePath)
        }
        )
    }
    ;
    module.GetFriendStatus=function(playerName){
        var status={
            friend:false,blocked:false
        }
        ;
        if(quakelive.mod_friends.IsOnRoster(playerName)){
            status.friend=true
        }
        else if(quakelive.mod_friends.IsBlocked(playerName)){
            status.blocked=true
        }
        return status
    }
    ;
    module.SetupVSFriendControls=function(){
        if(!friendListReady){
            return
        }
        var playerName=$('#prf_player_name').text();
        var container=$('#prf_friend_controls').empty();
        if(playerName.toLowerCase()==quakelive.username.toLowerCase()){
            return
        }
        var status=module.GetFriendStatus(playerName);
        if(status.friend){
            container.html("<div title=\"Already on friends list\" class=\"btn_yourfriend\"></div>"+"<a href=\"javascript:;\" title=\"Remove from Friends\" uuups=\"quakelive.mod_profile.UninvitePlayer( '"+playerName+"' ); return false\" class=\"btn_unfriend\"></a>")
        }
        else if(status.blocked){
            container.html("<a href=\"javascript:;\" uuups=\"quakelive.mod_profile.UnblockPlayer( '"+playerName+"' ); return false\" class=\"btn_fr_unblock_player\"></a>")
        }
        else{
            container.html("<a href=\"javascript:;\" title=\"Add to Friends\" uuups=\"quakelive.mod_profile.InvitePlayer( '"+playerName+"' ); return false\" class=\"btn_friendinvite\"></a>"+"<a href=\"javascript:;\" title=\"Add to Blocked Players\" uuups=\"quakelive.mod_profile.BlockPlayer( '"+playerName+"' ); return false\" class=\"btn_block\"></a>")
        }

    }
    ;
    module.SetupFriendControls=function(){
        if(!friendListReady){
            return
        }
        $('.prf_friend').each(function(index,domNode){
            var friendNode=$(domNode);var controlsNode=friendNode.find(".invite_controls");var str=controlsNode.attr('id');var index=str.indexOf('_');if(index!=-1){
                var playerName=str.substr(index+1);
                var status=module.GetFriendStatus(playerName);
                if(status.friend){
                    controlsNode.html("<div title=\""+playerName+" is already your friend\" class=\"btn_fr_invite_inactive rpad_btn fl\"></div>"+"<div class=\"cl\"></div>");friendNode.removeClass('is_blocked is_friend').addClass('is_friend')
                }
                else if(status.blocked){
                    var imgpath=quakelive.SwapAvatarPath(friendNode.find('.head_icon').attr("style"),quakelive.PlayerAvatarPath.G_LG);friendNode.find('.head_icon').attr("style",imgpath);friendNode.removeClass('is_blocked is_friend').addClass('is_blocked')
                }
                else{
                    controlsNode.html("<a href=\"javascript:;\" uuups=\"quakelive.mod_profile.InvitePlayer( '"+playerName+"' ); return false\" class=\"btn_fr_invite rpad_btn fl\"></a>"+"<div class=\"cl\"></div>")
                }

            }

        }
        )
    }
    ;
    module.InvitePlayer=function(name){
        if(!confirm("Are you sure you want to add "+name+" to your friends list?")){
            return
        }
        quakelive.mod_friends.Subscribe(name);
        var callbacks=module.sections[module.activeSection];
        if(callbacks&&callbacks.OnRosterChanged){
            callbacks.OnRosterChanged()
        }

    }
    ;
    module.UninvitePlayer=function(name){
        if(!confirm("Are you sure you want to remove "+name+" from your friends list?")){
            return
        }
        quakelive.mod_friends.Unsubscribe(name);
        var callbacks=module.sections[module.activeSection];
        if(callbacks&&callbacks.OnRosterChanged){
            setTimeout(callbacks.OnRosterChanged,300)
        }

    }
    ;
    module.BlockPlayer=function(name){
        if(!confirm("Are you sure you want to block the player "+name+"?")){
            return
        }
        quakelive.mod_friends.BlockPlayer(name);
        module.SetupVSFriendControls()
    }
    ;
    module.UnblockPlayer=function(name){
        if(!confirm("Are you sure you want to unblock the player "+name+"?")){
            return
        }
        quakelive.mod_friends.UnblockPlayer(name);
        module.SetupVSFriendControls()
    }
    ;
    var friendListReady=false;
    module.IM_OnRosterChanged=function(){
        friendListReady=true;
        if(quakelive.activeModule==module){
            var callbacks=module.sections[module.activeSection];
            if(callbacks&&callbacks.OnRosterChanged){
                callbacks.OnRosterChanged()
            }

        }

    }
    ;
    module.AlterSummaryContent=function(){
        module.BindRecentMatches();
        module.SetupVSFriendControls();
        module.CheckRecentCompetitors()
    }
    ;
    module.AlterStatisticsContent=function(){
        module.BindRecentMatches();
        module.SetupVSFriendControls()
    }
    ;
    module.AlterAwardsContent=function(){

    }
    ;
    module.AlterFriendsContent=function(){
        module.SetupFriendControls()
    }
    ;
    module.AlterCompetitorsContent=function(){
        module.BindRecentMatches();
        module.SetupFriendControls()
    }
    ;
    module.AlterMatchesContent=function(){

    }
    ;
    module.CheckRecentCompetitors=function(){
        $('.icon_holder &gt;
        img').each(function(index,domNode){
            var compNode=$(domNode);if(quakelive.mod_friends.IsBlocked(compNode.attr("id"))){
                var imgpath=quakelive.SwapAvatarPath(compNode.attr("src"),quakelive.PlayerAvatarPath.G_MD);compNode.attr("src",imgpath)
            }

        }
        )
    }
    ;
    module.activeSection='';
    module.sections={
        'summary':{
            OnShow:module.AlterSummaryContent,OnRosterChanged:module.SetupVSFriendControls
        }
        ,'statistics':{
            OnShow:module.AlterStatisticsContent,OnRosterChanged:module.SetupVSFriendControls
        }
        ,'awards':{
            OnShow:module.AlterAwardsContent,OnRosterChanged:null
        }
        ,'friends':{
            OnShow:module.AlterFriendsContent,OnRosterChanged:module.SetupFriendControls
        }
        ,'competitors':{
            OnShow:module.AlterCompetitorsContent,OnRosterChanged:module.SetupFriendControls
        }
        ,'matches':{
            OnShow:module.AlterMatchesContent,OnRosterChanged:null
        }

    }
    ;
    module.ShowContent=function(content){
        $('#qlv_contentBody').html(content);
        if(quakelive.pathParts[0]=='profile'){
            module.activeSection=quakelive.pathParts[1];
            var callbacks=module.sections[module.activeSection];
            if(callbacks&&callbacks.OnShow){
                callbacks.OnShow()
            }

        }
        var matchPathIndex=quakelive.pathParts.length-2;
        if(quakelive.pathParts[matchPathIndex]&&quakelive.pathParts[matchPathIndex]==parseInt(quakelive.pathParts[matchPathIndex])){
            quakelive.statstip.ShowStatsDetails(quakelive.pathParts[matchPathIndex],quakelive.pathParts[matchPathIndex+1])
        }
        switch(quakelive.pathParts[1]){
            case'awards':var award=quakelive.GetParam('award')||0;var type=quakelive.GetParam('type')||1;prevSelectedTypeId=-1;module.AwardsSelectBar(type,quakelive.pathParts[2],award);break;case'matches':module.LoadMatchesForWeek(quakelive.pathParts[2],quakelive.pathParts[3]||'last_7_days');break
        }

    }
    ;var focusCount=0;var focusDefault="";module.FocusProfileJump=function(input){
        var node=$(input);
        if(focusCount++==0){
            focusDefault=node.val()
        }
        if(node.val()==focusDefault){
            node.val('').removeClass('input_default')
        }

    }
    ;
    module.BlurProfileJump=function(input){
        var node=$(input);
        if(node.val()==''){
            node.val(focusDefault).addClass('input_default')
        }

    }
    ;
    module.SetProfileJumpMsg=function(msg){
        $('#profil_jump_msg').text(msg);
        if(msg.length&gt;
        0){
            setTimeout(function(){
                $('#profile_jump_msg').fadeOut()
            }
            ,15000)
        }

    }
    ;
    module.ProfileJumpClick=function(){
        module.SetProfileJumpMsg("");var player_name=$('#profile_jump_input').val();if(typeof(player_name)=='undefined'){
            module.SetProfileJumpMsg("Missing Player Name");return
        }
        player_name=$.trim(player_name);
        if(player_name.length==0){
            module.SetProfileJumpMsg("Empty Player Name");return
        }
        quakelive.Goto('profile/summary/'+player_name);
        return false
    }
    ;
    var prevSelectedTypeId=-1;
    module.AwardsSelectBar=function(typeId,playerName,jumpAwardId){
        var obj=$('.awardTypeId'+typeId);
        if(prevSelectedTypeId!=typeId){
            if(prevSelectedTypeId!=-1){
                $('.awardTypeId'+prevSelectedTypeId).removeClass('awardBarSel').addClass('awardBar')
            }
            prevSelectedTypeId=typeId;obj.removeClass('awardBar').addClass('awardBarSel');$('.selectedInfo').remove();var html='<div class="selectedInfo"><div style="padding: 5px">&lt;h1&gt;Loading…&lt;/h1&gt;<br><img src="'+quakelive.resource('/images/loader.gif')+'" width="62" height="13" style="margin: 0 auto; display: block"  alt=""></div></div>';obj.after($(html));$.ajax({
                url:'/profile/awards/'+playerName+'/'+typeId,mode:'abort',port:'ql_profile',dataType:'html',success:function(data){
                    $('.selectedInfo').html(data)
                }
                ,error:function(err){
                    $('.selectedInfo').html('&lt;
                    h1&gt;
                    Error loading award data.<br>Please Try again later&lt;
                    /h1&gt;
                    ')
                }

            }
            )
        }
        else{
            if(jumpAwardId){

            }
            else{
                $('.awardTypeId'+prevSelectedTypeId).removeClass('awardBarSel').addClass('awardBar');
                $('.selectedInfo').remove();
                prevSelectedTypeId=-1
            }

        }

    }
    ;
    var pendingAwardsTriggered=false;
    module.IM_OnConnected=function(){
        if(pendingAwardsTriggered){
            return
        }
        pendingAwardsTriggered=true;
        $.ajax({
            type:'get',url:'/profile/trigger_pending_awards',dataType:'json'
        }
        )
    }
    ;
    $.fn.extend({
        loading:function(){
            return this.html('<div style="width: 100%; height: 100%"><img src="'+quakelive.resource('/images/loader.gif')+'" width="62" height="13" style="margin: 0 auto"  alt=""></div>')
        }

    }
    );module.LoadMatchesForWeek=function(player_name,week_name){
        $('.btn_'+week_name+' a').addClass('selected');$('#matchesBlock').html('<div style="padding: 20px"><span class="verdanaBblk_11">Loading matches...</span><br><br><br><img src="'+quakelive.resource('/images/loader.gif')+'" width="62" height="13" style="margin: 0 auto"  alt=""></div>');$.ajax({
            type:'get',url:'/profile/matches_by_week/'+player_name+'/'+week_name,success:function(data){
                var node=$('#matchesBlock').html(data);
                var firstBar=node.find('.selectedBG:first').prev();
                if(firstBar.size()&gt;
                0){
                    module.MatchSelectBar(firstBar.get())
                }

            }
            ,error:function(err){
                $('#matchesBlock').html('Load failed')
            }

        }
        )
    }
    ;
    var prevMatchBar=null;
    module.MatchSelectBar=function(node){
        prevMatchBar=node;if(!$(node).hasClass("selectedMatchBar")){
            module.ActivateMatchBar(node)
        }
        else{
            module.DeactivateMatchBar(node)
        }

    }
    ;
    module.ActivateMatchBar=function(node){
        $(node).removeClass("matchBar").addClass("selectedMatchBar").next().show();quakelive.statstip.SetOptions(null);var basePath=quakelive.BuildSubPath(4);$(node).next().find(".areaMapC").each(function(){
            var matchdata=this.id.split("_");quakelive.statstip.BindStatsTooltip($(this),matchdata[1],matchdata[0],basePath)
        }
        )
    }
    ;
    module.DeactivateMatchBar=function(node){
        $(node).addClass("matchBar").removeClass("selectedMatchBar").next().hide()
    }
    ;
    quakelive.RegisterModule('profile',module)
}
)(jQuery);
(function($){
    var module={

    }
    ;module.skipMatchingPathUpdates=new RegExp("^#faq\\b");module.LAYOUT='postlogin';module.DISPLAY={
        friends:"#qlv_chatControl",bottom:true,content:true
    }
    ;
    quakelive.RegisterModule('faq',module)
}
)(jQuery);
(function($){
    var module={

    }
    ;module.skipMatchingPathUpdates=new RegExp("^#guide\\b");module.LAYOUT='postlogin';module.DISPLAY={
        friends:"#qlv_chatControl",bottom:true,content:true
    }
    ;
    quakelive.RegisterModule('guide',module)
}
)(jQuery);
(function($){
    var module={

    }
    ;
    module.GetLayout=function(){
        if(quakelive.pathParts[1]=='eula_updated'){
            return'bare'
        }
        else{
            return'postlogin'
        }

    }
    ;
    quakelive.RegisterModule('legals',module)
}
)(jQuery);
(function($){
    var module={

    }
    ;
    module.GT_FFA=0;
    module.GT_TOURNEY=1;
    module.GT_SINGLE=2;
    module.GT_TEAM=3;
    module.GT_CA=4;
    module.GT_CTF=5;
    module.TEAM_FREE=0;
    module.TEAM_RED=1;
    module.TEAM_BLUE=2;
    module.TEAM_SPECTATOR=3;
    module.allArenaOptions={
        'DM':{
            gameType:'DM',botSkill:-1,fragLimit:30,timeLimit:20,numPlayers:8,lastMap:'',numplay_opts:[1,2,4,8,12,16],limit_opts:[0,10,20,30,40,50]
        }
        ,'TOURNEY':{
            gameType:'DUEL',botSkill:-1,fragLimit:15,timeLimit:10,lastMap:'',limit_opts:[0,10,20,30,40,50]
        }
        ,'TDM':{
            gameType:'TDM',botSkill:-1,fragLimit:50,timeLimit:20,numPlayers:8,team:module.TEAM_RED,friendlyFire:0,lastMap:'',numplay_opts:[2,4,8,12,16],limit_opts:[0,10,20,30,40,50]
        }
        ,'CA':{
            gameType:'CA',botSkill:-1,fragLimit:8,timeLimit:0,numPlayers:8,team:module.TEAM_RED,friendlyFire:0,lastMap:'',numplay_opts:[2,4,8,12,16],limit_opts:[0,4,6,8,12,16]
        }
        ,'CTF':{
            gameType:'CTF',botSkill:-1,timeLimit:20,captureLimit:5,fragLimit:6,numPlayers:8,team:module.TEAM_RED,friendlyFire:0,lastMap:'',numplay_opts:[2,4,8,12,16],limit_opts:[0,4,6,8,12,16]
        }

    }
    ;
    module.GameTypeDisplayText={
        'DM':"Free For All",'TDM':"Team Death Match",'CTF':"Capture The Flag",'Tourney':"Duel",'TOURNEY':"Duel",'TOTAL':"TOTAL",'CA':"Clan Arena",'None':"None"
    }
    ;
    var bot_sk;
    var botmatch_options;
    /************************************************************\
    *
    \************************************************************/
    function read_bot_sk(){
        var xs=0;for(var i=0;i&lt;quakelive.session.length;++i){
            xs+=quakelive.session.charCodeAt(i)
        }
        var r=[];var k="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";var s=$('#bot_sk').text();for(var i=0;i&lt;s.length;++i){
            var xi=((1+i)*xs)%k.length;
            var ci=k.indexOf(s[i]);
            if(ci&lt;
            xi){
                ci+=k.length
            }
            r[i]=ci-xi
        }
        bot_sk=r
    }
    module.GetRandomBot=function(){
        var bots=["anarki","angel","biker","bitterman","bones","cadavre","crash","daemia","doom","gorre","grunt","hossman","hunter","keel","klesk","lucy","major","mynx","orbb","patriot","phobos","ranger","razor","sarge","slash","sorlag","stripe","tankjr","uriel","visor","wrack","xaero"];return bots[parseInt(Math.random()*bots.length)]
    }
    ;
    module.ReplayTrainingGame=function(){
        var player_skill=bot_sk[module.GT_FFA];cmdString="+set bot_dynamicSkill 1 +set com_backgroundDownload 1 +set sv_quitOnExitLevel 1 +set g_gametype 0 +set fraglimit 15 +set timelimit 10";cmdString+=" +set bot_startingSkill "+(skillmap[player_skill]||2)+" +map qztraining";LaunchGame(BuildCmdString()+cmdString,true)
    }
    ;
    module.isTeamGame=function(gtid){
        if(gtid&gt;
        =module.GT_TEAM){
            return true
        }
        return false
    }
    ;
    module.StartBotGame=function(){
        var botTeams={
            blue:0,red:0,free:0
        }
        ;
        var cmd_string=BuildCmdString();
        var gameTypeId=quakelive.GetGameTypeByName(botmatch_options.gameType.toLowerCase()).id;
        var team_game=module.isTeamGame(gameTypeId);
        var map=$('#arena_select option:selected').val();
        var timelimit=$('#time_select option:selected').val();
        var fraglimit=$('#frag_select option:selected').val();
        var botskill=$('#skill_select option:selected').val();
        var num_players=$('#num_players_select option:selected').val();
        if(team_game){
            num_players=parseInt(num_players/2)
        }
        cmd_string+=' +set g_gametype '+gameTypeId;
        var bot_start_skill;
        if(botskill&lt;
        0){
            bot_start_skill=bot_sk[gameTypeId];
            cmd_string+=' +set bot_dynamicSkill 1'
        }
        else if(botskill==0){
            bot_start_skill=bot_sk[gameTypeId]
        }
        else{
            bot_start_skill=botskill
        }
        cmd_string+=' +set g_spskill '+bot_start_skill;
        cmd_string+=' +set bot_startingSkill '+bot_start_skill;
        cmd_string+=' +set timelimit '+timelimit;
        switch(botmatch_options.gameType){
            case'CA':cmd_string+=' +set roundlimit '+fraglimit;
            cmd_string+=' +set dmflags 20';
            break;
            case'CTF':cmd_string+=' +set capturelimit '+fraglimit;
            break;
            default:cmd_string+=' +set fraglimit '+fraglimit;
            break
        }
        cmd_string+=' +map '+map;var maxClients;var minPlayers;var teamColor="free";if(team_game){
            cmd_string+=' +set g_friendlyFire '+(botmatch_options.friendlyFire?1:0);teamColor=(botmatch_options.team==1?"red":"blue");botTeams['blue']=botTeams['red']=num_players;botTeams[teamColor]--;minPlayers=parseInt(num_players);maxClients=(parseInt(num_players)+1)*2
        }
        else if(gameTypeId==module.GT_TOURNEY){
            botTeams['free']=1;
            minPlayers=2;
            maxClients=3
        }
        else{
            botTeams['free']=num_players-1;
            minPlayers=parseInt(num_players);
            maxClients=parseInt(num_players)+1
        }
        cmd_string+=" +set sv_maxclients "+maxClients;for(var team in botTeams){
            while(botTeams[team]--&gt;
            0){
                cmd_string+=" +addbot "+module.GetRandomBot()+" "+bot_start_skill+" "+team+" +wait"
            }

        }
        cmd_string+=" +set bot_minplayers "+minPlayers;LaunchGame(cmd_string,true)
    }
    ;
    module.DrawGTSelectBox=function(){
        var nhtml='';var gts=module.gt_map_obj;for(var gt in gts){
            opt='&lt;option value="'+gts[gt].GAME_TYPE_SHORT+'"&gt;'+module.GameTypeDisplayText[gts[gt].GAME_TYPE_SHORT]+' &lt;/option&gt;';nhtml+=opt
        }
        $('#gt_select').html(nhtml);$('#gt_select').removeAttr('disabled');$("#gt_select").change(module.OnGameTypeSelected);$("#gt_select").change()
    }
    ;
    module.OnGameTypeSelected=function(){
        var selected_value=$("#gt_select option:selected").val();botmatch_options=module.allArenaOptions[selected_value];$('#time_select').val(botmatch_options['timeLimit']);$('#frag_select').val(botmatch_options['fragLimit']);$('#skill_select').val(botmatch_options['botSkill']);if(selected_value!='TOURNEY'){
            $('#num_players_select').removeAttr('disabled').val('0').val(botmatch_options['numPlayers'])
        }
        else{
            $('#num_players_select').attr('disabled','disabled')
        }
        ;
        var fs_title_src;
        if(selected_value=='CTF'){
            fs_title_src=quakelive.resource('/images/sf/offline/capture_title2.png');$('#limit_title').attr('style',"background: url('"+fs_title_src+"') no-repeat; margin-left: 10px; width: 72px;")
        }
        else if(selected_value=='CA'){
            fs_title_src=quakelive.resource('/images/sf/offline/round_title2.png');$('#limit_title').attr('style',"background: url('"+fs_title_src+"') no-repeat; margin-left: 18px; width: 64px;")
        }
        else{
            fs_title_src=quakelive.resource('/images/sf/offline/frag_title2.png');$('#limit_title').attr('style',"background: url('"+fs_title_src+"') no-repeat;  width: 54px;")
        }
        module.DrawArenaSelectBox();
        module.DrawNumPlayersBox();
        module.DrawLimitBox()
    }
    ;
    module.OnArenaSelected=function(){
        var selected_arena=$("#arena_select option:selected").val();$('#arena_shot').attr('src',quakelive.resource('/images/levelshots/md/'+selected_arena+'.jpg'))
    }
    ;
    module.DrawArenaSelectBox=function(){
        var nhtml='';var selected_value=$("#gt_select option:selected").val();var arenas=module.gt_map_obj[selected_value].ARENAS;for(var arena in arenas){
            var opt='&lt;option value="'+arenas[arena].MAP_SYSNAME+'"&gt;'+arenas[arena].MAP_NAME+'&lt;/option&gt;';nhtml+=opt
        }
        $('#arena_select').html(nhtml);$('#arena_select').removeAttr('disabled');$("#arena_select").change(module.OnArenaSelected);$("#arena_select").change()
    }
    ;
    module.DrawNumPlayersBox=function(){
        var nhtml='';var selected_value=$("#gt_select option:selected").val();var gt_opts=module.allArenaOptions[selected_value];var np_opts=gt_opts['numplay_opts'];for(var option in np_opts){
            var opt='&lt;option value="'+np_opts[option]+'"&gt;'+np_opts[option]+'&lt;/option&gt;';nhtml+=opt
        }
        $('#num_players_select').html(nhtml);
        $('#num_players_select').val(gt_opts['numPlayers'])
    }
    ;
    module.DrawLimitBox=function(){
        var nhtml='';var selected_value=$("#gt_select option:selected").val();var gt_opts=module.allArenaOptions[selected_value];var lopts=gt_opts['limit_opts'];for(var option in lopts){
            var limit_name=lopts[option]?lopts[option]:'None';var opt='&lt;option value="'+lopts[option]+'"&gt;'+limit_name+'&lt;/option&gt;';nhtml+=opt
        }
        $('#frag_select').html(nhtml);
        $('#frag_select').val(gt_opts['fragLimit'])
    }
    ;
    module.LAYOUT='postlogin';
    module.DISPLAY={
        friends:"#qlv_chatControl",bottom:true,content:true
    }
    ;
    module.ShowContent=function(content){
        $('#qlv_contentBody').html(content);
        module.gt_map_obj=quakelive.Eval($('#gt_map_json').html());
        read_bot_sk();
        module.DrawGTSelectBox();
        module.DrawArenaSelectBox()
    }
    ;
    quakelive.RegisterModule('offlinegame',module)
}
)(jQuery);
(function($){
    var module={

    }
    ;
    module.LAYOUT='prelogin';
    module.DISPLAY={
        friends:"#qlv_chatControl",bottom:true,content:true
    }
    ;
    quakelive.RegisterModule('eula',module)
}
)(jQuery);
(function($){
    var module={

    }
    ;
    module.LAYOUT='bare';
    var styledFields={
        "forgot":['email','captcha'],"forgot/validate":['email','code','password','password2']
    }
    ;
    module.ShowContent=function(content){
        quakelive.ShowContent(content);
        module.ResetFieldStyles();
        switch(quakelive.path){
            case"forgot":$('#email').focus();break;case"forgot/validate":$('#email').val(quakelive.params['email']||'');$('#code').val(quakelive.params['code']||'');if($('#email').val().length&&$('#code').val().length){
                $('#password').focus()
            }
            else if($('#email').val().length){
                $('#code').focus()
            }
            else{
                $('#email').focus()
            }
            break
        }

    }
    ;
    module.ResetFieldStyles=function(){
        if(styledFields[quakelive.path]){
            var fields=styledFields[quakelive.path];for(var i in fields){
                quakelive.mod_register.StyleAsDefault(fields[i]);
                $('#'+fields[i]).focus(quakelive.mod_register.FocusField);
                $('#'+fields[i]).blur(quakelive.mod_register.BlurField)
            }

        }

    }
    ;
    module.RequestPasswordMail=function(){
        var formData={
            'email':$('#email').val(),'captcha':$('#captcha').val()
        }
        ;
        $.ajax({
            type:'post',dataType:'json',url:'/forgot/request_mail',data:formData,success:module.RequestPasswordMail_Success,error:module.RequestPasswordMail_Error
        }
        )
    }
    ;
    module.RequestPasswordMail_Success=function(data){
        if(data.ECODE==0){
            quakelive.Goto('forgot/validate;email='+data.EMAIL)
        }
        else{
            module.ResetFieldStyles();for(var errorId in data.ERRORS){
                quakelive.mod_register.StyleAsError(errorId);$('#help_'+errorId).append("<span class='error'>"+data.ERRORS[errorId]+"</span>")
            }

        }

    }
    ;
    module.RequestPasswordMail_Error=function(){
        module.RequestPasswordMail_Success({
            ECODE:-1,ERRORS:{
                "email":"Failed to reset password"
            }

        }
        )
    }
    ;
    module.ChangePassword=function(){
        var formData={
            'email':$('#email').val(),'code':$('#code').val(),'password':$('#password').val(),'password2':$('#password2').val()
        }
        ;
        $.ajax({
            type:'post',dataType:'json',url:'/forgot/change_password',data:formData,success:module.ChangePassword_Success,error:module.ChangePassword_Error
        }
        )
    }
    ;
    module.ChangePassword_Success=function(data){
        if(data.ECODE==0){
            alert("Your password has been changed!");quakelive.Goto('home')
        }
        else{
            module.ResetFieldStyles();for(var errorId in data.ERRORS){
                quakelive.mod_register.StyleAsError(errorId);$('#help_'+errorId).append("<span class='error'>"+data.ERRORS[errorId]+"</span>")
            }

        }

    }
    ;
    module.ChangePassword_Error=function(){
        module.ChangePassword_Success({
            ECODE:-1,ERRORS:{
                "email":"Failed to change password"
            }

        }
        )
    }
    ;quakelive.RegisterModule('forgot',module)
}
)(jQuery);
(function($){
    var module={

    }
    ;
    module.LAYOUT='prelogin';
    quakelive.RegisterModule('logoff',module)
}
)(jQuery);
(function($){
    var module={

    }
    ;
    module.LAYOUT='postlogin';
    module.DISPLAY={
        friends:"#qlv_chatControl",bottom:true,content:true
    }
    ;
    quakelive.RegisterModule('sorry',module)
}
)(jQuery);


/* JS Module Templates */
quakelive.mod_friends.TPL_MANAGE_ITEM = [unescape("%3Cdiv class=%22prf_friend%22%3E%3Cdiv class=%22head_icon interactive%22%3E%3Cimg class=%22online%22 src=%22"),quakelive.resource("/images/profile/icn_onlineflag.png"),unescape("%22 width=%2230%22 height=%2230%22 style=%22display:none;%22/%3E%3C/div%3E%3Cdiv class=%22player_name%22%3E%3Cimg width=%2216%22 height=%2211%22 /%3E%3Ca href='javascript:;'%3E%3C/a%3E%3Cdiv class=%22cl%22%3E%3C/div%3E%3C/div%3E%3Cdiv class=%22info_left%22%3E%3C/div%3E%3Cdiv class=%22info_middle%22%3E%3C/div%3E%3Cdiv class=%22info_right%22%3E%3Cdiv class=%22invite_controls%22%3E%3Ca href=%22javascript:;%22 class=%22btn_fr_view_profile%22 %3E%3C/a%3E%3Cdiv class=%22cl%22/%3E%3C/div%3E%3Ca href=%22javascript:;%22 class=%22btn_fr_delete_friend%22 %3E%3C/a%3E%3C/div%3E%3C/div%3E")].join('');
quakelive.mod_friends.TPL_INCOMING_ITEM = [unescape("%3Cdiv class=%22prf_friend%22%3E%3Cdiv class=%22head_icon interactive%22%3E%3Cimg class=%22online%22 src=%22"),quakelive.resource("/images/profile/icn_onlineflag.png"),unescape("%22 width=%2230%22 height=%2230%22 style=%22display:none;%22/%3E%3C/div%3E%3Cdiv class=%22player_name%22%3E%3Cimg width=%2216%22 height=%2211%22 /%3E%3Ca href='javascript:;'%3E%3C/a%3E%3Cdiv class=%22cl%22%3E%3C/div%3E%3C/div%3E%3Cdiv class=%22info_left%22%3E%3C/div%3E%3Cdiv class=%22info_middle_right%22%3E%3Cdiv class=%22invite_controls%22%3E%3Ca href=%22javascript:;%22 class=%22btn_fr_view_profile%22 %3E%3C/a%3E%3Cdiv class=%22cl%22/%3E%3C/div%3E%3Ca href=%22javascript:;%22 class=%22btn_fr_block_player%22 %3E%3C/a%3E%3C/div%3E%3Cdiv class=%22info_right%22%3E%3Cdiv class=%22invite_controls%22%3E%3Ca href=%22javascript:;%22 class=%22btn_fr_accept_invite%22 %3E%3C/a%3E%3Cdiv class=%22cl%22/%3E%3C/div%3E%3Ca href=%22javascript:;%22 class=%22btn_fr_decline_invite%22 %3E%3C/a%3E%3C/div%3E%3C/div%3E")].join('');
quakelive.mod_friends.TPL_OUTGOING_ITEM = [unescape("%3Cdiv class=%22prf_friend%22%3E%3Cdiv class=%22head_icon interactive%22%3E%3Cimg class=%22online%22 src=%22"),quakelive.resource("/images/profile/icn_onlineflag.png"),unescape("%22 width=%2230%22 height=%2230%22 style=%22display:none;%22/%3E%3C/div%3E%3Cdiv class=%22player_name%22%3E%3Cimg width=%2216%22 height=%2211%22 /%3E%3Ca href='javascript:;'%3E%3C/a%3E%3Cdiv class=%22cl%22%3E%3C/div%3E%3C/div%3E%3Cdiv class=%22info_left%22%3E%3C/div%3E%3Cdiv class=%22info_middle%22%3E%3C/div%3E%3Cdiv class=%22info_right%22%3E%3Cdiv class=%22invite_controls%22%3E%3Ca href=%22javascript:;%22 class=%22btn_fr_view_profile%22 %3E%3C/a%3E%3Cdiv class=%22cl%22/%3E%3C/div%3E%3Ca href=%22javascript:;%22 class=%22btn_fr_revoke_invite%22 %3E%3C/a%3E%3C/div%3E%3C/div%3E")].join('');
quakelive.mod_friends.TPL_BLOCK_ITEM = [unescape("%3Cdiv class=%22prf_friend%22%3E%3Cdiv class=%22head_icon interactive%22%3E%3Cimg class=%22online%22 src=%22"),quakelive.resource("/images/profile/icn_onlineflag.png"),unescape("%22 width=%2230%22 height=%2230%22 style=%22display:none;%22/%3E%3C/div%3E%3Cdiv class=%22player_name%22%3E%3Cimg width=%2216%22 height=%2211%22 /%3E%3Ca href='javascript:;'%3E%3C/a%3E%3Cdiv class=%22cl%22%3E%3C/div%3E%3C/div%3E%3Cdiv class=%22info_left%22%3E%3C/div%3E%3Cdiv class=%22info_middle%22%3E%3C/div%3E%3Cdiv class=%22info_right%22%3E%3Cdiv class=%22invite_controls%22%3E%3Ca href=%22javascript:;%22 class=%22btn_fr_view_profile%22 %3E%3C/a%3E%3Cdiv class=%22cl%22/%3E%3C/div%3E%3Ca href=%22javascript:;%22 class=%22btn_fr_unblock_player%22 %3E%3C/a%3E%3C/div%3E%3C/div%3E")].join('');
quakelive.mod_friends.TPL_SEARCH_EMAIL_REMOTE = [unescape("%3Cdiv class=%22qlv_searchForm%22%3E%3Cdiv class=%22qlv_success_left%22%3E%3Cimg src=%22"),quakelive.resource("/images/sf/friends/invite_success.gif"),unescape("%22 width=%22287%22 height=%22137%22 /%3E%3Cp%3E %3C/p%3E%3C/div%3E%3Cdiv class=%22qlv_searchForm_right%22%3E%3Cp class=%22footerCopy%22%3E %3C/p%3E%3Cp class=%22footerCopy%22%3EThis person will receive your friend request shortly.%3C/p%3E%3Cp%3E%3Cspan class=%22WelcomeText%22%3EYou have Gmail contacts that are not %3Cbr /%3Ecurrent QUAKE LIVE players.%3C/span%3E%3Cbr /%3E%3Cbr /%3ESelect which contacts to invite from the list.%3C/p%3E%3Cp%3E %3C/p%3E%3C/div%3E%3C/div%3E%3Cdiv class=%22qlv_resultListIE6Fix%22%3E%3Cdiv class=%22qlv_resultsList%22%3E%3Cdiv class=%22qlv_resultsListNA%22 style=%22margin: 20px; text-align: center; font-size: 16px; font-family: Arial; display: none;%22%3E%3C/div%3E%3Ctable cellpadding=%220%22 cellspacing=%220%22 class=%22qlv_resultsTable%22%3E%3Ctr%3E%3Ctd%3E%3Cdiv align=%22center%22%3E%3Cinput id=%22qlv_selectAllEmail%22 type=%22checkbox%22 /%3E%3C/div%3E%3C/td%3E%3Ctd%3E%3Cspan style=%22width:198px;%22%3E%3Cimg src=%22"),quakelive.resource("/images/sf/friends/sort_down_icon.gif"),unescape("%22 /%3E%3C/span%3E%3C/td%3E%3Ctd width=%22485%22 style=%22width:198px;%22%3E  email%3C/td%3E%3Ctd width=%2233%22%3E%3Cdiv align=%22right%22%3E%3C/div%3E%3C/td%3E%3C/tr%3E%3Ctbody%3E%3C/tbody%3E%3C/table%3E%3C/div%3E%3C/div%3E%3Cp class=%22qlv_skipbutton%22%3E%3Ca href=%22javascript:;%22 onclick=%22return false%22 /%3E%3C/p%3E%3Cp class=%22qlv_invitebutton%22%3E%3Ca href=%22javascript:;%22 onclick=%22return false%22 /%3E%3C/p%3E")].join('');
quakelive.mod_friends.TPL_FRIENDS_LIST = [unescape("%3Cdiv id=%22im-header%22%3E%3C/div%3E%3Cdiv id=%22im-body%22%3E%3Cdiv id=%22im-active%22%3E%3Ch1%3E%3C/h1%3E%3Cdiv class=%22itemlist%22%3E%3C/div%3E%3C/div%3E%3Cdiv id=%22im-online%22%3E%3Ch1%3E%3C/h1%3E%3Cdiv class=%22itemlist%22%3E%3C/div%3E%3C/div%3E%3C/div%3E%3Cdiv id=%22im-footer%22%3E%3C/div%3E")].join('');
quakelive.mod_prefs.TPL_CHARACTER = [unescape("%3Cdiv class=%22innerpanel fl%22%3E%3Cdiv class=%22rollover fl%22%3E%3Ca href=%22javascript:;%22 onclick=%22quakelive.mod_prefs.Nav('character')%22 class=%22btn_character fl selected%22%3E%3C/a%3E%3Ca href=%22javascript:;%22 onclick=%22quakelive.mod_prefs.Nav('controls_movement')%22 class=%22btn_controls fl%22%3E%3C/a%3E%3Ca href=%22javascript:;%22 onclick=%22quakelive.mod_prefs.Nav('settings_basic')%22 class=%22btn_settings fl%22%3E%3C/a%3E%3Cdiv class=%22cl%22%3E%3C/div%3E%3C/div%3E%3Cdiv class=%22character_gallery fl%22%3E%3Cdiv class=%22thirtypxhigh%22%3E%3C/div%3E%3Cdiv id=%22character_list%22 class=%22character_select fl%22%3E%3Cimg src=%22"),quakelive.resource("/images/loader.gif"),unescape("%22 width=%2262%22 height=%2213%22 /%3E Loading model list…%3C/div%3E%3Cdiv class=%22fl twentypxh long%22%3E%3Cdiv class=%22fl%22%3E%3Cdiv id=%22cfg_char_lgicon%22 class=%22char_lgicon fl%22%3E%3C/div%3E%3Cdiv class=%22fl twelvepxv tenpxh%22%3E%3Cdiv id=%22cfg_char_name%22 style=%22width: 220px; height: 24px%22%3E%3C/div%3E%3Cdiv id=%22cfg_char_race%22 style=%22width: 220px; height: 24px%22%3E%3C/div%3E%3C/div%3E%3Cdiv class=%22cl%22%3E%3C/div%3E%3C/div%3E%3Cdiv class=%22cl%22%3E%3C/div%3E%3Cdiv id=%22cfg_char_description%22 class=%22fl tenpxv eightypxhigh footerCopy%22 style=%22overflow: hidden%22%3E%3C/div%3E%3Cdiv class=%22cl%22%3E%3C/div%3E%3Cdiv class=%22fifteenpxhigh%22%3E%3C/div%3E%3Cdiv class=%22team_game_version%22%3E%3C/div%3E%3Cdiv class=%22cl%22%3E%3C/div%3E%3Cdiv id=%22cfg_char_redteam%22 class=%22red_team fl%22%3E%3C/div%3E%3Cdiv id=%22cfg_char_blueteam%22 class=%22blue_team fl%22%3E%3C/div%3E%3Cdiv class=%22cl%22%3E%3C/div%3E%3C/div%3E%3C/div%3E%3Cdiv class=%22fl%22 style=%22position: relative%22%3E%3Cdiv id=%22cfg_char_body%22 style=%22position: absolute; top: 10px; left: -15px%22 class=%22bodyshot fl%22%3E%3C/div%3E%3C/div%3E%3Cdiv class=%22cl%22%3E%3C/div%3E%3Cdiv class=%22twentypxh twentytwopxv%22%3E%3Ca href=%22javascript:;%22 onclick=%22quakelive.mod_prefs.ResetDefaults(); return false%22 class=%22fl reset_settings_defaults%22%3E%3C/a%3E%3Cdiv class=%22fl tenpxh light-midGrayTxt footerCopy%22%3EReset Defaults for all game settings%3C/div%3E%3Cdiv class=%22cl%22%3E%3C/div%3E%3C/div%3E%3C/div%3E")].join('');
quakelive.mod_prefs.TPL_SETTINGS_BASIC = [unescape("%3Cdiv class=%22innerpanellong fl%22%3E%3Cdiv class=%22rollover fl%22%3E%3Ca href=%22javascript:;%22 onclick=%22quakelive.mod_prefs.Nav('character')%22 class=%22btn_character fl%22%3E%3C/a%3E%3Ca href=%22javascript:;%22 onclick=%22quakelive.mod_prefs.Nav('controls_movement')%22 class=%22btn_controls fl%22%3E%3C/a%3E%3Ca href=%22javascript:;%22 onclick=%22quakelive.mod_prefs.Nav('settings_basic')%22 class=%22btn_settings fl selected%22%3E%3C/a%3E%3Cdiv class=%22cl%22%3E%3C/div%3E%3C/div%3E%3Cdiv class=%22cl%22%3E%3C/div%3E%3Cdiv%3E%3Cdiv class=%22fl%22 style=%22width: 276px;%22%3E %3C/div%3E%3Ca href=%22javascript:;%22 onclick=%22quakelive.mod_prefs.Nav('settings_basic')%22 class=%22btn_basic_active fl%22%3E%3C/a%3E%3Ca href=%22javascript:;%22 onclick=%22quakelive.mod_prefs.Nav('settings_advanced')%22 class=%22btn_advanced fl%22%3E%3C/a%3E%3Cdiv class=%22cl%22%3E%3C/div%3E%3C/div%3E%3Cdiv class=%22fl sixteenpxv%22%3E%3Cdiv class=%22fl twentypxh%22%3E%3Cdiv class=%22panel_audio%22%3E%3Cdiv class=%22twentythreepxhigh%22%3E%3C/div%3E%3Cdiv class=%22fourteenpxh footerCopy%22%3E%3Cp%3E%3Cdiv class='fl'%3EEffects volume: %3C/div%3E %3Cdiv id='effects_volume_value' class='fl'%3E%3C/div%3E%3Cdiv class='cl'%3E%3C/div%3E%3C/p%3E%3Cdiv id=%22slider_s_volume%22 class=%22slider ui-slider%22%3E%3C/div%3E%3Cdiv class=%22sliderpxh%22%3E%3Cdiv class=%22fl ninePxTxt lightGrayTxt%22%3Emin%3C/div%3E%3Cdiv class=%22fr ninePxTxt lightGrayTxt%22%3Emax%3C/div%3E%3Cdiv class=%22cl%22%3E%3C/div%3E%3C/div%3E%3C/div%3E%3Cdiv class=%22fourpxv%22%3E%3C/div%3E%3Cdiv class=%22fourteenpxh footerCopy%22%3E%3Cp%3E%3Cdiv class='fl'%3EMusic volume: %3C/div%3E %3Cdiv id='music_volume_value' class='fl'%3E%3C/div%3E%3Cdiv class='cl'%3E%3C/div%3E%3C/p%3E%3Cdiv id=%22slider_s_musicvolume%22 class=%22slider ui-slider%22%3E%3C/div%3E%3Cdiv class=%22sliderpxh%22%3E%3Cdiv class=%22cl%22%3E%3C/div%3E%3Cdiv class=%22fl ninePxTxt lightGrayTxt%22%3Emin%3C/div%3E%3Cdiv class=%22fr ninePxTxt lightGrayTxt%22%3Emax%3C/div%3E%3Cdiv class=%22cl%22%3E%3C/div%3E%3C/div%3E%3C/div%3E%3C/div%3E%3Cdiv class=%22twentypxv%22%3E%3C/div%3E%3Cdiv class=%22panel_video%22%3E%3Cdiv class=%22twentythreepxhigh%22%3E%3C/div%3E%3Cdiv class=%22fourteenpxh twohundredseventywide%22%3E%3Cdiv class=%22fl med%22%3E%3Cdiv class=%22footerCopy thirtypxhigh%22%3EPlay Full Screen:%3C/div%3E%3Cdiv class=%22footerCopy thirtypxhigh%22%3EFull Screen Resolution:%3C/div%3E%3Cdiv class=%22footerCopy thirtypxhigh%22%3EBrowser Resolution:%3C/div%3E%3Cdiv class=%22footerCopy%22%3E%3Cp%3E%3Cdiv class='fl'%3EBrightness: %3C/div%3E %3Cdiv id='brightness_value' class='fl'%3E%3C/div%3E%3Cdiv class='cl'%3E%3C/div%3E%3C/p%3E%3C/div%3E%3C/div%3E%3Cdiv class=%22fl fourteenpxh%22%3E%3Cdiv class=%22ninePxTxt lightGrayTxt thirtypxhigh%22 id=%22r_fullscreen%22%3E%3C/div%3E%3Cdiv class=%22thirtypxhigh%22%3E%3Cselect id='select_r_mode' name='r_mode'%3E%3C/select%3E%3C/div%3E%3Cdiv class=%22thirtypxhigh%22%3E%3Cselect id='select_r_inbrowsermode' name='r_inbrowsermode'%3E%3C/select%3E%3C/div%3E%3C/div%3E%3Cdiv class=%22cl%22%3E%3C/div%3E%3Cdiv id=%22slider_r_gamma%22 class=%22slider ui-slider%22%3E%3C/div%3E%3Cdiv class=%22sliderpxh%22%3E%3Cdiv class=%22fl ninePxTxt lightGrayTxt%22%3Emin%3C/div%3E%3Cdiv class=%22fr ninePxTxt lightGrayTxt%22%3Emax%3C/div%3E%3Cdiv class=%22cl%22%3E%3C/div%3E%3C/div%3E%3C/div%3E%3C/div%3E%3C/div%3E%3Cdiv class=%22panel_weapons fl twentypxh%22%3E%3Cdiv style=%22height: 25px%22%3E %3C/div%3E%3Cdiv class=%22fourteenpxh twohundredseventywide%22%3E%3Cdiv class=%22fl%22%3E%3Cdiv class=%22footerCopy thirtypxhigh%22%3EAuto Switch:%3C/div%3E%3C/div%3E%3Cdiv class=%22fl twentypxh%22%3E%3Cdiv class=%22ninePxTxt lightGrayTxt thirtypxhigh%22 id=%22cg_autoswitch%22%3E%3C/div%3E%3Cdiv class=%22cl%22%3E%3C/div%3E%3C/div%3E%3Cdiv class=%22cl%22%3E%3C/div%3E%3Cdiv class=%22footerCopy%22%3ERail Gun Primary Color:%3C/div%3E%3Cdiv id=%22color1_select%22 class=%22rail_select%22%3E%3Ca href=%22javascript:;%22 onclick=%22quakelive.mod_prefs.SelectColor('color1', 1); return false%22 id=%22color1_1%22 class=%22red%22%3E%3C/a%3E%3Ca href=%22javascript:;%22 onclick=%22quakelive.mod_prefs.SelectColor('color1', 2); return false%22 id=%22color1_2%22 class=%22green%22%3E%3C/a%3E%3Ca href=%22javascript:;%22 onclick=%22quakelive.mod_prefs.SelectColor('color1', 3); return false%22 id=%22color1_3%22 class=%22yellow%22%3E%3C/a%3E%3Ca href=%22javascript:;%22 onclick=%22quakelive.mod_prefs.SelectColor('color1', 4); return false%22 id=%22color1_4%22 class=%22blue%22%3E%3C/a%3E%3Ca href=%22javascript:;%22 onclick=%22quakelive.mod_prefs.SelectColor('color1', 5); return false%22 id=%22color1_5%22 class=%22ltpurple%22%3E%3C/a%3E%3Ca href=%22javascript:;%22 onclick=%22quakelive.mod_prefs.SelectColor('color1', 6); return false%22 id=%22color1_6%22 class=%22purple%22%3E%3C/a%3E%3Ca href=%22javascript:;%22 onclick=%22quakelive.mod_prefs.SelectColor('color1', 7); return false%22 id=%22color1_7%22 class=%22white%22%3E%3C/a%3E%3Cdiv class=%22cl%22%3E%3C/div%3E%3C/div%3E%3Cdiv class=%22cl%22%3E%3C/div%3E%3Cdiv class=%22tenpxhigh%22%3E%3C/div%3E%3Cdiv class=%22footerCopy%22%3ERail Gun Secondary Color:%3C/div%3E%3Cdiv id=%22color2_select%22 class=%22rail_select%22%3E%3Ca href=%22javascript:;%22 onclick=%22quakelive.mod_prefs.SelectColor('color2', 1); return false%22 id=%22color2_1%22 class=%22red%22%3E%3C/a%3E%3Ca href=%22javascript:;%22 onclick=%22quakelive.mod_prefs.SelectColor('color2', 2); return false%22 id=%22color2_2%22 class=%22green%22%3E%3C/a%3E%3Ca href=%22javascript:;%22 onclick=%22quakelive.mod_prefs.SelectColor('color2', 3); return false%22 id=%22color2_3%22 class=%22yellow%22%3E%3C/a%3E%3Ca href=%22javascript:;%22 onclick=%22quakelive.mod_prefs.SelectColor('color2', 4); return false%22 id=%22color2_4%22 class=%22blue%22%3E%3C/a%3E%3Ca href=%22javascript:;%22 onclick=%22quakelive.mod_prefs.SelectColor('color2', 5); return false%22 id=%22color2_5%22 class=%22ltpurple%22%3E%3C/a%3E%3Ca href=%22javascript:;%22 onclick=%22quakelive.mod_prefs.SelectColor('color2', 6); return false%22 id=%22color2_6%22 class=%22purple%22%3E%3C/a%3E%3Ca href=%22javascript:;%22 onclick=%22quakelive.mod_prefs.SelectColor('color2', 7); return false%22 id=%22color2_7%22 class=%22white%22%3E%3C/a%3E%3Cdiv class=%22cl%22%3E%3C/div%3E%3C/div%3E%3Cdiv class=%22cl%22%3E%3C/div%3E%3Cdiv class=%22fifteenpxhigh%22%3E%3C/div%3E%3Cdiv class=%22footerCopy%22%3ECrosshair Symbol:%3C/div%3E%3Cdiv id=%22crosshair_select%22 class=%22crosshair_select%22%3E%3Ca href=%22javascript:;%22 onclick=%22quakelive.mod_prefs.SelectCrosshair(1); return false%22 id=%22crosshair_1%22 class=%22a%22%3E%3C/a%3E%3Ca href=%22javascript:;%22 onclick=%22quakelive.mod_prefs.SelectCrosshair(2); return false%22 id=%22crosshair_2%22 class=%22b%22%3E%3C/a%3E%3Ca href=%22javascript:;%22 onclick=%22quakelive.mod_prefs.SelectCrosshair(3); return false%22 id=%22crosshair_3%22 class=%22c%22%3E%3C/a%3E%3Ca href=%22javascript:;%22 onclick=%22quakelive.mod_prefs.SelectCrosshair(4); return false%22 id=%22crosshair_4%22 class=%22d%22%3E%3C/a%3E%3Ca href=%22javascript:;%22 onclick=%22quakelive.mod_prefs.SelectCrosshair(5); return false%22 id=%22crosshair_5%22 class=%22e%22%3E%3C/a%3E%3Ca href=%22javascript:;%22 onclick=%22quakelive.mod_prefs.SelectCrosshair(6); return false%22 id=%22crosshair_6%22 class=%22f%22%3E%3C/a%3E%3Ca href=%22javascript:;%22 onclick=%22quakelive.mod_prefs.SelectCrosshair(7); return false%22 id=%22crosshair_7%22 class=%22g%22%3E%3C/a%3E%3Ca href=%22javascript:;%22 onclick=%22quakelive.mod_prefs.SelectCrosshair(8); return false%22 id=%22crosshair_8%22 class=%22h%22%3E%3C/a%3E%3Ca href=%22javascript:;%22 onclick=%22quakelive.mod_prefs.SelectCrosshair(9); return false%22 id=%22crosshair_9%22 class=%22i%22%3E%3C/a%3E%3Ca href=%22javascript:;%22 onclick=%22quakelive.mod_prefs.SelectCrosshair(10); return false%22 id=%22crosshair_10%22 class=%22j%22%3E%3C/a%3E%3C/div%3E%3Cdiv class=%22cl%22%3E%3C/div%3E%3Cdiv class=%22tenpxhigh%22%3E%3C/div%3E%3Cdiv class=%22footerCopy%22%3ECrosshair Color:%3C/div%3E%3Cdiv id=%22color2_select%22 class=%22rail_select%22%3E%3Ca href=%22javascript:;%22 onclick=%22quakelive.mod_prefs.SelectColor('cg_crosshairColor', 1); return false%22 id=%22cg_crosshairColor_1%22 class=%22red%22%3E%3C/a%3E%3Ca href=%22javascript:;%22 onclick=%22quakelive.mod_prefs.SelectColor('cg_crosshairColor', 2); return false%22 id=%22cg_crosshairColor_2%22 class=%22green%22%3E%3C/a%3E%3Ca href=%22javascript:;%22 onclick=%22quakelive.mod_prefs.SelectColor('cg_crosshairColor', 3); return false%22 id=%22cg_crosshairColor_3%22 class=%22yellow%22%3E%3C/a%3E%3Ca href=%22javascript:;%22 onclick=%22quakelive.mod_prefs.SelectColor('cg_crosshairColor', 4); return false%22 id=%22cg_crosshairColor_4%22 class=%22blue%22%3E%3C/a%3E%3Ca href=%22javascript:;%22 onclick=%22quakelive.mod_prefs.SelectColor('cg_crosshairColor', 5); return false%22 id=%22cg_crosshairColor_5%22 class=%22ltpurple%22%3E%3C/a%3E%3Ca href=%22javascript:;%22 onclick=%22quakelive.mod_prefs.SelectColor('cg_crosshairColor', 6); return false%22 id=%22cg_crosshairColor_6%22 class=%22purple%22%3E%3C/a%3E%3Ca href=%22javascript:;%22 onclick=%22quakelive.mod_prefs.SelectColor('cg_crosshairColor', 7); return false%22 id=%22cg_crosshairColor_7%22 class=%22white%22%3E%3C/a%3E%3Cdiv class=%22cl%22%3E%3C/div%3E%3C/div%3E%3C/div%3E%3C/div%3E%3Cdiv class=%22character_overlay fl%22%3E%3C/div%3E%3Cdiv class=%22cl%22%3E%3C/div%3E%3C/div%3E%3Cdiv class=%22cl%22%3E%3C/div%3E%3Cdiv class=%22twentypxh%22%3E%3Ca href=%22javascript:;%22 onclick=%22quakelive.mod_prefs.ResetDefaults(); return false%22 class=%22fl reset_settings_defaults%22%3E%3C/a%3E%3Cdiv class=%22fl tenpxh light-midGrayTxt footerCopy%22%3EReset Defaults for all game settings%3C/div%3E%3Cdiv class=%22cl%22%3E%3C/div%3E%3C/div%3E%3C/div%3E")].join('');
quakelive.mod_prefs.TPL_SETTINGS_ADVANCED = [unescape("%3Cdiv class=%22innerpanellong fl%22%3E%3Cdiv class=%22rollover fl%22%3E%3Ca href=%22javascript:;%22 onclick=%22quakelive.mod_prefs.Nav('character')%22 class=%22btn_character fl%22%3E%3C/a%3E%3Ca href=%22javascript:;%22 onclick=%22quakelive.mod_prefs.Nav('controls_movement')%22 class=%22btn_controls fl%22%3E%3C/a%3E%3Ca href=%22javascript:;%22 onclick=%22quakelive.mod_prefs.Nav('settings_basic')%22 class=%22btn_settings fl selected%22%3E%3C/a%3E%3Cdiv class=%22cl%22%3E%3C/div%3E%3C/div%3E%3Cdiv class=%22cl%22%3E%3C/div%3E%3Cdiv%3E%3Cdiv class=%22fl%22 style=%22width: 276px;%22%3E %3C/div%3E%3Ca href=%22javascript:;%22 onclick=%22quakelive.mod_prefs.Nav('settings_basic')%22 class=%22btn_basic fl%22%3E%3C/a%3E%3Ca href=%22javascript:;%22 onclick=%22quakelive.mod_prefs.Nav('settings_advanced')%22 class=%22btn_advanced_active fl%22%3E%3C/a%3E%3Cdiv class=%22cl%22%3E%3C/div%3E%3C/div%3E%3Cdiv class=%22fl sixteenpxv%22%3E%3Cdiv class=%22fl hundredwide%22%3E %3C/div%3E%3Cdiv class=%22fl%22%3E%3Cdiv class=%22panel_audio_advanced%22%3E%3Cdiv class=%22twentythreepxhigh%22%3E%3C/div%3E%3Cdiv class=%22fourteenpxh twohundredseventywide%22%3E%3Cdiv class=%22fl hundredwide%22%3E%3Cdiv class=%22footerCopy thirtypxhigh%22%3EDoppler%3C/div%3E%3C/div%3E%3Cdiv class=%22fl fourteenpxh%22%3E%3Cdiv class=%22ninePxTxt lightGrayTxt thirtypxhigh%22 id=%22s_doppler%22%3E%3C/div%3E%3C/div%3E%3C/div%3E%3Cdiv class=%22cl%22%3E%3C/div%3E%3C/div%3E%3Cdiv class=%22twentypxv%22%3E%3C/div%3E%3Cdiv class=%22panel_options_advanced%22%3E%3Cdiv class=%22twentythreepxhigh%22%3E%3C/div%3E%3Cdiv class=%22fourteenpxh twohundredseventywide%22%3E%3Cdiv class=%22fl med tenpxh%22%3E%3Cdiv class=%22tenpxhigh%22%3E%3C/div%3E%3Cdiv class=%22footerCopy thirtypxhigh%22%3EDraw Target Names%3C/div%3E%3Cdiv class=%22footerCopy thirtypxhigh%22%3EVoice Chat%3C/div%3E%3Cdiv class=%22footerCopy thirtypxhigh%22%3EVoice Text%3C/div%3E%3Cdiv class=%22footerCopy thirtypxhigh%22%3ETaunts%3C/div%3E%3C/div%3E%3Cdiv class=%22fl%22%3E%3Cdiv class=%22tenpxhigh%22%3E%3C/div%3E%3Cdiv class=%22ninePxTxt lightGrayTxt thirtypxhigh%22 id=%22cg_drawtargetnames%22%3E%3C/div%3E%3Cdiv class=%22ninePxTxt lightGrayTxt thirtypxhigh%22 id=%22cg_playvoicechats%22%3E%3C/div%3E%3Cdiv class=%22ninePxTxt lightGrayTxt thirtypxhigh%22 id=%22cg_showvoicetext%22%3E%3C/div%3E%3Cdiv class=%22ninePxTxt lightGrayTxt thirtypxhigh%22 id=%22cg_allowtaunt%22%3E%3C/div%3E%3C/div%3E%3Cdiv class=%22cl%22%3E%3C/div%3E%3C/div%3E%3C/div%3E%3C/div%3E%3Cdiv class=%22advanced_panels_right fl%22%3E%3Cdiv class=%22twentyfivepxhigh%22%3E%3C/div%3E%3Cdiv class=%22panel_video_advanced fl%22%3E%3Cdiv class=%22thirtypxhigh%22%3E%3C/div%3E%3Cdiv class=%22twentypxh twohundredseventywide%22%3E%3Cdiv class=%22fl%22%3E%3Cdiv class=%22footerCopy thirtypxhigh hundredtwentywide%22%3ELighting Model%3C/div%3E%3Cdiv class=%22footerCopy thirtypxhigh hundredtwentywide%22%3EGeometry Detail%3C/div%3E%3Cdiv class=%22footerCopy thirtypxhigh hundredtwentywide%22%3ETexture Filter%3C/div%3E%3Cdiv class=%22footerCopy thirtypxhigh hundredtwentywide%22%3ETexture Quality%3C/div%3E%3Cdiv class=%22footerCopy thirtypxhigh hundredtwentywide%22%3ETexture Compression%3C/div%3E%3C/div%3E%3Cdiv class=%22fl twentypxh%22%3E%3Cdiv class=%22thirtypxhigh hundredwide tr%22%3E%3Cselect id=%22select_r_vertexlight%22 name=%22r_vertexlight%22%3E%3C/select%3E%3C/div%3E%3Cdiv class=%22thirtypxhigh hundredwide tr%22%3E%3Cselect id=%22select_r_lodbias%22 name=%22r_lodbias%22%3E%3C/select%3E%3C/div%3E%3Cdiv class=%22thirtypxhigh hundredwide tr%22%3E%3Cselect id=%22select_r_texturemode%22 name=%22r_texturemode%22%3E%3C/select%3E%3C/div%3E%3Cdiv class=%22thirtypxhigh hundredwide tr%22%3E%3Cselect id=%22select_r_picmip%22 name=%22r_picmip%22%3E%3C/select%3E%3C/div%3E%3Cdiv class=%22ninePxTxt lightGrayTxt thirtypxhigh hundredwide tr%22 id=%22r_ext_compressed_textures%22%3E%3C/div%3E%3Cdiv class=%22cl%22%3E%3C/div%3E%3C/div%3E%3Cdiv class=%22cl%22%3E%3C/div%3E%3Cdiv class=%22footerCopy%22%3E%3Cp%3E%3Cdiv class='fl'%3EField of view: %3C/div%3E %3Cdiv id='fov_value' class='fl'%3E%3C/div%3E%3Cdiv class='cl'%3E%3C/div%3E%3C/p%3E%3Cdiv id=%22slider_cg_fov%22 class=%22slider ui-slider%22%3E%3C/div%3E%3Cdiv class=%22sliderpxh%22%3E%3Cdiv class=%22fl ninePxTxt lightGrayTxt%22%3Emin%3C/div%3E%3Cdiv class=%22fr ninePxTxt lightGrayTxt%22%3Emax%3C/div%3E%3Cdiv class=%22cl%22%3E%3C/div%3E%3C/div%3E%3Cdiv class=%22fifteenpxhigh%22%3E%3C/div%3E%3C/div%3E%3Cdiv class=%22fifteenpxhigh%22%3E%3C/div%3E%3C/div%3E%3C/div%3E%3C/div%3E%3Cdiv class=%22cl%22%3E%3C/div%3E%3C/div%3E%3Cdiv class=%22cl%22%3E%3C/div%3E%3Cdiv class=%22twentypxh twentypxlh%22%3E%3Ca href=%22javascript:;%22 onclick=%22quakelive.mod_prefs.ResetDefaults(); return false%22 class=%22fl reset_settings_defaults%22%3E%3C/a%3E%3Cdiv class=%22fl tenpxh light-midGrayTxt footerCopy%22%3EReset Defaults for all game settings%3C/div%3E%3Cdiv class=%22cl%22%3E%3C/div%3E%3C/div%3E%3C/div%3E")].join('');
quakelive.mod_prefs.TPL_CONTROLS_ACTIONS = [unescape("%3Cdiv class=%22innerpanellong fl%22%3E%3Cdiv class=%22rollover fl%22%3E%3Ca href=%22javascript:;%22 onclick=%22quakelive.mod_prefs.Nav('character'); return false%22 class=%22btn_character fl%22%3E%3C/a%3E%3Ca href=%22javascript:;%22 onclick=%22quakelive.mod_prefs.Nav('controls_movement'); return false%22 class=%22btn_controls fl selected%22%3E%3C/a%3E%3Ca href=%22javascript:;%22 onclick=%22quakelive.mod_prefs.Nav('settings_basic'); return false%22 class=%22btn_settings fl%22%3E%3C/a%3E%3Cdiv class=%22cl%22%3E%3C/div%3E%3C/div%3E%3Cdiv class=%22cl%22%3E%3C/div%3E%3Cdiv class=%22innerpanelsubnav%22%3E%3Cdiv class=%22fl%22 style=%22width:132px;%22%3E %3C/div%3E%3Ca href=%22javascript:;%22 onclick=%22quakelive.mod_prefs.Nav('controls_movement'); return false%22 class=%22btn_movement fl%22%3E%3C/a%3E%3Ca href=%22javascript:;%22 onclick=%22quakelive.mod_prefs.Nav('controls_actions'); return false%22 class=%22btn_actions fl selected%22%3E%3C/a%3E%3Ca href=%22javascript:;%22 onclick=%22quakelive.mod_prefs.Nav('controls_weapons'); return false%22 class=%22btn_weapons fl%22%3E%3C/a%3E%3Ca href=%22javascript:;%22 onclick=%22quakelive.mod_prefs.Nav('controls_mouse'); return false%22 class=%22btn_mouse fl%22%3E%3C/a%3E%3Cdiv class=%22cl%22%3E%3C/div%3E%3C/div%3E%3Cdiv class=%22innerpanelsettings%22%3E%3Cdiv class=%22controlsBG fl%22%3E%3Cdiv class=%22row%22%3E%3Cdiv class=%22medlong fl twentypxh fourpxpadtop%22%3E%3Cdiv class=%22txtCommand%22%3E%3C/div%3E%3C/div%3E%3Cdiv class=%22sixtypxwide fl fourpxpadtop%22%3E%3Cdiv class=%22txtMainKey%22%3E%3C/div%3E%3C/div%3E%3Cdiv class=%22cl%22%3E%3C/div%3E%3C/div%3E%3Cdiv id=%22controls_actions_binds0%22%3E%3C/div%3E%3C/div%3E%3Cdiv class=%22greyVertLine fl%22%3E%3C/div%3E%3Cdiv class=%22controlsBG fl%22%3E%3Cdiv class=%22row%22%3E%3Cdiv class=%22medlong fl twentypxh fourpxpadtop%22%3E%3Cdiv class=%22txtCommand%22%3E%3C/div%3E%3C/div%3E%3Cdiv class=%22sixtypxwide fl fourpxpadtop%22%3E%3Cdiv class=%22txtMainKey%22%3E%3C/div%3E%3C/div%3E%3Cdiv class=%22cl%22%3E%3C/div%3E%3C/div%3E%3Cdiv id=%22controls_actions_binds1%22%3E%3C/div%3E%3C/div%3E%3Cdiv class=%22cl%22%3E%3C/div%3E%3C/div%3E%3Cdiv class=%22fivepxhigh%22%3E%3C/div%3E%3Cdiv class=%22mainkeyhr%22%3E%3C/div%3E%3Cdiv class=%22keyboard_container%22%3E%3C/div%3E%3Cdiv class=%22cl%22%3E%3C/div%3E%3Cdiv class=%22threepxhigh%22%3E%3C/div%3E%3Cdiv class=%22twentypxh%22%3E%3Ca href=%22javascript:;%22 onclick=%22quakelive.mod_prefs.ResetDefaults(); return false%22 class=%22fl reset_settings_defaults%22%3E%3C/a%3E%3Cdiv class=%22fl tenpxh light-midGrayTxt footerCopy%22%3EReset Defaults for all game settings%3C/div%3E%3Cdiv class=%22cl%22%3E%3C/div%3E%3C/div%3E%3C/div%3E")].join('');
quakelive.mod_prefs.TPL_CONTROLS_MOVEMENT = [unescape("%3Cdiv class=%22innerpanellong fl%22%3E%3Cdiv class=%22rollover fl%22%3E%3Ca href=%22javascript:;%22 onclick=%22quakelive.mod_prefs.Nav('character'); return false%22 class=%22btn_character fl%22%3E%3C/a%3E%3Ca href=%22javascript:;%22 onclick=%22quakelive.mod_prefs.Nav('controls_movement'); return false%22 class=%22btn_controls fl selected%22%3E%3C/a%3E%3Ca href=%22javascript:;%22 onclick=%22quakelive.mod_prefs.Nav('settings_basic'); return false%22 class=%22btn_settings fl%22%3E%3C/a%3E%3Cdiv class=%22cl%22%3E%3C/div%3E%3C/div%3E%3Cdiv class=%22cl%22%3E%3C/div%3E%3Cdiv class=%22innerpanelsubnav%22%3E%3Cdiv class=%22fl%22 style=%22width:132px;%22%3E %3C/div%3E%3Ca href=%22javascript:;%22 onclick=%22quakelive.mod_prefs.Nav('controls_movement'); return false%22 class=%22btn_movement fl selected%22%3E%3C/a%3E%3Ca href=%22javascript:;%22 onclick=%22quakelive.mod_prefs.Nav('controls_actions'); return false%22 class=%22btn_actions fl%22%3E%3C/a%3E%3Ca href=%22javascript:;%22 onclick=%22quakelive.mod_prefs.Nav('controls_weapons'); return false%22 class=%22btn_weapons fl%22%3E%3C/a%3E%3Ca href=%22javascript:;%22 onclick=%22quakelive.mod_prefs.Nav('controls_mouse'); return false%22 class=%22btn_mouse fl%22%3E%3C/a%3E%3Cdiv class=%22cl%22%3E%3C/div%3E%3C/div%3E%3Cdiv class=%22innerpanelsettings%22%3E%3Cdiv class=%22controlsBG fl%22%3E%3Cdiv class=%22row%22%3E%3Cdiv class=%22medlong fl twentypxh fourpxpadtop%22%3E%3Cdiv class=%22txtCommand%22%3E%3C/div%3E%3C/div%3E%3Cdiv class=%22sixtypxwide fl fourpxpadtop%22%3E%3Cdiv class=%22txtMainKey%22%3E%3C/div%3E%3C/div%3E%3Cdiv class=%22cl%22%3E%3C/div%3E%3C/div%3E%3Cdiv id=%22controls_movement_binds0%22%3E%3C/div%3E%3C/div%3E%3Cdiv class=%22greyVertLine fl%22%3E%3C/div%3E%3Cdiv class=%22controlsBG fl%22%3E%3Cdiv class=%22row%22%3E%3Cdiv class=%22medlong fl twentypxh fourpxpadtop%22%3E%3Cdiv class=%22txtCommand%22%3E%3C/div%3E%3C/div%3E%3Cdiv class=%22sixtypxwide fl fourpxpadtop%22%3E%3Cdiv class=%22txtMainKey%22%3E%3C/div%3E%3C/div%3E%3Cdiv class=%22cl%22%3E%3C/div%3E%3C/div%3E%3Cdiv id=%22controls_movement_binds1%22%3E%3C/div%3E%3C/div%3E%3Cdiv class=%22cl%22%3E%3C/div%3E%3C/div%3E%3Cdiv class=%22fivepxhigh%22%3E%3C/div%3E%3Cdiv class=%22mainkeyhr%22%3E%3C/div%3E%3Cdiv class=%22keyboard_container%22%3E%3C/div%3E%3Cdiv class=%22cl%22%3E%3C/div%3E%3Cdiv class=%22threepxhigh%22%3E%3C/div%3E%3Cdiv class=%22twentypxh%22%3E%3Ca href=%22javascript:;%22 onclick=%22quakelive.mod_prefs.ResetDefaults(); return false%22 class=%22fl reset_settings_defaults%22%3E%3C/a%3E%3Cdiv class=%22fl tenpxh light-midGrayTxt footerCopy%22%3EReset Defaults for all game settings%3C/div%3E%3Cdiv class=%22cl%22%3E%3C/div%3E%3C/div%3E%3C/div%3E")].join('');
quakelive.mod_prefs.TPL_CONTROLS_WEAPONS = [unescape("%3Cdiv class=%22innerpanellong fl%22%3E%3Cdiv class=%22rollover fl%22%3E%3Ca href=%22javascript:;%22 onclick=%22quakelive.mod_prefs.Nav('character'); return false%22 class=%22btn_character fl%22%3E%3C/a%3E%3Ca href=%22javascript:;%22 onclick=%22quakelive.mod_prefs.Nav('controls_movement'); return false%22 class=%22btn_controls fl selected%22%3E%3C/a%3E%3Ca href=%22javascript:;%22 onclick=%22quakelive.mod_prefs.Nav('settings_basic'); return false%22 class=%22btn_settings fl%22%3E%3C/a%3E%3Cdiv class=%22cl%22%3E%3C/div%3E%3C/div%3E%3Cdiv class=%22cl%22%3E%3C/div%3E%3Cdiv class=%22innerpanelsubnav%22%3E%3Cdiv class=%22fl%22 style=%22width:132px;%22%3E %3C/div%3E%3Ca href=%22javascript:;%22 onclick=%22quakelive.mod_prefs.Nav('controls_movement'); return false%22 class=%22btn_movement fl%22%3E%3C/a%3E%3Ca href=%22javascript:;%22 onclick=%22quakelive.mod_prefs.Nav('controls_actions'); return false%22 class=%22btn_actions fl%22%3E%3C/a%3E%3Ca href=%22javascript:;%22 onclick=%22quakelive.mod_prefs.Nav('controls_weapons'); return false%22 class=%22btn_weapons fl selected%22%3E%3C/a%3E%3Ca href=%22javascript:;%22 onclick=%22quakelive.mod_prefs.Nav('controls_mouse'); return false%22 class=%22btn_mouse fl%22%3E%3C/a%3E%3Cdiv class=%22cl%22%3E%3C/div%3E%3C/div%3E%3Cdiv class=%22innerpanelsettings%22%3E%3Cdiv class=%22controlsBG fl%22%3E%3Cdiv class=%22row%22%3E%3Cdiv class=%22medlong fl twentypxh fourpxpadtop%22%3E%3Cdiv class=%22txtCommand%22%3E%3C/div%3E%3C/div%3E%3Cdiv class=%22sixtypxwide fl fourpxpadtop%22%3E%3Cdiv class=%22txtMainKey%22%3E%3C/div%3E%3C/div%3E%3Cdiv class=%22cl%22%3E%3C/div%3E%3C/div%3E%3Cdiv id=%22controls_weapons_binds0%22%3E%3C/div%3E%3C/div%3E%3Cdiv class=%22greyVertLine fl%22%3E%3C/div%3E%3Cdiv class=%22controlsBG fl%22%3E%3Cdiv class=%22row%22%3E%3Cdiv class=%22medlong fl twentypxh fourpxpadtop%22%3E%3Cdiv class=%22txtCommand%22%3E%3C/div%3E%3C/div%3E%3Cdiv class=%22sixtypxwide fl fourpxpadtop%22%3E%3Cdiv class=%22txtMainKey%22%3E%3C/div%3E%3C/div%3E%3Cdiv class=%22cl%22%3E%3C/div%3E%3C/div%3E%3Cdiv id=%22controls_weapons_binds1%22%3E%3C/div%3E%3C/div%3E%3Cdiv class=%22cl%22%3E%3C/div%3E%3C/div%3E%3Cdiv class=%22fivepxhigh%22%3E%3C/div%3E%3Cdiv class=%22mainkeyhr%22%3E%3C/div%3E%3Cdiv class=%22keyboard_container%22%3E%3C/div%3E%3Cdiv class=%22cl%22%3E%3C/div%3E%3Cdiv class=%22threepxhigh%22%3E%3C/div%3E%3Cdiv class=%22twentypxh%22%3E%3Ca href=%22javascript:;%22 onclick=%22quakelive.mod_prefs.ResetDefaults(); return false%22 class=%22fl reset_settings_defaults%22%3E%3C/a%3E%3Cdiv class=%22fl tenpxh light-midGrayTxt footerCopy%22%3EReset Defaults for all game settings%3C/div%3E%3Cdiv class=%22cl%22%3E%3C/div%3E%3C/div%3E%3C/div%3E")].join('');
quakelive.mod_prefs.TPL_CONTROLS_MOUSE = [unescape("%3Cdiv class=%22innerpanellong fl%22%3E%3Cdiv class=%22rollover fl%22%3E%3Ca href=%22javascript:;%22 onclick=%22quakelive.mod_prefs.Nav('character'); return false%22 class=%22btn_character fl%22%3E%3C/a%3E%3Ca href=%22javascript:;%22 onclick=%22quakelive.mod_prefs.Nav('controls_movement'); return false%22 class=%22btn_controls fl selected%22%3E%3C/a%3E%3Ca href=%22javascript:;%22 onclick=%22quakelive.mod_prefs.Nav('settings_basic'); return false%22 class=%22btn_settings fl%22%3E%3C/a%3E%3Cdiv class=%22cl%22%3E%3C/div%3E%3C/div%3E%3Cdiv class=%22cl%22%3E%3C/div%3E%3Cdiv class=%22innerpanelsubnav%22%3E%3Cdiv class=%22fl%22 style=%22width:132px;%22%3E %3C/div%3E%3Ca href=%22javascript:;%22 onclick=%22quakelive.mod_prefs.Nav('controls_movement'); return false%22 class=%22btn_movement fl%22%3E%3C/a%3E%3Ca href=%22javascript:;%22 onclick=%22quakelive.mod_prefs.Nav('controls_actions'); return false%22 class=%22btn_actions fl%22%3E%3C/a%3E%3Ca href=%22javascript:;%22 onclick=%22quakelive.mod_prefs.Nav('controls_weapons'); return false%22 class=%22btn_weapons fl%22%3E%3C/a%3E%3Ca href=%22javascript:;%22 onclick=%22quakelive.mod_prefs.Nav('controls_mouse'); return false%22 class=%22btn_mouse fl selected%22%3E%3C/a%3E%3Cdiv class=%22cl%22%3E%3C/div%3E%3C/div%3E%3Cdiv class=%22innerpanelsettings%22%3E%3Cdiv class=%22fl%22%3E%3Cdiv class=%22mc_panel%22%3E%3Cimg src=%22"),quakelive.resource("/images/sf/registration/controls/mouse_invert_label.gif"),unescape("%22 class=%22label%22 /%3E%3Cdiv class=%22tenpxv%22%3E%3C/div%3E%3Cdiv class=%22mc_opts tc%22%3E%3Cdiv class=%22fl tenpxwide%22%3E %3C/div%3E%3Cdiv class=%22fl%22%3E%3Cdiv class=%22fivepxv%22%3E%3C/div%3E%3Cdiv id=%22m_pitch%22%3E%3C/div%3E%3C/div%3E%3Cdiv class=%22fl tenpxwide%22%3E %3C/div%3E%3Cdiv class=%22fl tl%22%3E"On" will reverse the direction%3Cbr /%3Eof looking up and down.%3C/div%3E%3Cdiv class=%22cl%22%3E%3C/div%3E%3C/div%3E%3C/div%3E%3C/div%3E%3Cdiv class=%22greyVertLine fl%22%3E%3C/div%3E%3Cdiv class=%22fl%22%3E%3Cdiv class=%22mc_panel%22%3E%3Cimg src=%22"),quakelive.resource("/images/sf/registration/controls/mouse_sensitivity_label.gif"),unescape("%22 class=%22label%22 /%3E%3Cdiv class=%22mc_opts%22%3E%3Cp%3E%3Cdiv class='fl'%3EMouse sensitivity: %3C/div%3E %3Cdiv id='mouse_sens_value' class='fl'%3E%3C/div%3E%3Cdiv class='cl'%3E%3C/div%3E%3C/p%3E%3Cdiv class=%22fivepxv%22%3E%3C/div%3E%3Cdiv id=%22slider_sensitivity%22 class=%22slider ui-slider%22%3E%3C/div%3E%3Cdiv class=%22sliderpxh%22%3E%3Cdiv class=%22fl ninePxTxt lightGrayTxt%22%3Emin%3C/div%3E%3Cdiv class=%22fr ninePxTxt lightGrayTxt%22%3Emax%3C/div%3E%3Cdiv class=%22cl%22%3E%3C/div%3E%3C/div%3E%3C/div%3E%3C/div%3E%3C/div%3E%3Cdiv class=%22cl%22%3E%3C/div%3E%3C/div%3E%3Cdiv class=%22fivepxhigh%22%3E%3C/div%3E%3Cdiv class=%22mainkeyhr%22%3E%3C/div%3E%3Cdiv class=%22keyboard_container%22%3E%3C/div%3E%3Cdiv class=%22cl%22%3E%3C/div%3E%3Cdiv class=%22threepxhigh%22%3E%3C/div%3E%3Cdiv class=%22twentypxh%22%3E%3Ca href=%22javascript:;%22 onclick=%22quakelive.mod_prefs.ResetDefaults(); return false%22 class=%22fl reset_settings_defaults%22%3E%3C/a%3E%3Cdiv class=%22fl tenpxh light-midGrayTxt footerCopy%22%3EReset Defaults for all game settings%3C/div%3E%3Cdiv class=%22cl%22%3E%3C/div%3E%3C/div%3E%3C/div%3E")].join('');
quakelive.mod_prefs.TPL_KEYBOARD = [unescape("%3Cdiv id=%22qlv_keyboard%22%3E%3Cdiv class=%22left%22%3E%3Cdiv%3E%3Cspan class=%22key_ESCAPE esc%22%3E%3C/span%3E%3Cspan class=%22key_F1 f1%22%3E%3C/span%3E%3Cspan class=%22key_F2 f2%22%3E%3C/span%3E%3Cspan class=%22key_F3 f3%22%3E%3C/span%3E%3Cspan class=%22key_F4 f4%22%3E%3C/span%3E%3Cspan class=%22key_F5 f5%22%3E%3C/span%3E%3Cspan class=%22key_F6 f6%22%3E%3C/span%3E%3Cspan class=%22key_F7 f7%22%3E%3C/span%3E%3Cspan class=%22key_F8 f8%22%3E%3C/span%3E%3Cspan class=%22key_F9 f9%22%3E%3C/span%3E%3Cspan class=%22key_F10 f10%22%3E%3C/span%3E%3Cspan class=%22key_F11 f11%22%3E%3C/span%3E%3Cspan class=%22key_F12 f12%22%3E%3C/span%3E%3C/div%3E%3Cdiv%3E%3Cspan class=%22key_TILDE tilde%22%3E%3C/span%3E%3Cspan class=%22key_1 k1%22%3E%3C/span%3E%3Cspan class=%22key_2 k2%22%3E%3C/span%3E%3Cspan class=%22key_3 k3%22%3E%3C/span%3E%3Cspan class=%22key_4 k4%22%3E%3C/span%3E%3Cspan class=%22key_5 k5%22%3E%3C/span%3E%3Cspan class=%22key_6 k6%22%3E%3C/span%3E%3Cspan class=%22key_7 k7%22%3E%3C/span%3E%3Cspan class=%22key_8 k8%22%3E%3C/span%3E%3Cspan class=%22key_9 k9%22%3E%3C/span%3E%3Cspan class=%22key_0 k0%22%3E%3C/span%3E%3Cspan class=%22key_MINUS minus%22%3E%3C/span%3E%3Cspan class=%22key_EQUALS equal%22%3E%3C/span%3E%3Cspan class=%22key_BACKSPACE backspace%22%3E%3C/span%3E%3C/div%3E%3Cdiv%3E%3Cspan class=%22key_TAB tab%22%3E%3C/span%3E%3Cspan class=%22key_Q q%22%3E%3C/span%3E%3Cspan class=%22key_W w%22%3E%3C/span%3E%3Cspan class=%22key_E e%22%3E%3C/span%3E%3Cspan class=%22key_R r%22%3E%3C/span%3E%3Cspan class=%22key_T t%22%3E%3C/span%3E%3Cspan class=%22key_Y y%22%3E%3C/span%3E%3Cspan class=%22key_U u%22%3E%3C/span%3E%3Cspan class=%22key_I i%22%3E%3C/span%3E%3Cspan class=%22key_O o%22%3E%3C/span%3E%3Cspan class=%22key_P p%22%3E%3C/span%3E%3Cspan class=%22key_LEFTBRACKET lbrack%22%3E%3C/span%3E%3Cspan class=%22key_RIGHTBRACKET rbrack%22%3E%3C/span%3E%3Cspan class=%22key_BACKSLASH bslash%22%3E%3C/span%3E%3C/div%3E%3Cdiv%3E%3Cspan class=%22key_CAPSLOCK capslock%22%3E%3C/span%3E%3Cspan class=%22key_A a%22%3E%3C/span%3E%3Cspan class=%22key_S s%22%3E%3C/span%3E%3Cspan class=%22key_D d%22%3E%3C/span%3E%3Cspan class=%22key_F f%22%3E%3C/span%3E%3Cspan class=%22key_G g%22%3E%3C/span%3E%3Cspan class=%22key_H h%22%3E%3C/span%3E%3Cspan class=%22key_J j%22%3E%3C/span%3E%3Cspan class=%22key_K k%22%3E%3C/span%3E%3Cspan class=%22key_L l%22%3E%3C/span%3E%3Cspan class=%22key_SEMICOLON semicolon%22%3E%3C/span%3E%3Cspan class=%22key_APOSTROPHE apos%22%3E%3C/span%3E%3Cspan class=%22key_ENTER return%22%3E%3C/span%3E%3C/div%3E%3Cdiv%3E%3Cspan class=%22key_SHIFT shiftl%22%3E%3C/span%3E%3Cspan class=%22key_Z z%22%3E%3C/span%3E%3Cspan class=%22key_X x%22%3E%3C/span%3E%3Cspan class=%22key_C c%22%3E%3C/span%3E%3Cspan class=%22key_V v%22%3E%3C/span%3E%3Cspan class=%22key_B b%22%3E%3C/span%3E%3Cspan class=%22key_N n%22%3E%3C/span%3E%3Cspan class=%22key_M m%22%3E%3C/span%3E%3Cspan class=%22key_COMMA comma%22%3E%3C/span%3E%3Cspan class=%22key_PERIOD period%22%3E%3C/span%3E%3Cspan class=%22key_FORWARDSLASH fslash%22%3E%3C/span%3E%3Cspan class=%22key_SHIFT shiftr%22%3E%3C/span%3E%3C/div%3E%3Cdiv%3E%3Cspan class=%22key_CTRL ctrll%22%3E%3C/span%3E%3Cspan class=%22key_LEFTWIN winl%22%3E%3C/span%3E%3Cspan class=%22key_LEFTALT altl%22%3E%3C/span%3E%3Cspan class=%22key_SPACE spacebar%22%3E%3C/span%3E%3Cspan class=%22key_RIGHTALT altr%22%3E%3C/span%3E%3Cspan class=%22key_RIGHTWIN winr%22%3E%3C/span%3E%3Cspan class=%22key_CTRL ctrlr%22%3E%3C/span%3E%3Ca href=%22#%22 class=%22%22%3E%3C/a%3E%3C/div%3E%3C/div%3E%3Cdiv class=%22center%22%3E%3Cdiv%3E%3Cspan class=%22key_PRTSCRN prtscr%22%3E%3C/span%3E%3Cspan class=%22key_SCROLLLOCK scrolllock%22%3E%3C/span%3E%3Cspan class=%22key_PAUSE pausebreak%22%3E%3C/span%3E%3C/div%3E%3Cdiv%3E%3Cspan class=%22key_INS insert%22%3E%3C/span%3E%3Cspan class=%22key_HOME home%22%3E%3C/span%3E%3Cspan class=%22key_PGUP pgup%22%3E%3C/span%3E%3C/div%3E%3Cdiv%3E%3Cspan class=%22key_DEL delete%22%3E%3C/span%3E%3Cspan class=%22key_END end%22%3E%3C/span%3E%3Cspan class=%22key_PGDN pgdown%22%3E%3C/span%3E%3C/div%3E%3Cdiv%3E%3Cspan class=%22key_UPARROW arrowup%22%3E%3C/span%3E%3C/div%3E%3Cdiv%3E%3Cspan class=%22key_LEFTARROW arrowleft%22%3E%3C/span%3E%3Cspan class=%22key_DOWNARROW arrowdown%22%3E%3C/span%3E%3Cspan class=%22key_RIGHTARROW arrowright%22%3E%3C/span%3E%3C/div%3E%3C/div%3E%3Cdiv class=%22tenkey%22%3E%3Cdiv%3E%3Ca href=%22#%22 class=%22scrollLights%22%3E%3C/a%3E%3C/div%3E%3Cdiv%3E%3Cspan class=%22key_KP_NUMLOCK numlock%22%3E%3C/span%3E%3Cspan class=%22key_KP_SLASH slash%22%3E%3C/span%3E%3Cspan class=%22key_KP_STAR asterick%22%3E%3C/span%3E%3Cspan class=%22key_KP_MINUS minus%22%3E%3C/span%3E%3C/div%3E%3Cdiv%3E%3Cspan class=%22key_KP_HOME seven%22%3E%3C/span%3E%3Cspan class=%22key_KP_UPARROW eight%22%3E%3C/span%3E%3Cspan class=%22key_KP_PGUP nine%22%3E%3C/span%3E%3C/div%3E%3Cdiv%3E%3Cspan class=%22key_KP_LEFTARROW four%22%3E%3C/span%3E%3Cspan class=%22key_KP_5 five%22%3E%3C/span%3E%3Cspan class=%22key_KP_RIGHTARROW six%22%3E%3C/span%3E%3Cspan class=%22key_KP_PLUS tkPlus%22%3E%3C/span%3E%3C/div%3E%3Cdiv%3E%3Cspan class=%22key_KP_END one tkRow5%22%3E%3C/span%3E%3Cspan class=%22key_KP_DOWNARROW two tkRow5%22%3E%3C/span%3E%3Cspan class=%22key_KP_PGDN three tkRow5%22%3E%3C/span%3E%3C/div%3E%3Cdiv%3E%3Cspan class=%22key_KP_INS zero tkRow6%22%3E%3C/span%3E%3Cspan class=%22key_KP_DEL tkDelete tkRow6%22%3E%3C/span%3E%3Cspan class=%22key_KP_ENTER tkEnter%22%3E%3C/span%3E%3C/div%3E%3C/div%3E%3C/div%3E%3Cdiv class=%22mouse fl%22 %3E%3Cdiv class=%22mouse_top%22%3E%3C/div%3E%3Ca class=%22key_KP_MOUSE2 btn_rmouse%22%3E%3C/a%3E%3Cdiv class=%22mouse_body%22%3E%3C/div%3E%3Cdiv class=%22mouse_bottom%22%3E%3C/div%3E%3C/div%3E")].join('');
quakelive.mod_prefs.TPL_OVERLAY_CONTAINER = [unescape("%3Cdiv style='width: 100%; height: 100%'%3E%3Cdiv id=%22qlv_prefsoverlay%22 class=%22tl%22%3E%3Cdiv id=%22qlv_regWindow%22 class=%22regNone%22%3E%3C/div%3E%3C/div%3E%3Cdiv id=%22qlv_registrationContent%22 class=%22tl tenpxpad%22%3E%3Cdiv class=%22fortypxhigh%22%3E%3C/div%3E%3Cdiv class=%22registration leftAlign%22%3E%3Cdiv%3E%3Cdiv class=%22title fl%22%3E%3C/div%3E%3Ca href=%22javascript:;%22 onclick=%22quakelive.mod_prefs.CloseOverlay(); return false%22 class=%22close_window fr%22%3E%3C/a%3E%3Cdiv class=%22cl%22%3E%3C/div%3E%3C/div%3E%3Cdiv class=%22fiftypxhigh%22%3E%3C/div%3E%3Cdiv%3E%3Cdiv class=%22fifteenpxhigh%22%3E%3C/div%3E%3Cdiv id=%22configContainer%22 style=%22position: relative; z-index: 1%22%3E%3C/div%3E%3C/div%3E%3C/div%3E%3C/div%3E%3Cdiv class=%22cl%22%3E%3C/div%3E%3C/div%3E")].join('');
quakelive.mod_stats.TPL_QUICKSTATS = [unescape("%3Ca href=%22javascript:;%22 onclick=%22quakelive.Goto('stats'); return false%22 class=%22qlv_plts_offline%22%3E %3Cimg src=%22"),quakelive.resource("/images/sf/login/btn_viewfullstats.png"),unescape("%22 alt=%22offline%22 width=%22160%22 height=%2220%22 /%3E %3C/a%3E%3Cdiv class=%22qlv_plts_leftbox%22%3E%3Cdiv class=%22qlv_pltslb_top%22%3E %3Cspan class=%22qlv_pltslb_title%22%3E%3C/span%3E %3Cspan class=%22qlv_pltslb_last_played%22%3E%3C/span%3E %3C/div%3E%3Cdiv class=%22qlv_pltslb_bottom%22%3E%3Cdiv class=%22qlv_pltslb_character nametag-body-md%22%3E%3C/div%3E%3Ctable class=%22qlv_pltslb_bl%22%3E%3Ctr%3E%3Ctd%3E%3Cspan class=%22title%22%3EMost Played Arena%3C/span%3E %3Cspan class=%22fav_map_txt%22%3E%3C/span%3E %3C/td%3E%3Ctd height=%2260%22 width=%22100%22 class=%22fav_map_img tc%22%3E%3C/td%3E%3C/tr%3E%3Ctr%3E%3Ctd%3E%3Cspan class=%22title%22%3EMost Games Played%3C/span%3E %3Cspan class=%22fav_gametype_txt%22%3E%3C/span%3E %3C/td%3E%3Ctd height=%2260%22 width=%22100%22 class=%22fav_gametype_img tc%22%3E%3C/td%3E%3C/tr%3E%3Ctr%3E%3Ctd%3E%3Cspan class=%22title%22%3EWeapon of Choice%3C/span%3E %3Cspan class=%22fav_weapon_txt%22%3E%3C/span%3E %3C/td%3E%3Ctd height=%2260%22 width=%22100%22 class=%22fav_weapon_img%22%3E%3C/td%3E%3C/tr%3E%3C/table%3E%3C/div%3E%3C/div%3E%3Cdiv class=%22qlv_plts_rightbox%22%3E%3Cdiv class=%22qlv_pltsrb_top%22%3E%3Ctable%3E%3Ctr class=%22qlv_pltslb_hd%22%3E%3Ctd%3ETotal Frags:%3C/td%3E%3Ctd style=%22width:94px%22 class=%22total_frags%22%3E%3C/td%3E%3C/tr%3E%3Ctr%3E%3Ctd%3ETotal Games Played:%3C/td%3E%3Ctd class=%22total_games%22%3E%3C/td%3E%3C/tr%3E%3Ctr%3E%3Ctd%3ETotal Time Played:%3C/td%3E%3Ctd class=%22total_time%22%3E%3C/td%3E%3C/tr%3E%3C/table%3E%3C/div%3E%3Cdiv class=%22qlv_pltsrb_middle%22%3E%3C/div%3E%3Cdiv class=%22qlv_pltsrb_bottom%22%3E%3Ctable%3E%3Ctr class=%22qlv_pltsrb_hd%22%3E%3Ctd%3EGame Type%3C/td%3E%3Ctd class=%22tc%22%3EPlayed%3C/td%3E%3Ctd class=%22tc%22%3EWins%3C/td%3E%3C/tr%3E%3Ctr%3E%3Ctd%3EDeath Match%3C/td%3E%3Ctd class=%22tc played_dm%22%3E%3C/td%3E%3Ctd class=%22tc wins_dm%22%3E%3C/td%3E%3C/tr%3E%3Ctr%3E%3Ctd%3EDuel%3C/td%3E%3Ctd class=%22tc played_duel%22%3E%3C/td%3E%3Ctd class=%22tc wins_duel%22%3E%3C/td%3E%3C/tr%3E%3Ctr%3E%3Ctd%3ECapture The Flag%3C/td%3E%3Ctd class=%22tc played_ctf%22%3E%3C/td%3E%3Ctd class=%22tc wins_ctf%22%3E%3C/td%3E%3C/tr%3E%3Ctr%3E%3Ctd%3ETeam Death Match%3C/td%3E%3Ctd class=%22tc played_tdm%22%3E%3C/td%3E%3Ctd class=%22tc wins_tdm%22%3E%3C/td%3E%3C/tr%3E%3Ctr class=%22qlv_pltsrb_totals%22%3E%3Ctd%3ETOTALS%3C/td%3E%3Ctd class=%22tc played_total%22%3E%3C/td%3E%3Ctd class=%22tc wins_total%22%3E%3C/td%3E%3C/tr%3E%3C/table%3E%3C/div%3E%3C/div%3E")].join('');
quakelive.mod_stats.TPL_MATCH_SUMMARY = [unescape("%3Cdiv id=%22stats_tip%22 style=%22position: absolute; z-index: 1000; left: 0; top: 0%22%3E%3Cimg src=%22"),quakelive.resource("/images/sf/pop_up/game_data_windows/onOver/shadow_top.png"),unescape("%22 width=%22385%22 height=%225%22 /%3E%3Cdiv style=%22background: url("),quakelive.resource("/images/sf/pop_up/game_data_windows/onOver/shadow_middle.png"),unescape("); width: 385px; text-align: center%22%3E%3Cdiv class=%22popheaderS%22%3E%3Cimg src=%22"),quakelive.resource("/images/sf/pop_up/game_data_windows/onOver/hdr_gamesummary.png"),unescape("%22 class=%22fl%22 style=%22margin-left: 10px; margin-top: 2px%22 /%3E%3Cimg src=%22"),quakelive.resource("/images/sf/pop_up/game_data_windows/onOver/btn_clickformore.png"),unescape("%22 class=%22fr%22 style=%22margin-right: 10px; margin-top: 5px%22 /%3E%3Cdiv class=%22cl%22%3E%3C/div%3E%3C/div%3E%3Cdiv id=%22stats_datacontainer%22 class=%22popupBorder%22%3E%3Cdiv class=%22tc%22%3E%3Cimg src=%22"),quakelive.resource("/images/loader.gif"),unescape("%22 width=%2262%22 height=%2213%22 style=%22margin: 20px 0px%22 /%3E%3C/div%3E%3C/div%3E%3C/div%3E%3Cimg src=%22"),quakelive.resource("/images/sf/pop_up/game_data_windows/onOver/shadow_bottom.png"),unescape("%22 width=%22385%22 height=%225%22 /%3E%3C/div%3E")].join('');
quakelive.mod_stats.TPL_MATCH_SUMMARY_INNER = [unescape("%3Cdiv class=%22mainData%22%3E%3Cdiv id=%22match_mapshot%22%3E%3C/div%3E%3Cdiv id=%22match_maindata%22 class=%22mainDataInfo%22%3E%3C/div%3E%3C/div%3E%3Cdiv class=%22dataDetail%22%3E%3Cdiv class=%22match_highlights Norm11px%22%3E%3C/div%3E%3C/div%3E")].join('');
quakelive.mod_stats.TPL_MATCH_DETAILS = [unescape("%3Cdiv id=%22stats_details%22 style=%22position: absolute; z-index: 1001; left: 0; top: 0%22%3E%3Cimg src=%22"),quakelive.resource("/images/sf/pop_up/game_data_windows/onClick/shadow_top.png"),unescape("%22 width=%22645%22 height=%225%22 /%3E%3Cdiv style=%22background: url("),quakelive.resource("/images/sf/pop_up/game_data_windows/onClick/shadow_middle.png"),unescape("); width: 645px; text-align: center; margin: 0 auto%22%3E%3Cdiv class=%22statsDetailsBody%22%3E%3Cimg alt=%22%22 src=%22"),quakelive.resource("/images/sf/pop_up/game_data_windows/onClick/bkd_header.jpg"),unescape("%22 width=%22635%22 height=%2240%22 /%3E%3Cdiv class=%22popupBorderW%22%3E%3Cdiv%3E%3Cdiv id=%22match_gametype%22 class=%22gameTypeContainer fl%22%3ELoading…%3C/div%3E%3Ca href=%22javascript:;%22 onclick=%22quakelive.statstip.CloseStatsDetails(); return false%22 class=%22closeBtn fr%22%3E%3C/a%3E%3Cdiv id=%22stats_datacontainer%22 class=%22cl%22%3E%3Cdiv class=%22tc%22%3E%3Cimg src=%22"),quakelive.resource("/images/loader.gif"),unescape("%22 width=%2262%22 height=%2213%22 style=%22margin: 20px 0px%22 /%3E%3C/div%3E%3C/div%3E%3C/div%3E%3Cdiv class=%22statsDetailsFooter%22%3E%3Cdiv class=%22adContainer%22%3E%3Ciframe src=%22"),quakelive.resource("/ads/game_details_468_60.html"),unescape("%22 width=%22468%22 height=%2260%22 marginwidth=%220%22 marginheight=%220%22 frameborder=%220%22 scrolling=%22no%22 /%3E%3C/div%3E%3C/div%3E%3C/div%3E%3C/div%3E%3C/div%3E%3Cimg src=%22"),quakelive.resource("/images/sf/pop_up/game_data_windows/onClick/shadow_bottom.png"),unescape("%22 width=%22645%22 height=%225%22 /%3E%3C/div%3E")].join('');
quakelive.mod_stats.TPL_MATCH_DETAILS_INNER = [unescape("%3Cdiv class=%22mainDataW%22%3E%3Cdiv id=%22match_mapshot%22%3E%3C/div%3E%3Cdiv id=%22match_maindata%22 class=%22mainDataInfoW%22%3E%3C/div%3E%3C/div%3E%3Cdiv id=%22match_vscontainer%22 class=%22fr%22%3E%3C/div%3E%3Cdiv class=%22matchNavBar%22%3E%3Cdiv class=%22leftSide%22%3E%3Ca href=%22javascript:;%22 onclick=%22quakelive.statstip.SetDetailsMode('scoreboard'); return false%22 class=%22fl nav_scoreboard selected%22%3EScoreboard%3C/a%3E%3Cspan class=%22fl%22%3E | %3C/span%3E%3Ca href=%22javascript:;%22 onclick=%22quakelive.statstip.SetDetailsMode('weaponaccuracy'); return false%22 class=%22fl nav_weaponaccuracy%22%3EWeapon Accuracy%3C/a%3E%3Cdiv class=%22cl%22%3E%3C/div%3E%3C/div%3E%3Cdiv class=%22rightSide%22%3E%3Cspan class=%22fr addthis_container%22%3E%3C/span%3E%3Cspan class=%22fr%22%3E  %3C/span%3E%3Ca href=%22javascript:;%22 class=%22share_email fr%22%3Eemail%3C/a%3E%3Ca href=%22javascript:;%22 class=%22share_email_img share_email fr%22%3E%3C/a%3E%3Cspan class=%22fr%22%3E  %3C/span%3E%3Ca href=%22javascript:;%22 class=%22share_link fr%22%3Elink%3C/a%3E%3Ca href=%22javascript:;%22 class=%22share_link_img share_link fr%22%3E%3C/a%3E%3Cdiv class=%22cl%22%3E%3C/div%3E%3C/div%3E%3Cdiv class=%22cl%22%3E%3C/div%3E%3C/div%3E%3Cdiv class=%22dataDetailL%22%3E%3Cdiv class=%22match_scoreboard Norm11px%22%3E%3C/div%3E%3Cdiv class=%22match_weapons Norm11px%22 style=%22display: none%22%3E%3C/div%3E%3Cdiv class=%22match_weaponaccuracy Norm11px%22 style=%22display: none%22%3E%3C/div%3E%3C/div%3E")].join('');
quakelive.mod_stats.TPL_MATCH_VSCONTAINER = [unescape("%3Cdiv class=%22vsFrameContainer%22%3E%3Cdiv class=%22gameTypeIcon%22%3E%3C/div%3E%3Cdiv class=%22headNum1%22%3E%3C/div%3E%3Cdiv class=%22headNum2%22%3E%3C/div%3E%3Cdiv class=%22vsFrame%22%3E%3C/div%3E%3Cdiv class=%22rankNum1%22%3E%3C/div%3E%3Cdiv class=%22scoreNum1%22%3E%3C/div%3E%3Cdiv class=%22nameNum1%22%3E%3C/div%3E%3Cdiv class=%22flagNum1%22%3E%3C/div%3E%3Cdiv class=%22rankNum2%22%3E%3C/div%3E%3Cdiv class=%22scoreNum2%22%3E%3C/div%3E%3Cdiv class=%22nameNum2%22%3E%3C/div%3E%3Cdiv class=%22flagNum2%22%3E%3C/div%3E%3Cdiv class=%22noPlayer2%22%3ENo Teammate Available%3C/div%3E%3C/div%3E")].join('');
quakelive.mod_lfg.TPL_MODE_MINIMIZED = [unescape("%3Cdiv class=%22lfg_content%22 id=%22lfg_minimized%22%3E%3C/div%3E")].join('');
quakelive.mod_lfg.TPL_MODE_NORMAL = [unescape("%3Cdiv class=%22lfg_content%22 id=%22lfg_normal%22%3E%3Cdiv class=%22collapse_proxy%22%3E%3C/div%3E%3Cul class=%22jd_menu%22%3E%3Cli class=%22top%22%3E%3Ca href=%22javascript:;%22 class=%22accessible%22 style=%22position: relative; padding-left: 20px; padding-right: 31px%22%3E%3Cdiv class=%22arrow_right%22%3E%3C/div%3ESelect Game Type%3C/a%3E%3Cul%3E%3Cli class=%22select_gt_5 tl%22%3E%3Cimg src=%22"),quakelive.resource("/images/lfg/tny.png"),unescape("%22 width=%2220%22 height=%2220%22 /%3EDuel%3C/li%3E%3C/ul%3E%3C/li%3E%3C/ul%3E%3Cdiv class=%22blurb%22%3EWe'll find an opponent at your skill level, then alert you when the game is ready.%3C/div%3E%3Cdiv class=%22cancel_blurb%22%3E%3C/div%3E%3Cdiv class=%22footer%22%3E%3C/div%3E%3C/div%3E")].join('');
quakelive.mod_lfg.TPL_MODE_READY = [unescape("%3Cdiv class=%22lfg_content%22 id=%22lfg_matchready%22%3E%3Cdiv class=%22description%22%3E%3C/div%3E%3Cdiv id=%22lfg_ready_tooltip%22%3E%3Cdiv class=%22levelshot%22%3E%3C/div%3E%3Ca href=%22javascript:;%22 class=%22play%22%3E%3C/a%3E%3C/div%3E%3Ca href=%22javascript:;%22 class=%22decline%22%3E%3C/a%3E%3Cdiv class=%22timer_header%22%3Eopen for%3C/div%3E%3Cdiv class=%22timer%22%3E%3C/div%3E%3C/div%3E")].join('');
quakelive.mod_lfg.TPL_MODE_INQUEUE = [unescape("%3Cdiv class=%22lfg_content%22 id=%22lfg_inqueue%22%3E%3Cdiv class=%22collapse_proxy%22%3E%3C/div%3E%3Cdiv class=%22blurb%22%3EWe're now finding you a Duel at your skill level. Please wait…%3C/div%3E%3Cdiv class=%22footer%22%3E%3Cimg src=%22"),quakelive.resource("/images/loader.gif"),unescape("%22 class=%22fl ticker%22 /%3E%3Cspan class=%22fl search_status%22%3ESearching%3C/span%3E%3Ca href=%22javascript:;%22 class=%22btn_stop fr%22%3E%3C/a%3E%3Cdiv class=%22cl%22%3E%3C/div%3E%3C/div%3E%3C/div%3E")].join('');
quakelive.mod_home.TPL_TOUR_OVERLAY = [unescape("%3Cdiv class=%22jqmWindow%22 id=%22tour_overlay%22%3E    %3Ca class=%22jqmClose%22%3E%3C/a%3E    %3Cdiv class='header'%3E        %3Cimg src=%22"),quakelive.resource("/images/tour_header.png"),unescape("%22 width=%22411%22 height=%2248%22 /%3E    %3C/div%3E    %3Cdiv class=%22tc%22%3E        %3Ciframe src=%22"),quakelive.resource("/flash/tour/index_tour.html"),unescape("?49caf1b28671c%22 width=%22960%22 height=%22425%22 marginwidth=%220%22 marginheight=%220%22 frameborder=%220%22 scrolling=%22no%22 /%3E    %3C/div%3E%3C/div%3E")].join('');