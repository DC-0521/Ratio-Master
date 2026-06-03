/**
 * Actividad Práctica 2 - Diseño Web
 * Script de Control Optimizado: Calculadora de Proporciones (Ratio Master)
 */

$(document).ready(function() {

    // Referencias a los elementos del DOM usando jQuery
    const $aspectRatio = $('#aspect-ratio');
    const $inputWidth = $('#input-width');
    const $inputHeight = $('#input-height');
    const $liveCanvas = $('#live-canvas');
    const $canvasDimensions = $('#canvas-dimensions');
    const $alertMessage = $('#alert-message');

    /**
     * Obtiene los valores numéricos de la proporción seleccionada
     */
    function getRatioValues() {
        const ratioString = $aspectRatio.val();
        const parts = ratioString.split(':');
        return {
            widthRatio: parseFloat(parts[0]),
            heightRatio: parseFloat(parts[1])
        };
    }

    /**
     * Limpia y oculta los mensajes de alerta en pantalla
     */
    function resetAlerts() {
        $alertMessage.addClass('hidden').removeClass('danger warning').text('');
        $inputWidth.removeClass('input-error');
        $inputHeight.removeClass('input-error');
    }

    /**
     * Muestra alertas dinámicas según las validaciones
     */
    function showAlert(message, type) {
        resetAlerts();
        $alertMessage.removeClass('hidden').addClass(type).text(message);
    }

    /**
     * Realiza el cálculo matemático de las dimensiones y actualiza la interfaz
     */
    function calculateDimensions(triggerSource) {
        const ratios = getRatioValues();
        let width = parseFloat($inputWidth.val());
        let height = parseFloat($inputHeight.val());

        // 1. Sentencia de Control: Validación de valores vacíos o no numéricos
        if (isNaN(width) && isNaN(height)) {
            $canvasDimensions.text('0 x 0 px');
            $liveCanvas.css({ width: '100px', height: '100px' });
            resetAlerts();
            return;
        }

        // 2. Sentencia de Control OPTIMIZADA: Corrección del error de NaN visual
        if ((triggerSource === 'width' && width <= 0) || (triggerSource === 'height' && height <= 0)) {
            showAlert('❌ Error: Las dimensiones deben ser números enteros mayores a cero.', 'danger');
            if (width <= 0) $inputWidth.addClass('input-error');
            if (height <= 0) $inputHeight.addClass('input-error');
            
            // Forzamos un estado seguro en el DOM para evitar el "NaN x NaN"
            $canvasDimensions.text('0 x 0 px');
            $liveCanvas.css({ width: '100px', height: '100px' });
            return;
        }

        resetAlerts();

        // 3. Bloque de Cálculo: Regla de tres según el origen del cambio
        if (triggerSource === 'width' || (triggerSource === 'ratio' && !isNaN(width))) {
            height = Math.round(width * (ratios.heightRatio / ratios.widthRatio));
            $inputHeight.val(height);
        } else if (triggerSource === 'height' && !isNaN(height)) {
            width = Math.round(height * (ratios.widthRatio / ratios.heightRatio));
            $inputWidth.val(width);
        }

        // 4. Actualización del texto del DOM con las dimensiones reales calculadas
        $canvasDimensions.text(`${width} x ${height} px`);

        // 5. Sentencia de Control: Alerta de optimización si se exceden estándares web
        if (width > 4000 || height > 4000) {
            showAlert('⚠️ Advertencia: El tamaño excede el estándar web óptimo (4000px). Podría causar lentitud de carga.', 'warning');
        }

        // 6. Escalado Visual del Lienzo (Modificación interactiva del CSS mediante jQuery)
        const maxDisplaySize = 280;
        let displayWidth, displayHeight;

        if (ratios.widthRatio >= ratios.heightRatio) {
            displayWidth = maxDisplaySize;
            displayHeight = maxDisplaySize * (ratios.heightRatio / ratios.widthRatio);
        } else {
            displayHeight = maxDisplaySize;
            displayWidth = maxDisplaySize * (ratios.widthRatio / ratios.heightRatio);
        }

        $liveCanvas.css({
            width: displayWidth + 'px',
            height: displayHeight + 'px'
        });
    }

    // ==========================================================================
    // Captura y Control de Eventos (jQuery)
    // ==========================================================================
    $inputWidth.on('input', function() {
        calculateDimensions('width');
    });

    $inputHeight.on('input', function() {
        calculateDimensions('height');
    });

    $aspectRatio.on('change', function() {
        calculateDimensions('ratio');
    });

    // Inicializar el lienzo de forma limpia
    $inputWidth.val(1920);
    calculateDimensions('width');
});