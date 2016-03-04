// Start from https://gist.github.com/iwek/7154578#file-csv-to-json-js
// and fix the issue with double quoted values

var count;
function csvTojs2(csv) {
    var lines = csv.split("\n");
    if (lines.length < 102) {
        var result = [];
        lines[0] = 'id,dealerDr,anio,revision,tipoMercado,tipoProducto,matriz,oem,noParte,noParteAnterior,descripcion,cantMax,comentarios,url,ponderacion,precioDealer';
        var headers = lines[0].split(",");
        $("#progress").progressbar({
            value: 0
        });
        for (var i = 1; i < lines.length; i++) {
            var obj = {};
            lines[i] = i + ',' + lines[i] + ',,,,';
            var row = lines[i],
                    queryIdx = 0,
                    startValueIdx = 0,
                    idx = 0;

            if (row.trim() === '') {
                continue;
            }

            while (idx < row.length) {
                /* if we meet a double quote we skip until the next one */
                var c = row[idx];

                if (c === '"') {
                    do {
                        c = row[++idx];
                    } while (c !== '"' && idx < row.length - 1);
                }

                if (c === ',' || /* handle end of line with no comma */ idx === row.length - 1) {
                    /* we've got a value */
                    var value = row.substr(startValueIdx, idx - startValueIdx).trim();

                    /* skip first double quote */
                    if (value[0] === '"') {
                        value = value.substr(1);
                    }
                    /* skip last comma */
                    if (value[value.length - 1] === ',') {
                        value = value.substr(0, value.length - 1);
                    }
                    /* skip last double quote */
                    if (value[value.length - 1] === '"') {
                        value = value.substr(0, value.length - 1);
                    }

                    var key = headers[queryIdx++];
                    obj[key] = value;
                    startValueIdx = idx + 1;
                }

                ++idx;
            }

            result.push(obj);
        }
        $("#progress").progressbar({
            value: 100
        });
        $('#enviar').prop('disabled', false);
    } else {
        alert('El archivo tiene mas de 100 registros');
        return null;
    }
    return result;
}




function csvTojs(csv) {
    var lines = csv.split("\n");

    var result = [];

    var headers = lines[0].replace("\\r", "").split(",");

    for (var i = 1; i < lines.length; i++) {

        var obj = {};
        var currentline = lines[i].replace("\\r", "").split(",");

        for (var j = 0; j < headers.length; j++) {
            obj[headers[j]] = currentline[j];
        }

        result.push(obj);

    }

    return result; //JavaScript object
    //return JSON.stringify(result); //JSON
}





