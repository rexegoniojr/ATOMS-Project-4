export const saveText = (container) => {
    if (container) {
        var txt = container.split('^').join('[ALT94]')
        txt = txt.split('_').join('[ALT95]')
        txt = txt.split('`').join('[ALT96]')
        txt = txt.split('!').join('[ALT33]')
        txt = txt.split('"').join('[ALT34]')
        txt = txt.split('%').join('[ALT37]')
        txt = txt.split('&').join('[ALT38]')
        txt = txt.split("'").join('[ALT39]')
        txt = txt.split('(').join('[ALT40]')
        txt = txt.split(')').join('[ALT41]')
        txt = txt.split('*').join('[ALT42]')
        txt = txt.split('+').join('[ALT43]')
        txt = txt.split(',').join('[ALT44]')
        txt = txt.split('-').join('[ALT45]')
        txt = txt.split('/').join('[ALT47]')
        txt = txt.split(':').join('[ALT58]')
        txt = txt.split(';').join('[ALT59]')
        txt = txt.split('<').join('[ALT60]')
        txt = txt.split('=').join('[ALT61]')
        txt = txt.split('>').join('[ALT62]')
        txt = txt.split('?').join('[ALT63]')
        txt = txt.split('{').join('[ALT123]')
        txt = txt.split('}').join('[ALT125]')
        return txt;
    }
}

export const retrieveText = (container) => {
    if (container) {
        var txt = container.split('[ALT94]').join('^')
        txt = txt.split('[ALT95]').join('_')
        txt = txt.split('[ALT96]').join('`')
        txt = txt.split('[ALT33]').join('!')
        txt = txt.split('[ALT34]').join('"')
        txt = txt.split('[ALT37]').join('%')
        txt = txt.split('[ALT38]').join('&')
        txt = txt.split('[ALT39]').join("'")
        txt = txt.split('[ALT40]').join('(')
        txt = txt.split('[ALT41]').join(')')
        txt = txt.split('[ALT42]').join('*')
        txt = txt.split('[ALT43]').join('+')
        txt = txt.split('[ALT44]').join(',')
        txt = txt.split('[ALT45]').join('-')
        txt = txt.split('[ALT47]').join('/')
        txt = txt.split('[ALT58]').join(':')
        txt = txt.split('[ALT59]').join(';')
        txt = txt.split('[ALT60]').join('<')
        txt = txt.split('[ALT61]').join('=')
        txt = txt.split('[ALT62]').join('>')
        txt = txt.split('[ALT63]').join('?')
        txt = txt.split('[ALT123]').join('{')
        txt = txt.split('[ALT125]').join('}')
        return txt;
    }
}

export const toUpperText = (container) => {
    if (container) {
        const text = container;
        return text.toUpperCase();
    }
}

export const toZip = (container) => {
    if (container) {
        let hex = '';
        for (let i = 0; i < container.length; i++) {
            const charCode = container.charCodeAt(i);
            const hexValue = charCode.toString(16);
            hex += hexValue.padStart(2, '0');
        }
        return hex;
    }
}

export const toUnzip = (container) => {
    if (container) {
        let str = '';
        for (let i = 0; i < container.length; i += 2) {
          const hexValue = container.substr(i, 2);
          const decimalValue = parseInt(hexValue, 16);
          str += String.fromCharCode(decimalValue);
        }
        return str;
    }
}