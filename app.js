import $$ from 'dom7';
import Framework7 from 'framework7/framework7.esm.bundle.js';

// Import F7 Styles
import 'framework7/css/framework7.bundle.css';

// Import Icons and App Custom Styles
import '../css/icons.css';
import '../css/app.css';
// Import Cordova APIs
import cordovaApp from './cordova-app.js';
// Import Routes
import routes from './routes.js';

import Axios from 'axios';

// Import main app component
import App from '../app.f7.html';

var app = new Framework7({
  root: '#app', // App root element
  component: App, // App main component
  id: 'io.framework7.myapp', // App bundle ID
  name: 'My App', // App name
  theme: 'auto', // Automatic theme detection


  // App routes
  routes: routes,


  // Input settings
  input: {
    scrollIntoViewOnFocus: Framework7.device.cordova && !Framework7.device.electron,
    scrollIntoViewCentered: Framework7.device.cordova && !Framework7.device.electron,
  },
  // Cordova Statusbar settings
  statusbar: {
    iosOverlaysWebView: true,
    androidOverlaysWebView: false,
  },
  on: {
    init: function () {
      var f7 = this;
      if (f7.device.cordova) {
        cordovaApp.init(f7);
      }
      $$(document).on('page:init', '.page[data-name="kalkulator"]', function (e) {
        $$('button[id="dodaj"]').on('click', function() {
          var liczba1 = document.getElementById('liczba1').value;
          var liczba2 = document.getElementById('liczba2').value;
         document.getElementById('wynik').value = Number(liczba1) + Number(liczba2);
        });
        $$('button[id="odejmij"]').on('click', function() {
          var liczba1 = document.getElementById('liczba1').value;
          var liczba2 = document.getElementById('liczba2').value;
         document.getElementById('wynik').value = Number(liczba1) - Number(liczba2);
        });
        $$('button[id="pomnoz"]').on('click', function() {
          var liczba1 = document.getElementById('liczba1').value;
          var liczba2 = document.getElementById('liczba2').value;
         document.getElementById('wynik').value = Number(liczba1) * Number(liczba2);
        });
        $$('button[id="podziel"]').on('click', function() {
          var liczba1 = document.getElementById('liczba1').value;
          var liczba2 = document.getElementById('liczba2').value;
         document.getElementById('wynik').value = Number(liczba1) / Number(liczba2);
        });
      }), 
	  $$(document).on('page:init', '.page[data-name="tabelka"]', function (e) {
        $$('button[id="guzik"]').on('click', function() {
			  var i = 0;
			  var table = document.getElementById("tabela");
			  var row = table.insertRow(0);
			  var cell1 = row.insertCell(0);
			  var cell2 = row.insertCell(1);
			  var cell3 = row.insertCell(2);
			  cell1.innerHTML = "18";
			  cell2.innerHTML = Number(++i);
			  cell3.innerHTML = "kolumna";
        });
      })
      $$(document).on('page:init', '.page[data-name="sprawdzanie"]', function (e) {
        $$("input").keyup(function() {
          var kategoria = $$(this).val().trim();
          if(kategoria != '')
          {
             app.request({
                url: 'http://jakubmatysiak.pl/sprawdz.php',
                type: 'post',
                data: {kategoria: kategoria},
                success: function(wynik){
                    $$('#czy_dostepne').html(wynik);
                 }
             });
          }
          else
          {
             $$("#czy_dostepne").html("");
          } 
       });
      })
      $$(document).on('page:init', '.page[data-name="pesel"]', function (e) {
        $$('button[id="czyszczenie"]').on('click', function() {
          $$("#wynik").html("");
          $$("#wynik2").html("");
          $$("#wynik3").html("");
          $$("#guzik").html("");
          $$("#pesel").html("");
        });
      })
  /*    $$(document).on('page:init', '.page[data-name="pesel"]', function (e) {
        $$('button[id="sprawdz"]').on('click', function() {
            var cyfra = new Array();
            var pesel_dlugosc = document.getElementById("pesel").value;
            var wagi = [1,3,7,9,1,3,7,9,1,3,1];
            var suma_kontrolna=0;
        
            for (i=0;i<11; i++)
            {
              cyfra[i] = Number(String(pesel_dlugosc.substring(i,i+1)));
              if (isNaN(cyfra[i]))
              {
                return;
              }
            }
            
            for (var i=0;i<11;i++)
                suma_kontrolna+=wagi[i]*cyfra[i];
        
            var sprawdz_rok = 1900+cyfra[0]*10+cyfra[1];
            if (cyfra[2]>=2 && cyfra[2]<8)
                sprawdz_rok+=Math.floor(cyfra[2]/2)*100;
            if (cyfra[2]>=8)
                sprawdz_rok-=100;
        
            var miesiac = (cyfra[2]%2)*10+cyfra[3];
            var dzien = cyfra[4]*10+cyfra[5];
        
            function zla_suma(sumaa){
                document.getElementById("wynik").innerHTML = (sumaa?"<h3>Zła suma</h3>" : "<h3>Suma okej</h3>");
                return sumaa;
            }
        
            function zla_dlugosc(dlugosc){
                document.getElementById("wynik2").innerHTML = (dlugosc?"<h3>Zła długość</h3>" : "<h3>Długosć okej</h3>");
                return dlugosc;
            }
        
            function zla_data(data){
                document.getElementById("wynik3").innerHTML = (data?"<h3>Zła data</h3>" : "<h3>Data okej</h3>");
                return data;
            }
        
            var dlug = (zla_dlugosc(pesel_dlugosc.length != 11));
            var sum = (zla_suma((suma_kontrolna%10)!=0));
            var dat = (zla_data(!sprawdz_date(dzien,miesiac,sprawdz_rok)));
            var dlug_d = !(zla_dlugosc(pesel_dlugosc.length != 11));
            var sum_d = !(zla_suma((suma_kontrolna%10)!=0));
            var dat_d = !(zla_data(!sprawdz_date(dzien,miesiac,sprawdz_rok)));
        
            if (dlug||sum||dat)
            {
                document.getElementById("pesel").style.backgroundColor = "yellow";
            }
            if ((dlug&&sum)||(dlug&&dat)||(sum&&dat))
            {
                document.getElementById("pesel").style.backgroundColor = "orange";
            }
            if (dlug&&sum&&dat)
            {
                document.getElementById("pesel").style.backgroundColor = "red";
            }
            if (dlug_d&&sum_d&&dat_d)
            {
                document.getElementById("pesel").style.backgroundColor = "green";
                var przycisk = document.getElementById("guziki");
                przycisk.innerHTML = przycisk.innerHTML + "<div class='col'><button type='submit' id='dodaj' class='button convert-form-to-data'>Wyślij do bazy</div>";
            }
            function sprawdz_date(dzien,miesiac,rok)
            {
              var data = new Date(rok,miesiac-1,dzien);
              return data.getDate()==dzien &&
                     data.getMonth()==miesiac-1 &&
                     data.getFullYear()==rok;
            }
       });
      }) */
      $$(document).on('page:init', '.page[data-name="dziedziczenie"]', function (e) {
        $$("input").keyup(function() {
          var imie = document.getElementById("imie").value;
          var nazwisko = document.getElementById("nazwisko").value;
          var klasa = document.getElementById("klasa").value;
          var numer = document.getElementById("numer").value;
          var imie_n = document.getElementById("imie_n").value;
          var nazwisko_n = document.getElementById("nazwisko_n").value;
          var klasa_n = document.getElementById("klasa_n").value;
          var przedmiot = document.getElementById("przedmiot").value;

          class Osoba {
            constructor(imie, nazwisko){
                this.imie = imie;
                this.nazwisko = nazwisko;
            }
        }

        class Uczen extends Osoba {
            constructor(imie, nazwisko, klasa, numer){
                super(imie, nazwisko);
                this.klasa = klasa;
                this.numer = numer;
            }
        }

        class Nauczyciel extends Osoba {
            constructor(imie, nazwisko, klasa_n, przedmiot){
                super(imie, nazwisko);
                this.klasa_n = klasa_n;
                this.przedmiot = przedmiot;
            }
        }

        let uczen = new Uczen(imie, nazwisko, klasa, numer);
        document.getElementById("wypisz").innerHTML = uczen.imie + ' ' + uczen.nazwisko + ' ' + uczen.klasa + ' ' + uczen.numer;
        let nauczyciel = new Nauczyciel(imie_n, nazwisko_n, klasa_n, przedmiot);
        document.getElementById("wypisz2").innerHTML = nauczyciel.imie + ' ' + nauczyciel.nazwisko + ' ' + nauczyciel.klasa_n + ' ' + nauczyciel.przedmiot;
        });
      })
      $$(document).on('page:init', '.page[data-name="wyszukaj"]', function(e) { 
        axios
            .get('http://jakubmatysiak.pl/json_select.php?szukaj=%')
            .then(response => {
                console.log(this.items, response.data);
                var virtualList = app.virtualList.create({
                    el: '.virtual-list',
                    items: response.data, 
                    searchAll: function(query, items) {
                        var found = [];
                        for (var i = 0; i < items.length; i++) {
                            if (items[i].nazwisko.toLowerCase().indexOf(query.toLowerCase()) >= 0 || query.trim() === '') found.push(i);
                        }
                        return found; 
                    },
                    itemTemplate: '<li>' +
                        '<a href="#" class="item-link item-content">' +
                        '<div class="item-inner">' +
                        '<div class="item-title-row">' +
                        '<div class="item-title">{{imie}}</div>' +
                        '</div>' +
                        '<div class="item-subtitle">{{nazwisko}}</div>' +
                        '</div>' +
                        '</a>' +
                        '</li>',
                    height: app.theme === 'ios' ? 63 : (app.theme === 'md' ? 73 : 46),
                });
            });
    });
    $$(document).on('page:init', '.page[data-name="regex"]', function (e) {
      $$('input[type="text"]').on('keyup keydown change', function() {
        var imie = document.getElementById("imie").value;
        var wzor_imie = new RegExp("[A-Z][a-zżźćńółęąśŻŹĆĄŚĘŁÓŃ]*");
        var nazwisko = document.getElementById("nazwisko").value;
        var wzor_nazwisko = new RegExp("[A-Z][a-zżźćńółęąśŻŹĆĄŚĘŁÓŃ]*");
        var kod = document.getElementById("kod").value;
        var wzor_kod = new RegExp ("[0-9]{2}-[0-9]{3}");
        var miasto = document.getElementById("miasto").value;
        var wzor_miasto = new RegExp("[A-Z][a-zżźćńółęąśŻŹĆĄŚĘŁÓŃ]*");
        var telefon = document.getElementById("telefon").value;
        var wzor_telefon = new RegExp("[0-9]{3}-[0-9]{3}-[0-9]{3}");
        var email = document.getElementById("email").value;
        var wzor_email = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
        if (wzor_imie.test(imie))
        {
          $$('#imie').css('backgroundColor', 'green');
        }
        else
        {
          $$('#imie').css('backgroundColor', 'red');
        }
        if (wzor_nazwisko.test(nazwisko))
        {
          $$('#nazwisko').css('backgroundColor', 'green');
        }
        else
        {
          $$('#nazwisko').css('backgroundColor', 'red');
        }
        if (wzor_kod.test(kod))
        {
          $$('#kod').css('backgroundColor', 'green');
        }
        else
        {
          $$('#kod').css('backgroundColor', 'red');
        }
        if (wzor_miasto.test(miasto))
        {
          $$('#miasto').css('backgroundColor', 'green');
        }
        else
        {
          $$('#miasto').css('backgroundColor', 'red');
        }
        if (wzor_telefon.test(telefon))
        {
          $$('#telefon').css('backgroundColor', 'green');
        }
        else
        {
          $$('#telefon').css('backgroundColor', 'red');
        }
        if (wzor_email.test(email))
        {
          $$('#email').css('backgroundColor', 'green');
        }
        else
        {
          $$('#email').css('backgroundColor', 'red');
        }
      });
    })
  
    
var db;
var shortName = 'pesele4';
var version = '1.0';
var displayName = 'pesele4';
var maxSize = 65535;
  function errorHandler(transaction, error) {
     alert('Błąd: ' + error.message + ' kod błędu: ' + error.code);
  }
  function successCallBack() {
  }
  function nullHandler(){};
$$(document).on('page:init', '.page[data-name="pesel"]', function(e){
  $$('button[id="sprawdz"]').on('click', function() {
    var cyfra = new Array();
    var pesel_dlugosc = document.getElementById("pesel").value;
    var wagi = [1,3,7,9,1,3,7,9,1,3,1];
    var suma_kontrolna=0;

    for (i=0;i<11; i++)
    {
      cyfra[i] = Number(String(pesel_dlugosc.substring(i,i+1)));
      if (isNaN(cyfra[i]))
      {
        return;
      }
    }
    
    for (var i=0;i<11;i++)
        suma_kontrolna+=wagi[i]*cyfra[i];

    var sprawdz_rok = 1900+cyfra[0]*10+cyfra[1];
    if (cyfra[2]>=2 && cyfra[2]<8)
        sprawdz_rok+=Math.floor(cyfra[2]/2)*100;
    if (cyfra[2]>=8)
        sprawdz_rok-=100;

    var miesiac = (cyfra[2]%2)*10+cyfra[3];
    var dzien = cyfra[4]*10+cyfra[5];

    function zla_suma(sumaa){
        document.getElementById("wynik").innerHTML = (sumaa?"<h3>Zła suma</h3>" : "<h3>Suma okej</h3>");
        return sumaa;
    }

    function zla_dlugosc(dlugosc){
        document.getElementById("wynik2").innerHTML = (dlugosc?"<h3>Zła długość</h3>" : "<h3>Długosć okej</h3>");
        return dlugosc;
    }

    function zla_data(data){
        document.getElementById("wynik3").innerHTML = (data?"<h3>Zła data</h3>" : "<h3>Data okej</h3>");
        return data;
    }

    var dlug = (zla_dlugosc(pesel_dlugosc.length != 11));
    var sum = (zla_suma((suma_kontrolna%10)!=0));
    var dat = (zla_data(!sprawdz_date(dzien,miesiac,sprawdz_rok)));
    var dlug_d = !(zla_dlugosc(pesel_dlugosc.length != 11));
    var sum_d = !(zla_suma((suma_kontrolna%10)!=0));
    var dat_d = !(zla_data(!sprawdz_date(dzien,miesiac,sprawdz_rok)));

    if (dlug||sum||dat)
    {
        document.getElementById("pesel").style.backgroundColor = "yellow";
    }
    if ((dlug&&sum)||(dlug&&dat)||(sum&&dat))
    {
        document.getElementById("pesel").style.backgroundColor = "orange";
    }
    if (dlug&&sum&&dat)
    {
        document.getElementById("pesel").style.backgroundColor = "red";
    }
    if (dlug_d&&sum_d&&dat_d)
    {
        document.getElementById("pesel").style.backgroundColor = "green";
        AddValueToDB();
        
    }
    function sprawdz_date(dzien,miesiac,rok)
    {
      var data = new Date(rok,miesiac-1,dzien);
      return data.getDate()==dzien &&
             data.getMonth()==miesiac-1 &&
             data.getFullYear()==rok;
    }
});
      if (!window.openDatabase) {
         alert('Twoje urządzenie nie obsługuje SQLite!');
      }
      db = openDatabase(shortName, version, displayName,maxSize); 
      db.transaction(function(tx){ 
       tx.executeSql( 'CREATE TABLE IF NOT EXISTS pesele(Id INTEGER NOT NULL PRIMARY KEY, pesel TEXT NOT NULL)',[],nullHandler,errorHandler);},errorHandler,successCallBack);


   $$('#pokaz').on('click', () => {
    console.log("odswiezanie");
     ListDBValues();
   })

   return;
});
 function ListDBValues() {
 if (!window.openDatabase) {
  alert('To urządzenie nie obsługuje SQLite!');
  return;
 }
 $$('#wyswietl').html(''); 
 db.transaction(function(transaction) {
   transaction.executeSql('SELECT * FROM pesele;', [],
     function(transaction, result) {
      if (result != null && result.rows != null) {
        for (var i = 0; i < result.rows.length; i++) {
          var row = result.rows.item(i);
          $$('#wyswietl').append('<br><tr>' + '<td> ' + row.Id + '</td> '  + '. ' + '<td>' +row.pesel);
        }
       }
     },errorHandler);
 },errorHandler,nullHandler);
}
function AddValueToDB() {
   if (!window.openDatabase) {
     alert('To urządzenie nie obsługuje SQLite!');
      return;
   }
   db.transaction(function(transaction) {
     transaction.executeSql('INSERT INTO pesele(pesel) VALUES (?)',[$$('#pesel').val()],
       nullHandler,errorHandler);
     });
   ListDBValues();
    return false;
  }
    },
  },
});