var json;
function PreviewText() {
    var oFReader = new FileReader();
    oFReader.readAsText(document.getElementById("csvFile").files[0]);
    oFReader.onload = function(oFREvent) {
        //var csvval = oFREvent.target.result.split("\n");

        var csv = oFREvent.target.result;
        json = csvTojs2(csv);

        $('#matriz').val(json[0].matriz);

        $('#matrizLabel').html(json[0].matriz);

        $('#oem').val(json[0].oem);

        $('#revision').val(json[0].revision);

        $('#anio').val(json[0].anio);

        $('#para').val(json[0].dealerDr);

        $('#tipoProducto').val(json[0].tipoProducto);

        $('#rango').val(json[0].matriz);

        $('#mercado').val(json[0].tipoMercado);

        $('#tableBody').bootstrapTable({
            idField: 'id',
            pagination: true,
            search: true,
            data: json,
            emptytext: '-',
            formatLoadingMessage: function() {
                return 'Cargando...';
            },
            formatRecordsPerPage: function(pageNumber) {
                return pageNumber + ' registros por pagina';
            },
            formatShowingRows: function(pageFrom, pageTo, totalRows) {
                return 'Mostrando ' + pageFrom + ' a ' + pageTo + ' de ' + totalRows + ' registros';
            },
            formatSearch: function() {
                return 'Buscar';
            },
            formatNoMatches: function() {
                return 'No se encontraron registros';
            },
            formatPaginationSwitch: function() {
                return 'Ocultar/Mostrar paginacioon';
            },
            formatRefresh: function() {
                return 'Actualizar';
            },
            formatToggle: function() {
                return 'Toggle';
            },
            formatColumns: function() {
                return 'Columnas';
            },
            formatAllRows: function() {
                return 'Todos';
            },
            columns: [{
                    field: 'status',
                    checkbox: true

                }, {
                    field: 'id',
                    title: 'Id',
                    visible: false
                }, {
                    field: 'noParte',
                    title: 'No. Parte',
                    editable: {
                        defaultValue: '-',
                        emptytext: '-',
                        type: 'text'
                    }
                }, {
                    field: 'noParteAnterior',
                    title: 'No. Parte anterior',
                    editable: {
                        defaultValue: '-',
                        emptytext: '-',
                        type: 'text'
                    }
                }, {
                    field: 'descripcion',
                    title: 'Description',
                    editable: {
                        defaultValue: '-',
                        emptytext: '-',
                        type: 'text'
                    }
                }, {
                    field: 'cantMax',
                    title: 'Cantidad maxima',
                    editable: {
                        defaultValue: '-',
                        emptytext: '-',
                        type: 'text'
                    }
                }, {
                    field: 'comentarios',
                    title: 'Comentarios',
                    editable: {
                        defaultValue: '-',
                        emptytext: '-',
                        type: 'text'
                    }
                }, {
                    field: 'url',
                    title: 'URL',
                    editable: {
                        defaultValue: '-',
                        emptytext: '-',
                        type: 'text'
                    }
                }, {
                    field: 'ponderacion',
                    title: 'Ponderacion',
                    editable: {
                        defaultValue: '-',
                        emptytext: '-',
                        type: 'text'
                    }
                }, {
                    field: 'precioDealer',
                    title: 'Precio Dealer',
                    editable: {
                        defaultValue: '-',
                        emptytext: '-',
                        type: 'text'
                    }
                }]

        });
        count = $('#tableBody').bootstrapTable('getData').length;


    };


}


$(function() {

    $('#enviar').click(function() {

        jsonHeader = $('#formHeader').serializeJSON();

        jsonBody = JSON.stringify($('#tableBody').bootstrapTable('getData')).replace(/\\r/g, '');

        data = '{"header":' + jsonHeader + ', "data":' + jsonBody + '}';

        console.log(data);


        $.ajax({
            dataType: "text",
            url: "SaveCsv",
            method: "POST",
            beforeSend: function() {
                $("#loading").dialog('open').html("<p>La Informacion esta siendo enviada, por favor espere...</p>");
            },
            data: {"data": data}
        }).done(function(e) {
            $('#loading').html(e);
            setTimeout(function() {
            }, 500000);
            location.reload();
        })
                .fail(function(e) {
                    alert("Ocurrio un error al enviar los datos");
                    setTimeout(function() {
                    }, 500000);
                    location.reload();
                });

        $('#formHeader')[0].reset();
        $('#tableBody').bootstrapTable('removeAll');


    });

    $('#buttonAdd').click(function() {

        count++;
        $('#tableBody').bootstrapTable('insertRow', {
            index: $('#tableBody').bootstrapTable('getData').length,
            row: {
                id: count,
                noParte: '',
                noParteAnterior: '',
                descripcion: '',
                cantMax: '',
                comentarios: '',
                url: '',
                ponderacion: '',
                precioDealer: ''
            }
        });
    });

    $('#buttonRemove').click(function() {
        var ids = $.map($('#tableBody').bootstrapTable('getSelections'), function(row) {
            return row.id;
        });
        $('#tableBody').bootstrapTable('remove', {
            field: 'id',
            values: ids
        });
    });

    $("#loading").dialog({
        hide: 'slide',
        show: 'slide',
        autoOpen: false
    });



});


























