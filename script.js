const inputs = document.querySelectorAll("input");

inputs.forEach(input => {
    input.addEventListener("input", analyze);
});


function analyze() {


    const lte = {

        sinr: value("sinr"),
        rsrq: value("rsrq"),
        rsrp: value("rsrp"),
        rssi: value("rssi")

    };


    const nr5g = {

        sinr: value("sssinr"),
        rsrq: value("ssrsrq"),
        rsrp: value("ssrsrp")

    };



    let hasLTE =
        Object.values(lte).some(v => v !== null);


    let has5G =
        Object.values(nr5g).some(v => v !== null);



    if (!hasLTE && !has5G) {

        document
        .getElementById("results")
        .classList.add("hidden");

        return;

    }



    document
    .getElementById("results")
    .classList.remove("hidden");



    let scores = [];



    if (hasLTE) {


        if(lte.sinr !== null){

            let r = evaluateSINR(lte.sinr);
            draw("sinr",lte.sinr+" dB",r);
            scores.push({
                value:r.score,
                weight:0.40
            });

        }


        if(lte.rsrq !== null){

            let r = evaluateRSRQ(lte.rsrq);
            draw("rsrq",lte.rsrq+" dB",r);

            scores.push({
                value:r.score,
                weight:0.35
            });

        }



        if(lte.rsrp !== null){

            let r = evaluateRSRP(lte.rsrp);
            draw("rsrp",lte.rsrp+" dBm",r);

            scores.push({
                value:r.score,
                weight:0.20
            });

        }



        if(lte.rssi !== null){

            let r = evaluateRSSI(lte.rssi);
            draw("rssi",lte.rssi+" dBm",r);

            scores.push({
                value:r.score,
                weight:0.05
            });

        }

    }



    if(has5G){


        let weight5g = 1.15;



        if(nr5g.sinr !== null){

            let r = evaluateSINR(nr5g.sinr);

            draw(
                "sssinr",
                nr5g.sinr+" dB",
                r
            );


            scores.push({
                value:r.score,
                weight:0.40 * weight5g
            });

        }




        if(nr5g.rsrq !== null){

            let r = evaluateRSRQ(nr5g.rsrq);

            draw(
                "ssrsrq",
                nr5g.rsrq+" dB",
                r
            );


            scores.push({
                value:r.score,
                weight:0.35 * weight5g
            });

        }




        if(nr5g.rsrp !== null){

            let r = evaluateRSRP(nr5g.rsrp);

            draw(
                "ssrsrp",
                nr5g.rsrp+" dBm",
                r
            );


            scores.push({
                value:r.score,
                weight:0.25 * weight5g
            });

        }

    }





    let totalWeight =
        scores.reduce(
            (a,b)=>a+b.weight,
            0
        );


    let finalScore =
        scores.reduce(
            (a,b)=>a+(b.value*b.weight),
            0
        )
        /
        totalWeight;



    showScore(
        Math.round(finalScore)
    );


}





function value(id){

    let v =
    document.getElementById(id).value;


    if(v === "")
        return null;


    return parseFloat(v);

}





function draw(prefix,value,obj){


    document
    .getElementById(prefix+"Value")
    .innerText=value;



    let status =
    document.getElementById(prefix+"Status");


    status.innerText=obj.label;

    status.className =
    "status "+obj.class;




    let bar =
    document.getElementById(prefix+"Bar");


    bar.style.width =
    obj.score+"%";


    bar.style.background =
    obj.color;


}







function showScore(score){


    let text;
    let cls;


    if(score>=90){

        text="🟢 Eccellente";
        cls="green";

    }
    else if(score>=75){

        text="🟢 Ottima";
        cls="green";

    }
    else if(score>=60){

        text="🟡 Buona";
        cls="yellow";

    }
    else if(score>=40){

        text="🟠 Sufficiente";
        cls="orange";

    }
    else if(score>=20){

        text="🔴 Scarsa";
        cls="red";

    }
    else{

        text="⚫ Critica";
        cls="gray";

    }



    document
    .getElementById("score")
    .innerText =
    score+"/100";



    let el =
    document.getElementById("scoreStatus");


    el.innerText=text;

    el.className =
    "scoreStatus "+cls;


}








function result(score,label,cls,color){

    return {

        score,
        label,
        class:cls,
        color

    };

}





function evaluateSINR(v){


    if(v>=20)
        return result(100,"🟢 Eccellente","green","#22c55e");

    if(v>=13)
        return result(90,"🟢 Ottimo","green","#22c55e");

    if(v>=5)
        return result(70,"🟡 Buono","yellow","#facc15");

    if(v>=0)
        return result(40,"🟠 Scarso","orange","#fb923c");


    return result(10,"🔴 Critico","red","#ef4444");

}






function evaluateRSRQ(v){


    if(v>=-10)
        return result(100,"🟢 Ottimo","green","#22c55e");

    if(v>=-15)
        return result(75,"🟡 Buono","yellow","#facc15");

    if(v>=-20)
        return result(45,"🟠 Scarso","orange","#fb923c");


    return result(10,"🔴 Critico","red","#ef4444");

}






function evaluateRSRP(v){


    if(v>=-80)
        return result(100,"🟢 Eccellente","green","#22c55e");

    if(v>=-90)
        return result(90,"🟢 Ottimo","green","#22c55e");

    if(v>=-100)
        return result(75,"🟡 Buono","yellow","#facc15");

    if(v>=-110)
        return result(45,"🟠 Debole","orange","#fb923c");


    return result(10,"🔴 Molto debole","red","#ef4444");

}






function evaluateRSSI(v){


    if(v>=-65)
        return result(100,"🟢 Eccellente","green","#22c55e");

    if(v>=-75)
        return result(90,"🟢 Ottimo","green","#22c55e");

    if(v>=-85)
        return result(75,"🟡 Buono","yellow","#facc15");

    if(v>=-95)
        return result(45,"🟠 Scarso","orange","#fb923c");


    return result(10,"🔴 Critico","red","#ef4444");

}
