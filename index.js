/**
 * POSTCSS EXTENDS
 * A postcss plugin to extend simple rules
 * version          1.0.0
 * author           Arpad Hegedus <hegedus.arpad@gmail.com>
 */

// load dependencies
let postcss = require('postcss'),
    util = require('postcss-plugin-utilities');

// export plugin
module.exports = postcss.plugin('postcss-extends', (options = {}) => {
    return css => {
        options = Object.assign({
            blacklistPropoerties: ['-webkit-appearance', '-webkit-touch-callout', '-webkit-highlight-color'],
            states: [':hover', ':focus', ':active', ':visited', ':first-child', ':last-child']
        }, options);
        css.walkDecls('extend', decl => {
            let parent = decl.parent,
                selector = decl.value,
                props = [],
                nodes = [],
                stateNodes = {};
            parent.walkDecls(d => { props.push(d.prop); })
            css.walkRules(rule => {
                let sel = postcss.list.comma(rule.selector);
                if (sel.indexOf(selector) !== -1) {
                    if (rule.parent.type !== 'atrule') {
                        rule.walkDecls(node => {
                            nodes.push(node.clone());
                        });
                    } else {
                        let media = `@${rule.parent.name} ${rule.parent.params}`;
                        stateNodes[media] = (stateNodes.hasOwnProperty(media))? stateNodes[media] : [];
                        rule.walkDecls(node => {
                            stateNodes[media].push(node.clone());
                        });
                    }
                }
                options.states.forEach(state => {
                    if (sel.indexOf(selector + state) !== -1) { 
                        stateNodes[parent.selector + state] = (stateNodes.hasOwnProperty(parent.selector + state)) ? stateNodes[parent.selector + state] : [];
                        rule.walkDecls(node => {
                            stateNodes[parent.selector + state].push(node.clone());
                        });
                    }
                });
            });
            nodes.forEach(node => { 
                if (props.indexOf(node.prop) === -1 && options.blacklistPropoerties.indexOf(node.prop) === -1) { 
                    decl.before(node);
                }
            });
            for (let [state, nds] of Object.entries(stateNodes)) { 
                let styles = '';
                nds.forEach(n => { 
                    styles += `${n.prop}: ${n.value};`;
                });
                if (state.indexOf('@') === 0) {
                    parent.after(postcss.parse(`${state} { ${parent.selector} { ${styles} } }`));
                } else { 
                    parent.after(postcss.parse(`${state} { ${styles} }`));
                }
                
            }
            decl.remove();
            if (parent.nodes.length === 0) {
                parent.remove();
            }
        });
    }
});