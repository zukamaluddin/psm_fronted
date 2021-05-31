export default function convertNumberToWords(theNum) {

    // let th = ['', 'thousand', 'million', 'billion', 'trillion'];
    // let dg = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
    // let tn = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
    // let tw = ['twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
    //
    let th = ['', 'Ribu', 'Juta', 'Bilion', 'Trilion'];
    let dg = ['Kosong', 'Satu', 'Dua', 'Tiga', 'Empat', 'Lima', 'Enam', 'Tujuh', 'Lapan', 'Sembilan'];
    let tn = ['Sepuluh', 'Sebelas', 'Dua Belas', 'Tiga Belas', 'Empat Belas', 'Lima Belas', 'Enam Belas', 'Tujuh Belas', 'Lapan Belas', 'Sembilan Belas'];
    let tw = ['Dua Puluh', 'Tiga Puluh', 'Empat Puluh', 'Lima Puluh', 'Enam Puluh', 'Tujuh Puluh', 'Lapan Puluh', 'Sembilan Puluh'];
    let belasSen = ['Sepuluh', 'Sebeles', 'Dua Belas', 'Tiga Belas', 'Empat Belas', 'Lima Belas', 'Enam Belas', 'Tujuh Belas', 'Lapan Belas', 'Sembilan Belas'];
    let puluhSen = ['Dua Puluh', 'Tiga Puluh', 'Empat Puluh', 'Lima Puluh', 'Enam Puluh', 'Tujuh Puluh', 'Lapan Puluh', 'Sembilan Puluh'];

    function toWords(s) {
        s = s.toString();
        s = s.replace(/[\, ]/g, '');
        if (s != parseFloat(s)) return 'not a number';
        let x = s.indexOf('.');
        if (x == -1) x = s.length;
        if (x > 15) return 'too big';
        let n = s.split('');
        let str = '';
        let sk = 0;
        for (let i = 0; i < x; i++) {
            if ((x - i) % 3 == 2) {
                if (n[i] == '1') {
                    str += tn[Number(n[i + 1])] + ' ';
                    i++;
                    sk = 1;
                } else if (n[i] != 0) {
                    str += tw[n[i] - 2] + ' ';
                    sk = 1;
                }
            } else if (n[i] != 0) {
                str += dg[n[i]] + ' ';
                if ((x - i) % 3 == 0) str += 'Ratus ';
                sk = 1;
            }
            if ((x - i) % 3 == 1) {
                if (sk) str += th[(x - i - 1) / 3] + ' ';
                sk = 0;
            }
        }
        if (x != s.length) {
            let y = s.length;
            // str += 'dan  ';

            let chekSen = ''
            for (let i = x + 1; i < y; i++) {
                chekSen = chekSen + n[i]
            }
            let convertI = Number(chekSen)
            if (convertI < 9) {       /*Kalau  .01 hingga .09*/
                console.log(dg[n[y - 1]])

                if (dg[n[y - 1]] == "Kosong") {

                    // 0 sen tak payah masuk

                } else {
                    str += 'dan  ';
                    str += dg[n[y - 1]] + ' Sen';
                }

            }

            if (convertI > 9 && convertI < 20) {   /*Kalau  .10 hingga .19*/
                str += 'dan  ';
                str += belasSen[convertI - 10] + ' Sen';
            }
            if (convertI > 19 && convertI < 100) {  /*Kalau  .20 hingga .99*/
                str += 'dan  ';
                str += puluhSen[n[y - 2] - 2] + ' ';
                if (n[y - 1] == 0) {     /*check Kalau  last number 0 ex 20/30/40 etc */
                    str += ' Sen';
                } else {             /*check Kalau  last number lebih dari 0  ex 21/22/23 etc */
                    str += dg[n[y - 1]] + ' Sen';
                }

            }

        }
        return str.replace(/\s+/g, ' ');
    }

    return toWords(theNum)
    // document.getElementById("lontong").innerHTML = words;
};