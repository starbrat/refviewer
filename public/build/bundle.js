
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop$1() { }
    const identity = x => x;
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function is_promise(value) {
        return value && typeof value === 'object' && typeof value.then === 'function';
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop$1;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }
    function exclude_internal_props(props) {
        const result = {};
        for (const k in props)
            if (k[0] !== '$')
                result[k] = props[k];
        return result;
    }
    function compute_rest_props(props, keys) {
        const rest = {};
        keys = new Set(keys);
        for (const k in props)
            if (!keys.has(k) && k[0] !== '$')
                rest[k] = props[k];
        return rest;
    }
    function set_store_value(store, ret, value) {
        store.set(value);
        return ret;
    }
    function action_destroyer(action_result) {
        return action_result && is_function(action_result.destroy) ? action_result.destroy : noop$1;
    }

    const is_client = typeof window !== 'undefined';
    let now$1 = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop$1;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function get_root_for_style(node) {
        if (!node)
            return document;
        const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
        if (root && root.host) {
            return root;
        }
        return node.ownerDocument;
    }
    function append_empty_stylesheet(node) {
        const style_element = element('style');
        append_stylesheet(get_root_for_style(node), style_element);
        return style_element.sheet;
    }
    function append_stylesheet(node, style) {
        append(node.head || node, style);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen$1(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function prevent_default(fn) {
        return function (event) {
            event.preventDefault();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function stop_propagation(fn) {
        return function (event) {
            event.stopPropagation();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function to_number(value) {
        return value === '' ? null : +value;
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function set_style(node, key, value, important) {
        if (value === null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        return e;
    }
    class HtmlTag {
        constructor(is_svg = false) {
            this.is_svg = false;
            this.is_svg = is_svg;
            this.e = this.n = null;
        }
        c(html) {
            this.h(html);
        }
        m(html, target, anchor = null) {
            if (!this.e) {
                if (this.is_svg)
                    this.e = svg_element(target.nodeName);
                else
                    this.e = element(target.nodeName);
                this.t = target;
                this.c(html);
            }
            this.i(anchor);
        }
        h(html) {
            this.e.innerHTML = html;
            this.n = Array.from(this.e.childNodes);
        }
        i(anchor) {
            for (let i = 0; i < this.n.length; i += 1) {
                insert(this.t, this.n[i], anchor);
            }
        }
        p(html) {
            this.d();
            this.h(html);
            this.i(this.a);
        }
        d() {
            this.n.forEach(detach);
        }
    }

    // we need to store the information for multiple documents because a Svelte application could also contain iframes
    // https://github.com/sveltejs/svelte/issues/3624
    const managed_styles = new Map();
    let active = 0;
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash$2(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_style_information(doc, node) {
        const info = { stylesheet: append_empty_stylesheet(node), rules: {} };
        managed_styles.set(doc, info);
        return info;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash$2(rule)}_${uid}`;
        const doc = get_root_for_style(node);
        const { stylesheet, rules } = managed_styles.get(doc) || create_style_information(doc, node);
        if (!rules[name]) {
            rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ''}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        const previous = (node.style.animation || '').split(', ');
        const next = previous.filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        );
        const deleted = previous.length - next.length;
        if (deleted) {
            node.style.animation = next.join(', ');
            active -= deleted;
            if (!active)
                clear_rules();
        }
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            managed_styles.forEach(info => {
                const { stylesheet } = info;
                let i = stylesheet.cssRules.length;
                while (i--)
                    stylesheet.deleteRule(i);
                info.rules = {};
            });
            managed_styles.clear();
        });
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail, { cancelable = false } = {}) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail, { cancelable });
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
                return !event.defaultPrevented;
            }
            return true;
        };
    }
    function setContext(key, context) {
        get_current_component().$$.context.set(key, context);
        return context;
    }
    function getContext(key) {
        return get_current_component().$$.context.get(key);
    }
    // TODO figure out if we still want to support
    // shorthand events, or if we want to implement
    // a real bubbling mechanism
    function bubble(component, event) {
        const callbacks = component.$$.callbacks[event.type];
        if (callbacks) {
            // @ts-ignore
            callbacks.slice().forEach(fn => fn.call(this, event));
        }
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }

    let promise;
    function wait() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    function dispatch(node, direction, kind) {
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
        else if (callback) {
            callback();
        }
    }
    const null_transition = { duration: 0 };
    function create_in_transition(node, fn, params) {
        let config = fn(node, params);
        let running = false;
        let animation_name;
        let task;
        let uid = 0;
        function cleanup() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop$1, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 0, 1, duration, delay, easing, css, uid++);
            tick(0, 1);
            const start_time = now$1() + delay;
            const end_time = start_time + duration;
            if (task)
                task.abort();
            running = true;
            add_render_callback(() => dispatch(node, true, 'start'));
            task = loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(1, 0);
                        dispatch(node, true, 'end');
                        cleanup();
                        return running = false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(t, 1 - t);
                    }
                }
                return running;
            });
        }
        let started = false;
        return {
            start() {
                if (started)
                    return;
                started = true;
                delete_rule(node);
                if (is_function(config)) {
                    config = config();
                    wait().then(go);
                }
                else {
                    go();
                }
            },
            invalidate() {
                started = false;
            },
            end() {
                if (running) {
                    cleanup();
                    running = false;
                }
            }
        };
    }
    function create_out_transition(node, fn, params) {
        let config = fn(node, params);
        let running = true;
        let animation_name;
        const group = outros;
        group.r += 1;
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop$1, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 1, 0, duration, delay, easing, css);
            const start_time = now$1() + delay;
            const end_time = start_time + duration;
            add_render_callback(() => dispatch(node, false, 'start'));
            loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(0, 1);
                        dispatch(node, false, 'end');
                        if (!--group.r) {
                            // this will result in `end()` being called,
                            // so we don't need to clean up here
                            run_all(group.c);
                        }
                        return false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(1 - t, t);
                    }
                }
                return running;
            });
        }
        if (is_function(config)) {
            wait().then(() => {
                // @ts-ignore
                config = config();
                go();
            });
        }
        else {
            go();
        }
        return {
            end(reset) {
                if (reset && config.tick) {
                    config.tick(1, 0);
                }
                if (running) {
                    if (animation_name)
                        delete_rule(node, animation_name);
                    running = false;
                }
            }
        };
    }
    function create_bidirectional_transition(node, fn, params, intro) {
        let config = fn(node, params);
        let t = intro ? 0 : 1;
        let running_program = null;
        let pending_program = null;
        let animation_name = null;
        function clear_animation() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function init(program, duration) {
            const d = (program.b - t);
            duration *= Math.abs(d);
            return {
                a: t,
                b: program.b,
                d,
                duration,
                start: program.start,
                end: program.start + duration,
                group: program.group
            };
        }
        function go(b) {
            const { delay = 0, duration = 300, easing = identity, tick = noop$1, css } = config || null_transition;
            const program = {
                start: now$1() + delay,
                b
            };
            if (!b) {
                // @ts-ignore todo: improve typings
                program.group = outros;
                outros.r += 1;
            }
            if (running_program || pending_program) {
                pending_program = program;
            }
            else {
                // if this is an intro, and there's a delay, we need to do
                // an initial tick and/or apply CSS animation immediately
                if (css) {
                    clear_animation();
                    animation_name = create_rule(node, t, b, duration, delay, easing, css);
                }
                if (b)
                    tick(0, 1);
                running_program = init(program, duration);
                add_render_callback(() => dispatch(node, b, 'start'));
                loop(now => {
                    if (pending_program && now > pending_program.start) {
                        running_program = init(pending_program, duration);
                        pending_program = null;
                        dispatch(node, running_program.b, 'start');
                        if (css) {
                            clear_animation();
                            animation_name = create_rule(node, t, running_program.b, running_program.duration, 0, easing, config.css);
                        }
                    }
                    if (running_program) {
                        if (now >= running_program.end) {
                            tick(t = running_program.b, 1 - t);
                            dispatch(node, running_program.b, 'end');
                            if (!pending_program) {
                                // we're done
                                if (running_program.b) {
                                    // intro — we can tidy up immediately
                                    clear_animation();
                                }
                                else {
                                    // outro — needs to be coordinated
                                    if (!--running_program.group.r)
                                        run_all(running_program.group.c);
                                }
                            }
                            running_program = null;
                        }
                        else if (now >= running_program.start) {
                            const p = now - running_program.start;
                            t = running_program.a + running_program.d * easing(p / running_program.duration);
                            tick(t, 1 - t);
                        }
                    }
                    return !!(running_program || pending_program);
                });
            }
        }
        return {
            run(b) {
                if (is_function(config)) {
                    wait().then(() => {
                        // @ts-ignore
                        config = config();
                        go(b);
                    });
                }
                else {
                    go(b);
                }
            },
            end() {
                clear_animation();
                running_program = pending_program = null;
            }
        };
    }

    function handle_promise(promise, info) {
        const token = info.token = {};
        function update(type, index, key, value) {
            if (info.token !== token)
                return;
            info.resolved = value;
            let child_ctx = info.ctx;
            if (key !== undefined) {
                child_ctx = child_ctx.slice();
                child_ctx[key] = value;
            }
            const block = type && (info.current = type)(child_ctx);
            let needs_flush = false;
            if (info.block) {
                if (info.blocks) {
                    info.blocks.forEach((block, i) => {
                        if (i !== index && block) {
                            group_outros();
                            transition_out(block, 1, 1, () => {
                                if (info.blocks[i] === block) {
                                    info.blocks[i] = null;
                                }
                            });
                            check_outros();
                        }
                    });
                }
                else {
                    info.block.d(1);
                }
                block.c();
                transition_in(block, 1);
                block.m(info.mount(), info.anchor);
                needs_flush = true;
            }
            info.block = block;
            if (info.blocks)
                info.blocks[index] = block;
            if (needs_flush) {
                flush();
            }
        }
        if (is_promise(promise)) {
            const current_component = get_current_component();
            promise.then(value => {
                set_current_component(current_component);
                update(info.then, 1, info.value, value);
                set_current_component(null);
            }, error => {
                set_current_component(current_component);
                update(info.catch, 2, info.error, error);
                set_current_component(null);
                if (!info.hasCatch) {
                    throw error;
                }
            });
            // if we previously had a then/catch block, destroy it
            if (info.current !== info.pending) {
                update(info.pending, 0);
                return true;
            }
        }
        else {
            if (info.current !== info.then) {
                update(info.then, 1, info.value, promise);
                return true;
            }
            info.resolved = promise;
        }
    }
    function update_await_block_branch(info, ctx, dirty) {
        const child_ctx = ctx.slice();
        const { resolved } = info;
        if (info.current === info.then) {
            child_ctx[info.value] = resolved;
        }
        if (info.current === info.catch) {
            child_ctx[info.error] = resolved;
        }
        info.block.p(child_ctx, dirty);
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function outro_and_destroy_block(block, lookup) {
        transition_out(block, 1, 1, () => {
            lookup.delete(block.key);
        });
    }
    function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block, next, get_context) {
        let o = old_blocks.length;
        let n = list.length;
        let i = o;
        const old_indexes = {};
        while (i--)
            old_indexes[old_blocks[i].key] = i;
        const new_blocks = [];
        const new_lookup = new Map();
        const deltas = new Map();
        i = n;
        while (i--) {
            const child_ctx = get_context(ctx, list, i);
            const key = get_key(child_ctx);
            let block = lookup.get(key);
            if (!block) {
                block = create_each_block(key, child_ctx);
                block.c();
            }
            else if (dynamic) {
                block.p(child_ctx, dirty);
            }
            new_lookup.set(key, new_blocks[i] = block);
            if (key in old_indexes)
                deltas.set(key, Math.abs(i - old_indexes[key]));
        }
        const will_move = new Set();
        const did_move = new Set();
        function insert(block) {
            transition_in(block, 1);
            block.m(node, next);
            lookup.set(block.key, block);
            next = block.first;
            n--;
        }
        while (o && n) {
            const new_block = new_blocks[n - 1];
            const old_block = old_blocks[o - 1];
            const new_key = new_block.key;
            const old_key = old_block.key;
            if (new_block === old_block) {
                // do nothing
                next = new_block.first;
                o--;
                n--;
            }
            else if (!new_lookup.has(old_key)) {
                // remove old block
                destroy(old_block, lookup);
                o--;
            }
            else if (!lookup.has(new_key) || will_move.has(new_key)) {
                insert(new_block);
            }
            else if (did_move.has(old_key)) {
                o--;
            }
            else if (deltas.get(new_key) > deltas.get(old_key)) {
                did_move.add(new_key);
                insert(new_block);
            }
            else {
                will_move.add(old_key);
                o--;
            }
        }
        while (o--) {
            const old_block = old_blocks[o];
            if (!new_lookup.has(old_block.key))
                destroy(old_block, lookup);
        }
        while (n)
            insert(new_blocks[n - 1]);
        return new_blocks;
    }
    function validate_each_keys(ctx, list, get_context, get_key) {
        const keys = new Set();
        for (let i = 0; i < list.length; i++) {
            const key = get_key(get_context(ctx, list, i));
            if (keys.has(key)) {
                throw new Error('Cannot have duplicate keys in a keyed each');
            }
            keys.add(key);
        }
    }

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function get_spread_object(spread_props) {
        return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
    }

    function bind(component, name, callback) {
        const index = component.$$.props[name];
        if (index !== undefined) {
            component.$$.bound[index] = callback;
            callback(component.$$.ctx[index]);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop$1,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop$1;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.49.0' }, detail), { bubbles: true }));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen$1(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev('SvelteDOMSetProperty', { node, property, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

    function createCommonjsModule(fn) {
      var module = { exports: {} };
    	return fn(module, module.exports), module.exports;
    }

    /*global define:false */

    var mousetrap = createCommonjsModule(function (module) {
    /**
     * Copyright 2012-2017 Craig Campbell
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     * http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     *
     * Mousetrap is a simple keyboard shortcut library for Javascript with
     * no external dependencies
     *
     * @version 1.6.5
     * @url craig.is/killing/mice
     */
    (function(window, document, undefined$1) {

        // Check if mousetrap is used inside browser, if not, return
        if (!window) {
            return;
        }

        /**
         * mapping of special keycodes to their corresponding keys
         *
         * everything in this dictionary cannot use keypress events
         * so it has to be here to map to the correct keycodes for
         * keyup/keydown events
         *
         * @type {Object}
         */
        var _MAP = {
            8: 'backspace',
            9: 'tab',
            13: 'enter',
            16: 'shift',
            17: 'ctrl',
            18: 'alt',
            20: 'capslock',
            27: 'esc',
            32: 'space',
            33: 'pageup',
            34: 'pagedown',
            35: 'end',
            36: 'home',
            37: 'left',
            38: 'up',
            39: 'right',
            40: 'down',
            45: 'ins',
            46: 'del',
            91: 'meta',
            93: 'meta',
            224: 'meta'
        };

        /**
         * mapping for special characters so they can support
         *
         * this dictionary is only used incase you want to bind a
         * keyup or keydown event to one of these keys
         *
         * @type {Object}
         */
        var _KEYCODE_MAP = {
            106: '*',
            107: '+',
            109: '-',
            110: '.',
            111 : '/',
            186: ';',
            187: '=',
            188: ',',
            189: '-',
            190: '.',
            191: '/',
            192: '`',
            219: '[',
            220: '\\',
            221: ']',
            222: '\''
        };

        /**
         * this is a mapping of keys that require shift on a US keypad
         * back to the non shift equivelents
         *
         * this is so you can use keyup events with these keys
         *
         * note that this will only work reliably on US keyboards
         *
         * @type {Object}
         */
        var _SHIFT_MAP = {
            '~': '`',
            '!': '1',
            '@': '2',
            '#': '3',
            '$': '4',
            '%': '5',
            '^': '6',
            '&': '7',
            '*': '8',
            '(': '9',
            ')': '0',
            '_': '-',
            '+': '=',
            ':': ';',
            '\"': '\'',
            '<': ',',
            '>': '.',
            '?': '/',
            '|': '\\'
        };

        /**
         * this is a list of special strings you can use to map
         * to modifier keys when you specify your keyboard shortcuts
         *
         * @type {Object}
         */
        var _SPECIAL_ALIASES = {
            'option': 'alt',
            'command': 'meta',
            'return': 'enter',
            'escape': 'esc',
            'plus': '+',
            'mod': /Mac|iPod|iPhone|iPad/.test(navigator.platform) ? 'meta' : 'ctrl'
        };

        /**
         * variable to store the flipped version of _MAP from above
         * needed to check if we should use keypress or not when no action
         * is specified
         *
         * @type {Object|undefined}
         */
        var _REVERSE_MAP;

        /**
         * loop through the f keys, f1 to f19 and add them to the map
         * programatically
         */
        for (var i = 1; i < 20; ++i) {
            _MAP[111 + i] = 'f' + i;
        }

        /**
         * loop through to map numbers on the numeric keypad
         */
        for (i = 0; i <= 9; ++i) {

            // This needs to use a string cause otherwise since 0 is falsey
            // mousetrap will never fire for numpad 0 pressed as part of a keydown
            // event.
            //
            // @see https://github.com/ccampbell/mousetrap/pull/258
            _MAP[i + 96] = i.toString();
        }

        /**
         * cross browser add event method
         *
         * @param {Element|HTMLDocument} object
         * @param {string} type
         * @param {Function} callback
         * @returns void
         */
        function _addEvent(object, type, callback) {
            if (object.addEventListener) {
                object.addEventListener(type, callback, false);
                return;
            }

            object.attachEvent('on' + type, callback);
        }

        /**
         * takes the event and returns the key character
         *
         * @param {Event} e
         * @return {string}
         */
        function _characterFromEvent(e) {

            // for keypress events we should return the character as is
            if (e.type == 'keypress') {
                var character = String.fromCharCode(e.which);

                // if the shift key is not pressed then it is safe to assume
                // that we want the character to be lowercase.  this means if
                // you accidentally have caps lock on then your key bindings
                // will continue to work
                //
                // the only side effect that might not be desired is if you
                // bind something like 'A' cause you want to trigger an
                // event when capital A is pressed caps lock will no longer
                // trigger the event.  shift+a will though.
                if (!e.shiftKey) {
                    character = character.toLowerCase();
                }

                return character;
            }

            // for non keypress events the special maps are needed
            if (_MAP[e.which]) {
                return _MAP[e.which];
            }

            if (_KEYCODE_MAP[e.which]) {
                return _KEYCODE_MAP[e.which];
            }

            // if it is not in the special map

            // with keydown and keyup events the character seems to always
            // come in as an uppercase character whether you are pressing shift
            // or not.  we should make sure it is always lowercase for comparisons
            return String.fromCharCode(e.which).toLowerCase();
        }

        /**
         * checks if two arrays are equal
         *
         * @param {Array} modifiers1
         * @param {Array} modifiers2
         * @returns {boolean}
         */
        function _modifiersMatch(modifiers1, modifiers2) {
            return modifiers1.sort().join(',') === modifiers2.sort().join(',');
        }

        /**
         * takes a key event and figures out what the modifiers are
         *
         * @param {Event} e
         * @returns {Array}
         */
        function _eventModifiers(e) {
            var modifiers = [];

            if (e.shiftKey) {
                modifiers.push('shift');
            }

            if (e.altKey) {
                modifiers.push('alt');
            }

            if (e.ctrlKey) {
                modifiers.push('ctrl');
            }

            if (e.metaKey) {
                modifiers.push('meta');
            }

            return modifiers;
        }

        /**
         * prevents default for this event
         *
         * @param {Event} e
         * @returns void
         */
        function _preventDefault(e) {
            if (e.preventDefault) {
                e.preventDefault();
                return;
            }

            e.returnValue = false;
        }

        /**
         * stops propogation for this event
         *
         * @param {Event} e
         * @returns void
         */
        function _stopPropagation(e) {
            if (e.stopPropagation) {
                e.stopPropagation();
                return;
            }

            e.cancelBubble = true;
        }

        /**
         * determines if the keycode specified is a modifier key or not
         *
         * @param {string} key
         * @returns {boolean}
         */
        function _isModifier(key) {
            return key == 'shift' || key == 'ctrl' || key == 'alt' || key == 'meta';
        }

        /**
         * reverses the map lookup so that we can look for specific keys
         * to see what can and can't use keypress
         *
         * @return {Object}
         */
        function _getReverseMap() {
            if (!_REVERSE_MAP) {
                _REVERSE_MAP = {};
                for (var key in _MAP) {

                    // pull out the numeric keypad from here cause keypress should
                    // be able to detect the keys from the character
                    if (key > 95 && key < 112) {
                        continue;
                    }

                    if (_MAP.hasOwnProperty(key)) {
                        _REVERSE_MAP[_MAP[key]] = key;
                    }
                }
            }
            return _REVERSE_MAP;
        }

        /**
         * picks the best action based on the key combination
         *
         * @param {string} key - character for key
         * @param {Array} modifiers
         * @param {string=} action passed in
         */
        function _pickBestAction(key, modifiers, action) {

            // if no action was picked in we should try to pick the one
            // that we think would work best for this key
            if (!action) {
                action = _getReverseMap()[key] ? 'keydown' : 'keypress';
            }

            // modifier keys don't work as expected with keypress,
            // switch to keydown
            if (action == 'keypress' && modifiers.length) {
                action = 'keydown';
            }

            return action;
        }

        /**
         * Converts from a string key combination to an array
         *
         * @param  {string} combination like "command+shift+l"
         * @return {Array}
         */
        function _keysFromString(combination) {
            if (combination === '+') {
                return ['+'];
            }

            combination = combination.replace(/\+{2}/g, '+plus');
            return combination.split('+');
        }

        /**
         * Gets info for a specific key combination
         *
         * @param  {string} combination key combination ("command+s" or "a" or "*")
         * @param  {string=} action
         * @returns {Object}
         */
        function _getKeyInfo(combination, action) {
            var keys;
            var key;
            var i;
            var modifiers = [];

            // take the keys from this pattern and figure out what the actual
            // pattern is all about
            keys = _keysFromString(combination);

            for (i = 0; i < keys.length; ++i) {
                key = keys[i];

                // normalize key names
                if (_SPECIAL_ALIASES[key]) {
                    key = _SPECIAL_ALIASES[key];
                }

                // if this is not a keypress event then we should
                // be smart about using shift keys
                // this will only work for US keyboards however
                if (action && action != 'keypress' && _SHIFT_MAP[key]) {
                    key = _SHIFT_MAP[key];
                    modifiers.push('shift');
                }

                // if this key is a modifier then add it to the list of modifiers
                if (_isModifier(key)) {
                    modifiers.push(key);
                }
            }

            // depending on what the key combination is
            // we will try to pick the best event for it
            action = _pickBestAction(key, modifiers, action);

            return {
                key: key,
                modifiers: modifiers,
                action: action
            };
        }

        function _belongsTo(element, ancestor) {
            if (element === null || element === document) {
                return false;
            }

            if (element === ancestor) {
                return true;
            }

            return _belongsTo(element.parentNode, ancestor);
        }

        function Mousetrap(targetElement) {
            var self = this;

            targetElement = targetElement || document;

            if (!(self instanceof Mousetrap)) {
                return new Mousetrap(targetElement);
            }

            /**
             * element to attach key events to
             *
             * @type {Element}
             */
            self.target = targetElement;

            /**
             * a list of all the callbacks setup via Mousetrap.bind()
             *
             * @type {Object}
             */
            self._callbacks = {};

            /**
             * direct map of string combinations to callbacks used for trigger()
             *
             * @type {Object}
             */
            self._directMap = {};

            /**
             * keeps track of what level each sequence is at since multiple
             * sequences can start out with the same sequence
             *
             * @type {Object}
             */
            var _sequenceLevels = {};

            /**
             * variable to store the setTimeout call
             *
             * @type {null|number}
             */
            var _resetTimer;

            /**
             * temporary state where we will ignore the next keyup
             *
             * @type {boolean|string}
             */
            var _ignoreNextKeyup = false;

            /**
             * temporary state where we will ignore the next keypress
             *
             * @type {boolean}
             */
            var _ignoreNextKeypress = false;

            /**
             * are we currently inside of a sequence?
             * type of action ("keyup" or "keydown" or "keypress") or false
             *
             * @type {boolean|string}
             */
            var _nextExpectedAction = false;

            /**
             * resets all sequence counters except for the ones passed in
             *
             * @param {Object} doNotReset
             * @returns void
             */
            function _resetSequences(doNotReset) {
                doNotReset = doNotReset || {};

                var activeSequences = false,
                    key;

                for (key in _sequenceLevels) {
                    if (doNotReset[key]) {
                        activeSequences = true;
                        continue;
                    }
                    _sequenceLevels[key] = 0;
                }

                if (!activeSequences) {
                    _nextExpectedAction = false;
                }
            }

            /**
             * finds all callbacks that match based on the keycode, modifiers,
             * and action
             *
             * @param {string} character
             * @param {Array} modifiers
             * @param {Event|Object} e
             * @param {string=} sequenceName - name of the sequence we are looking for
             * @param {string=} combination
             * @param {number=} level
             * @returns {Array}
             */
            function _getMatches(character, modifiers, e, sequenceName, combination, level) {
                var i;
                var callback;
                var matches = [];
                var action = e.type;

                // if there are no events related to this keycode
                if (!self._callbacks[character]) {
                    return [];
                }

                // if a modifier key is coming up on its own we should allow it
                if (action == 'keyup' && _isModifier(character)) {
                    modifiers = [character];
                }

                // loop through all callbacks for the key that was pressed
                // and see if any of them match
                for (i = 0; i < self._callbacks[character].length; ++i) {
                    callback = self._callbacks[character][i];

                    // if a sequence name is not specified, but this is a sequence at
                    // the wrong level then move onto the next match
                    if (!sequenceName && callback.seq && _sequenceLevels[callback.seq] != callback.level) {
                        continue;
                    }

                    // if the action we are looking for doesn't match the action we got
                    // then we should keep going
                    if (action != callback.action) {
                        continue;
                    }

                    // if this is a keypress event and the meta key and control key
                    // are not pressed that means that we need to only look at the
                    // character, otherwise check the modifiers as well
                    //
                    // chrome will not fire a keypress if meta or control is down
                    // safari will fire a keypress if meta or meta+shift is down
                    // firefox will fire a keypress if meta or control is down
                    if ((action == 'keypress' && !e.metaKey && !e.ctrlKey) || _modifiersMatch(modifiers, callback.modifiers)) {

                        // when you bind a combination or sequence a second time it
                        // should overwrite the first one.  if a sequenceName or
                        // combination is specified in this call it does just that
                        //
                        // @todo make deleting its own method?
                        var deleteCombo = !sequenceName && callback.combo == combination;
                        var deleteSequence = sequenceName && callback.seq == sequenceName && callback.level == level;
                        if (deleteCombo || deleteSequence) {
                            self._callbacks[character].splice(i, 1);
                        }

                        matches.push(callback);
                    }
                }

                return matches;
            }

            /**
             * actually calls the callback function
             *
             * if your callback function returns false this will use the jquery
             * convention - prevent default and stop propogation on the event
             *
             * @param {Function} callback
             * @param {Event} e
             * @returns void
             */
            function _fireCallback(callback, e, combo, sequence) {

                // if this event should not happen stop here
                if (self.stopCallback(e, e.target || e.srcElement, combo, sequence)) {
                    return;
                }

                if (callback(e, combo) === false) {
                    _preventDefault(e);
                    _stopPropagation(e);
                }
            }

            /**
             * handles a character key event
             *
             * @param {string} character
             * @param {Array} modifiers
             * @param {Event} e
             * @returns void
             */
            self._handleKey = function(character, modifiers, e) {
                var callbacks = _getMatches(character, modifiers, e);
                var i;
                var doNotReset = {};
                var maxLevel = 0;
                var processedSequenceCallback = false;

                // Calculate the maxLevel for sequences so we can only execute the longest callback sequence
                for (i = 0; i < callbacks.length; ++i) {
                    if (callbacks[i].seq) {
                        maxLevel = Math.max(maxLevel, callbacks[i].level);
                    }
                }

                // loop through matching callbacks for this key event
                for (i = 0; i < callbacks.length; ++i) {

                    // fire for all sequence callbacks
                    // this is because if for example you have multiple sequences
                    // bound such as "g i" and "g t" they both need to fire the
                    // callback for matching g cause otherwise you can only ever
                    // match the first one
                    if (callbacks[i].seq) {

                        // only fire callbacks for the maxLevel to prevent
                        // subsequences from also firing
                        //
                        // for example 'a option b' should not cause 'option b' to fire
                        // even though 'option b' is part of the other sequence
                        //
                        // any sequences that do not match here will be discarded
                        // below by the _resetSequences call
                        if (callbacks[i].level != maxLevel) {
                            continue;
                        }

                        processedSequenceCallback = true;

                        // keep a list of which sequences were matches for later
                        doNotReset[callbacks[i].seq] = 1;
                        _fireCallback(callbacks[i].callback, e, callbacks[i].combo, callbacks[i].seq);
                        continue;
                    }

                    // if there were no sequence matches but we are still here
                    // that means this is a regular match so we should fire that
                    if (!processedSequenceCallback) {
                        _fireCallback(callbacks[i].callback, e, callbacks[i].combo);
                    }
                }

                // if the key you pressed matches the type of sequence without
                // being a modifier (ie "keyup" or "keypress") then we should
                // reset all sequences that were not matched by this event
                //
                // this is so, for example, if you have the sequence "h a t" and you
                // type "h e a r t" it does not match.  in this case the "e" will
                // cause the sequence to reset
                //
                // modifier keys are ignored because you can have a sequence
                // that contains modifiers such as "enter ctrl+space" and in most
                // cases the modifier key will be pressed before the next key
                //
                // also if you have a sequence such as "ctrl+b a" then pressing the
                // "b" key will trigger a "keypress" and a "keydown"
                //
                // the "keydown" is expected when there is a modifier, but the
                // "keypress" ends up matching the _nextExpectedAction since it occurs
                // after and that causes the sequence to reset
                //
                // we ignore keypresses in a sequence that directly follow a keydown
                // for the same character
                var ignoreThisKeypress = e.type == 'keypress' && _ignoreNextKeypress;
                if (e.type == _nextExpectedAction && !_isModifier(character) && !ignoreThisKeypress) {
                    _resetSequences(doNotReset);
                }

                _ignoreNextKeypress = processedSequenceCallback && e.type == 'keydown';
            };

            /**
             * handles a keydown event
             *
             * @param {Event} e
             * @returns void
             */
            function _handleKeyEvent(e) {

                // normalize e.which for key events
                // @see http://stackoverflow.com/questions/4285627/javascript-keycode-vs-charcode-utter-confusion
                if (typeof e.which !== 'number') {
                    e.which = e.keyCode;
                }

                var character = _characterFromEvent(e);

                // no character found then stop
                if (!character) {
                    return;
                }

                // need to use === for the character check because the character can be 0
                if (e.type == 'keyup' && _ignoreNextKeyup === character) {
                    _ignoreNextKeyup = false;
                    return;
                }

                self.handleKey(character, _eventModifiers(e), e);
            }

            /**
             * called to set a 1 second timeout on the specified sequence
             *
             * this is so after each key press in the sequence you have 1 second
             * to press the next key before you have to start over
             *
             * @returns void
             */
            function _resetSequenceTimer() {
                clearTimeout(_resetTimer);
                _resetTimer = setTimeout(_resetSequences, 1000);
            }

            /**
             * binds a key sequence to an event
             *
             * @param {string} combo - combo specified in bind call
             * @param {Array} keys
             * @param {Function} callback
             * @param {string=} action
             * @returns void
             */
            function _bindSequence(combo, keys, callback, action) {

                // start off by adding a sequence level record for this combination
                // and setting the level to 0
                _sequenceLevels[combo] = 0;

                /**
                 * callback to increase the sequence level for this sequence and reset
                 * all other sequences that were active
                 *
                 * @param {string} nextAction
                 * @returns {Function}
                 */
                function _increaseSequence(nextAction) {
                    return function() {
                        _nextExpectedAction = nextAction;
                        ++_sequenceLevels[combo];
                        _resetSequenceTimer();
                    };
                }

                /**
                 * wraps the specified callback inside of another function in order
                 * to reset all sequence counters as soon as this sequence is done
                 *
                 * @param {Event} e
                 * @returns void
                 */
                function _callbackAndReset(e) {
                    _fireCallback(callback, e, combo);

                    // we should ignore the next key up if the action is key down
                    // or keypress.  this is so if you finish a sequence and
                    // release the key the final key will not trigger a keyup
                    if (action !== 'keyup') {
                        _ignoreNextKeyup = _characterFromEvent(e);
                    }

                    // weird race condition if a sequence ends with the key
                    // another sequence begins with
                    setTimeout(_resetSequences, 10);
                }

                // loop through keys one at a time and bind the appropriate callback
                // function.  for any key leading up to the final one it should
                // increase the sequence. after the final, it should reset all sequences
                //
                // if an action is specified in the original bind call then that will
                // be used throughout.  otherwise we will pass the action that the
                // next key in the sequence should match.  this allows a sequence
                // to mix and match keypress and keydown events depending on which
                // ones are better suited to the key provided
                for (var i = 0; i < keys.length; ++i) {
                    var isFinal = i + 1 === keys.length;
                    var wrappedCallback = isFinal ? _callbackAndReset : _increaseSequence(action || _getKeyInfo(keys[i + 1]).action);
                    _bindSingle(keys[i], wrappedCallback, action, combo, i);
                }
            }

            /**
             * binds a single keyboard combination
             *
             * @param {string} combination
             * @param {Function} callback
             * @param {string=} action
             * @param {string=} sequenceName - name of sequence if part of sequence
             * @param {number=} level - what part of the sequence the command is
             * @returns void
             */
            function _bindSingle(combination, callback, action, sequenceName, level) {

                // store a direct mapped reference for use with Mousetrap.trigger
                self._directMap[combination + ':' + action] = callback;

                // make sure multiple spaces in a row become a single space
                combination = combination.replace(/\s+/g, ' ');

                var sequence = combination.split(' ');
                var info;

                // if this pattern is a sequence of keys then run through this method
                // to reprocess each pattern one key at a time
                if (sequence.length > 1) {
                    _bindSequence(combination, sequence, callback, action);
                    return;
                }

                info = _getKeyInfo(combination, action);

                // make sure to initialize array if this is the first time
                // a callback is added for this key
                self._callbacks[info.key] = self._callbacks[info.key] || [];

                // remove an existing match if there is one
                _getMatches(info.key, info.modifiers, {type: info.action}, sequenceName, combination, level);

                // add this call back to the array
                // if it is a sequence put it at the beginning
                // if not put it at the end
                //
                // this is important because the way these are processed expects
                // the sequence ones to come first
                self._callbacks[info.key][sequenceName ? 'unshift' : 'push']({
                    callback: callback,
                    modifiers: info.modifiers,
                    action: info.action,
                    seq: sequenceName,
                    level: level,
                    combo: combination
                });
            }

            /**
             * binds multiple combinations to the same callback
             *
             * @param {Array} combinations
             * @param {Function} callback
             * @param {string|undefined} action
             * @returns void
             */
            self._bindMultiple = function(combinations, callback, action) {
                for (var i = 0; i < combinations.length; ++i) {
                    _bindSingle(combinations[i], callback, action);
                }
            };

            // start!
            _addEvent(targetElement, 'keypress', _handleKeyEvent);
            _addEvent(targetElement, 'keydown', _handleKeyEvent);
            _addEvent(targetElement, 'keyup', _handleKeyEvent);
        }

        /**
         * binds an event to mousetrap
         *
         * can be a single key, a combination of keys separated with +,
         * an array of keys, or a sequence of keys separated by spaces
         *
         * be sure to list the modifier keys first to make sure that the
         * correct key ends up getting bound (the last key in the pattern)
         *
         * @param {string|Array} keys
         * @param {Function} callback
         * @param {string=} action - 'keypress', 'keydown', or 'keyup'
         * @returns void
         */
        Mousetrap.prototype.bind = function(keys, callback, action) {
            var self = this;
            keys = keys instanceof Array ? keys : [keys];
            self._bindMultiple.call(self, keys, callback, action);
            return self;
        };

        /**
         * unbinds an event to mousetrap
         *
         * the unbinding sets the callback function of the specified key combo
         * to an empty function and deletes the corresponding key in the
         * _directMap dict.
         *
         * TODO: actually remove this from the _callbacks dictionary instead
         * of binding an empty function
         *
         * the keycombo+action has to be exactly the same as
         * it was defined in the bind method
         *
         * @param {string|Array} keys
         * @param {string} action
         * @returns void
         */
        Mousetrap.prototype.unbind = function(keys, action) {
            var self = this;
            return self.bind.call(self, keys, function() {}, action);
        };

        /**
         * triggers an event that has already been bound
         *
         * @param {string} keys
         * @param {string=} action
         * @returns void
         */
        Mousetrap.prototype.trigger = function(keys, action) {
            var self = this;
            if (self._directMap[keys + ':' + action]) {
                self._directMap[keys + ':' + action]({}, keys);
            }
            return self;
        };

        /**
         * resets the library back to its initial state.  this is useful
         * if you want to clear out the current keyboard shortcuts and bind
         * new ones - for example if you switch to another page
         *
         * @returns void
         */
        Mousetrap.prototype.reset = function() {
            var self = this;
            self._callbacks = {};
            self._directMap = {};
            return self;
        };

        /**
         * should we stop this event before firing off callbacks
         *
         * @param {Event} e
         * @param {Element} element
         * @return {boolean}
         */
        Mousetrap.prototype.stopCallback = function(e, element) {
            var self = this;

            // if the element has the class "mousetrap" then no need to stop
            if ((' ' + element.className + ' ').indexOf(' mousetrap ') > -1) {
                return false;
            }

            if (_belongsTo(element, self.target)) {
                return false;
            }

            // Events originating from a shadow DOM are re-targetted and `e.target` is the shadow host,
            // not the initial event target in the shadow tree. Note that not all events cross the
            // shadow boundary.
            // For shadow trees with `mode: 'open'`, the initial event target is the first element in
            // the event’s composed path. For shadow trees with `mode: 'closed'`, the initial event
            // target cannot be obtained.
            if ('composedPath' in e && typeof e.composedPath === 'function') {
                // For open shadow trees, update `element` so that the following check works.
                var initialEventTarget = e.composedPath()[0];
                if (initialEventTarget !== e.target) {
                    element = initialEventTarget;
                }
            }

            // stop for input, select, and textarea
            return element.tagName == 'INPUT' || element.tagName == 'SELECT' || element.tagName == 'TEXTAREA' || element.isContentEditable;
        };

        /**
         * exposes _handleKey publicly so it can be overwritten by extensions
         */
        Mousetrap.prototype.handleKey = function() {
            var self = this;
            return self._handleKey.apply(self, arguments);
        };

        /**
         * allow custom key mappings
         */
        Mousetrap.addKeycodes = function(object) {
            for (var key in object) {
                if (object.hasOwnProperty(key)) {
                    _MAP[key] = object[key];
                }
            }
            _REVERSE_MAP = null;
        };

        /**
         * Init the global mousetrap functions
         *
         * This method is needed to allow the global mousetrap functions to work
         * now that mousetrap is a constructor function.
         */
        Mousetrap.init = function() {
            var documentMousetrap = Mousetrap(document);
            for (var method in documentMousetrap) {
                if (method.charAt(0) !== '_') {
                    Mousetrap[method] = (function(method) {
                        return function() {
                            return documentMousetrap[method].apply(documentMousetrap, arguments);
                        };
                    } (method));
                }
            }
        };

        Mousetrap.init();

        // expose mousetrap to the global object
        window.Mousetrap = Mousetrap;

        // expose as a common js module
        if (module.exports) {
            module.exports = Mousetrap;
        }

        // expose mousetrap as an AMD module
        if (typeof undefined$1 === 'function' && undefined$1.amd) {
            undefined$1(function() {
                return Mousetrap;
            });
        }
    }) (typeof window !== 'undefined' ? window : null, typeof  window !== 'undefined' ? document : null);
    });

    const isFunc = (v) => typeof v === 'function';
    const isArr = Array.isArray;

    const listen = (arr, mousetrap) => {
      const result = [];
      let v2, f1;
      let i = 0;
      arr.forEach((v1, k) => {
        if (isArr(v1)) result.push(v1), ++i;
        else {
    (v2 = arr[k + 1]), (f1 = isFunc(v1));

          if (!result[i]) result[i] = [[], []];
          result[i][!f1 ? 0 : 1].push(v1);

          if (v2 && f1 && !isFunc(v2)) ++i;
        }
      });

      result.forEach((arr) => {
        if (arr.length !== 2) listen(arr, mousetrap);
        else {
          const types = arr[0],
            fns = isArr(arr[1]) ? arr[1] : [arr[1]];

          mousetrap.bind(types, (...a) => fns.forEach((fn) => fn(...a)));
        }
      });
    };

    function use(
      _node,
      arr
    )


     {
      const mousetrap$1 = new mousetrap(window.document);

      const destroy = () => {
        mousetrap$1.reset();
      };

      const update = (arr) => {
        destroy(), listen(arr, mousetrap$1);
      };

      update(arr);
      return { update, destroy }
    }

    var top = 'top';
    var bottom = 'bottom';
    var right = 'right';
    var left = 'left';
    var auto = 'auto';
    var basePlacements = [top, bottom, right, left];
    var start$1 = 'start';
    var end = 'end';
    var clippingParents = 'clippingParents';
    var viewport = 'viewport';
    var popper = 'popper';
    var reference = 'reference';
    var variationPlacements = /*#__PURE__*/basePlacements.reduce(function (acc, placement) {
      return acc.concat([placement + "-" + start$1, placement + "-" + end]);
    }, []);
    var placements = /*#__PURE__*/[].concat(basePlacements, [auto]).reduce(function (acc, placement) {
      return acc.concat([placement, placement + "-" + start$1, placement + "-" + end]);
    }, []); // modifiers that need to read the DOM

    var beforeRead = 'beforeRead';
    var read = 'read';
    var afterRead = 'afterRead'; // pure-logic modifiers

    var beforeMain = 'beforeMain';
    var main = 'main';
    var afterMain = 'afterMain'; // modifier with the purpose to write to the DOM (or write into a framework state)

    var beforeWrite = 'beforeWrite';
    var write = 'write';
    var afterWrite = 'afterWrite';
    var modifierPhases = [beforeRead, read, afterRead, beforeMain, main, afterMain, beforeWrite, write, afterWrite];

    function getNodeName(element) {
      return element ? (element.nodeName || '').toLowerCase() : null;
    }

    function getWindow(node) {
      if (node == null) {
        return window;
      }

      if (node.toString() !== '[object Window]') {
        var ownerDocument = node.ownerDocument;
        return ownerDocument ? ownerDocument.defaultView || window : window;
      }

      return node;
    }

    function isElement(node) {
      var OwnElement = getWindow(node).Element;
      return node instanceof OwnElement || node instanceof Element;
    }

    function isHTMLElement(node) {
      var OwnElement = getWindow(node).HTMLElement;
      return node instanceof OwnElement || node instanceof HTMLElement;
    }

    function isShadowRoot(node) {
      // IE 11 has no ShadowRoot
      if (typeof ShadowRoot === 'undefined') {
        return false;
      }

      var OwnElement = getWindow(node).ShadowRoot;
      return node instanceof OwnElement || node instanceof ShadowRoot;
    }

    // and applies them to the HTMLElements such as popper and arrow

    function applyStyles(_ref) {
      var state = _ref.state;
      Object.keys(state.elements).forEach(function (name) {
        var style = state.styles[name] || {};
        var attributes = state.attributes[name] || {};
        var element = state.elements[name]; // arrow is optional + virtual elements

        if (!isHTMLElement(element) || !getNodeName(element)) {
          return;
        } // Flow doesn't support to extend this property, but it's the most
        // effective way to apply styles to an HTMLElement
        // $FlowFixMe[cannot-write]


        Object.assign(element.style, style);
        Object.keys(attributes).forEach(function (name) {
          var value = attributes[name];

          if (value === false) {
            element.removeAttribute(name);
          } else {
            element.setAttribute(name, value === true ? '' : value);
          }
        });
      });
    }

    function effect$2(_ref2) {
      var state = _ref2.state;
      var initialStyles = {
        popper: {
          position: state.options.strategy,
          left: '0',
          top: '0',
          margin: '0'
        },
        arrow: {
          position: 'absolute'
        },
        reference: {}
      };
      Object.assign(state.elements.popper.style, initialStyles.popper);
      state.styles = initialStyles;

      if (state.elements.arrow) {
        Object.assign(state.elements.arrow.style, initialStyles.arrow);
      }

      return function () {
        Object.keys(state.elements).forEach(function (name) {
          var element = state.elements[name];
          var attributes = state.attributes[name] || {};
          var styleProperties = Object.keys(state.styles.hasOwnProperty(name) ? state.styles[name] : initialStyles[name]); // Set all values to an empty string to unset them

          var style = styleProperties.reduce(function (style, property) {
            style[property] = '';
            return style;
          }, {}); // arrow is optional + virtual elements

          if (!isHTMLElement(element) || !getNodeName(element)) {
            return;
          }

          Object.assign(element.style, style);
          Object.keys(attributes).forEach(function (attribute) {
            element.removeAttribute(attribute);
          });
        });
      };
    } // eslint-disable-next-line import/no-unused-modules


    var applyStyles$1 = {
      name: 'applyStyles',
      enabled: true,
      phase: 'write',
      fn: applyStyles,
      effect: effect$2,
      requires: ['computeStyles']
    };

    function getBasePlacement(placement) {
      return placement.split('-')[0];
    }

    var max = Math.max;
    var min = Math.min;
    var round = Math.round;

    function getBoundingClientRect(element, includeScale) {
      if (includeScale === void 0) {
        includeScale = false;
      }

      var rect = element.getBoundingClientRect();
      var scaleX = 1;
      var scaleY = 1;

      if (isHTMLElement(element) && includeScale) {
        var offsetHeight = element.offsetHeight;
        var offsetWidth = element.offsetWidth; // Do not attempt to divide by 0, otherwise we get `Infinity` as scale
        // Fallback to 1 in case both values are `0`

        if (offsetWidth > 0) {
          scaleX = round(rect.width) / offsetWidth || 1;
        }

        if (offsetHeight > 0) {
          scaleY = round(rect.height) / offsetHeight || 1;
        }
      }

      return {
        width: rect.width / scaleX,
        height: rect.height / scaleY,
        top: rect.top / scaleY,
        right: rect.right / scaleX,
        bottom: rect.bottom / scaleY,
        left: rect.left / scaleX,
        x: rect.left / scaleX,
        y: rect.top / scaleY
      };
    }

    // means it doesn't take into account transforms.

    function getLayoutRect(element) {
      var clientRect = getBoundingClientRect(element); // Use the clientRect sizes if it's not been transformed.
      // Fixes https://github.com/popperjs/popper-core/issues/1223

      var width = element.offsetWidth;
      var height = element.offsetHeight;

      if (Math.abs(clientRect.width - width) <= 1) {
        width = clientRect.width;
      }

      if (Math.abs(clientRect.height - height) <= 1) {
        height = clientRect.height;
      }

      return {
        x: element.offsetLeft,
        y: element.offsetTop,
        width: width,
        height: height
      };
    }

    function contains(parent, child) {
      var rootNode = child.getRootNode && child.getRootNode(); // First, attempt with faster native method

      if (parent.contains(child)) {
        return true;
      } // then fallback to custom implementation with Shadow DOM support
      else if (rootNode && isShadowRoot(rootNode)) {
          var next = child;

          do {
            if (next && parent.isSameNode(next)) {
              return true;
            } // $FlowFixMe[prop-missing]: need a better way to handle this...


            next = next.parentNode || next.host;
          } while (next);
        } // Give up, the result is false


      return false;
    }

    function getComputedStyle$1(element) {
      return getWindow(element).getComputedStyle(element);
    }

    function isTableElement(element) {
      return ['table', 'td', 'th'].indexOf(getNodeName(element)) >= 0;
    }

    function getDocumentElement(element) {
      // $FlowFixMe[incompatible-return]: assume body is always available
      return ((isElement(element) ? element.ownerDocument : // $FlowFixMe[prop-missing]
      element.document) || window.document).documentElement;
    }

    function getParentNode(element) {
      if (getNodeName(element) === 'html') {
        return element;
      }

      return (// this is a quicker (but less type safe) way to save quite some bytes from the bundle
        // $FlowFixMe[incompatible-return]
        // $FlowFixMe[prop-missing]
        element.assignedSlot || // step into the shadow DOM of the parent of a slotted node
        element.parentNode || ( // DOM Element detected
        isShadowRoot(element) ? element.host : null) || // ShadowRoot detected
        // $FlowFixMe[incompatible-call]: HTMLElement is a Node
        getDocumentElement(element) // fallback

      );
    }

    function getTrueOffsetParent(element) {
      if (!isHTMLElement(element) || // https://github.com/popperjs/popper-core/issues/837
      getComputedStyle$1(element).position === 'fixed') {
        return null;
      }

      return element.offsetParent;
    } // `.offsetParent` reports `null` for fixed elements, while absolute elements
    // return the containing block


    function getContainingBlock(element) {
      var isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') !== -1;
      var isIE = navigator.userAgent.indexOf('Trident') !== -1;

      if (isIE && isHTMLElement(element)) {
        // In IE 9, 10 and 11 fixed elements containing block is always established by the viewport
        var elementCss = getComputedStyle$1(element);

        if (elementCss.position === 'fixed') {
          return null;
        }
      }

      var currentNode = getParentNode(element);

      if (isShadowRoot(currentNode)) {
        currentNode = currentNode.host;
      }

      while (isHTMLElement(currentNode) && ['html', 'body'].indexOf(getNodeName(currentNode)) < 0) {
        var css = getComputedStyle$1(currentNode); // This is non-exhaustive but covers the most common CSS properties that
        // create a containing block.
        // https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block#identifying_the_containing_block

        if (css.transform !== 'none' || css.perspective !== 'none' || css.contain === 'paint' || ['transform', 'perspective'].indexOf(css.willChange) !== -1 || isFirefox && css.willChange === 'filter' || isFirefox && css.filter && css.filter !== 'none') {
          return currentNode;
        } else {
          currentNode = currentNode.parentNode;
        }
      }

      return null;
    } // Gets the closest ancestor positioned element. Handles some edge cases,
    // such as table ancestors and cross browser bugs.


    function getOffsetParent(element) {
      var window = getWindow(element);
      var offsetParent = getTrueOffsetParent(element);

      while (offsetParent && isTableElement(offsetParent) && getComputedStyle$1(offsetParent).position === 'static') {
        offsetParent = getTrueOffsetParent(offsetParent);
      }

      if (offsetParent && (getNodeName(offsetParent) === 'html' || getNodeName(offsetParent) === 'body' && getComputedStyle$1(offsetParent).position === 'static')) {
        return window;
      }

      return offsetParent || getContainingBlock(element) || window;
    }

    function getMainAxisFromPlacement(placement) {
      return ['top', 'bottom'].indexOf(placement) >= 0 ? 'x' : 'y';
    }

    function within(min$1, value, max$1) {
      return max(min$1, min(value, max$1));
    }
    function withinMaxClamp(min, value, max) {
      var v = within(min, value, max);
      return v > max ? max : v;
    }

    function getFreshSideObject() {
      return {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
      };
    }

    function mergePaddingObject(paddingObject) {
      return Object.assign({}, getFreshSideObject(), paddingObject);
    }

    function expandToHashMap(value, keys) {
      return keys.reduce(function (hashMap, key) {
        hashMap[key] = value;
        return hashMap;
      }, {});
    }

    var toPaddingObject = function toPaddingObject(padding, state) {
      padding = typeof padding === 'function' ? padding(Object.assign({}, state.rects, {
        placement: state.placement
      })) : padding;
      return mergePaddingObject(typeof padding !== 'number' ? padding : expandToHashMap(padding, basePlacements));
    };

    function arrow(_ref) {
      var _state$modifiersData$;

      var state = _ref.state,
          name = _ref.name,
          options = _ref.options;
      var arrowElement = state.elements.arrow;
      var popperOffsets = state.modifiersData.popperOffsets;
      var basePlacement = getBasePlacement(state.placement);
      var axis = getMainAxisFromPlacement(basePlacement);
      var isVertical = [left, right].indexOf(basePlacement) >= 0;
      var len = isVertical ? 'height' : 'width';

      if (!arrowElement || !popperOffsets) {
        return;
      }

      var paddingObject = toPaddingObject(options.padding, state);
      var arrowRect = getLayoutRect(arrowElement);
      var minProp = axis === 'y' ? top : left;
      var maxProp = axis === 'y' ? bottom : right;
      var endDiff = state.rects.reference[len] + state.rects.reference[axis] - popperOffsets[axis] - state.rects.popper[len];
      var startDiff = popperOffsets[axis] - state.rects.reference[axis];
      var arrowOffsetParent = getOffsetParent(arrowElement);
      var clientSize = arrowOffsetParent ? axis === 'y' ? arrowOffsetParent.clientHeight || 0 : arrowOffsetParent.clientWidth || 0 : 0;
      var centerToReference = endDiff / 2 - startDiff / 2; // Make sure the arrow doesn't overflow the popper if the center point is
      // outside of the popper bounds

      var min = paddingObject[minProp];
      var max = clientSize - arrowRect[len] - paddingObject[maxProp];
      var center = clientSize / 2 - arrowRect[len] / 2 + centerToReference;
      var offset = within(min, center, max); // Prevents breaking syntax highlighting...

      var axisProp = axis;
      state.modifiersData[name] = (_state$modifiersData$ = {}, _state$modifiersData$[axisProp] = offset, _state$modifiersData$.centerOffset = offset - center, _state$modifiersData$);
    }

    function effect$1(_ref2) {
      var state = _ref2.state,
          options = _ref2.options;
      var _options$element = options.element,
          arrowElement = _options$element === void 0 ? '[data-popper-arrow]' : _options$element;

      if (arrowElement == null) {
        return;
      } // CSS selector


      if (typeof arrowElement === 'string') {
        arrowElement = state.elements.popper.querySelector(arrowElement);

        if (!arrowElement) {
          return;
        }
      }

      if (process.env.NODE_ENV !== "production") {
        if (!isHTMLElement(arrowElement)) {
          console.error(['Popper: "arrow" element must be an HTMLElement (not an SVGElement).', 'To use an SVG arrow, wrap it in an HTMLElement that will be used as', 'the arrow.'].join(' '));
        }
      }

      if (!contains(state.elements.popper, arrowElement)) {
        if (process.env.NODE_ENV !== "production") {
          console.error(['Popper: "arrow" modifier\'s `element` must be a child of the popper', 'element.'].join(' '));
        }

        return;
      }

      state.elements.arrow = arrowElement;
    } // eslint-disable-next-line import/no-unused-modules


    var arrow$1 = {
      name: 'arrow',
      enabled: true,
      phase: 'main',
      fn: arrow,
      effect: effect$1,
      requires: ['popperOffsets'],
      requiresIfExists: ['preventOverflow']
    };

    function getVariation(placement) {
      return placement.split('-')[1];
    }

    var unsetSides = {
      top: 'auto',
      right: 'auto',
      bottom: 'auto',
      left: 'auto'
    }; // Round the offsets to the nearest suitable subpixel based on the DPR.
    // Zooming can change the DPR, but it seems to report a value that will
    // cleanly divide the values into the appropriate subpixels.

    function roundOffsetsByDPR(_ref) {
      var x = _ref.x,
          y = _ref.y;
      var win = window;
      var dpr = win.devicePixelRatio || 1;
      return {
        x: round(x * dpr) / dpr || 0,
        y: round(y * dpr) / dpr || 0
      };
    }

    function mapToStyles(_ref2) {
      var _Object$assign2;

      var popper = _ref2.popper,
          popperRect = _ref2.popperRect,
          placement = _ref2.placement,
          variation = _ref2.variation,
          offsets = _ref2.offsets,
          position = _ref2.position,
          gpuAcceleration = _ref2.gpuAcceleration,
          adaptive = _ref2.adaptive,
          roundOffsets = _ref2.roundOffsets,
          isFixed = _ref2.isFixed;
      var _offsets$x = offsets.x,
          x = _offsets$x === void 0 ? 0 : _offsets$x,
          _offsets$y = offsets.y,
          y = _offsets$y === void 0 ? 0 : _offsets$y;

      var _ref3 = typeof roundOffsets === 'function' ? roundOffsets({
        x: x,
        y: y
      }) : {
        x: x,
        y: y
      };

      x = _ref3.x;
      y = _ref3.y;
      var hasX = offsets.hasOwnProperty('x');
      var hasY = offsets.hasOwnProperty('y');
      var sideX = left;
      var sideY = top;
      var win = window;

      if (adaptive) {
        var offsetParent = getOffsetParent(popper);
        var heightProp = 'clientHeight';
        var widthProp = 'clientWidth';

        if (offsetParent === getWindow(popper)) {
          offsetParent = getDocumentElement(popper);

          if (getComputedStyle$1(offsetParent).position !== 'static' && position === 'absolute') {
            heightProp = 'scrollHeight';
            widthProp = 'scrollWidth';
          }
        } // $FlowFixMe[incompatible-cast]: force type refinement, we compare offsetParent with window above, but Flow doesn't detect it


        offsetParent = offsetParent;

        if (placement === top || (placement === left || placement === right) && variation === end) {
          sideY = bottom;
          var offsetY = isFixed && offsetParent === win && win.visualViewport ? win.visualViewport.height : // $FlowFixMe[prop-missing]
          offsetParent[heightProp];
          y -= offsetY - popperRect.height;
          y *= gpuAcceleration ? 1 : -1;
        }

        if (placement === left || (placement === top || placement === bottom) && variation === end) {
          sideX = right;
          var offsetX = isFixed && offsetParent === win && win.visualViewport ? win.visualViewport.width : // $FlowFixMe[prop-missing]
          offsetParent[widthProp];
          x -= offsetX - popperRect.width;
          x *= gpuAcceleration ? 1 : -1;
        }
      }

      var commonStyles = Object.assign({
        position: position
      }, adaptive && unsetSides);

      var _ref4 = roundOffsets === true ? roundOffsetsByDPR({
        x: x,
        y: y
      }) : {
        x: x,
        y: y
      };

      x = _ref4.x;
      y = _ref4.y;

      if (gpuAcceleration) {
        var _Object$assign;

        return Object.assign({}, commonStyles, (_Object$assign = {}, _Object$assign[sideY] = hasY ? '0' : '', _Object$assign[sideX] = hasX ? '0' : '', _Object$assign.transform = (win.devicePixelRatio || 1) <= 1 ? "translate(" + x + "px, " + y + "px)" : "translate3d(" + x + "px, " + y + "px, 0)", _Object$assign));
      }

      return Object.assign({}, commonStyles, (_Object$assign2 = {}, _Object$assign2[sideY] = hasY ? y + "px" : '', _Object$assign2[sideX] = hasX ? x + "px" : '', _Object$assign2.transform = '', _Object$assign2));
    }

    function computeStyles(_ref5) {
      var state = _ref5.state,
          options = _ref5.options;
      var _options$gpuAccelerat = options.gpuAcceleration,
          gpuAcceleration = _options$gpuAccelerat === void 0 ? true : _options$gpuAccelerat,
          _options$adaptive = options.adaptive,
          adaptive = _options$adaptive === void 0 ? true : _options$adaptive,
          _options$roundOffsets = options.roundOffsets,
          roundOffsets = _options$roundOffsets === void 0 ? true : _options$roundOffsets;

      if (process.env.NODE_ENV !== "production") {
        var transitionProperty = getComputedStyle$1(state.elements.popper).transitionProperty || '';

        if (adaptive && ['transform', 'top', 'right', 'bottom', 'left'].some(function (property) {
          return transitionProperty.indexOf(property) >= 0;
        })) {
          console.warn(['Popper: Detected CSS transitions on at least one of the following', 'CSS properties: "transform", "top", "right", "bottom", "left".', '\n\n', 'Disable the "computeStyles" modifier\'s `adaptive` option to allow', 'for smooth transitions, or remove these properties from the CSS', 'transition declaration on the popper element if only transitioning', 'opacity or background-color for example.', '\n\n', 'We recommend using the popper element as a wrapper around an inner', 'element that can have any CSS property transitioned for animations.'].join(' '));
        }
      }

      var commonStyles = {
        placement: getBasePlacement(state.placement),
        variation: getVariation(state.placement),
        popper: state.elements.popper,
        popperRect: state.rects.popper,
        gpuAcceleration: gpuAcceleration,
        isFixed: state.options.strategy === 'fixed'
      };

      if (state.modifiersData.popperOffsets != null) {
        state.styles.popper = Object.assign({}, state.styles.popper, mapToStyles(Object.assign({}, commonStyles, {
          offsets: state.modifiersData.popperOffsets,
          position: state.options.strategy,
          adaptive: adaptive,
          roundOffsets: roundOffsets
        })));
      }

      if (state.modifiersData.arrow != null) {
        state.styles.arrow = Object.assign({}, state.styles.arrow, mapToStyles(Object.assign({}, commonStyles, {
          offsets: state.modifiersData.arrow,
          position: 'absolute',
          adaptive: false,
          roundOffsets: roundOffsets
        })));
      }

      state.attributes.popper = Object.assign({}, state.attributes.popper, {
        'data-popper-placement': state.placement
      });
    } // eslint-disable-next-line import/no-unused-modules


    var computeStyles$1 = {
      name: 'computeStyles',
      enabled: true,
      phase: 'beforeWrite',
      fn: computeStyles,
      data: {}
    };

    var passive = {
      passive: true
    };

    function effect(_ref) {
      var state = _ref.state,
          instance = _ref.instance,
          options = _ref.options;
      var _options$scroll = options.scroll,
          scroll = _options$scroll === void 0 ? true : _options$scroll,
          _options$resize = options.resize,
          resize = _options$resize === void 0 ? true : _options$resize;
      var window = getWindow(state.elements.popper);
      var scrollParents = [].concat(state.scrollParents.reference, state.scrollParents.popper);

      if (scroll) {
        scrollParents.forEach(function (scrollParent) {
          scrollParent.addEventListener('scroll', instance.update, passive);
        });
      }

      if (resize) {
        window.addEventListener('resize', instance.update, passive);
      }

      return function () {
        if (scroll) {
          scrollParents.forEach(function (scrollParent) {
            scrollParent.removeEventListener('scroll', instance.update, passive);
          });
        }

        if (resize) {
          window.removeEventListener('resize', instance.update, passive);
        }
      };
    } // eslint-disable-next-line import/no-unused-modules


    var eventListeners = {
      name: 'eventListeners',
      enabled: true,
      phase: 'write',
      fn: function fn() {},
      effect: effect,
      data: {}
    };

    var hash$1 = {
      left: 'right',
      right: 'left',
      bottom: 'top',
      top: 'bottom'
    };
    function getOppositePlacement(placement) {
      return placement.replace(/left|right|bottom|top/g, function (matched) {
        return hash$1[matched];
      });
    }

    var hash = {
      start: 'end',
      end: 'start'
    };
    function getOppositeVariationPlacement(placement) {
      return placement.replace(/start|end/g, function (matched) {
        return hash[matched];
      });
    }

    function getWindowScroll(node) {
      var win = getWindow(node);
      var scrollLeft = win.pageXOffset;
      var scrollTop = win.pageYOffset;
      return {
        scrollLeft: scrollLeft,
        scrollTop: scrollTop
      };
    }

    function getWindowScrollBarX(element) {
      // If <html> has a CSS width greater than the viewport, then this will be
      // incorrect for RTL.
      // Popper 1 is broken in this case and never had a bug report so let's assume
      // it's not an issue. I don't think anyone ever specifies width on <html>
      // anyway.
      // Browsers where the left scrollbar doesn't cause an issue report `0` for
      // this (e.g. Edge 2019, IE11, Safari)
      return getBoundingClientRect(getDocumentElement(element)).left + getWindowScroll(element).scrollLeft;
    }

    function getViewportRect(element) {
      var win = getWindow(element);
      var html = getDocumentElement(element);
      var visualViewport = win.visualViewport;
      var width = html.clientWidth;
      var height = html.clientHeight;
      var x = 0;
      var y = 0; // NB: This isn't supported on iOS <= 12. If the keyboard is open, the popper
      // can be obscured underneath it.
      // Also, `html.clientHeight` adds the bottom bar height in Safari iOS, even
      // if it isn't open, so if this isn't available, the popper will be detected
      // to overflow the bottom of the screen too early.

      if (visualViewport) {
        width = visualViewport.width;
        height = visualViewport.height; // Uses Layout Viewport (like Chrome; Safari does not currently)
        // In Chrome, it returns a value very close to 0 (+/-) but contains rounding
        // errors due to floating point numbers, so we need to check precision.
        // Safari returns a number <= 0, usually < -1 when pinch-zoomed
        // Feature detection fails in mobile emulation mode in Chrome.
        // Math.abs(win.innerWidth / visualViewport.scale - visualViewport.width) <
        // 0.001
        // Fallback here: "Not Safari" userAgent

        if (!/^((?!chrome|android).)*safari/i.test(navigator.userAgent)) {
          x = visualViewport.offsetLeft;
          y = visualViewport.offsetTop;
        }
      }

      return {
        width: width,
        height: height,
        x: x + getWindowScrollBarX(element),
        y: y
      };
    }

    // of the `<html>` and `<body>` rect bounds if horizontally scrollable

    function getDocumentRect(element) {
      var _element$ownerDocumen;

      var html = getDocumentElement(element);
      var winScroll = getWindowScroll(element);
      var body = (_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body;
      var width = max(html.scrollWidth, html.clientWidth, body ? body.scrollWidth : 0, body ? body.clientWidth : 0);
      var height = max(html.scrollHeight, html.clientHeight, body ? body.scrollHeight : 0, body ? body.clientHeight : 0);
      var x = -winScroll.scrollLeft + getWindowScrollBarX(element);
      var y = -winScroll.scrollTop;

      if (getComputedStyle$1(body || html).direction === 'rtl') {
        x += max(html.clientWidth, body ? body.clientWidth : 0) - width;
      }

      return {
        width: width,
        height: height,
        x: x,
        y: y
      };
    }

    function isScrollParent(element) {
      // Firefox wants us to check `-x` and `-y` variations as well
      var _getComputedStyle = getComputedStyle$1(element),
          overflow = _getComputedStyle.overflow,
          overflowX = _getComputedStyle.overflowX,
          overflowY = _getComputedStyle.overflowY;

      return /auto|scroll|overlay|hidden/.test(overflow + overflowY + overflowX);
    }

    function getScrollParent(node) {
      if (['html', 'body', '#document'].indexOf(getNodeName(node)) >= 0) {
        // $FlowFixMe[incompatible-return]: assume body is always available
        return node.ownerDocument.body;
      }

      if (isHTMLElement(node) && isScrollParent(node)) {
        return node;
      }

      return getScrollParent(getParentNode(node));
    }

    /*
    given a DOM element, return the list of all scroll parents, up the list of ancesors
    until we get to the top window object. This list is what we attach scroll listeners
    to, because if any of these parent elements scroll, we'll need to re-calculate the
    reference element's position.
    */

    function listScrollParents(element, list) {
      var _element$ownerDocumen;

      if (list === void 0) {
        list = [];
      }

      var scrollParent = getScrollParent(element);
      var isBody = scrollParent === ((_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body);
      var win = getWindow(scrollParent);
      var target = isBody ? [win].concat(win.visualViewport || [], isScrollParent(scrollParent) ? scrollParent : []) : scrollParent;
      var updatedList = list.concat(target);
      return isBody ? updatedList : // $FlowFixMe[incompatible-call]: isBody tells us target will be an HTMLElement here
      updatedList.concat(listScrollParents(getParentNode(target)));
    }

    function rectToClientRect(rect) {
      return Object.assign({}, rect, {
        left: rect.x,
        top: rect.y,
        right: rect.x + rect.width,
        bottom: rect.y + rect.height
      });
    }

    function getInnerBoundingClientRect(element) {
      var rect = getBoundingClientRect(element);
      rect.top = rect.top + element.clientTop;
      rect.left = rect.left + element.clientLeft;
      rect.bottom = rect.top + element.clientHeight;
      rect.right = rect.left + element.clientWidth;
      rect.width = element.clientWidth;
      rect.height = element.clientHeight;
      rect.x = rect.left;
      rect.y = rect.top;
      return rect;
    }

    function getClientRectFromMixedType(element, clippingParent) {
      return clippingParent === viewport ? rectToClientRect(getViewportRect(element)) : isElement(clippingParent) ? getInnerBoundingClientRect(clippingParent) : rectToClientRect(getDocumentRect(getDocumentElement(element)));
    } // A "clipping parent" is an overflowable container with the characteristic of
    // clipping (or hiding) overflowing elements with a position different from
    // `initial`


    function getClippingParents(element) {
      var clippingParents = listScrollParents(getParentNode(element));
      var canEscapeClipping = ['absolute', 'fixed'].indexOf(getComputedStyle$1(element).position) >= 0;
      var clipperElement = canEscapeClipping && isHTMLElement(element) ? getOffsetParent(element) : element;

      if (!isElement(clipperElement)) {
        return [];
      } // $FlowFixMe[incompatible-return]: https://github.com/facebook/flow/issues/1414


      return clippingParents.filter(function (clippingParent) {
        return isElement(clippingParent) && contains(clippingParent, clipperElement) && getNodeName(clippingParent) !== 'body';
      });
    } // Gets the maximum area that the element is visible in due to any number of
    // clipping parents


    function getClippingRect(element, boundary, rootBoundary) {
      var mainClippingParents = boundary === 'clippingParents' ? getClippingParents(element) : [].concat(boundary);
      var clippingParents = [].concat(mainClippingParents, [rootBoundary]);
      var firstClippingParent = clippingParents[0];
      var clippingRect = clippingParents.reduce(function (accRect, clippingParent) {
        var rect = getClientRectFromMixedType(element, clippingParent);
        accRect.top = max(rect.top, accRect.top);
        accRect.right = min(rect.right, accRect.right);
        accRect.bottom = min(rect.bottom, accRect.bottom);
        accRect.left = max(rect.left, accRect.left);
        return accRect;
      }, getClientRectFromMixedType(element, firstClippingParent));
      clippingRect.width = clippingRect.right - clippingRect.left;
      clippingRect.height = clippingRect.bottom - clippingRect.top;
      clippingRect.x = clippingRect.left;
      clippingRect.y = clippingRect.top;
      return clippingRect;
    }

    function computeOffsets(_ref) {
      var reference = _ref.reference,
          element = _ref.element,
          placement = _ref.placement;
      var basePlacement = placement ? getBasePlacement(placement) : null;
      var variation = placement ? getVariation(placement) : null;
      var commonX = reference.x + reference.width / 2 - element.width / 2;
      var commonY = reference.y + reference.height / 2 - element.height / 2;
      var offsets;

      switch (basePlacement) {
        case top:
          offsets = {
            x: commonX,
            y: reference.y - element.height
          };
          break;

        case bottom:
          offsets = {
            x: commonX,
            y: reference.y + reference.height
          };
          break;

        case right:
          offsets = {
            x: reference.x + reference.width,
            y: commonY
          };
          break;

        case left:
          offsets = {
            x: reference.x - element.width,
            y: commonY
          };
          break;

        default:
          offsets = {
            x: reference.x,
            y: reference.y
          };
      }

      var mainAxis = basePlacement ? getMainAxisFromPlacement(basePlacement) : null;

      if (mainAxis != null) {
        var len = mainAxis === 'y' ? 'height' : 'width';

        switch (variation) {
          case start$1:
            offsets[mainAxis] = offsets[mainAxis] - (reference[len] / 2 - element[len] / 2);
            break;

          case end:
            offsets[mainAxis] = offsets[mainAxis] + (reference[len] / 2 - element[len] / 2);
            break;
        }
      }

      return offsets;
    }

    function detectOverflow(state, options) {
      if (options === void 0) {
        options = {};
      }

      var _options = options,
          _options$placement = _options.placement,
          placement = _options$placement === void 0 ? state.placement : _options$placement,
          _options$boundary = _options.boundary,
          boundary = _options$boundary === void 0 ? clippingParents : _options$boundary,
          _options$rootBoundary = _options.rootBoundary,
          rootBoundary = _options$rootBoundary === void 0 ? viewport : _options$rootBoundary,
          _options$elementConte = _options.elementContext,
          elementContext = _options$elementConte === void 0 ? popper : _options$elementConte,
          _options$altBoundary = _options.altBoundary,
          altBoundary = _options$altBoundary === void 0 ? false : _options$altBoundary,
          _options$padding = _options.padding,
          padding = _options$padding === void 0 ? 0 : _options$padding;
      var paddingObject = mergePaddingObject(typeof padding !== 'number' ? padding : expandToHashMap(padding, basePlacements));
      var altContext = elementContext === popper ? reference : popper;
      var popperRect = state.rects.popper;
      var element = state.elements[altBoundary ? altContext : elementContext];
      var clippingClientRect = getClippingRect(isElement(element) ? element : element.contextElement || getDocumentElement(state.elements.popper), boundary, rootBoundary);
      var referenceClientRect = getBoundingClientRect(state.elements.reference);
      var popperOffsets = computeOffsets({
        reference: referenceClientRect,
        element: popperRect,
        strategy: 'absolute',
        placement: placement
      });
      var popperClientRect = rectToClientRect(Object.assign({}, popperRect, popperOffsets));
      var elementClientRect = elementContext === popper ? popperClientRect : referenceClientRect; // positive = overflowing the clipping rect
      // 0 or negative = within the clipping rect

      var overflowOffsets = {
        top: clippingClientRect.top - elementClientRect.top + paddingObject.top,
        bottom: elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom,
        left: clippingClientRect.left - elementClientRect.left + paddingObject.left,
        right: elementClientRect.right - clippingClientRect.right + paddingObject.right
      };
      var offsetData = state.modifiersData.offset; // Offsets can be applied only to the popper element

      if (elementContext === popper && offsetData) {
        var offset = offsetData[placement];
        Object.keys(overflowOffsets).forEach(function (key) {
          var multiply = [right, bottom].indexOf(key) >= 0 ? 1 : -1;
          var axis = [top, bottom].indexOf(key) >= 0 ? 'y' : 'x';
          overflowOffsets[key] += offset[axis] * multiply;
        });
      }

      return overflowOffsets;
    }

    function computeAutoPlacement(state, options) {
      if (options === void 0) {
        options = {};
      }

      var _options = options,
          placement = _options.placement,
          boundary = _options.boundary,
          rootBoundary = _options.rootBoundary,
          padding = _options.padding,
          flipVariations = _options.flipVariations,
          _options$allowedAutoP = _options.allowedAutoPlacements,
          allowedAutoPlacements = _options$allowedAutoP === void 0 ? placements : _options$allowedAutoP;
      var variation = getVariation(placement);
      var placements$1 = variation ? flipVariations ? variationPlacements : variationPlacements.filter(function (placement) {
        return getVariation(placement) === variation;
      }) : basePlacements;
      var allowedPlacements = placements$1.filter(function (placement) {
        return allowedAutoPlacements.indexOf(placement) >= 0;
      });

      if (allowedPlacements.length === 0) {
        allowedPlacements = placements$1;

        if (process.env.NODE_ENV !== "production") {
          console.error(['Popper: The `allowedAutoPlacements` option did not allow any', 'placements. Ensure the `placement` option matches the variation', 'of the allowed placements.', 'For example, "auto" cannot be used to allow "bottom-start".', 'Use "auto-start" instead.'].join(' '));
        }
      } // $FlowFixMe[incompatible-type]: Flow seems to have problems with two array unions...


      var overflows = allowedPlacements.reduce(function (acc, placement) {
        acc[placement] = detectOverflow(state, {
          placement: placement,
          boundary: boundary,
          rootBoundary: rootBoundary,
          padding: padding
        })[getBasePlacement(placement)];
        return acc;
      }, {});
      return Object.keys(overflows).sort(function (a, b) {
        return overflows[a] - overflows[b];
      });
    }

    function getExpandedFallbackPlacements(placement) {
      if (getBasePlacement(placement) === auto) {
        return [];
      }

      var oppositePlacement = getOppositePlacement(placement);
      return [getOppositeVariationPlacement(placement), oppositePlacement, getOppositeVariationPlacement(oppositePlacement)];
    }

    function flip(_ref) {
      var state = _ref.state,
          options = _ref.options,
          name = _ref.name;

      if (state.modifiersData[name]._skip) {
        return;
      }

      var _options$mainAxis = options.mainAxis,
          checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis,
          _options$altAxis = options.altAxis,
          checkAltAxis = _options$altAxis === void 0 ? true : _options$altAxis,
          specifiedFallbackPlacements = options.fallbackPlacements,
          padding = options.padding,
          boundary = options.boundary,
          rootBoundary = options.rootBoundary,
          altBoundary = options.altBoundary,
          _options$flipVariatio = options.flipVariations,
          flipVariations = _options$flipVariatio === void 0 ? true : _options$flipVariatio,
          allowedAutoPlacements = options.allowedAutoPlacements;
      var preferredPlacement = state.options.placement;
      var basePlacement = getBasePlacement(preferredPlacement);
      var isBasePlacement = basePlacement === preferredPlacement;
      var fallbackPlacements = specifiedFallbackPlacements || (isBasePlacement || !flipVariations ? [getOppositePlacement(preferredPlacement)] : getExpandedFallbackPlacements(preferredPlacement));
      var placements = [preferredPlacement].concat(fallbackPlacements).reduce(function (acc, placement) {
        return acc.concat(getBasePlacement(placement) === auto ? computeAutoPlacement(state, {
          placement: placement,
          boundary: boundary,
          rootBoundary: rootBoundary,
          padding: padding,
          flipVariations: flipVariations,
          allowedAutoPlacements: allowedAutoPlacements
        }) : placement);
      }, []);
      var referenceRect = state.rects.reference;
      var popperRect = state.rects.popper;
      var checksMap = new Map();
      var makeFallbackChecks = true;
      var firstFittingPlacement = placements[0];

      for (var i = 0; i < placements.length; i++) {
        var placement = placements[i];

        var _basePlacement = getBasePlacement(placement);

        var isStartVariation = getVariation(placement) === start$1;
        var isVertical = [top, bottom].indexOf(_basePlacement) >= 0;
        var len = isVertical ? 'width' : 'height';
        var overflow = detectOverflow(state, {
          placement: placement,
          boundary: boundary,
          rootBoundary: rootBoundary,
          altBoundary: altBoundary,
          padding: padding
        });
        var mainVariationSide = isVertical ? isStartVariation ? right : left : isStartVariation ? bottom : top;

        if (referenceRect[len] > popperRect[len]) {
          mainVariationSide = getOppositePlacement(mainVariationSide);
        }

        var altVariationSide = getOppositePlacement(mainVariationSide);
        var checks = [];

        if (checkMainAxis) {
          checks.push(overflow[_basePlacement] <= 0);
        }

        if (checkAltAxis) {
          checks.push(overflow[mainVariationSide] <= 0, overflow[altVariationSide] <= 0);
        }

        if (checks.every(function (check) {
          return check;
        })) {
          firstFittingPlacement = placement;
          makeFallbackChecks = false;
          break;
        }

        checksMap.set(placement, checks);
      }

      if (makeFallbackChecks) {
        // `2` may be desired in some cases – research later
        var numberOfChecks = flipVariations ? 3 : 1;

        var _loop = function _loop(_i) {
          var fittingPlacement = placements.find(function (placement) {
            var checks = checksMap.get(placement);

            if (checks) {
              return checks.slice(0, _i).every(function (check) {
                return check;
              });
            }
          });

          if (fittingPlacement) {
            firstFittingPlacement = fittingPlacement;
            return "break";
          }
        };

        for (var _i = numberOfChecks; _i > 0; _i--) {
          var _ret = _loop(_i);

          if (_ret === "break") break;
        }
      }

      if (state.placement !== firstFittingPlacement) {
        state.modifiersData[name]._skip = true;
        state.placement = firstFittingPlacement;
        state.reset = true;
      }
    } // eslint-disable-next-line import/no-unused-modules


    var flip$1 = {
      name: 'flip',
      enabled: true,
      phase: 'main',
      fn: flip,
      requiresIfExists: ['offset'],
      data: {
        _skip: false
      }
    };

    function getSideOffsets(overflow, rect, preventedOffsets) {
      if (preventedOffsets === void 0) {
        preventedOffsets = {
          x: 0,
          y: 0
        };
      }

      return {
        top: overflow.top - rect.height - preventedOffsets.y,
        right: overflow.right - rect.width + preventedOffsets.x,
        bottom: overflow.bottom - rect.height + preventedOffsets.y,
        left: overflow.left - rect.width - preventedOffsets.x
      };
    }

    function isAnySideFullyClipped(overflow) {
      return [top, right, bottom, left].some(function (side) {
        return overflow[side] >= 0;
      });
    }

    function hide(_ref) {
      var state = _ref.state,
          name = _ref.name;
      var referenceRect = state.rects.reference;
      var popperRect = state.rects.popper;
      var preventedOffsets = state.modifiersData.preventOverflow;
      var referenceOverflow = detectOverflow(state, {
        elementContext: 'reference'
      });
      var popperAltOverflow = detectOverflow(state, {
        altBoundary: true
      });
      var referenceClippingOffsets = getSideOffsets(referenceOverflow, referenceRect);
      var popperEscapeOffsets = getSideOffsets(popperAltOverflow, popperRect, preventedOffsets);
      var isReferenceHidden = isAnySideFullyClipped(referenceClippingOffsets);
      var hasPopperEscaped = isAnySideFullyClipped(popperEscapeOffsets);
      state.modifiersData[name] = {
        referenceClippingOffsets: referenceClippingOffsets,
        popperEscapeOffsets: popperEscapeOffsets,
        isReferenceHidden: isReferenceHidden,
        hasPopperEscaped: hasPopperEscaped
      };
      state.attributes.popper = Object.assign({}, state.attributes.popper, {
        'data-popper-reference-hidden': isReferenceHidden,
        'data-popper-escaped': hasPopperEscaped
      });
    } // eslint-disable-next-line import/no-unused-modules


    var hide$1 = {
      name: 'hide',
      enabled: true,
      phase: 'main',
      requiresIfExists: ['preventOverflow'],
      fn: hide
    };

    function distanceAndSkiddingToXY(placement, rects, offset) {
      var basePlacement = getBasePlacement(placement);
      var invertDistance = [left, top].indexOf(basePlacement) >= 0 ? -1 : 1;

      var _ref = typeof offset === 'function' ? offset(Object.assign({}, rects, {
        placement: placement
      })) : offset,
          skidding = _ref[0],
          distance = _ref[1];

      skidding = skidding || 0;
      distance = (distance || 0) * invertDistance;
      return [left, right].indexOf(basePlacement) >= 0 ? {
        x: distance,
        y: skidding
      } : {
        x: skidding,
        y: distance
      };
    }

    function offset(_ref2) {
      var state = _ref2.state,
          options = _ref2.options,
          name = _ref2.name;
      var _options$offset = options.offset,
          offset = _options$offset === void 0 ? [0, 0] : _options$offset;
      var data = placements.reduce(function (acc, placement) {
        acc[placement] = distanceAndSkiddingToXY(placement, state.rects, offset);
        return acc;
      }, {});
      var _data$state$placement = data[state.placement],
          x = _data$state$placement.x,
          y = _data$state$placement.y;

      if (state.modifiersData.popperOffsets != null) {
        state.modifiersData.popperOffsets.x += x;
        state.modifiersData.popperOffsets.y += y;
      }

      state.modifiersData[name] = data;
    } // eslint-disable-next-line import/no-unused-modules


    var offset$1 = {
      name: 'offset',
      enabled: true,
      phase: 'main',
      requires: ['popperOffsets'],
      fn: offset
    };

    function popperOffsets(_ref) {
      var state = _ref.state,
          name = _ref.name;
      // Offsets are the actual position the popper needs to have to be
      // properly positioned near its reference element
      // This is the most basic placement, and will be adjusted by
      // the modifiers in the next step
      state.modifiersData[name] = computeOffsets({
        reference: state.rects.reference,
        element: state.rects.popper,
        strategy: 'absolute',
        placement: state.placement
      });
    } // eslint-disable-next-line import/no-unused-modules


    var popperOffsets$1 = {
      name: 'popperOffsets',
      enabled: true,
      phase: 'read',
      fn: popperOffsets,
      data: {}
    };

    function getAltAxis(axis) {
      return axis === 'x' ? 'y' : 'x';
    }

    function preventOverflow(_ref) {
      var state = _ref.state,
          options = _ref.options,
          name = _ref.name;
      var _options$mainAxis = options.mainAxis,
          checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis,
          _options$altAxis = options.altAxis,
          checkAltAxis = _options$altAxis === void 0 ? false : _options$altAxis,
          boundary = options.boundary,
          rootBoundary = options.rootBoundary,
          altBoundary = options.altBoundary,
          padding = options.padding,
          _options$tether = options.tether,
          tether = _options$tether === void 0 ? true : _options$tether,
          _options$tetherOffset = options.tetherOffset,
          tetherOffset = _options$tetherOffset === void 0 ? 0 : _options$tetherOffset;
      var overflow = detectOverflow(state, {
        boundary: boundary,
        rootBoundary: rootBoundary,
        padding: padding,
        altBoundary: altBoundary
      });
      var basePlacement = getBasePlacement(state.placement);
      var variation = getVariation(state.placement);
      var isBasePlacement = !variation;
      var mainAxis = getMainAxisFromPlacement(basePlacement);
      var altAxis = getAltAxis(mainAxis);
      var popperOffsets = state.modifiersData.popperOffsets;
      var referenceRect = state.rects.reference;
      var popperRect = state.rects.popper;
      var tetherOffsetValue = typeof tetherOffset === 'function' ? tetherOffset(Object.assign({}, state.rects, {
        placement: state.placement
      })) : tetherOffset;
      var normalizedTetherOffsetValue = typeof tetherOffsetValue === 'number' ? {
        mainAxis: tetherOffsetValue,
        altAxis: tetherOffsetValue
      } : Object.assign({
        mainAxis: 0,
        altAxis: 0
      }, tetherOffsetValue);
      var offsetModifierState = state.modifiersData.offset ? state.modifiersData.offset[state.placement] : null;
      var data = {
        x: 0,
        y: 0
      };

      if (!popperOffsets) {
        return;
      }

      if (checkMainAxis) {
        var _offsetModifierState$;

        var mainSide = mainAxis === 'y' ? top : left;
        var altSide = mainAxis === 'y' ? bottom : right;
        var len = mainAxis === 'y' ? 'height' : 'width';
        var offset = popperOffsets[mainAxis];
        var min$1 = offset + overflow[mainSide];
        var max$1 = offset - overflow[altSide];
        var additive = tether ? -popperRect[len] / 2 : 0;
        var minLen = variation === start$1 ? referenceRect[len] : popperRect[len];
        var maxLen = variation === start$1 ? -popperRect[len] : -referenceRect[len]; // We need to include the arrow in the calculation so the arrow doesn't go
        // outside the reference bounds

        var arrowElement = state.elements.arrow;
        var arrowRect = tether && arrowElement ? getLayoutRect(arrowElement) : {
          width: 0,
          height: 0
        };
        var arrowPaddingObject = state.modifiersData['arrow#persistent'] ? state.modifiersData['arrow#persistent'].padding : getFreshSideObject();
        var arrowPaddingMin = arrowPaddingObject[mainSide];
        var arrowPaddingMax = arrowPaddingObject[altSide]; // If the reference length is smaller than the arrow length, we don't want
        // to include its full size in the calculation. If the reference is small
        // and near the edge of a boundary, the popper can overflow even if the
        // reference is not overflowing as well (e.g. virtual elements with no
        // width or height)

        var arrowLen = within(0, referenceRect[len], arrowRect[len]);
        var minOffset = isBasePlacement ? referenceRect[len] / 2 - additive - arrowLen - arrowPaddingMin - normalizedTetherOffsetValue.mainAxis : minLen - arrowLen - arrowPaddingMin - normalizedTetherOffsetValue.mainAxis;
        var maxOffset = isBasePlacement ? -referenceRect[len] / 2 + additive + arrowLen + arrowPaddingMax + normalizedTetherOffsetValue.mainAxis : maxLen + arrowLen + arrowPaddingMax + normalizedTetherOffsetValue.mainAxis;
        var arrowOffsetParent = state.elements.arrow && getOffsetParent(state.elements.arrow);
        var clientOffset = arrowOffsetParent ? mainAxis === 'y' ? arrowOffsetParent.clientTop || 0 : arrowOffsetParent.clientLeft || 0 : 0;
        var offsetModifierValue = (_offsetModifierState$ = offsetModifierState == null ? void 0 : offsetModifierState[mainAxis]) != null ? _offsetModifierState$ : 0;
        var tetherMin = offset + minOffset - offsetModifierValue - clientOffset;
        var tetherMax = offset + maxOffset - offsetModifierValue;
        var preventedOffset = within(tether ? min(min$1, tetherMin) : min$1, offset, tether ? max(max$1, tetherMax) : max$1);
        popperOffsets[mainAxis] = preventedOffset;
        data[mainAxis] = preventedOffset - offset;
      }

      if (checkAltAxis) {
        var _offsetModifierState$2;

        var _mainSide = mainAxis === 'x' ? top : left;

        var _altSide = mainAxis === 'x' ? bottom : right;

        var _offset = popperOffsets[altAxis];

        var _len = altAxis === 'y' ? 'height' : 'width';

        var _min = _offset + overflow[_mainSide];

        var _max = _offset - overflow[_altSide];

        var isOriginSide = [top, left].indexOf(basePlacement) !== -1;

        var _offsetModifierValue = (_offsetModifierState$2 = offsetModifierState == null ? void 0 : offsetModifierState[altAxis]) != null ? _offsetModifierState$2 : 0;

        var _tetherMin = isOriginSide ? _min : _offset - referenceRect[_len] - popperRect[_len] - _offsetModifierValue + normalizedTetherOffsetValue.altAxis;

        var _tetherMax = isOriginSide ? _offset + referenceRect[_len] + popperRect[_len] - _offsetModifierValue - normalizedTetherOffsetValue.altAxis : _max;

        var _preventedOffset = tether && isOriginSide ? withinMaxClamp(_tetherMin, _offset, _tetherMax) : within(tether ? _tetherMin : _min, _offset, tether ? _tetherMax : _max);

        popperOffsets[altAxis] = _preventedOffset;
        data[altAxis] = _preventedOffset - _offset;
      }

      state.modifiersData[name] = data;
    } // eslint-disable-next-line import/no-unused-modules


    var preventOverflow$1 = {
      name: 'preventOverflow',
      enabled: true,
      phase: 'main',
      fn: preventOverflow,
      requiresIfExists: ['offset']
    };

    function getHTMLElementScroll(element) {
      return {
        scrollLeft: element.scrollLeft,
        scrollTop: element.scrollTop
      };
    }

    function getNodeScroll(node) {
      if (node === getWindow(node) || !isHTMLElement(node)) {
        return getWindowScroll(node);
      } else {
        return getHTMLElementScroll(node);
      }
    }

    function isElementScaled(element) {
      var rect = element.getBoundingClientRect();
      var scaleX = round(rect.width) / element.offsetWidth || 1;
      var scaleY = round(rect.height) / element.offsetHeight || 1;
      return scaleX !== 1 || scaleY !== 1;
    } // Returns the composite rect of an element relative to its offsetParent.
    // Composite means it takes into account transforms as well as layout.


    function getCompositeRect(elementOrVirtualElement, offsetParent, isFixed) {
      if (isFixed === void 0) {
        isFixed = false;
      }

      var isOffsetParentAnElement = isHTMLElement(offsetParent);
      var offsetParentIsScaled = isHTMLElement(offsetParent) && isElementScaled(offsetParent);
      var documentElement = getDocumentElement(offsetParent);
      var rect = getBoundingClientRect(elementOrVirtualElement, offsetParentIsScaled);
      var scroll = {
        scrollLeft: 0,
        scrollTop: 0
      };
      var offsets = {
        x: 0,
        y: 0
      };

      if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
        if (getNodeName(offsetParent) !== 'body' || // https://github.com/popperjs/popper-core/issues/1078
        isScrollParent(documentElement)) {
          scroll = getNodeScroll(offsetParent);
        }

        if (isHTMLElement(offsetParent)) {
          offsets = getBoundingClientRect(offsetParent, true);
          offsets.x += offsetParent.clientLeft;
          offsets.y += offsetParent.clientTop;
        } else if (documentElement) {
          offsets.x = getWindowScrollBarX(documentElement);
        }
      }

      return {
        x: rect.left + scroll.scrollLeft - offsets.x,
        y: rect.top + scroll.scrollTop - offsets.y,
        width: rect.width,
        height: rect.height
      };
    }

    function order(modifiers) {
      var map = new Map();
      var visited = new Set();
      var result = [];
      modifiers.forEach(function (modifier) {
        map.set(modifier.name, modifier);
      }); // On visiting object, check for its dependencies and visit them recursively

      function sort(modifier) {
        visited.add(modifier.name);
        var requires = [].concat(modifier.requires || [], modifier.requiresIfExists || []);
        requires.forEach(function (dep) {
          if (!visited.has(dep)) {
            var depModifier = map.get(dep);

            if (depModifier) {
              sort(depModifier);
            }
          }
        });
        result.push(modifier);
      }

      modifiers.forEach(function (modifier) {
        if (!visited.has(modifier.name)) {
          // check for visited object
          sort(modifier);
        }
      });
      return result;
    }

    function orderModifiers(modifiers) {
      // order based on dependencies
      var orderedModifiers = order(modifiers); // order based on phase

      return modifierPhases.reduce(function (acc, phase) {
        return acc.concat(orderedModifiers.filter(function (modifier) {
          return modifier.phase === phase;
        }));
      }, []);
    }

    function debounce(fn) {
      var pending;
      return function () {
        if (!pending) {
          pending = new Promise(function (resolve) {
            Promise.resolve().then(function () {
              pending = undefined;
              resolve(fn());
            });
          });
        }

        return pending;
      };
    }

    function format(str) {
      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      return [].concat(args).reduce(function (p, c) {
        return p.replace(/%s/, c);
      }, str);
    }

    var INVALID_MODIFIER_ERROR = 'Popper: modifier "%s" provided an invalid %s property, expected %s but got %s';
    var MISSING_DEPENDENCY_ERROR = 'Popper: modifier "%s" requires "%s", but "%s" modifier is not available';
    var VALID_PROPERTIES = ['name', 'enabled', 'phase', 'fn', 'effect', 'requires', 'options'];
    function validateModifiers(modifiers) {
      modifiers.forEach(function (modifier) {
        [].concat(Object.keys(modifier), VALID_PROPERTIES) // IE11-compatible replacement for `new Set(iterable)`
        .filter(function (value, index, self) {
          return self.indexOf(value) === index;
        }).forEach(function (key) {
          switch (key) {
            case 'name':
              if (typeof modifier.name !== 'string') {
                console.error(format(INVALID_MODIFIER_ERROR, String(modifier.name), '"name"', '"string"', "\"" + String(modifier.name) + "\""));
              }

              break;

            case 'enabled':
              if (typeof modifier.enabled !== 'boolean') {
                console.error(format(INVALID_MODIFIER_ERROR, modifier.name, '"enabled"', '"boolean"', "\"" + String(modifier.enabled) + "\""));
              }

              break;

            case 'phase':
              if (modifierPhases.indexOf(modifier.phase) < 0) {
                console.error(format(INVALID_MODIFIER_ERROR, modifier.name, '"phase"', "either " + modifierPhases.join(', '), "\"" + String(modifier.phase) + "\""));
              }

              break;

            case 'fn':
              if (typeof modifier.fn !== 'function') {
                console.error(format(INVALID_MODIFIER_ERROR, modifier.name, '"fn"', '"function"', "\"" + String(modifier.fn) + "\""));
              }

              break;

            case 'effect':
              if (modifier.effect != null && typeof modifier.effect !== 'function') {
                console.error(format(INVALID_MODIFIER_ERROR, modifier.name, '"effect"', '"function"', "\"" + String(modifier.fn) + "\""));
              }

              break;

            case 'requires':
              if (modifier.requires != null && !Array.isArray(modifier.requires)) {
                console.error(format(INVALID_MODIFIER_ERROR, modifier.name, '"requires"', '"array"', "\"" + String(modifier.requires) + "\""));
              }

              break;

            case 'requiresIfExists':
              if (!Array.isArray(modifier.requiresIfExists)) {
                console.error(format(INVALID_MODIFIER_ERROR, modifier.name, '"requiresIfExists"', '"array"', "\"" + String(modifier.requiresIfExists) + "\""));
              }

              break;

            case 'options':
            case 'data':
              break;

            default:
              console.error("PopperJS: an invalid property has been provided to the \"" + modifier.name + "\" modifier, valid properties are " + VALID_PROPERTIES.map(function (s) {
                return "\"" + s + "\"";
              }).join(', ') + "; but \"" + key + "\" was provided.");
          }

          modifier.requires && modifier.requires.forEach(function (requirement) {
            if (modifiers.find(function (mod) {
              return mod.name === requirement;
            }) == null) {
              console.error(format(MISSING_DEPENDENCY_ERROR, String(modifier.name), requirement, requirement));
            }
          });
        });
      });
    }

    function uniqueBy(arr, fn) {
      var identifiers = new Set();
      return arr.filter(function (item) {
        var identifier = fn(item);

        if (!identifiers.has(identifier)) {
          identifiers.add(identifier);
          return true;
        }
      });
    }

    function mergeByName(modifiers) {
      var merged = modifiers.reduce(function (merged, current) {
        var existing = merged[current.name];
        merged[current.name] = existing ? Object.assign({}, existing, current, {
          options: Object.assign({}, existing.options, current.options),
          data: Object.assign({}, existing.data, current.data)
        }) : current;
        return merged;
      }, {}); // IE11 does not support Object.values

      return Object.keys(merged).map(function (key) {
        return merged[key];
      });
    }

    var INVALID_ELEMENT_ERROR = 'Popper: Invalid reference or popper argument provided. They must be either a DOM element or virtual element.';
    var INFINITE_LOOP_ERROR = 'Popper: An infinite loop in the modifiers cycle has been detected! The cycle has been interrupted to prevent a browser crash.';
    var DEFAULT_OPTIONS = {
      placement: 'bottom',
      modifiers: [],
      strategy: 'absolute'
    };

    function areValidElements() {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return !args.some(function (element) {
        return !(element && typeof element.getBoundingClientRect === 'function');
      });
    }

    function popperGenerator(generatorOptions) {
      if (generatorOptions === void 0) {
        generatorOptions = {};
      }

      var _generatorOptions = generatorOptions,
          _generatorOptions$def = _generatorOptions.defaultModifiers,
          defaultModifiers = _generatorOptions$def === void 0 ? [] : _generatorOptions$def,
          _generatorOptions$def2 = _generatorOptions.defaultOptions,
          defaultOptions = _generatorOptions$def2 === void 0 ? DEFAULT_OPTIONS : _generatorOptions$def2;
      return function createPopper(reference, popper, options) {
        if (options === void 0) {
          options = defaultOptions;
        }

        var state = {
          placement: 'bottom',
          orderedModifiers: [],
          options: Object.assign({}, DEFAULT_OPTIONS, defaultOptions),
          modifiersData: {},
          elements: {
            reference: reference,
            popper: popper
          },
          attributes: {},
          styles: {}
        };
        var effectCleanupFns = [];
        var isDestroyed = false;
        var instance = {
          state: state,
          setOptions: function setOptions(setOptionsAction) {
            var options = typeof setOptionsAction === 'function' ? setOptionsAction(state.options) : setOptionsAction;
            cleanupModifierEffects();
            state.options = Object.assign({}, defaultOptions, state.options, options);
            state.scrollParents = {
              reference: isElement(reference) ? listScrollParents(reference) : reference.contextElement ? listScrollParents(reference.contextElement) : [],
              popper: listScrollParents(popper)
            }; // Orders the modifiers based on their dependencies and `phase`
            // properties

            var orderedModifiers = orderModifiers(mergeByName([].concat(defaultModifiers, state.options.modifiers))); // Strip out disabled modifiers

            state.orderedModifiers = orderedModifiers.filter(function (m) {
              return m.enabled;
            }); // Validate the provided modifiers so that the consumer will get warned
            // if one of the modifiers is invalid for any reason

            if (process.env.NODE_ENV !== "production") {
              var modifiers = uniqueBy([].concat(orderedModifiers, state.options.modifiers), function (_ref) {
                var name = _ref.name;
                return name;
              });
              validateModifiers(modifiers);

              if (getBasePlacement(state.options.placement) === auto) {
                var flipModifier = state.orderedModifiers.find(function (_ref2) {
                  var name = _ref2.name;
                  return name === 'flip';
                });

                if (!flipModifier) {
                  console.error(['Popper: "auto" placements require the "flip" modifier be', 'present and enabled to work.'].join(' '));
                }
              }

              var _getComputedStyle = getComputedStyle$1(popper),
                  marginTop = _getComputedStyle.marginTop,
                  marginRight = _getComputedStyle.marginRight,
                  marginBottom = _getComputedStyle.marginBottom,
                  marginLeft = _getComputedStyle.marginLeft; // We no longer take into account `margins` on the popper, and it can
              // cause bugs with positioning, so we'll warn the consumer


              if ([marginTop, marginRight, marginBottom, marginLeft].some(function (margin) {
                return parseFloat(margin);
              })) {
                console.warn(['Popper: CSS "margin" styles cannot be used to apply padding', 'between the popper and its reference element or boundary.', 'To replicate margin, use the `offset` modifier, as well as', 'the `padding` option in the `preventOverflow` and `flip`', 'modifiers.'].join(' '));
              }
            }

            runModifierEffects();
            return instance.update();
          },
          // Sync update – it will always be executed, even if not necessary. This
          // is useful for low frequency updates where sync behavior simplifies the
          // logic.
          // For high frequency updates (e.g. `resize` and `scroll` events), always
          // prefer the async Popper#update method
          forceUpdate: function forceUpdate() {
            if (isDestroyed) {
              return;
            }

            var _state$elements = state.elements,
                reference = _state$elements.reference,
                popper = _state$elements.popper; // Don't proceed if `reference` or `popper` are not valid elements
            // anymore

            if (!areValidElements(reference, popper)) {
              if (process.env.NODE_ENV !== "production") {
                console.error(INVALID_ELEMENT_ERROR);
              }

              return;
            } // Store the reference and popper rects to be read by modifiers


            state.rects = {
              reference: getCompositeRect(reference, getOffsetParent(popper), state.options.strategy === 'fixed'),
              popper: getLayoutRect(popper)
            }; // Modifiers have the ability to reset the current update cycle. The
            // most common use case for this is the `flip` modifier changing the
            // placement, which then needs to re-run all the modifiers, because the
            // logic was previously ran for the previous placement and is therefore
            // stale/incorrect

            state.reset = false;
            state.placement = state.options.placement; // On each update cycle, the `modifiersData` property for each modifier
            // is filled with the initial data specified by the modifier. This means
            // it doesn't persist and is fresh on each update.
            // To ensure persistent data, use `${name}#persistent`

            state.orderedModifiers.forEach(function (modifier) {
              return state.modifiersData[modifier.name] = Object.assign({}, modifier.data);
            });
            var __debug_loops__ = 0;

            for (var index = 0; index < state.orderedModifiers.length; index++) {
              if (process.env.NODE_ENV !== "production") {
                __debug_loops__ += 1;

                if (__debug_loops__ > 100) {
                  console.error(INFINITE_LOOP_ERROR);
                  break;
                }
              }

              if (state.reset === true) {
                state.reset = false;
                index = -1;
                continue;
              }

              var _state$orderedModifie = state.orderedModifiers[index],
                  fn = _state$orderedModifie.fn,
                  _state$orderedModifie2 = _state$orderedModifie.options,
                  _options = _state$orderedModifie2 === void 0 ? {} : _state$orderedModifie2,
                  name = _state$orderedModifie.name;

              if (typeof fn === 'function') {
                state = fn({
                  state: state,
                  options: _options,
                  name: name,
                  instance: instance
                }) || state;
              }
            }
          },
          // Async and optimistically optimized update – it will not be executed if
          // not necessary (debounced to run at most once-per-tick)
          update: debounce(function () {
            return new Promise(function (resolve) {
              instance.forceUpdate();
              resolve(state);
            });
          }),
          destroy: function destroy() {
            cleanupModifierEffects();
            isDestroyed = true;
          }
        };

        if (!areValidElements(reference, popper)) {
          if (process.env.NODE_ENV !== "production") {
            console.error(INVALID_ELEMENT_ERROR);
          }

          return instance;
        }

        instance.setOptions(options).then(function (state) {
          if (!isDestroyed && options.onFirstUpdate) {
            options.onFirstUpdate(state);
          }
        }); // Modifiers have the ability to execute arbitrary code before the first
        // update cycle runs. They will be executed in the same order as the update
        // cycle. This is useful when a modifier adds some persistent data that
        // other modifiers need to use, but the modifier is run after the dependent
        // one.

        function runModifierEffects() {
          state.orderedModifiers.forEach(function (_ref3) {
            var name = _ref3.name,
                _ref3$options = _ref3.options,
                options = _ref3$options === void 0 ? {} : _ref3$options,
                effect = _ref3.effect;

            if (typeof effect === 'function') {
              var cleanupFn = effect({
                state: state,
                name: name,
                instance: instance,
                options: options
              });

              var noopFn = function noopFn() {};

              effectCleanupFns.push(cleanupFn || noopFn);
            }
          });
        }

        function cleanupModifierEffects() {
          effectCleanupFns.forEach(function (fn) {
            return fn();
          });
          effectCleanupFns = [];
        }

        return instance;
      };
    }

    var defaultModifiers = [eventListeners, popperOffsets$1, computeStyles$1, applyStyles$1, offset$1, flip$1, preventOverflow$1, arrow$1, hide$1];
    var createPopper = /*#__PURE__*/popperGenerator({
      defaultModifiers: defaultModifiers
    }); // eslint-disable-next-line import/no-unused-modules

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    var __assign$1 = function() {
        __assign$1 = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign$1.apply(this, arguments);
    };

    function createPopperActions(initOptions) {
        var popperInstance = null;
        var referenceNode;
        var contentNode;
        var options = initOptions;
        var initPopper = function () {
            if (referenceNode && contentNode) {
                popperInstance = createPopper(referenceNode, contentNode, options);
            }
        };
        var deinitPopper = function () {
            if (popperInstance) {
                popperInstance.destroy();
                popperInstance = null;
            }
        };
        var referenceAction = function (node) {
            referenceNode = node;
            initPopper();
            return {
                destroy: function () {
                    deinitPopper();
                },
            };
        };
        var contentAction = function (node, contentOptions) {
            contentNode = node;
            options = __assign$1(__assign$1({}, initOptions), contentOptions);
            initPopper();
            return {
                update: function (newContentOptions) {
                    options = __assign$1(__assign$1({}, initOptions), newContentOptions);
                    if (popperInstance && options) {
                        popperInstance.setOptions(options);
                    }
                },
                destroy: function () {
                    deinitPopper();
                },
            };
        };
        return [referenceAction, contentAction, function () { return popperInstance; }];
    }

    function fade(node, { delay = 0, duration = 400, easing = identity } = {}) {
        const o = +getComputedStyle(node).opacity;
        return {
            delay,
            duration,
            easing,
            css: t => `opacity: ${t * o}`
        };
    }

    /* src\components\common\Tooltip.svelte generated by Svelte v3.49.0 */
    const file$S = "src\\components\\common\\Tooltip.svelte";

    // (22:0) {#if show}
    function create_if_block$l(ctx) {
    	let div2;
    	let div0;
    	let t;
    	let div1;
    	let content_action;
    	let div2_intro;
    	let div2_outro;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[4].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[3], null);

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			if (default_slot) default_slot.c();
    			t = space();
    			div1 = element("div");
    			attr_dev(div0, "class", "tooltip-content");
    			add_location(div0, file$S, 29, 2, 499);
    			attr_dev(div1, "id", "arrow");
    			attr_dev(div1, "class", "arrow");
    			attr_dev(div1, "data-popper-arrow", "");
    			add_location(div1, file$S, 32, 2, 560);
    			attr_dev(div2, "id", "tooltip");
    			attr_dev(div2, "class", "tooltip");
    			add_location(div2, file$S, 22, 1, 357);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);

    			if (default_slot) {
    				default_slot.m(div0, null);
    			}

    			append_dev(div2, t);
    			append_dev(div2, div1);
    			current = true;

    			if (!mounted) {
    				dispose = action_destroyer(content_action = /*content*/ ctx[0].call(null, div2, /*options*/ ctx[1]));
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 8)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[3],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[3])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[3], dirty, null),
    						null
    					);
    				}
    			}

    			if (content_action && is_function(content_action.update) && dirty & /*options*/ 2) content_action.update.call(null, /*options*/ ctx[1]);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);

    			add_render_callback(() => {
    				if (div2_outro) div2_outro.end(1);
    				div2_intro = create_in_transition(div2, fade, { duration: 200 });
    				div2_intro.start();
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			if (div2_intro) div2_intro.invalidate();
    			div2_outro = create_out_transition(div2, fade, { duration: 50 });
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			if (default_slot) default_slot.d(detaching);
    			if (detaching && div2_outro) div2_outro.end();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$l.name,
    		type: "if",
    		source: "(22:0) {#if show}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$X(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*show*/ ctx[2] && create_if_block$l(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*show*/ ctx[2]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*show*/ 4) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$l(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$X.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$V($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Tooltip', slots, ['default']);
    	let { content } = $$props;

    	let { options = {
    		modifiers: [
    			{
    				name: 'offset',
    				options: { offset: [0, 6] }
    			}
    		]
    	} } = $$props;

    	let timeout;
    	let show;

    	onMount(async () => {
    		setTimeout(
    			() => {
    				$$invalidate(2, show = true);
    			},
    			1200
    		);
    	});

    	const writable_props = ['content', 'options'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Tooltip> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('content' in $$props) $$invalidate(0, content = $$props.content);
    		if ('options' in $$props) $$invalidate(1, options = $$props.options);
    		if ('$$scope' in $$props) $$invalidate(3, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		fade,
    		content,
    		options,
    		timeout,
    		show
    	});

    	$$self.$inject_state = $$props => {
    		if ('content' in $$props) $$invalidate(0, content = $$props.content);
    		if ('options' in $$props) $$invalidate(1, options = $$props.options);
    		if ('timeout' in $$props) timeout = $$props.timeout;
    		if ('show' in $$props) $$invalidate(2, show = $$props.show);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [content, options, show, $$scope, slots];
    }

    class Tooltip extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$V, create_fragment$X, safe_not_equal, { content: 0, options: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Tooltip",
    			options,
    			id: create_fragment$X.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*content*/ ctx[0] === undefined && !('content' in props)) {
    			console.warn("<Tooltip> was created without expected prop 'content'");
    		}
    	}

    	get content() {
    		throw new Error("<Tooltip>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set content(value) {
    		throw new Error("<Tooltip>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get options() {
    		throw new Error("<Tooltip>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set options(value) {
    		throw new Error("<Tooltip>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\common\Control.svelte generated by Svelte v3.49.0 */
    const file$R = "src\\components\\common\\Control.svelte";

    // (32:0) {#if showTooltip && !tips && tiptext}
    function create_if_block$k(ctx) {
    	let tooltip;
    	let current;

    	tooltip = new Tooltip({
    			props: {
    				content: /*popperContent*/ ctx[7],
    				$$slots: { default: [create_default_slot$d] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(tooltip.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(tooltip, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const tooltip_changes = {};

    			if (dirty & /*$$scope, tiptext*/ 4104) {
    				tooltip_changes.$$scope = { dirty, ctx };
    			}

    			tooltip.$set(tooltip_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tooltip.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tooltip.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(tooltip, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$k.name,
    		type: "if",
    		source: "(32:0) {#if showTooltip && !tips && tiptext}",
    		ctx
    	});

    	return block;
    }

    // (33:1) <Tooltip content={popperContent}>
    function create_default_slot$d(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*tiptext*/ ctx[3]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*tiptext*/ 8) set_data_dev(t, /*tiptext*/ ctx[3]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$d.name,
    		type: "slot",
    		source: "(33:1) <Tooltip content={popperContent}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$W(ctx) {
    	let button;
    	let t;
    	let if_block_anchor;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[8].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[12], null);
    	let if_block = /*showTooltip*/ ctx[5] && !/*tips*/ ctx[0] && /*tiptext*/ ctx[3] && create_if_block$k(ctx);

    	const block = {
    		c: function create() {
    			button = element("button");
    			if (default_slot) default_slot.c();
    			t = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    			set_style(button, "font-size", /*legacy*/ ctx[1] ? "14px" : /*size*/ ctx[2]);
    			attr_dev(button, "class", "control svelte-emr3ky");
    			toggle_class(button, "legacy", /*legacy*/ ctx[1]);
    			toggle_class(button, "persistent", /*persistent*/ ctx[4]);
    			add_location(button, file$R, 18, 0, 415);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (default_slot) {
    				default_slot.m(button, null);
    			}

    			insert_dev(target, t, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					action_destroyer(/*popperRef*/ ctx[6].call(null, button)),
    					listen_dev(button, "mouseenter", /*mouseenter_handler*/ ctx[10], false, false, false),
    					listen_dev(button, "mouseleave", /*mouseleave_handler*/ ctx[11], false, false, false),
    					listen_dev(button, "click", /*click_handler*/ ctx[9], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 4096)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[12],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[12])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[12], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*legacy, size*/ 6) {
    				set_style(button, "font-size", /*legacy*/ ctx[1] ? "14px" : /*size*/ ctx[2]);
    			}

    			if (dirty & /*legacy*/ 2) {
    				toggle_class(button, "legacy", /*legacy*/ ctx[1]);
    			}

    			if (dirty & /*persistent*/ 16) {
    				toggle_class(button, "persistent", /*persistent*/ ctx[4]);
    			}

    			if (/*showTooltip*/ ctx[5] && !/*tips*/ ctx[0] && /*tiptext*/ ctx[3]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*showTooltip, tips, tiptext*/ 41) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$k(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			if (default_slot) default_slot.d(detaching);
    			if (detaching) detach_dev(t);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$W.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$U($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Control', slots, ['default']);
    	const [popperRef, popperContent] = createPopperActions({ placement: 'bottom', strategy: 'fixed' });
    	let showTooltip = false;
    	let { tips = false } = $$props;
    	let { legacy = false } = $$props;
    	let { size = 14 } = $$props;
    	let { tiptext = false } = $$props;
    	let { persistent = false } = $$props;
    	const writable_props = ['tips', 'legacy', 'size', 'tiptext', 'persistent'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Control> was created with unknown prop '${key}'`);
    	});

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	const mouseenter_handler = () => $$invalidate(5, showTooltip = true);
    	const mouseleave_handler = () => $$invalidate(5, showTooltip = false);

    	$$self.$$set = $$props => {
    		if ('tips' in $$props) $$invalidate(0, tips = $$props.tips);
    		if ('legacy' in $$props) $$invalidate(1, legacy = $$props.legacy);
    		if ('size' in $$props) $$invalidate(2, size = $$props.size);
    		if ('tiptext' in $$props) $$invalidate(3, tiptext = $$props.tiptext);
    		if ('persistent' in $$props) $$invalidate(4, persistent = $$props.persistent);
    		if ('$$scope' in $$props) $$invalidate(12, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		createPopperActions,
    		Tooltip,
    		popperRef,
    		popperContent,
    		showTooltip,
    		tips,
    		legacy,
    		size,
    		tiptext,
    		persistent
    	});

    	$$self.$inject_state = $$props => {
    		if ('showTooltip' in $$props) $$invalidate(5, showTooltip = $$props.showTooltip);
    		if ('tips' in $$props) $$invalidate(0, tips = $$props.tips);
    		if ('legacy' in $$props) $$invalidate(1, legacy = $$props.legacy);
    		if ('size' in $$props) $$invalidate(2, size = $$props.size);
    		if ('tiptext' in $$props) $$invalidate(3, tiptext = $$props.tiptext);
    		if ('persistent' in $$props) $$invalidate(4, persistent = $$props.persistent);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		tips,
    		legacy,
    		size,
    		tiptext,
    		persistent,
    		showTooltip,
    		popperRef,
    		popperContent,
    		slots,
    		click_handler,
    		mouseenter_handler,
    		mouseleave_handler,
    		$$scope
    	];
    }

    class Control extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$U, create_fragment$W, safe_not_equal, {
    			tips: 0,
    			legacy: 1,
    			size: 2,
    			tiptext: 3,
    			persistent: 4
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Control",
    			options,
    			id: create_fragment$W.name
    		});
    	}

    	get tips() {
    		throw new Error("<Control>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tips(value) {
    		throw new Error("<Control>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get legacy() {
    		throw new Error("<Control>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set legacy(value) {
    		throw new Error("<Control>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<Control>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Control>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get tiptext() {
    		throw new Error("<Control>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tiptext(value) {
    		throw new Error("<Control>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get persistent() {
    		throw new Error("<Control>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set persistent(value) {
    		throw new Error("<Control>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\Titlebar.svelte generated by Svelte v3.49.0 */
    const file$Q = "src\\components\\Titlebar.svelte";

    // (56:3) {:else}
    function create_else_block$6(ctx) {
    	let i;

    	const block = {
    		c: function create() {
    			i = element("i");
    			attr_dev(i, "class", "fas fa-bars");
    			add_location(i, file$Q, 56, 7, 1335);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, i, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(i);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$6.name,
    		type: "else",
    		source: "(56:3) {:else}",
    		ctx
    	});

    	return block;
    }

    // (54:3) {#if settingsOpen}
    function create_if_block_4$4(ctx) {
    	let i;

    	const block = {
    		c: function create() {
    			i = element("i");
    			attr_dev(i, "class", "fas fa-times");
    			add_location(i, file$Q, 54, 7, 1286);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, i, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(i);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4$4.name,
    		type: "if",
    		source: "(54:3) {#if settingsOpen}",
    		ctx
    	});

    	return block;
    }

    // (44:2) <Control     {tips}     {legacy}     size="12px"     tiptext={settingsOpen ? "Close menu" : "Main menu"}     on:click={e => {      settingsOpen = !settingsOpen;      dispatch('settingsOpen', settingsOpen);     }}    >
    function create_default_slot_9$1(ctx) {
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if (/*settingsOpen*/ ctx[0]) return create_if_block_4$4;
    		return create_else_block$6;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type !== (current_block_type = select_block_type(ctx))) {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_9$1.name,
    		type: "slot",
    		source: "(44:2) <Control     {tips}     {legacy}     size=\\\"12px\\\"     tiptext={settingsOpen ? \\\"Close menu\\\" : \\\"Main menu\\\"}     on:click={e => {      settingsOpen = !settingsOpen;      dispatch('settingsOpen', settingsOpen);     }}    >",
    		ctx
    	});

    	return block;
    }

    // (61:2) {#if !settingsOpen}
    function create_if_block_1$8(ctx) {
    	let t;
    	let if_block1_anchor;
    	let current;
    	let if_block0 = (!/*fileSelected*/ ctx[1] || /*overwrite*/ ctx[4]) && create_if_block_3$4(ctx);
    	let if_block1 = /*fileSelected*/ ctx[1] && create_if_block_2$5(ctx);

    	const block = {
    		c: function create() {
    			if (if_block0) if_block0.c();
    			t = space();
    			if (if_block1) if_block1.c();
    			if_block1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, if_block1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (!/*fileSelected*/ ctx[1] || /*overwrite*/ ctx[4]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty & /*fileSelected, overwrite*/ 18) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_3$4(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(t.parentNode, t);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (/*fileSelected*/ ctx[1]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty & /*fileSelected*/ 2) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block_2$5(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(if_block1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$8.name,
    		type: "if",
    		source: "(61:2) {#if !settingsOpen}",
    		ctx
    	});

    	return block;
    }

    // (62:3) {#if !fileSelected || overwrite}
    function create_if_block_3$4(ctx) {
    	let control0;
    	let t;
    	let control1;
    	let current;

    	control0 = new Control({
    			props: {
    				tips: /*tips*/ ctx[3],
    				legacy: /*legacy*/ ctx[2],
    				size: "12px",
    				tiptext: "Select file",
    				$$slots: { default: [create_default_slot_8$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	control0.$on("click", /*openImage*/ ctx[10]);

    	control1 = new Control({
    			props: {
    				tips: /*tips*/ ctx[3],
    				legacy: /*legacy*/ ctx[2],
    				size: "12px",
    				tiptext: "Screenshot",
    				$$slots: { default: [create_default_slot_7$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	control1.$on("click", /*click_handler_1*/ ctx[14]);

    	const block = {
    		c: function create() {
    			create_component(control0.$$.fragment);
    			t = space();
    			create_component(control1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(control0, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(control1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const control0_changes = {};
    			if (dirty & /*tips*/ 8) control0_changes.tips = /*tips*/ ctx[3];
    			if (dirty & /*legacy*/ 4) control0_changes.legacy = /*legacy*/ ctx[2];

    			if (dirty & /*$$scope*/ 2097152) {
    				control0_changes.$$scope = { dirty, ctx };
    			}

    			control0.$set(control0_changes);
    			const control1_changes = {};
    			if (dirty & /*tips*/ 8) control1_changes.tips = /*tips*/ ctx[3];
    			if (dirty & /*legacy*/ 4) control1_changes.legacy = /*legacy*/ ctx[2];

    			if (dirty & /*$$scope*/ 2097152) {
    				control1_changes.$$scope = { dirty, ctx };
    			}

    			control1.$set(control1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(control0.$$.fragment, local);
    			transition_in(control1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(control0.$$.fragment, local);
    			transition_out(control1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(control0, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(control1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$4.name,
    		type: "if",
    		source: "(62:3) {#if !fileSelected || overwrite}",
    		ctx
    	});

    	return block;
    }

    // (63:4) <Control       {tips}       {legacy}       size="12px"       tiptext="Select file"       on:click={openImage}      >
    function create_default_slot_8$1(ctx) {
    	let i;

    	const block = {
    		c: function create() {
    			i = element("i");
    			attr_dev(i, "class", "fas fa-file-upload");
    			add_location(i, file$Q, 69, 5, 1577);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, i, anchor);
    		},
    		p: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(i);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_8$1.name,
    		type: "slot",
    		source: "(63:4) <Control       {tips}       {legacy}       size=\\\"12px\\\"       tiptext=\\\"Select file\\\"       on:click={openImage}      >",
    		ctx
    	});

    	return block;
    }

    // (73:4) <Control       {tips}       {legacy}       size="12px"       tiptext="Screenshot"       on:click={e => { ipcRenderer.send('screenshot'); }}      >
    function create_default_slot_7$1(ctx) {
    	let i;

    	const block = {
    		c: function create() {
    			i = element("i");
    			attr_dev(i, "class", "fas fa-crosshairs");
    			add_location(i, file$Q, 79, 8, 1791);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, i, anchor);
    		},
    		p: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(i);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_7$1.name,
    		type: "slot",
    		source: "(73:4) <Control       {tips}       {legacy}       size=\\\"12px\\\"       tiptext=\\\"Screenshot\\\"       on:click={e => { ipcRenderer.send('screenshot'); }}      >",
    		ctx
    	});

    	return block;
    }

    // (83:3) {#if fileSelected}
    function create_if_block_2$5(ctx) {
    	let control;
    	let current;

    	control = new Control({
    			props: {
    				tips: /*tips*/ ctx[3],
    				legacy: /*legacy*/ ctx[2],
    				size: "12px",
    				tiptext: "Clear",
    				$$slots: { default: [create_default_slot_6$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	control.$on("click", /*clearImage*/ ctx[11]);

    	const block = {
    		c: function create() {
    			create_component(control.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(control, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const control_changes = {};
    			if (dirty & /*tips*/ 8) control_changes.tips = /*tips*/ ctx[3];
    			if (dirty & /*legacy*/ 4) control_changes.legacy = /*legacy*/ ctx[2];

    			if (dirty & /*$$scope*/ 2097152) {
    				control_changes.$$scope = { dirty, ctx };
    			}

    			control.$set(control_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(control.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(control.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(control, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$5.name,
    		type: "if",
    		source: "(83:3) {#if fileSelected}",
    		ctx
    	});

    	return block;
    }

    // (84:4) <Control       {tips}       {legacy}       size="12px"       tiptext="Clear"       on:click={clearImage}      >
    function create_default_slot_6$1(ctx) {
    	let i;

    	const block = {
    		c: function create() {
    			i = element("i");
    			attr_dev(i, "class", "fas fa-trash");
    			add_location(i, file$Q, 90, 8, 2000);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, i, anchor);
    		},
    		p: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(i);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_6$1.name,
    		type: "slot",
    		source: "(84:4) <Control       {tips}       {legacy}       size=\\\"12px\\\"       tiptext=\\\"Clear\\\"       on:click={clearImage}      >",
    		ctx
    	});

    	return block;
    }

    // (97:2) {#if version}
    function create_if_block$j(ctx) {
    	let span;
    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t0 = text("v. ");
    			t1 = text(/*version*/ ctx[5]);
    			attr_dev(span, "class", "version svelte-1y8gu7w");
    			add_location(span, file$Q, 97, 3, 2125);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t0);
    			append_dev(span, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*version*/ 32) set_data_dev(t1, /*version*/ ctx[5]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$j.name,
    		type: "if",
    		source: "(97:2) {#if version}",
    		ctx
    	});

    	return block;
    }

    // (100:2) <Control     {tips}     {legacy}     size="12px"     tiptext="Make click-through"      on:click={e => { ipcRenderer.send('window', 'clickthrough'); }}    >
    function create_default_slot_5$1(ctx) {
    	let i;

    	const block = {
    		c: function create() {
    			i = element("i");
    			attr_dev(i, "class", "fas fa-ghost");
    			add_location(i, file$Q, 106, 6, 2342);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, i, anchor);
    		},
    		p: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(i);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_5$1.name,
    		type: "slot",
    		source: "(100:2) <Control     {tips}     {legacy}     size=\\\"12px\\\"     tiptext=\\\"Make click-through\\\"      on:click={e => { ipcRenderer.send('window', 'clickthrough'); }}    >",
    		ctx
    	});

    	return block;
    }

    // (109:2) <Control     {tips}     {legacy}     size="12px"     tiptext="New window"      on:click={e => { ipcRenderer.send('window', 'new'); }}    >
    function create_default_slot_4$2(ctx) {
    	let i;

    	const block = {
    		c: function create() {
    			i = element("i");
    			attr_dev(i, "class", "fas fa-window");
    			add_location(i, file$Q, 115, 6, 2534);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, i, anchor);
    		},
    		p: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(i);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4$2.name,
    		type: "slot",
    		source: "(109:2) <Control     {tips}     {legacy}     size=\\\"12px\\\"     tiptext=\\\"New window\\\"      on:click={e => { ipcRenderer.send('window', 'new'); }}    >",
    		ctx
    	});

    	return block;
    }

    // (118:2) <Control     {tips}     {legacy}     size="13px"     tiptext="Pin to top"      on:click={e => { ipcRenderer.send('window', 'pin'); }}    >
    function create_default_slot_3$2(ctx) {
    	let i;

    	const block = {
    		c: function create() {
    			i = element("i");
    			attr_dev(i, "class", "fas fa-thumbtack svelte-1y8gu7w");
    			toggle_class(i, "pinned", /*pinned*/ ctx[6]);
    			add_location(i, file$Q, 124, 6, 2727);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, i, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*pinned*/ 64) {
    				toggle_class(i, "pinned", /*pinned*/ ctx[6]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(i);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3$2.name,
    		type: "slot",
    		source: "(118:2) <Control     {tips}     {legacy}     size=\\\"13px\\\"     tiptext=\\\"Pin to top\\\"      on:click={e => { ipcRenderer.send('window', 'pin'); }}    >",
    		ctx
    	});

    	return block;
    }

    // (127:2) <Control     {tips}     {legacy}     tiptext="Minimize"     on:click={e => { ipcRenderer.send('window', 'minimize'); }}    >
    function create_default_slot_2$2(ctx) {
    	let i;

    	const block = {
    		c: function create() {
    			i = element("i");
    			attr_dev(i, "class", "fas fa-minus");
    			add_location(i, file$Q, 132, 6, 2922);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, i, anchor);
    		},
    		p: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(i);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$2.name,
    		type: "slot",
    		source: "(127:2) <Control     {tips}     {legacy}     tiptext=\\\"Minimize\\\"     on:click={e => { ipcRenderer.send('window', 'minimize'); }}    >",
    		ctx
    	});

    	return block;
    }

    // (135:2) <Control     {tips}     {legacy}     tiptext={maximized ? "Restore" : "Maximize"}     on:click={e => { ipcRenderer.send('window', 'maximize'); }}    >
    function create_default_slot_1$7(ctx) {
    	let i;

    	const block = {
    		c: function create() {
    			i = element("i");
    			attr_dev(i, "class", "fas fa-plus");
    			add_location(i, file$Q, 140, 3, 3123);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, i, anchor);
    		},
    		p: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(i);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$7.name,
    		type: "slot",
    		source: "(135:2) <Control     {tips}     {legacy}     tiptext={maximized ? \\\"Restore\\\" : \\\"Maximize\\\"}     on:click={e => { ipcRenderer.send('window', 'maximize'); }}    >",
    		ctx
    	});

    	return block;
    }

    // (143:2) <Control     {tips}     {legacy}     persistent={true}     tiptext="Close"     on:click={e => { ipcRenderer.send('window', 'close'); }}    >
    function create_default_slot$c(ctx) {
    	let i;

    	const block = {
    		c: function create() {
    			i = element("i");
    			attr_dev(i, "class", "fas fa-times");
    			add_location(i, file$Q, 149, 6, 3316);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, i, anchor);
    		},
    		p: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(i);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$c.name,
    		type: "slot",
    		source: "(143:2) <Control     {tips}     {legacy}     persistent={true}     tiptext=\\\"Close\\\"     on:click={e => { ipcRenderer.send('window', 'close'); }}    >",
    		ctx
    	});

    	return block;
    }

    function create_fragment$V(ctx) {
    	let div2;
    	let div0;
    	let control0;
    	let t0;
    	let t1;
    	let div1;
    	let t2;
    	let control1;
    	let t3;
    	let control2;
    	let t4;
    	let control3;
    	let t5;
    	let control4;
    	let t6;
    	let control5;
    	let t7;
    	let control6;
    	let current;
    	let mounted;
    	let dispose;

    	control0 = new Control({
    			props: {
    				tips: /*tips*/ ctx[3],
    				legacy: /*legacy*/ ctx[2],
    				size: "12px",
    				tiptext: /*settingsOpen*/ ctx[0] ? "Close menu" : "Main menu",
    				$$slots: { default: [create_default_slot_9$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	control0.$on("click", /*click_handler*/ ctx[13]);
    	let if_block0 = !/*settingsOpen*/ ctx[0] && create_if_block_1$8(ctx);
    	let if_block1 = /*version*/ ctx[5] && create_if_block$j(ctx);

    	control1 = new Control({
    			props: {
    				tips: /*tips*/ ctx[3],
    				legacy: /*legacy*/ ctx[2],
    				size: "12px",
    				tiptext: "Make click-through",
    				$$slots: { default: [create_default_slot_5$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	control1.$on("click", /*click_handler_2*/ ctx[15]);

    	control2 = new Control({
    			props: {
    				tips: /*tips*/ ctx[3],
    				legacy: /*legacy*/ ctx[2],
    				size: "12px",
    				tiptext: "New window",
    				$$slots: { default: [create_default_slot_4$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	control2.$on("click", /*click_handler_3*/ ctx[16]);

    	control3 = new Control({
    			props: {
    				tips: /*tips*/ ctx[3],
    				legacy: /*legacy*/ ctx[2],
    				size: "13px",
    				tiptext: "Pin to top",
    				$$slots: { default: [create_default_slot_3$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	control3.$on("click", /*click_handler_4*/ ctx[17]);

    	control4 = new Control({
    			props: {
    				tips: /*tips*/ ctx[3],
    				legacy: /*legacy*/ ctx[2],
    				tiptext: "Minimize",
    				$$slots: { default: [create_default_slot_2$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	control4.$on("click", /*click_handler_5*/ ctx[18]);

    	control5 = new Control({
    			props: {
    				tips: /*tips*/ ctx[3],
    				legacy: /*legacy*/ ctx[2],
    				tiptext: /*maximized*/ ctx[7] ? "Restore" : "Maximize",
    				$$slots: { default: [create_default_slot_1$7] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	control5.$on("click", /*click_handler_6*/ ctx[19]);

    	control6 = new Control({
    			props: {
    				tips: /*tips*/ ctx[3],
    				legacy: /*legacy*/ ctx[2],
    				persistent: true,
    				tiptext: "Close",
    				$$slots: { default: [create_default_slot$c] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	control6.$on("click", /*click_handler_7*/ ctx[20]);

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			create_component(control0.$$.fragment);
    			t0 = space();
    			if (if_block0) if_block0.c();
    			t1 = space();
    			div1 = element("div");
    			if (if_block1) if_block1.c();
    			t2 = space();
    			create_component(control1.$$.fragment);
    			t3 = space();
    			create_component(control2.$$.fragment);
    			t4 = space();
    			create_component(control3.$$.fragment);
    			t5 = space();
    			create_component(control4.$$.fragment);
    			t6 = space();
    			create_component(control5.$$.fragment);
    			t7 = space();
    			create_component(control6.$$.fragment);
    			attr_dev(div0, "class", "titlebar-group svelte-1y8gu7w");
    			add_location(div0, file$Q, 42, 1, 1005);
    			attr_dev(div1, "class", "titlebar-group svelte-1y8gu7w");
    			add_location(div1, file$Q, 95, 1, 2075);
    			attr_dev(div2, "class", "titlebar svelte-1y8gu7w");
    			toggle_class(div2, "legacy", /*legacy*/ ctx[2]);
    			add_location(div2, file$Q, 41, 0, 967);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			mount_component(control0, div0, null);
    			append_dev(div0, t0);
    			if (if_block0) if_block0.m(div0, null);
    			append_dev(div2, t1);
    			append_dev(div2, div1);
    			if (if_block1) if_block1.m(div1, null);
    			append_dev(div1, t2);
    			mount_component(control1, div1, null);
    			append_dev(div1, t3);
    			mount_component(control2, div1, null);
    			append_dev(div1, t4);
    			mount_component(control3, div1, null);
    			append_dev(div1, t5);
    			mount_component(control4, div1, null);
    			append_dev(div1, t6);
    			mount_component(control5, div1, null);
    			append_dev(div1, t7);
    			mount_component(control6, div1, null);
    			current = true;

    			if (!mounted) {
    				dispose = action_destroyer(use.call(null, window, [
    					['command+o', 'ctrl+o', /*openImage*/ ctx[10]],
    					['del', 'backspace', /*clearImage*/ ctx[11]],
    					['command+x', 'ctrl+x', /*cutImage*/ ctx[12]]
    				]));

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			const control0_changes = {};
    			if (dirty & /*tips*/ 8) control0_changes.tips = /*tips*/ ctx[3];
    			if (dirty & /*legacy*/ 4) control0_changes.legacy = /*legacy*/ ctx[2];
    			if (dirty & /*settingsOpen*/ 1) control0_changes.tiptext = /*settingsOpen*/ ctx[0] ? "Close menu" : "Main menu";

    			if (dirty & /*$$scope, settingsOpen*/ 2097153) {
    				control0_changes.$$scope = { dirty, ctx };
    			}

    			control0.$set(control0_changes);

    			if (!/*settingsOpen*/ ctx[0]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty & /*settingsOpen*/ 1) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_1$8(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(div0, null);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (/*version*/ ctx[5]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block$j(ctx);
    					if_block1.c();
    					if_block1.m(div1, t2);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			const control1_changes = {};
    			if (dirty & /*tips*/ 8) control1_changes.tips = /*tips*/ ctx[3];
    			if (dirty & /*legacy*/ 4) control1_changes.legacy = /*legacy*/ ctx[2];

    			if (dirty & /*$$scope*/ 2097152) {
    				control1_changes.$$scope = { dirty, ctx };
    			}

    			control1.$set(control1_changes);
    			const control2_changes = {};
    			if (dirty & /*tips*/ 8) control2_changes.tips = /*tips*/ ctx[3];
    			if (dirty & /*legacy*/ 4) control2_changes.legacy = /*legacy*/ ctx[2];

    			if (dirty & /*$$scope*/ 2097152) {
    				control2_changes.$$scope = { dirty, ctx };
    			}

    			control2.$set(control2_changes);
    			const control3_changes = {};
    			if (dirty & /*tips*/ 8) control3_changes.tips = /*tips*/ ctx[3];
    			if (dirty & /*legacy*/ 4) control3_changes.legacy = /*legacy*/ ctx[2];

    			if (dirty & /*$$scope, pinned*/ 2097216) {
    				control3_changes.$$scope = { dirty, ctx };
    			}

    			control3.$set(control3_changes);
    			const control4_changes = {};
    			if (dirty & /*tips*/ 8) control4_changes.tips = /*tips*/ ctx[3];
    			if (dirty & /*legacy*/ 4) control4_changes.legacy = /*legacy*/ ctx[2];

    			if (dirty & /*$$scope*/ 2097152) {
    				control4_changes.$$scope = { dirty, ctx };
    			}

    			control4.$set(control4_changes);
    			const control5_changes = {};
    			if (dirty & /*tips*/ 8) control5_changes.tips = /*tips*/ ctx[3];
    			if (dirty & /*legacy*/ 4) control5_changes.legacy = /*legacy*/ ctx[2];
    			if (dirty & /*maximized*/ 128) control5_changes.tiptext = /*maximized*/ ctx[7] ? "Restore" : "Maximize";

    			if (dirty & /*$$scope*/ 2097152) {
    				control5_changes.$$scope = { dirty, ctx };
    			}

    			control5.$set(control5_changes);
    			const control6_changes = {};
    			if (dirty & /*tips*/ 8) control6_changes.tips = /*tips*/ ctx[3];
    			if (dirty & /*legacy*/ 4) control6_changes.legacy = /*legacy*/ ctx[2];

    			if (dirty & /*$$scope*/ 2097152) {
    				control6_changes.$$scope = { dirty, ctx };
    			}

    			control6.$set(control6_changes);

    			if (dirty & /*legacy*/ 4) {
    				toggle_class(div2, "legacy", /*legacy*/ ctx[2]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(control0.$$.fragment, local);
    			transition_in(if_block0);
    			transition_in(control1.$$.fragment, local);
    			transition_in(control2.$$.fragment, local);
    			transition_in(control3.$$.fragment, local);
    			transition_in(control4.$$.fragment, local);
    			transition_in(control5.$$.fragment, local);
    			transition_in(control6.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(control0.$$.fragment, local);
    			transition_out(if_block0);
    			transition_out(control1.$$.fragment, local);
    			transition_out(control2.$$.fragment, local);
    			transition_out(control3.$$.fragment, local);
    			transition_out(control4.$$.fragment, local);
    			transition_out(control5.$$.fragment, local);
    			transition_out(control6.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			destroy_component(control0);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			destroy_component(control1);
    			destroy_component(control2);
    			destroy_component(control3);
    			destroy_component(control4);
    			destroy_component(control5);
    			destroy_component(control6);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$V.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$T($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Titlebar', slots, []);
    	const { ipcRenderer } = require('electron');
    	const dispatch = createEventDispatcher();
    	let { fileSelected = false } = $$props;
    	let { settingsOpen = false } = $$props;
    	let { legacy = false } = $$props;
    	let { tips = false } = $$props;
    	let { overwrite = false } = $$props;
    	let { version } = $$props;
    	let pinned = false;
    	let maximized = false;

    	ipcRenderer.on('pin', (event, arg) => {
    		$$invalidate(6, pinned = arg);
    	});

    	ipcRenderer.on('max', (event, arg) => {
    		$$invalidate(7, maximized = arg);
    	});

    	function openImage() {
    		ipcRenderer.send('selectfile');
    	}

    	function clearImage() {
    		dispatch('clear');
    	}

    	function cutImage() {
    		dispatch('copy');
    		dispatch('clear');
    	}

    	const writable_props = ['fileSelected', 'settingsOpen', 'legacy', 'tips', 'overwrite', 'version'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Titlebar> was created with unknown prop '${key}'`);
    	});

    	const click_handler = e => {
    		$$invalidate(0, settingsOpen = !settingsOpen);
    		dispatch('settingsOpen', settingsOpen);
    	};

    	const click_handler_1 = e => {
    		ipcRenderer.send('screenshot');
    	};

    	const click_handler_2 = e => {
    		ipcRenderer.send('window', 'clickthrough');
    	};

    	const click_handler_3 = e => {
    		ipcRenderer.send('window', 'new');
    	};

    	const click_handler_4 = e => {
    		ipcRenderer.send('window', 'pin');
    	};

    	const click_handler_5 = e => {
    		ipcRenderer.send('window', 'minimize');
    	};

    	const click_handler_6 = e => {
    		ipcRenderer.send('window', 'maximize');
    	};

    	const click_handler_7 = e => {
    		ipcRenderer.send('window', 'close');
    	};

    	$$self.$$set = $$props => {
    		if ('fileSelected' in $$props) $$invalidate(1, fileSelected = $$props.fileSelected);
    		if ('settingsOpen' in $$props) $$invalidate(0, settingsOpen = $$props.settingsOpen);
    		if ('legacy' in $$props) $$invalidate(2, legacy = $$props.legacy);
    		if ('tips' in $$props) $$invalidate(3, tips = $$props.tips);
    		if ('overwrite' in $$props) $$invalidate(4, overwrite = $$props.overwrite);
    		if ('version' in $$props) $$invalidate(5, version = $$props.version);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		mousetrap: use,
    		Control,
    		ipcRenderer,
    		dispatch,
    		fileSelected,
    		settingsOpen,
    		legacy,
    		tips,
    		overwrite,
    		version,
    		pinned,
    		maximized,
    		openImage,
    		clearImage,
    		cutImage
    	});

    	$$self.$inject_state = $$props => {
    		if ('fileSelected' in $$props) $$invalidate(1, fileSelected = $$props.fileSelected);
    		if ('settingsOpen' in $$props) $$invalidate(0, settingsOpen = $$props.settingsOpen);
    		if ('legacy' in $$props) $$invalidate(2, legacy = $$props.legacy);
    		if ('tips' in $$props) $$invalidate(3, tips = $$props.tips);
    		if ('overwrite' in $$props) $$invalidate(4, overwrite = $$props.overwrite);
    		if ('version' in $$props) $$invalidate(5, version = $$props.version);
    		if ('pinned' in $$props) $$invalidate(6, pinned = $$props.pinned);
    		if ('maximized' in $$props) $$invalidate(7, maximized = $$props.maximized);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		settingsOpen,
    		fileSelected,
    		legacy,
    		tips,
    		overwrite,
    		version,
    		pinned,
    		maximized,
    		ipcRenderer,
    		dispatch,
    		openImage,
    		clearImage,
    		cutImage,
    		click_handler,
    		click_handler_1,
    		click_handler_2,
    		click_handler_3,
    		click_handler_4,
    		click_handler_5,
    		click_handler_6,
    		click_handler_7
    	];
    }

    class Titlebar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$T, create_fragment$V, safe_not_equal, {
    			fileSelected: 1,
    			settingsOpen: 0,
    			legacy: 2,
    			tips: 3,
    			overwrite: 4,
    			version: 5
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Titlebar",
    			options,
    			id: create_fragment$V.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*version*/ ctx[5] === undefined && !('version' in props)) {
    			console.warn("<Titlebar> was created without expected prop 'version'");
    		}
    	}

    	get fileSelected() {
    		throw new Error("<Titlebar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set fileSelected(value) {
    		throw new Error("<Titlebar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get settingsOpen() {
    		throw new Error("<Titlebar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set settingsOpen(value) {
    		throw new Error("<Titlebar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get legacy() {
    		throw new Error("<Titlebar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set legacy(value) {
    		throw new Error("<Titlebar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get tips() {
    		throw new Error("<Titlebar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tips(value) {
    		throw new Error("<Titlebar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get overwrite() {
    		throw new Error("<Titlebar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set overwrite(value) {
    		throw new Error("<Titlebar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get version() {
    		throw new Error("<Titlebar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set version(value) {
    		throw new Error("<Titlebar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\Desktop.svelte generated by Svelte v3.49.0 */

    const { console: console_1$3 } = globals;
    const file$P = "src\\components\\Desktop.svelte";

    function create_fragment$U(ctx) {
    	let div;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[8].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[7], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", "desktop svelte-18danl4");
    			set_style(div, "background", /*backdropColor*/ ctx[1]);
    			toggle_class(div, "legacy", /*legacy*/ ctx[0]);
    			add_location(div, file$P, 92, 0, 3115);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div, "dragover", dragover_handler, false, false, false),
    					listen_dev(div, "drop", /*handleFilesSelect*/ ctx[2], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 128)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[7],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[7])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[7], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*backdropColor*/ 2) {
    				set_style(div, "background", /*backdropColor*/ ctx[1]);
    			}

    			if (dirty & /*legacy*/ 1) {
    				toggle_class(div, "legacy", /*legacy*/ ctx[0]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$U.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const dragover_handler = e => {
    	e.preventDefault();
    };

    function instance$S($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Desktop', slots, ['default']);
    	const HTMLParser = require('node-html-parser');
    	const { ipcRenderer } = require('electron');
    	let { legacy = false } = $$props;
    	let { settings = {} } = $$props;
    	let { loading = false } = $$props;
    	let { backdropColor = "#2F2E33" } = $$props;
    	let { settingsOpen } = $$props;
    	let { fileSelected } = $$props;

    	const decodeHTMLEntities = text => {
    		// Create a new element or use one from cache, to save some element creation overhead
    		const el = decodeHTMLEntities.__cache_data_element = decodeHTMLEntities.__cache_data_element || document.createElement('div');

    		const enc = text.// Prevent any mixup of existing pattern in text
    		replace(/⪪/g, '⪪#').// Encode entities in special format. This will prevent native element encoder to replace any amp characters
    		replace(/&([a-z1-8]{2,31}|#x[0-9a-f]+|#\d+);/gi, '⪪$1⪫');

    		// Encode any HTML tags in the text to prevent script injection
    		el.textContent = enc;

    		// Decode entities from special format, back to their original HTML entities format
    		el.innerHTML = el.innerHTML.replace(/⪪([a-z1-8]{2,31}|#x[0-9a-f]+|#\d+)⪫/gi, '&$1;').replace(/#⪫/g, '⪫');

    		// Get the decoded HTML entities
    		const dec = el.textContent;

    		// Clear the element content, in order to preserve a bit of memory (it is just the text may be pretty big)
    		el.textContent = '';

    		return dec;
    	};

    	function handleFilesSelect(e) {
    		if (!settings.overwrite && fileSelected || settingsOpen) return;
    		$$invalidate(3, loading = true);
    		const acceptedFiles = Array.from(e.dataTransfer.files);
    		const acceptedItems = Array.from(e.dataTransfer.items);

    		if (acceptedFiles.length > 0) ipcRenderer.send('file', acceptedFiles[0].path); else if (acceptedItems.length > 0) {
    			let testHTML = e.dataTransfer.getData("text/html");

    			if (testHTML) {
    				if (testHTML.startsWith("data") && testHTML.includes("image")) {
    					//gotten a plain data string
    					ipcRenderer.send('file', testHTML);
    				} else if (testHTML.startsWith("http")) {
    					//gotten a plain url string
    					ipcRenderer.send('file', decodeHTMLEntities(testHTML));
    				} else {
    					//gotten HTML, likely an IMG tag
    					let parsedHTML = HTMLParser.parse(testHTML);

    					let image = parsedHTML.querySelector('img');
    					let url = parsedHTML.querySelector('a');

    					if (image) {
    						let srctext = image.getAttribute('src');
    						if (srctext.startsWith("data")) ipcRenderer.send('file', srctext); else if (srctext.startsWith("http")) ipcRenderer.send('file', srctext);
    					} else if (url) ipcRenderer.send('file', url.getAttribute('href')); else {
    						$$invalidate(3, loading = false);
    						ipcRenderer.send('action', "Unrecognized format");
    					}
    				}
    			} else ipcRenderer.send('file', e.dataTransfer.getData("text"));
    		} else {
    			let text = e.dataTransfer.getData("text");
    			console.log("gotten text", text);
    		} //HANDLE URL, DATA, AND WHATEVER ERRORS HERE
    	}

    	const writable_props = [
    		'legacy',
    		'settings',
    		'loading',
    		'backdropColor',
    		'settingsOpen',
    		'fileSelected'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$3.warn(`<Desktop> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('legacy' in $$props) $$invalidate(0, legacy = $$props.legacy);
    		if ('settings' in $$props) $$invalidate(4, settings = $$props.settings);
    		if ('loading' in $$props) $$invalidate(3, loading = $$props.loading);
    		if ('backdropColor' in $$props) $$invalidate(1, backdropColor = $$props.backdropColor);
    		if ('settingsOpen' in $$props) $$invalidate(5, settingsOpen = $$props.settingsOpen);
    		if ('fileSelected' in $$props) $$invalidate(6, fileSelected = $$props.fileSelected);
    		if ('$$scope' in $$props) $$invalidate(7, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		HTMLParser,
    		ipcRenderer,
    		legacy,
    		settings,
    		loading,
    		backdropColor,
    		settingsOpen,
    		fileSelected,
    		decodeHTMLEntities,
    		handleFilesSelect
    	});

    	$$self.$inject_state = $$props => {
    		if ('legacy' in $$props) $$invalidate(0, legacy = $$props.legacy);
    		if ('settings' in $$props) $$invalidate(4, settings = $$props.settings);
    		if ('loading' in $$props) $$invalidate(3, loading = $$props.loading);
    		if ('backdropColor' in $$props) $$invalidate(1, backdropColor = $$props.backdropColor);
    		if ('settingsOpen' in $$props) $$invalidate(5, settingsOpen = $$props.settingsOpen);
    		if ('fileSelected' in $$props) $$invalidate(6, fileSelected = $$props.fileSelected);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		legacy,
    		backdropColor,
    		handleFilesSelect,
    		loading,
    		settings,
    		settingsOpen,
    		fileSelected,
    		$$scope,
    		slots
    	];
    }

    class Desktop extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$S, create_fragment$U, safe_not_equal, {
    			legacy: 0,
    			settings: 4,
    			loading: 3,
    			backdropColor: 1,
    			settingsOpen: 5,
    			fileSelected: 6
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Desktop",
    			options,
    			id: create_fragment$U.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*settingsOpen*/ ctx[5] === undefined && !('settingsOpen' in props)) {
    			console_1$3.warn("<Desktop> was created without expected prop 'settingsOpen'");
    		}

    		if (/*fileSelected*/ ctx[6] === undefined && !('fileSelected' in props)) {
    			console_1$3.warn("<Desktop> was created without expected prop 'fileSelected'");
    		}
    	}

    	get legacy() {
    		throw new Error("<Desktop>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set legacy(value) {
    		throw new Error("<Desktop>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get settings() {
    		throw new Error("<Desktop>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set settings(value) {
    		throw new Error("<Desktop>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get loading() {
    		throw new Error("<Desktop>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set loading(value) {
    		throw new Error("<Desktop>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get backdropColor() {
    		throw new Error("<Desktop>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set backdropColor(value) {
    		throw new Error("<Desktop>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get settingsOpen() {
    		throw new Error("<Desktop>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set settingsOpen(value) {
    		throw new Error("<Desktop>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get fileSelected() {
    		throw new Error("<Desktop>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set fileSelected(value) {
    		throw new Error("<Desktop>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\Backdrop.svelte generated by Svelte v3.49.0 */

    const file$O = "src\\components\\Backdrop.svelte";

    function create_fragment$T(ctx) {
    	let div4;
    	let div0;
    	let t0;
    	let div1;
    	let t1;
    	let div2;
    	let t2;
    	let div3;

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			div0 = element("div");
    			t0 = space();
    			div1 = element("div");
    			t1 = space();
    			div2 = element("div");
    			t2 = space();
    			div3 = element("div");
    			attr_dev(div0, "class", "backdrop-bg backdrop-top svelte-3u4xdv");
    			add_location(div0, file$O, 5, 1, 90);
    			attr_dev(div1, "class", "backdrop-bg backdrop-right svelte-3u4xdv");
    			add_location(div1, file$O, 6, 1, 137);
    			attr_dev(div2, "class", "backdrop-bg backdrop-bottom svelte-3u4xdv");
    			add_location(div2, file$O, 7, 1, 186);
    			attr_dev(div3, "class", "backdrop-bg backdrop-left svelte-3u4xdv");
    			add_location(div3, file$O, 8, 1, 236);
    			attr_dev(div4, "class", "backdrop svelte-3u4xdv");
    			toggle_class(div4, "legacy", /*legacy*/ ctx[0]);
    			add_location(div4, file$O, 4, 0, 52);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			append_dev(div4, div0);
    			append_dev(div4, t0);
    			append_dev(div4, div1);
    			append_dev(div4, t1);
    			append_dev(div4, div2);
    			append_dev(div4, t2);
    			append_dev(div4, div3);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*legacy*/ 1) {
    				toggle_class(div4, "legacy", /*legacy*/ ctx[0]);
    			}
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div4);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$T.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$R($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Backdrop', slots, []);
    	let { legacy = false } = $$props;
    	const writable_props = ['legacy'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Backdrop> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('legacy' in $$props) $$invalidate(0, legacy = $$props.legacy);
    	};

    	$$self.$capture_state = () => ({ legacy });

    	$$self.$inject_state = $$props => {
    		if ('legacy' in $$props) $$invalidate(0, legacy = $$props.legacy);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [legacy];
    }

    class Backdrop extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$R, create_fragment$T, safe_not_equal, { legacy: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Backdrop",
    			options,
    			id: create_fragment$T.name
    		});
    	}

    	get legacy() {
    		throw new Error("<Backdrop>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set legacy(value) {
    		throw new Error("<Backdrop>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\common\Tool.svelte generated by Svelte v3.49.0 */
    const file$N = "src\\components\\common\\Tool.svelte";

    // (30:0) {#if showTooltip && !tips && tiptext}
    function create_if_block$i(ctx) {
    	let tooltip;
    	let current;

    	tooltip = new Tooltip({
    			props: {
    				content: /*popperContent*/ ctx[6],
    				$$slots: { default: [create_default_slot$b] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(tooltip.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(tooltip, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const tooltip_changes = {};

    			if (dirty & /*$$scope, tiptext*/ 2056) {
    				tooltip_changes.$$scope = { dirty, ctx };
    			}

    			tooltip.$set(tooltip_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tooltip.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tooltip.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(tooltip, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$i.name,
    		type: "if",
    		source: "(30:0) {#if showTooltip && !tips && tiptext}",
    		ctx
    	});

    	return block;
    }

    // (31:1) <Tooltip content={popperContent}>
    function create_default_slot$b(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*tiptext*/ ctx[3]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*tiptext*/ 8) set_data_dev(t, /*tiptext*/ ctx[3]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$b.name,
    		type: "slot",
    		source: "(31:1) <Tooltip content={popperContent}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$S(ctx) {
    	let button;
    	let t;
    	let if_block_anchor;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[7].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[11], null);
    	let if_block = /*showTooltip*/ ctx[4] && !/*tips*/ ctx[0] && /*tiptext*/ ctx[3] && create_if_block$i(ctx);

    	const block = {
    		c: function create() {
    			button = element("button");
    			if (default_slot) default_slot.c();
    			t = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    			set_style(button, "font-size", /*legacy*/ ctx[1] ? "14px" : /*size*/ ctx[2]);
    			attr_dev(button, "class", "control svelte-4zshi9");
    			toggle_class(button, "legacy", /*legacy*/ ctx[1]);
    			add_location(button, file$N, 17, 0, 381);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (default_slot) {
    				default_slot.m(button, null);
    			}

    			insert_dev(target, t, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					action_destroyer(/*popperRef*/ ctx[5].call(null, button)),
    					listen_dev(button, "mouseenter", /*mouseenter_handler*/ ctx[9], false, false, false),
    					listen_dev(button, "mouseleave", /*mouseleave_handler*/ ctx[10], false, false, false),
    					listen_dev(button, "click", /*click_handler*/ ctx[8], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 2048)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[11],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[11])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[11], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*legacy, size*/ 6) {
    				set_style(button, "font-size", /*legacy*/ ctx[1] ? "14px" : /*size*/ ctx[2]);
    			}

    			if (dirty & /*legacy*/ 2) {
    				toggle_class(button, "legacy", /*legacy*/ ctx[1]);
    			}

    			if (/*showTooltip*/ ctx[4] && !/*tips*/ ctx[0] && /*tiptext*/ ctx[3]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*showTooltip, tips, tiptext*/ 25) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$i(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			if (default_slot) default_slot.d(detaching);
    			if (detaching) detach_dev(t);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$S.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$Q($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Tool', slots, ['default']);
    	const [popperRef, popperContent] = createPopperActions({ placement: 'right', strategy: 'fixed' });
    	let showTooltip = false;
    	let { tips = false } = $$props;
    	let { legacy = false } = $$props;
    	let { size = 14 } = $$props;
    	let { tiptext = false } = $$props;
    	const writable_props = ['tips', 'legacy', 'size', 'tiptext'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Tool> was created with unknown prop '${key}'`);
    	});

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	const mouseenter_handler = () => $$invalidate(4, showTooltip = true);
    	const mouseleave_handler = () => $$invalidate(4, showTooltip = false);

    	$$self.$$set = $$props => {
    		if ('tips' in $$props) $$invalidate(0, tips = $$props.tips);
    		if ('legacy' in $$props) $$invalidate(1, legacy = $$props.legacy);
    		if ('size' in $$props) $$invalidate(2, size = $$props.size);
    		if ('tiptext' in $$props) $$invalidate(3, tiptext = $$props.tiptext);
    		if ('$$scope' in $$props) $$invalidate(11, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		createPopperActions,
    		Tooltip,
    		popperRef,
    		popperContent,
    		showTooltip,
    		tips,
    		legacy,
    		size,
    		tiptext
    	});

    	$$self.$inject_state = $$props => {
    		if ('showTooltip' in $$props) $$invalidate(4, showTooltip = $$props.showTooltip);
    		if ('tips' in $$props) $$invalidate(0, tips = $$props.tips);
    		if ('legacy' in $$props) $$invalidate(1, legacy = $$props.legacy);
    		if ('size' in $$props) $$invalidate(2, size = $$props.size);
    		if ('tiptext' in $$props) $$invalidate(3, tiptext = $$props.tiptext);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		tips,
    		legacy,
    		size,
    		tiptext,
    		showTooltip,
    		popperRef,
    		popperContent,
    		slots,
    		click_handler,
    		mouseenter_handler,
    		mouseleave_handler,
    		$$scope
    	];
    }

    class Tool extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$Q, create_fragment$S, safe_not_equal, { tips: 0, legacy: 1, size: 2, tiptext: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Tool",
    			options,
    			id: create_fragment$S.name
    		});
    	}

    	get tips() {
    		throw new Error("<Tool>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tips(value) {
    		throw new Error("<Tool>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get legacy() {
    		throw new Error("<Tool>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set legacy(value) {
    		throw new Error("<Tool>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<Tool>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Tool>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get tiptext() {
    		throw new Error("<Tool>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tiptext(value) {
    		throw new Error("<Tool>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    function clickOutside(node) {
    	// the node has been mounted in the DOM
    	
    	window.addEventListener('click', handleClick);
    	
    	function handleClick(e){   
      if (!node.contains(e.target)){
        node.dispatchEvent(new CustomEvent('outsideclick'));
      }
    }

    	return {
    		destroy() {
    			// the node has been removed from the DOM
    			window.removeEventListener('click', handleClick);
    		}
    	};
    }

    /* src\components\common\Dropdown.svelte generated by Svelte v3.49.0 */
    const file$M = "src\\components\\common\\Dropdown.svelte";

    // (24:0) {#if show}
    function create_if_block$h(ctx) {
    	let div2;
    	let div0;
    	let t;
    	let div1;
    	let content_action;
    	let div2_intro;
    	let div2_outro;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[6].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[5], null);

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			if (default_slot) default_slot.c();
    			t = space();
    			div1 = element("div");
    			attr_dev(div0, "class", "dropdown-content");
    			add_location(div0, file$M, 39, 2, 769);
    			attr_dev(div1, "id", "arrow");
    			attr_dev(div1, "class", "arrow");
    			attr_dev(div1, "data-popper-arrow", "");
    			add_location(div1, file$M, 42, 2, 831);
    			attr_dev(div2, "id", "dropdown");
    			attr_dev(div2, "class", "dropdown");
    			add_location(div2, file$M, 24, 1, 486);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);

    			if (default_slot) {
    				default_slot.m(div0, null);
    			}

    			append_dev(div2, t);
    			append_dev(div2, div1);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					action_destroyer(content_action = /*content*/ ctx[0].call(null, div2, /*options*/ ctx[1])),
    					action_destroyer(clickOutside.call(null, div2)),
    					listen_dev(div2, "outsideclick", /*outsideclick_handler*/ ctx[7], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 32)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[5],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[5])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[5], dirty, null),
    						null
    					);
    				}
    			}

    			if (content_action && is_function(content_action.update) && dirty & /*options*/ 2) content_action.update.call(null, /*options*/ ctx[1]);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);

    			add_render_callback(() => {
    				if (div2_outro) div2_outro.end(1);
    				div2_intro = create_in_transition(div2, fade, { duration: 200 });
    				div2_intro.start();
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			if (div2_intro) div2_intro.invalidate();
    			div2_outro = create_out_transition(div2, fade, { duration: 50 });
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			if (default_slot) default_slot.d(detaching);
    			if (detaching && div2_outro) div2_outro.end();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$h.name,
    		type: "if",
    		source: "(24:0) {#if show}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$R(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*show*/ ctx[2] && create_if_block$h(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*show*/ ctx[2]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*show*/ 4) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$h(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$R.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$P($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Dropdown', slots, ['default']);
    	const dispatch = createEventDispatcher();
    	let { content } = $$props;

    	let { options = {
    		modifiers: [
    			{
    				name: 'offset',
    				options: { offset: [-12, 15] }
    			}
    		]
    	} } = $$props;

    	let show;
    	let clicks = 0;

    	onMount(async () => {
    		$$invalidate(2, show = true);
    	});

    	const writable_props = ['content', 'options'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Dropdown> was created with unknown prop '${key}'`);
    	});

    	const outsideclick_handler = () => {
    		$$invalidate(3, clicks++, clicks);

    		if (clicks > 1) {
    			dispatch('close');
    			$$invalidate(2, show = false);
    		}
    	};

    	$$self.$$set = $$props => {
    		if ('content' in $$props) $$invalidate(0, content = $$props.content);
    		if ('options' in $$props) $$invalidate(1, options = $$props.options);
    		if ('$$scope' in $$props) $$invalidate(5, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		onMount,
    		fade,
    		clickOutside,
    		dispatch,
    		content,
    		options,
    		show,
    		clicks
    	});

    	$$self.$inject_state = $$props => {
    		if ('content' in $$props) $$invalidate(0, content = $$props.content);
    		if ('options' in $$props) $$invalidate(1, options = $$props.options);
    		if ('show' in $$props) $$invalidate(2, show = $$props.show);
    		if ('clicks' in $$props) $$invalidate(3, clicks = $$props.clicks);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [content, options, show, clicks, dispatch, $$scope, slots, outsideclick_handler];
    }

    class Dropdown extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$P, create_fragment$R, safe_not_equal, { content: 0, options: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Dropdown",
    			options,
    			id: create_fragment$R.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*content*/ ctx[0] === undefined && !('content' in props)) {
    			console.warn("<Dropdown> was created without expected prop 'content'");
    		}
    	}

    	get content() {
    		throw new Error("<Dropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set content(value) {
    		throw new Error("<Dropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get options() {
    		throw new Error("<Dropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set options(value) {
    		throw new Error("<Dropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var umd = createCommonjsModule(function (module, exports) {
    (function (global, factory) {
        factory(exports) ;
    })(commonjsGlobal, (function (exports) {
        function range(start, end, step = 1) {
            let index = -1;
            let length = Math.max(Math.ceil((end - start) / step + 1), 0);
            const result = new Array(length);
            while (length--) {
                result[++index] = start;
                start += step;
            }
            return result;
        }
        function uniqBy(array, key) {
            const seen = {};
            return array.filter(function (item) {
                const k = key(item);
                return Object.prototype.hasOwnProperty.call(seen, k) ? false : (seen[k] = true);
            });
        }

        function randomHexColor() {
            return ('#' +
                Math.floor(Math.random() * 16777215)
                    .toString(16)
                    .padStart(6, '0'));
        }
        function hsv2rgb({ h, s, v, a = 1 }) {
            let R, G, B;
            let _h = (h % 360) / 60;
            const C = v * s;
            const X = C * (1 - Math.abs((_h % 2) - 1));
            R = G = B = v - C;
            _h = ~~_h;
            R += [C, X, 0, 0, X, C][_h];
            G += [X, C, C, X, 0, 0][_h];
            B += [0, 0, X, C, C, X][_h];
            const r = Math.round(R * 255);
            const g = Math.round(G * 255);
            const b = Math.round(B * 255);
            return { r, g, b, a };
        }
        function rgb2hex({ r, g, b, a = 1 }) {
            const _a = Math.round(a * 255) | 0;
            const colors = _a === 255 ? [r, g, b] : [r, g, b, _a];
            return {
                hex: '#' + colors.reduce((acc, v) => `${acc}${v.toString(16).padStart(2, '0')}`, '')
            };
        }
        function hex2rgb(hex) {
            const h = hex.hex;
            return {
                r: parseInt(h.substring(1, 3), 16),
                g: parseInt(h.substring(3, 5), 16),
                b: parseInt(h.substring(5, 7), 16),
                a: h.length <= 7 ? 1 : parseInt(h.substring(7, 9), 16) / 255
            };
        }
        function rgb2hsv({ r, g, b, a = 1 }) {
            const R = r / 255;
            const G = g / 255;
            const B = b / 255;
            const V = Math.max(R, G, B);
            const C = V - Math.min(R, G, B);
            const S = C === 0 ? 0 : C / V;
            let H = C === 0
                ? 0
                : V === R
                    ? (G - B) / C + (G < B ? 6 : 0)
                    : V === G
                        ? (B - R) / C + 2
                        : (R - G) / C + 4;
            H = (H % 6) * 60;
            return {
                a: a,
                h: H,
                s: S,
                v: V
            };
        }
        function hsv2Color({ h, s, v, a }) {
            const rgb = hsv2rgb({ h, s, v, a });
            return Object.assign(Object.assign(Object.assign({}, rgb), rgb2hex(rgb)), { h,
                s,
                v });
        }
        function rgb2Color({ r, g, b, a }) {
            const rgb = { r, g, b, a };
            return Object.assign(Object.assign(Object.assign({}, rgb2hsv(rgb)), rgb2hex(rgb)), { r,
                g,
                b });
        }
        function hex2Color({ hex }) {
            const rgb = hex2rgb({ hex });
            return Object.assign(Object.assign(Object.assign({}, rgb), rgb2hsv(rgb)), { hex });
        }
        function colorRange(startHex, endHex, length) {
            if (!startHex || !endHex || !length || length <= 1)
                return undefined;
            const rangeLength = length - 1;
            const startColor = hex2Color({ hex: startHex });
            const endColor = hex2Color({ hex: endHex });
            if (Math.abs(startColor.h - endColor.h) > 180) {
                if (startColor.h < endColor.h)
                    startColor.h += 360;
                else
                    endColor.h += 360;
            }
            return range(0, rangeLength).map((index) => hsv2Color({
                h: (startColor.h + ((endColor.h - startColor.h) * index) / rangeLength) % 360,
                s: startColor.s + ((endColor.s - startColor.s) * index) / rangeLength,
                v: startColor.v + ((endColor.v - startColor.v) * index) / rangeLength,
                a: startColor.a === undefined || endColor.a === undefined
                    ? 1
                    : startColor.a + ((endColor.a - startColor.a) * index) / rangeLength
            }).hex);
        }
        function isDark(rgb) {
            const { r, g, b } = rgb;
            const hsp = Math.sqrt(0.299 * r * r + 0.587 * g * g + 0.114 * b * b);
            return hsp < 127.5;
        }

        function clamp(value, min, max) {
            return Math.min(Math.max(min, value), max);
        }
        function floor(value, base = 1) {
            return base === 1 ? Math.floor(value) : Math.floor(value / base) * base;
        }
        function floor2(value) {
            return floor(value, 2);
        }
        function floor3(value) {
            return floor(value, 3);
        }
        function distance(arr1, arr2) {
            if (arr1.length !== arr2.length)
                return NaN;
            return Math.sqrt(arr1.reduce((acc, val, index) => acc + Math.pow(val - arr2[index], 2), 0));
        }

        const isArray = Array.isArray;
        const keyList = Object.keys;
        const hasProp = Object.prototype.hasOwnProperty;
        function deepEqual(a, b) {
            if (a === b)
                return true;
            if (a && b && typeof a == 'object' && typeof b == 'object') {
                const arrA = isArray(a);
                const arrB = isArray(b);
                let i;
                let length;
                if (arrA && arrB) {
                    length = a.length;
                    if (length !== b.length)
                        return false;
                    for (i = length; i-- !== 0;) {
                        if (!deepEqual(a[i], b[i]))
                            return false;
                    }
                    return true;
                }
                if (arrA !== arrB)
                    return false;
                const dateA = a instanceof Date;
                const dateB = b instanceof Date;
                if (dateA !== dateB)
                    return false;
                if (dateA && dateB)
                    return a.getTime() === b.getTime();
                const regexpA = a instanceof RegExp;
                const regexpB = b instanceof RegExp;
                if (regexpA !== regexpB)
                    return false;
                if (regexpA && regexpB)
                    return a.toString() === b.toString();
                const keys = keyList(a);
                length = keys.length;
                if (length !== keyList(b).length) {
                    return false;
                }
                for (i = length; i-- !== 0;) {
                    if (!hasProp.call(b, keys[i]))
                        return false;
                }
                return true;
            }
            return a !== a && b !== b;
        }

        const isStringABool = (value) => {
            return value === 'true' || value === 'false';
        };
        const isStringAFloat = (value) => {
            return !isNaN(+value) && isFinite(+value);
        };

        exports.clamp = clamp;
        exports.colorRange = colorRange;
        exports.deepEqual = deepEqual;
        exports.distance = distance;
        exports.floor = floor;
        exports.floor2 = floor2;
        exports.floor3 = floor3;
        exports.hex2Color = hex2Color;
        exports.hex2rgb = hex2rgb;
        exports.hsv2Color = hsv2Color;
        exports.hsv2rgb = hsv2rgb;
        exports.isDark = isDark;
        exports.isStringABool = isStringABool;
        exports.isStringAFloat = isStringAFloat;
        exports.randomHexColor = randomHexColor;
        exports.range = range;
        exports.rgb2Color = rgb2Color;
        exports.rgb2hex = rgb2hex;
        exports.rgb2hsv = rgb2hsv;
        exports.uniqBy = uniqBy;

        Object.defineProperty(exports, '__esModule', { value: true });

    }));

    });

    const subscriber_queue = [];
    /**
     * Creates a `Readable` store that allows reading by subscription.
     * @param value initial value
     * @param {StartStopNotifier}start start and stop notifications for subscriptions
     */
    function readable(value, start) {
        return {
            subscribe: writable(value, start).subscribe
        };
    }
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop$1) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop$1) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop$1;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }
    function derived(stores, fn, initial_value) {
        const single = !Array.isArray(stores);
        const stores_array = single
            ? [stores]
            : stores;
        const auto = fn.length < 2;
        return readable(initial_value, (set) => {
            let inited = false;
            const values = [];
            let pending = 0;
            let cleanup = noop$1;
            const sync = () => {
                if (pending) {
                    return;
                }
                cleanup();
                const result = fn(single ? values[0] : values, set);
                if (auto) {
                    set(result);
                }
                else {
                    cleanup = is_function(result) ? result : noop$1;
                }
            };
            const unsubscribers = stores_array.map((store, i) => subscribe(store, (value) => {
                values[i] = value;
                pending &= ~(1 << i);
                if (inited) {
                    sync();
                }
            }, () => {
                pending |= (1 << i);
            }));
            inited = true;
            sync();
            return function stop() {
                run_all(unsubscribers);
                cleanup();
            };
        });
    }

    /**
     * Store that keeps track of the keys pressed, updated by the ArrowKeyHandler component
     */
    const keyPressed = writable({
        ArrowLeft: 0,
        ArrowUp: 0,
        ArrowRight: 0,
        ArrowDown: 0
    });
    /**
     * Store that keeps track of the keys pressed, with utility horizontal / vertical attributes
     * updated by the ArrowKeyHandler component
     */
    const keyPressedCustom = derived(keyPressed, ($keyPressed) => {
        return {
            ...$keyPressed,
            ArrowV: $keyPressed.ArrowUp + $keyPressed.ArrowDown,
            ArrowH: $keyPressed.ArrowLeft + $keyPressed.ArrowRight,
            ArrowVH: $keyPressed.ArrowUp + $keyPressed.ArrowDown + $keyPressed.ArrowLeft + $keyPressed.ArrowRight
        };
    });

    /**
     * Ease in out sin base function
     * @param x - param, between 1 and infinity
     * @param min - starting return value, default .001
     * @param max ending return value, default .01
     * @returns a number between min and max
     */
    function easeInOutSin(x, min = 0.001, max = 0.01) {
        /**
         * after the delay, the ease in starts (i.e. after x = DELAY)*
         */
        const DELAY = 50;
        /**
         * Duration of the transition (i.e. bewteen x = DELAY and x = DELAY + DURATION)
         */
        const DURATION = 50;
        const X = Math.min(1, Math.max(1, x - DELAY) / DURATION);
        return min + ((max - min) / 2) * (1 - Math.cos(Math.PI * X));
    }

    /* node_modules\svelte-awesome-color-picker\components\Picker.svelte generated by Svelte v3.49.0 */

    const { window: window_1$3 } = globals;
    const file$L = "node_modules\\svelte-awesome-color-picker\\components\\Picker.svelte";

    // (99:0) <svelte:component this={components.pickerWrapper} {focused} {toRight}>
    function create_default_slot$a(ctx) {
    	let div;
    	let switch_instance;
    	let current;
    	let mounted;
    	let dispose;
    	var switch_value = /*components*/ ctx[2].pickerIndicator;

    	function switch_props(ctx) {
    		return {
    			props: {
    				pos: /*pos*/ ctx[9],
    				isDark: /*isDark*/ ctx[5],
    				color: umd.hsv2Color({
    					h: /*h*/ ctx[3],
    					s: /*s*/ ctx[0],
    					v: /*v*/ ctx[1],
    					a: 1
    				})
    			},
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props(ctx));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			attr_dev(div, "class", "picker svelte-uiwgvv");
    			attr_dev(div, "tabindex", "0");
    			set_style(div, "--color-bg", /*colorBg*/ ctx[8]?.hex);
    			add_location(div, file$L, 99, 1, 2996);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (switch_instance) {
    				mount_component(switch_instance, div, null);
    			}

    			/*div_binding*/ ctx[18](div);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div, "mousedown", stop_propagation(prevent_default(/*pickerMouseDown*/ ctx[10])), false, true, true),
    					listen_dev(div, "touchstart", /*touch*/ ctx[16], false, false, false),
    					listen_dev(div, "touchmove", stop_propagation(prevent_default(/*touch*/ ctx[16])), false, true, true),
    					listen_dev(div, "touchend", /*touch*/ ctx[16], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = {};
    			if (dirty & /*pos*/ 512) switch_instance_changes.pos = /*pos*/ ctx[9];
    			if (dirty & /*isDark*/ 32) switch_instance_changes.isDark = /*isDark*/ ctx[5];

    			if (dirty & /*h, s, v*/ 11) switch_instance_changes.color = umd.hsv2Color({
    				h: /*h*/ ctx[3],
    				s: /*s*/ ctx[0],
    				v: /*v*/ ctx[1],
    				a: 1
    			});

    			if (switch_value !== (switch_value = /*components*/ ctx[2].pickerIndicator)) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props(ctx));
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, div, null);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}

    			if (!current || dirty & /*colorBg*/ 256) {
    				set_style(div, "--color-bg", /*colorBg*/ ctx[8]?.hex);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (switch_instance) destroy_component(switch_instance);
    			/*div_binding*/ ctx[18](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$a.name,
    		type: "slot",
    		source: "(99:0) <svelte:component this={components.pickerWrapper} {focused} {toRight}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$Q(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	let mounted;
    	let dispose;
    	var switch_value = /*components*/ ctx[2].pickerWrapper;

    	function switch_props(ctx) {
    		return {
    			props: {
    				focused: /*focused*/ ctx[7],
    				toRight: /*toRight*/ ctx[4],
    				$$slots: { default: [create_default_slot$a] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props(ctx));
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(window_1$3, "mouseup", /*mouseUp*/ ctx[11], false, false, false),
    					listen_dev(window_1$3, "mousedown", /*mouseDown*/ ctx[13], false, false, false),
    					listen_dev(window_1$3, "mousemove", /*mouseMove*/ ctx[12], false, false, false),
    					listen_dev(window_1$3, "keyup", /*keyup*/ ctx[14], false, false, false),
    					listen_dev(window_1$3, "keydown", /*keydown*/ ctx[15], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			const switch_instance_changes = {};
    			if (dirty & /*focused*/ 128) switch_instance_changes.focused = /*focused*/ ctx[7];
    			if (dirty & /*toRight*/ 16) switch_instance_changes.toRight = /*toRight*/ ctx[4];

    			if (dirty & /*$$scope, colorBg, picker, components, pos, isDark, h, s, v*/ 67109743) {
    				switch_instance_changes.$$scope = { dirty, ctx };
    			}

    			if (switch_value !== (switch_value = /*components*/ ctx[2].pickerWrapper)) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props(ctx));
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$Q.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$O($$self, $$props, $$invalidate) {
    	let $keyPressed;
    	let $keyPressedCustom;
    	validate_store(keyPressed, 'keyPressed');
    	component_subscribe($$self, keyPressed, $$value => $$invalidate(22, $keyPressed = $$value));
    	validate_store(keyPressedCustom, 'keyPressedCustom');
    	component_subscribe($$self, keyPressedCustom, $$value => $$invalidate(23, $keyPressedCustom = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Picker', slots, []);
    	let { components } = $$props;
    	let { h } = $$props;
    	let { s } = $$props;
    	let { v } = $$props;
    	let { isOpen } = $$props;
    	let { toRight } = $$props;
    	let { isDark } = $$props;
    	let picker;
    	let isMouseDown = false;
    	let focused = false;
    	let focusMovementIntervalId;
    	let focusMovementCounter;
    	let colorBg;
    	let pos = { x: 100, y: 0 };

    	function onClick(e) {
    		let mouse = { x: e.offsetX, y: e.offsetY };
    		let width = picker.getBoundingClientRect().width;
    		let height = picker.getBoundingClientRect().height;
    		$$invalidate(0, s = umd.clamp(mouse.x / width, 0, 1));
    		$$invalidate(1, v = umd.clamp((height - mouse.y) / height, 0, 1));
    	}

    	function pickerMouseDown(e) {
    		if (e.button === 0) {
    			isMouseDown = true;
    			onClick(e);
    		}
    	}

    	function mouseUp() {
    		isMouseDown = false;
    	}

    	function mouseMove(e) {
    		if (isMouseDown) onClick({
    			offsetX: Math.max(0, Math.min(picker.getBoundingClientRect().width, e.clientX - picker.getBoundingClientRect().left)),
    			offsetY: Math.max(0, Math.min(picker.getBoundingClientRect().height, e.clientY - picker.getBoundingClientRect().top))
    		});
    	}

    	function mouseDown(e) {
    		if (!e.target.isSameNode(picker)) $$invalidate(7, focused = false);
    	}

    	function keyup(e) {
    		if (e.key === 'Tab') $$invalidate(7, focused = !!document.activeElement?.isSameNode(picker));
    		if (!e.repeat && focused) move();
    	}

    	function keydown(e) {
    		if (focused && $keyPressedCustom.ArrowVH) {
    			e.preventDefault();
    			if (!e.repeat) move();
    		}
    	}

    	function move() {
    		if ($keyPressedCustom.ArrowVH) {
    			if (!focusMovementIntervalId) {
    				focusMovementCounter = 0;

    				focusMovementIntervalId = window.setInterval(
    					() => {
    						let focusMovementFactor = easeInOutSin(++focusMovementCounter);
    						$$invalidate(0, s = Math.min(1, Math.max(0, s + ($keyPressed.ArrowRight - $keyPressed.ArrowLeft) * focusMovementFactor)));
    						$$invalidate(1, v = Math.min(1, Math.max(0, v + ($keyPressed.ArrowUp - $keyPressed.ArrowDown) * focusMovementFactor)));
    					},
    					10
    				);
    			}
    		} else if (focusMovementIntervalId) {
    			clearInterval(focusMovementIntervalId);
    			focusMovementIntervalId = undefined;
    		}
    	}

    	function touch(e) {
    		e.preventDefault();

    		onClick({
    			offsetX: e.changedTouches[0].clientX - picker.getBoundingClientRect().left,
    			offsetY: e.changedTouches[0].clientY - picker.getBoundingClientRect().top
    		});
    	}

    	const writable_props = ['components', 'h', 's', 'v', 'isOpen', 'toRight', 'isDark'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Picker> was created with unknown prop '${key}'`);
    	});

    	function div_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			picker = $$value;
    			$$invalidate(6, picker);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('components' in $$props) $$invalidate(2, components = $$props.components);
    		if ('h' in $$props) $$invalidate(3, h = $$props.h);
    		if ('s' in $$props) $$invalidate(0, s = $$props.s);
    		if ('v' in $$props) $$invalidate(1, v = $$props.v);
    		if ('isOpen' in $$props) $$invalidate(17, isOpen = $$props.isOpen);
    		if ('toRight' in $$props) $$invalidate(4, toRight = $$props.toRight);
    		if ('isDark' in $$props) $$invalidate(5, isDark = $$props.isDark);
    	};

    	$$self.$capture_state = () => ({
    		hsv2Color: umd.hsv2Color,
    		clamp: umd.clamp,
    		keyPressed,
    		keyPressedCustom,
    		easeInOutSin,
    		components,
    		h,
    		s,
    		v,
    		isOpen,
    		toRight,
    		isDark,
    		picker,
    		isMouseDown,
    		focused,
    		focusMovementIntervalId,
    		focusMovementCounter,
    		colorBg,
    		pos,
    		onClick,
    		pickerMouseDown,
    		mouseUp,
    		mouseMove,
    		mouseDown,
    		keyup,
    		keydown,
    		move,
    		touch,
    		$keyPressed,
    		$keyPressedCustom
    	});

    	$$self.$inject_state = $$props => {
    		if ('components' in $$props) $$invalidate(2, components = $$props.components);
    		if ('h' in $$props) $$invalidate(3, h = $$props.h);
    		if ('s' in $$props) $$invalidate(0, s = $$props.s);
    		if ('v' in $$props) $$invalidate(1, v = $$props.v);
    		if ('isOpen' in $$props) $$invalidate(17, isOpen = $$props.isOpen);
    		if ('toRight' in $$props) $$invalidate(4, toRight = $$props.toRight);
    		if ('isDark' in $$props) $$invalidate(5, isDark = $$props.isDark);
    		if ('picker' in $$props) $$invalidate(6, picker = $$props.picker);
    		if ('isMouseDown' in $$props) isMouseDown = $$props.isMouseDown;
    		if ('focused' in $$props) $$invalidate(7, focused = $$props.focused);
    		if ('focusMovementIntervalId' in $$props) focusMovementIntervalId = $$props.focusMovementIntervalId;
    		if ('focusMovementCounter' in $$props) focusMovementCounter = $$props.focusMovementCounter;
    		if ('colorBg' in $$props) $$invalidate(8, colorBg = $$props.colorBg);
    		if ('pos' in $$props) $$invalidate(9, pos = $$props.pos);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*h*/ 8) {
    			if (typeof h === 'number') $$invalidate(8, colorBg = umd.hsv2Color({ h, s: 1, v: 1, a: 1 }));
    		}

    		if ($$self.$$.dirty & /*s, v, picker*/ 67) {
    			if (typeof s === 'number' && typeof v === 'number' && picker) $$invalidate(9, pos = { x: s * 100, y: (1 - v) * 100 });
    		}
    	};

    	return [
    		s,
    		v,
    		components,
    		h,
    		toRight,
    		isDark,
    		picker,
    		focused,
    		colorBg,
    		pos,
    		pickerMouseDown,
    		mouseUp,
    		mouseMove,
    		mouseDown,
    		keyup,
    		keydown,
    		touch,
    		isOpen,
    		div_binding
    	];
    }

    class Picker extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$O, create_fragment$Q, safe_not_equal, {
    			components: 2,
    			h: 3,
    			s: 0,
    			v: 1,
    			isOpen: 17,
    			toRight: 4,
    			isDark: 5
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Picker",
    			options,
    			id: create_fragment$Q.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*components*/ ctx[2] === undefined && !('components' in props)) {
    			console.warn("<Picker> was created without expected prop 'components'");
    		}

    		if (/*h*/ ctx[3] === undefined && !('h' in props)) {
    			console.warn("<Picker> was created without expected prop 'h'");
    		}

    		if (/*s*/ ctx[0] === undefined && !('s' in props)) {
    			console.warn("<Picker> was created without expected prop 's'");
    		}

    		if (/*v*/ ctx[1] === undefined && !('v' in props)) {
    			console.warn("<Picker> was created without expected prop 'v'");
    		}

    		if (/*isOpen*/ ctx[17] === undefined && !('isOpen' in props)) {
    			console.warn("<Picker> was created without expected prop 'isOpen'");
    		}

    		if (/*toRight*/ ctx[4] === undefined && !('toRight' in props)) {
    			console.warn("<Picker> was created without expected prop 'toRight'");
    		}

    		if (/*isDark*/ ctx[5] === undefined && !('isDark' in props)) {
    			console.warn("<Picker> was created without expected prop 'isDark'");
    		}
    	}

    	get components() {
    		throw new Error("<Picker>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set components(value) {
    		throw new Error("<Picker>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get h() {
    		throw new Error("<Picker>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set h(value) {
    		throw new Error("<Picker>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get s() {
    		throw new Error("<Picker>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set s(value) {
    		throw new Error("<Picker>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get v() {
    		throw new Error("<Picker>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set v(value) {
    		throw new Error("<Picker>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isOpen() {
    		throw new Error("<Picker>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isOpen(value) {
    		throw new Error("<Picker>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get toRight() {
    		throw new Error("<Picker>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set toRight(value) {
    		throw new Error("<Picker>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isDark() {
    		throw new Error("<Picker>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isDark(value) {
    		throw new Error("<Picker>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\svelte-awesome-color-picker\components\Slider.svelte generated by Svelte v3.49.0 */

    const { window: window_1$2 } = globals;
    const file$K = "node_modules\\svelte-awesome-color-picker\\components\\Slider.svelte";

    // (82:0) <svelte:component this={components.sliderWrapper} {focused} {toRight}>
    function create_default_slot$9(ctx) {
    	let div;
    	let switch_instance;
    	let current;
    	let mounted;
    	let dispose;
    	var switch_value = /*components*/ ctx[0].sliderIndicator;

    	function switch_props(ctx) {
    		return {
    			props: {
    				pos: /*pos*/ ctx[3],
    				toRight: /*toRight*/ ctx[1]
    			},
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props(ctx));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			attr_dev(div, "class", "slider svelte-k84egy");
    			attr_dev(div, "tabindex", "0");
    			toggle_class(div, "to-right", /*toRight*/ ctx[1]);
    			add_location(div, file$K, 82, 1, 2429);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (switch_instance) {
    				mount_component(switch_instance, div, null);
    			}

    			/*div_binding*/ ctx[12](div);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div, "mousedown", stop_propagation(prevent_default(/*mouseDown*/ ctx[5])), false, true, true),
    					listen_dev(div, "touchstart", /*touch*/ ctx[10], false, false, false),
    					listen_dev(div, "touchmove", stop_propagation(prevent_default(/*touch*/ ctx[10])), false, true, true),
    					listen_dev(div, "touchend", /*touch*/ ctx[10], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = {};
    			if (dirty & /*pos*/ 8) switch_instance_changes.pos = /*pos*/ ctx[3];
    			if (dirty & /*toRight*/ 2) switch_instance_changes.toRight = /*toRight*/ ctx[1];

    			if (switch_value !== (switch_value = /*components*/ ctx[0].sliderIndicator)) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props(ctx));
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, div, null);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}

    			if (dirty & /*toRight*/ 2) {
    				toggle_class(div, "to-right", /*toRight*/ ctx[1]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (switch_instance) destroy_component(switch_instance);
    			/*div_binding*/ ctx[12](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$9.name,
    		type: "slot",
    		source: "(82:0) <svelte:component this={components.sliderWrapper} {focused} {toRight}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$P(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	let mounted;
    	let dispose;
    	var switch_value = /*components*/ ctx[0].sliderWrapper;

    	function switch_props(ctx) {
    		return {
    			props: {
    				focused: /*focused*/ ctx[4],
    				toRight: /*toRight*/ ctx[1],
    				$$slots: { default: [create_default_slot$9] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props(ctx));
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(window_1$2, "mouseup", /*mouseUp*/ ctx[6], false, false, false),
    					listen_dev(window_1$2, "mousemove", /*mouseMove*/ ctx[7], false, false, false),
    					listen_dev(window_1$2, "keyup", /*keyup*/ ctx[8], false, false, false),
    					listen_dev(window_1$2, "keydown", /*keydown*/ ctx[9], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			const switch_instance_changes = {};
    			if (dirty & /*focused*/ 16) switch_instance_changes.focused = /*focused*/ ctx[4];
    			if (dirty & /*toRight*/ 2) switch_instance_changes.toRight = /*toRight*/ ctx[1];

    			if (dirty & /*$$scope, slider, toRight, components, pos*/ 1048591) {
    				switch_instance_changes.$$scope = { dirty, ctx };
    			}

    			if (switch_value !== (switch_value = /*components*/ ctx[0].sliderWrapper)) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props(ctx));
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$P.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$N($$self, $$props, $$invalidate) {
    	let $keyPressed;
    	let $keyPressedCustom;
    	validate_store(keyPressed, 'keyPressed');
    	component_subscribe($$self, keyPressed, $$value => $$invalidate(16, $keyPressed = $$value));
    	validate_store(keyPressedCustom, 'keyPressedCustom');
    	component_subscribe($$self, keyPressedCustom, $$value => $$invalidate(17, $keyPressedCustom = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Slider', slots, []);
    	let { components } = $$props;
    	let { toRight } = $$props;
    	let slider;
    	let isMouseDown = false;
    	let { h } = $$props;
    	let pos = 0;
    	let focused = false;
    	let focusMovementIntervalId;
    	let focusMovementCounter;

    	function onClick(pos) {
    		const size = toRight
    		? slider.getBoundingClientRect().width
    		: slider.getBoundingClientRect().height;

    		const boundedPos = Math.max(0, Math.min(size, pos));
    		$$invalidate(11, h = boundedPos / size * 360);
    	}

    	function mouseDown(e) {
    		if (e.button === 0) {
    			isMouseDown = true;
    			onClick(toRight ? e.offsetX : e.offsetY);
    		}
    	}

    	function mouseUp() {
    		isMouseDown = false;
    	}

    	function mouseMove(e) {
    		if (isMouseDown) onClick(toRight
    		? e.clientX - slider.getBoundingClientRect().left
    		: e.clientY - slider.getBoundingClientRect().top);
    	}

    	function keyup(e) {
    		if (e.key === 'Tab') $$invalidate(4, focused = !!document.activeElement?.isSameNode(slider));
    		if (!e.repeat && focused) move();
    	}

    	function keydown(e) {
    		if (focused && $keyPressedCustom.ArrowVH) {
    			e.preventDefault();
    			if (!e.repeat) move();
    		}
    	}

    	function move() {
    		if ($keyPressedCustom.ArrowVH) {
    			if (!focusMovementIntervalId) {
    				focusMovementCounter = 0;

    				focusMovementIntervalId = window.setInterval(
    					() => {
    						const focusMovementFactor = easeInOutSin(++focusMovementCounter);

    						const movement = toRight
    						? $keyPressed.ArrowRight - $keyPressed.ArrowLeft
    						: $keyPressed.ArrowDown - $keyPressed.ArrowUp;

    						$$invalidate(11, h = Math.min(360, Math.max(0, h + movement * 360 * focusMovementFactor)));
    					},
    					10
    				);
    			}
    		} else if (focusMovementIntervalId) {
    			clearInterval(focusMovementIntervalId);
    			focusMovementIntervalId = undefined;
    		}
    	}

    	function touch(e) {
    		e.preventDefault();

    		onClick(toRight
    		? e.changedTouches[0].clientX - slider.getBoundingClientRect().left
    		: e.changedTouches[0].clientY - slider.getBoundingClientRect().top);
    	}

    	const writable_props = ['components', 'toRight', 'h'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Slider> was created with unknown prop '${key}'`);
    	});

    	function div_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			slider = $$value;
    			$$invalidate(2, slider);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('components' in $$props) $$invalidate(0, components = $$props.components);
    		if ('toRight' in $$props) $$invalidate(1, toRight = $$props.toRight);
    		if ('h' in $$props) $$invalidate(11, h = $$props.h);
    	};

    	$$self.$capture_state = () => ({
    		keyPressed,
    		keyPressedCustom,
    		easeInOutSin,
    		components,
    		toRight,
    		slider,
    		isMouseDown,
    		h,
    		pos,
    		focused,
    		focusMovementIntervalId,
    		focusMovementCounter,
    		onClick,
    		mouseDown,
    		mouseUp,
    		mouseMove,
    		keyup,
    		keydown,
    		move,
    		touch,
    		$keyPressed,
    		$keyPressedCustom
    	});

    	$$self.$inject_state = $$props => {
    		if ('components' in $$props) $$invalidate(0, components = $$props.components);
    		if ('toRight' in $$props) $$invalidate(1, toRight = $$props.toRight);
    		if ('slider' in $$props) $$invalidate(2, slider = $$props.slider);
    		if ('isMouseDown' in $$props) isMouseDown = $$props.isMouseDown;
    		if ('h' in $$props) $$invalidate(11, h = $$props.h);
    		if ('pos' in $$props) $$invalidate(3, pos = $$props.pos);
    		if ('focused' in $$props) $$invalidate(4, focused = $$props.focused);
    		if ('focusMovementIntervalId' in $$props) focusMovementIntervalId = $$props.focusMovementIntervalId;
    		if ('focusMovementCounter' in $$props) focusMovementCounter = $$props.focusMovementCounter;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*h, slider*/ 2052) {
    			if (typeof h === 'number' && slider) $$invalidate(3, pos = 100 * h / 360);
    		}
    	};

    	return [
    		components,
    		toRight,
    		slider,
    		pos,
    		focused,
    		mouseDown,
    		mouseUp,
    		mouseMove,
    		keyup,
    		keydown,
    		touch,
    		h,
    		div_binding
    	];
    }

    class Slider extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$N, create_fragment$P, safe_not_equal, { components: 0, toRight: 1, h: 11 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Slider",
    			options,
    			id: create_fragment$P.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*components*/ ctx[0] === undefined && !('components' in props)) {
    			console.warn("<Slider> was created without expected prop 'components'");
    		}

    		if (/*toRight*/ ctx[1] === undefined && !('toRight' in props)) {
    			console.warn("<Slider> was created without expected prop 'toRight'");
    		}

    		if (/*h*/ ctx[11] === undefined && !('h' in props)) {
    			console.warn("<Slider> was created without expected prop 'h'");
    		}
    	}

    	get components() {
    		throw new Error("<Slider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set components(value) {
    		throw new Error("<Slider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get toRight() {
    		throw new Error("<Slider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set toRight(value) {
    		throw new Error("<Slider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get h() {
    		throw new Error("<Slider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set h(value) {
    		throw new Error("<Slider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\svelte-awesome-color-picker\components\Alpha.svelte generated by Svelte v3.49.0 */

    const { window: window_1$1 } = globals;
    const file$J = "node_modules\\svelte-awesome-color-picker\\components\\Alpha.svelte";

    // (89:0) <svelte:component this={components.alphaWrapper} {focused} {toRight}>
    function create_default_slot$8(ctx) {
    	let div;
    	let switch_instance;
    	let current;
    	let mounted;
    	let dispose;
    	var switch_value = /*components*/ ctx[1].alphaIndicator;

    	function switch_props(ctx) {
    		return {
    			props: {
    				pos: /*pos*/ ctx[9],
    				toRight: /*toRight*/ ctx[6],
    				color: umd.hsv2Color({
    					h: /*h*/ ctx[2],
    					s: /*s*/ ctx[3],
    					v: /*v*/ ctx[4],
    					a: /*a*/ ctx[0]
    				})
    			},
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props(ctx));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			attr_dev(div, "tabindex", "0");
    			attr_dev(div, "class", "alpha svelte-1526m2d");
    			set_style(div, "--alpha-color", /*hex*/ ctx[5]?.substring(0, 7));
    			toggle_class(div, "to-right", /*toRight*/ ctx[6]);
    			add_location(div, file$J, 89, 1, 2545);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (switch_instance) {
    				mount_component(switch_instance, div, null);
    			}

    			/*div_binding*/ ctx[17](div);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div, "mousedown", stop_propagation(prevent_default(/*mouseDown*/ ctx[10])), false, true, true),
    					listen_dev(div, "touchstart", /*touch*/ ctx[15], false, false, false),
    					listen_dev(div, "touchmove", stop_propagation(prevent_default(/*touch*/ ctx[15])), false, true, true),
    					listen_dev(div, "touchend", /*touch*/ ctx[15], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = {};
    			if (dirty & /*pos*/ 512) switch_instance_changes.pos = /*pos*/ ctx[9];
    			if (dirty & /*toRight*/ 64) switch_instance_changes.toRight = /*toRight*/ ctx[6];

    			if (dirty & /*h, s, v, a*/ 29) switch_instance_changes.color = umd.hsv2Color({
    				h: /*h*/ ctx[2],
    				s: /*s*/ ctx[3],
    				v: /*v*/ ctx[4],
    				a: /*a*/ ctx[0]
    			});

    			if (switch_value !== (switch_value = /*components*/ ctx[1].alphaIndicator)) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props(ctx));
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, div, null);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}

    			if (!current || dirty & /*hex*/ 32) {
    				set_style(div, "--alpha-color", /*hex*/ ctx[5]?.substring(0, 7));
    			}

    			if (dirty & /*toRight*/ 64) {
    				toggle_class(div, "to-right", /*toRight*/ ctx[6]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (switch_instance) destroy_component(switch_instance);
    			/*div_binding*/ ctx[17](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$8.name,
    		type: "slot",
    		source: "(89:0) <svelte:component this={components.alphaWrapper} {focused} {toRight}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$O(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	let mounted;
    	let dispose;
    	var switch_value = /*components*/ ctx[1].alphaWrapper;

    	function switch_props(ctx) {
    		return {
    			props: {
    				focused: /*focused*/ ctx[8],
    				toRight: /*toRight*/ ctx[6],
    				$$slots: { default: [create_default_slot$8] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props(ctx));
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(window_1$1, "mouseup", /*mouseUp*/ ctx[11], false, false, false),
    					listen_dev(window_1$1, "mousemove", /*mouseMove*/ ctx[12], false, false, false),
    					listen_dev(window_1$1, "keyup", /*keyup*/ ctx[13], false, false, false),
    					listen_dev(window_1$1, "keydown", /*keydown*/ ctx[14], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			const switch_instance_changes = {};
    			if (dirty & /*focused*/ 256) switch_instance_changes.focused = /*focused*/ ctx[8];
    			if (dirty & /*toRight*/ 64) switch_instance_changes.toRight = /*toRight*/ ctx[6];

    			if (dirty & /*$$scope, hex, alpha, toRight, components, pos, h, s, v, a*/ 33555199) {
    				switch_instance_changes.$$scope = { dirty, ctx };
    			}

    			if (switch_value !== (switch_value = /*components*/ ctx[1].alphaWrapper)) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props(ctx));
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$O.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$M($$self, $$props, $$invalidate) {
    	let $keyPressed;
    	let $keyPressedCustom;
    	validate_store(keyPressed, 'keyPressed');
    	component_subscribe($$self, keyPressed, $$value => $$invalidate(21, $keyPressed = $$value));
    	validate_store(keyPressedCustom, 'keyPressedCustom');
    	component_subscribe($$self, keyPressedCustom, $$value => $$invalidate(22, $keyPressedCustom = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Alpha', slots, []);
    	let { components } = $$props;
    	let { isOpen } = $$props;
    	let { h } = $$props;
    	let { s } = $$props;
    	let { v } = $$props;
    	let { a = 1 } = $$props;
    	let { hex } = $$props;
    	let { toRight } = $$props;
    	let alpha;
    	let isMouseDown = false;
    	let focused = false;
    	let focusMovementIntervalId;
    	let focusMovementCounter;
    	let pos;

    	function onClick(pos) {
    		const size = toRight
    		? alpha.getBoundingClientRect().width
    		: alpha.getBoundingClientRect().height;

    		const boundedPos = Math.max(0, Math.min(size, pos));
    		$$invalidate(0, a = boundedPos / size);
    	}

    	function mouseDown(e) {
    		if (e.button === 0) {
    			isMouseDown = true;
    			onClick(toRight ? e.offsetX : e.offsetY);
    		}
    	}

    	function mouseUp() {
    		isMouseDown = false;
    	}

    	function mouseMove(e) {
    		if (isMouseDown) onClick(toRight
    		? e.clientX - alpha.getBoundingClientRect().left
    		: e.clientY - alpha.getBoundingClientRect().top);
    	}

    	function keyup(e) {
    		if (e.key === 'Tab') $$invalidate(8, focused = !!document.activeElement?.isSameNode(alpha));
    		if (!e.repeat && focused) move();
    	}

    	function keydown(e) {
    		if (focused && $keyPressedCustom.ArrowVH) {
    			e.preventDefault();
    			if (!e.repeat) move();
    		}
    	}

    	function move() {
    		if ($keyPressedCustom.ArrowVH) {
    			if (!focusMovementIntervalId) {
    				focusMovementCounter = 0;

    				focusMovementIntervalId = window.setInterval(
    					() => {
    						const focusMovementFactor = easeInOutSin(++focusMovementCounter);

    						const movement = toRight
    						? $keyPressed.ArrowRight - $keyPressed.ArrowLeft
    						: $keyPressed.ArrowDown - $keyPressed.ArrowUp;

    						$$invalidate(0, a = Math.min(1, Math.max(0, a + movement * focusMovementFactor)));
    					},
    					10
    				);
    			}
    		} else if (focusMovementIntervalId) {
    			clearInterval(focusMovementIntervalId);
    			focusMovementIntervalId = undefined;
    		}
    	}

    	function touch(e) {
    		e.preventDefault();

    		onClick(toRight
    		? e.changedTouches[0].clientX - alpha.getBoundingClientRect().left
    		: e.changedTouches[0].clientY - alpha.getBoundingClientRect().top);
    	}

    	const writable_props = ['components', 'isOpen', 'h', 's', 'v', 'a', 'hex', 'toRight'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Alpha> was created with unknown prop '${key}'`);
    	});

    	function div_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			alpha = $$value;
    			$$invalidate(7, alpha);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('components' in $$props) $$invalidate(1, components = $$props.components);
    		if ('isOpen' in $$props) $$invalidate(16, isOpen = $$props.isOpen);
    		if ('h' in $$props) $$invalidate(2, h = $$props.h);
    		if ('s' in $$props) $$invalidate(3, s = $$props.s);
    		if ('v' in $$props) $$invalidate(4, v = $$props.v);
    		if ('a' in $$props) $$invalidate(0, a = $$props.a);
    		if ('hex' in $$props) $$invalidate(5, hex = $$props.hex);
    		if ('toRight' in $$props) $$invalidate(6, toRight = $$props.toRight);
    	};

    	$$self.$capture_state = () => ({
    		hsv2Color: umd.hsv2Color,
    		keyPressed,
    		keyPressedCustom,
    		easeInOutSin,
    		components,
    		isOpen,
    		h,
    		s,
    		v,
    		a,
    		hex,
    		toRight,
    		alpha,
    		isMouseDown,
    		focused,
    		focusMovementIntervalId,
    		focusMovementCounter,
    		pos,
    		onClick,
    		mouseDown,
    		mouseUp,
    		mouseMove,
    		keyup,
    		keydown,
    		move,
    		touch,
    		$keyPressed,
    		$keyPressedCustom
    	});

    	$$self.$inject_state = $$props => {
    		if ('components' in $$props) $$invalidate(1, components = $$props.components);
    		if ('isOpen' in $$props) $$invalidate(16, isOpen = $$props.isOpen);
    		if ('h' in $$props) $$invalidate(2, h = $$props.h);
    		if ('s' in $$props) $$invalidate(3, s = $$props.s);
    		if ('v' in $$props) $$invalidate(4, v = $$props.v);
    		if ('a' in $$props) $$invalidate(0, a = $$props.a);
    		if ('hex' in $$props) $$invalidate(5, hex = $$props.hex);
    		if ('toRight' in $$props) $$invalidate(6, toRight = $$props.toRight);
    		if ('alpha' in $$props) $$invalidate(7, alpha = $$props.alpha);
    		if ('isMouseDown' in $$props) isMouseDown = $$props.isMouseDown;
    		if ('focused' in $$props) $$invalidate(8, focused = $$props.focused);
    		if ('focusMovementIntervalId' in $$props) focusMovementIntervalId = $$props.focusMovementIntervalId;
    		if ('focusMovementCounter' in $$props) focusMovementCounter = $$props.focusMovementCounter;
    		if ('pos' in $$props) $$invalidate(9, pos = $$props.pos);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*a, alpha*/ 129) {
    			if (typeof a === 'number' && alpha) $$invalidate(9, pos = 100 * a);
    		}
    	};

    	return [
    		a,
    		components,
    		h,
    		s,
    		v,
    		hex,
    		toRight,
    		alpha,
    		focused,
    		pos,
    		mouseDown,
    		mouseUp,
    		mouseMove,
    		keyup,
    		keydown,
    		touch,
    		isOpen,
    		div_binding
    	];
    }

    class Alpha extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$M, create_fragment$O, safe_not_equal, {
    			components: 1,
    			isOpen: 16,
    			h: 2,
    			s: 3,
    			v: 4,
    			a: 0,
    			hex: 5,
    			toRight: 6
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Alpha",
    			options,
    			id: create_fragment$O.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*components*/ ctx[1] === undefined && !('components' in props)) {
    			console.warn("<Alpha> was created without expected prop 'components'");
    		}

    		if (/*isOpen*/ ctx[16] === undefined && !('isOpen' in props)) {
    			console.warn("<Alpha> was created without expected prop 'isOpen'");
    		}

    		if (/*h*/ ctx[2] === undefined && !('h' in props)) {
    			console.warn("<Alpha> was created without expected prop 'h'");
    		}

    		if (/*s*/ ctx[3] === undefined && !('s' in props)) {
    			console.warn("<Alpha> was created without expected prop 's'");
    		}

    		if (/*v*/ ctx[4] === undefined && !('v' in props)) {
    			console.warn("<Alpha> was created without expected prop 'v'");
    		}

    		if (/*hex*/ ctx[5] === undefined && !('hex' in props)) {
    			console.warn("<Alpha> was created without expected prop 'hex'");
    		}

    		if (/*toRight*/ ctx[6] === undefined && !('toRight' in props)) {
    			console.warn("<Alpha> was created without expected prop 'toRight'");
    		}
    	}

    	get components() {
    		throw new Error("<Alpha>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set components(value) {
    		throw new Error("<Alpha>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isOpen() {
    		throw new Error("<Alpha>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isOpen(value) {
    		throw new Error("<Alpha>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get h() {
    		throw new Error("<Alpha>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set h(value) {
    		throw new Error("<Alpha>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get s() {
    		throw new Error("<Alpha>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set s(value) {
    		throw new Error("<Alpha>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get v() {
    		throw new Error("<Alpha>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set v(value) {
    		throw new Error("<Alpha>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get a() {
    		throw new Error("<Alpha>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set a(value) {
    		throw new Error("<Alpha>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get hex() {
    		throw new Error("<Alpha>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hex(value) {
    		throw new Error("<Alpha>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get toRight() {
    		throw new Error("<Alpha>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set toRight(value) {
    		throw new Error("<Alpha>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\svelte-awesome-color-picker\components\variant\default\TextInput.svelte generated by Svelte v3.49.0 */

    const file$I = "node_modules\\svelte-awesome-color-picker\\components\\variant\\default\\TextInput.svelte";

    // (42:1) {:else}
    function create_else_block$5(ctx) {
    	let div;
    	let input0;
    	let t0;
    	let input1;
    	let t1;
    	let input2;
    	let t2;
    	let input3;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			input0 = element("input");
    			t0 = space();
    			input1 = element("input");
    			t1 = space();
    			input2 = element("input");
    			t2 = space();
    			input3 = element("input");
    			input0.value = /*h*/ ctx[6];
    			attr_dev(input0, "type", "number");
    			attr_dev(input0, "min", "0");
    			attr_dev(input0, "max", "360");
    			attr_dev(input0, "class", "svelte-19fere0");
    			add_location(input0, file$I, 43, 3, 1431);
    			input1.value = /*s*/ ctx[5];
    			attr_dev(input1, "type", "number");
    			attr_dev(input1, "min", "0");
    			attr_dev(input1, "max", "1");
    			attr_dev(input1, "step", "0.01");
    			attr_dev(input1, "class", "svelte-19fere0");
    			add_location(input1, file$I, 44, 3, 1512);
    			input2.value = /*v*/ ctx[4];
    			attr_dev(input2, "type", "number");
    			attr_dev(input2, "min", "0");
    			attr_dev(input2, "max", "1");
    			attr_dev(input2, "step", "0.01");
    			attr_dev(input2, "class", "svelte-19fere0");
    			add_location(input2, file$I, 45, 3, 1603);
    			input3.value = /*a*/ ctx[3];
    			attr_dev(input3, "type", "number");
    			attr_dev(input3, "min", "0");
    			attr_dev(input3, "max", "1");
    			attr_dev(input3, "step", "0.01");
    			attr_dev(input3, "class", "svelte-19fere0");
    			add_location(input3, file$I, 46, 3, 1694);
    			attr_dev(div, "class", "input-container svelte-19fere0");
    			add_location(div, file$I, 42, 2, 1398);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, input0);
    			append_dev(div, t0);
    			append_dev(div, input1);
    			append_dev(div, t1);
    			append_dev(div, input2);
    			append_dev(div, t2);
    			append_dev(div, input3);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*updateHsv*/ ctx[10]('h'), false, false, false),
    					listen_dev(input1, "input", /*updateHsv*/ ctx[10]('s'), false, false, false),
    					listen_dev(input2, "input", /*updateHsv*/ ctx[10]('v'), false, false, false),
    					listen_dev(input3, "input", /*updateHsv*/ ctx[10]('a'), false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*h*/ 64 && input0.value !== /*h*/ ctx[6]) {
    				prop_dev(input0, "value", /*h*/ ctx[6]);
    			}

    			if (dirty & /*s*/ 32 && input1.value !== /*s*/ ctx[5]) {
    				prop_dev(input1, "value", /*s*/ ctx[5]);
    			}

    			if (dirty & /*v*/ 16 && input2.value !== /*v*/ ctx[4]) {
    				prop_dev(input2, "value", /*v*/ ctx[4]);
    			}

    			if (dirty & /*a*/ 8 && input3.value !== /*a*/ ctx[3]) {
    				prop_dev(input3, "value", /*a*/ ctx[3]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$5.name,
    		type: "else",
    		source: "(42:1) {:else}",
    		ctx
    	});

    	return block;
    }

    // (35:22) 
    function create_if_block_1$7(ctx) {
    	let div;
    	let input0;
    	let input0_value_value;
    	let t0;
    	let input1;
    	let input1_value_value;
    	let t1;
    	let input2;
    	let input2_value_value;
    	let t2;
    	let input3;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			input0 = element("input");
    			t0 = space();
    			input1 = element("input");
    			t1 = space();
    			input2 = element("input");
    			t2 = space();
    			input3 = element("input");
    			input0.value = input0_value_value = /*rgb*/ ctx[0].r;
    			attr_dev(input0, "type", "number");
    			attr_dev(input0, "min", "0");
    			attr_dev(input0, "max", "255");
    			attr_dev(input0, "class", "svelte-19fere0");
    			add_location(input0, file$I, 36, 3, 1035);
    			input1.value = input1_value_value = /*rgb*/ ctx[0].g;
    			attr_dev(input1, "type", "number");
    			attr_dev(input1, "min", "0");
    			attr_dev(input1, "max", "255");
    			attr_dev(input1, "class", "svelte-19fere0");
    			add_location(input1, file$I, 37, 3, 1120);
    			input2.value = input2_value_value = /*rgb*/ ctx[0].b;
    			attr_dev(input2, "type", "number");
    			attr_dev(input2, "min", "0");
    			attr_dev(input2, "max", "255");
    			attr_dev(input2, "class", "svelte-19fere0");
    			add_location(input2, file$I, 38, 3, 1205);
    			input3.value = /*a*/ ctx[3];
    			attr_dev(input3, "type", "number");
    			attr_dev(input3, "min", "0");
    			attr_dev(input3, "max", "1");
    			attr_dev(input3, "step", "0.01");
    			attr_dev(input3, "class", "svelte-19fere0");
    			add_location(input3, file$I, 39, 3, 1290);
    			attr_dev(div, "class", "input-container svelte-19fere0");
    			add_location(div, file$I, 35, 2, 1002);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, input0);
    			append_dev(div, t0);
    			append_dev(div, input1);
    			append_dev(div, t1);
    			append_dev(div, input2);
    			append_dev(div, t2);
    			append_dev(div, input3);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*updateRgb*/ ctx[9]('r'), false, false, false),
    					listen_dev(input1, "input", /*updateRgb*/ ctx[9]('g'), false, false, false),
    					listen_dev(input2, "input", /*updateRgb*/ ctx[9]('b'), false, false, false),
    					listen_dev(input3, "input", /*updateRgb*/ ctx[9]('a'), false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*rgb*/ 1 && input0_value_value !== (input0_value_value = /*rgb*/ ctx[0].r) && input0.value !== input0_value_value) {
    				prop_dev(input0, "value", input0_value_value);
    			}

    			if (dirty & /*rgb*/ 1 && input1_value_value !== (input1_value_value = /*rgb*/ ctx[0].g) && input1.value !== input1_value_value) {
    				prop_dev(input1, "value", input1_value_value);
    			}

    			if (dirty & /*rgb*/ 1 && input2_value_value !== (input2_value_value = /*rgb*/ ctx[0].b) && input2.value !== input2_value_value) {
    				prop_dev(input2, "value", input2_value_value);
    			}

    			if (dirty & /*a*/ 8 && input3.value !== /*a*/ ctx[3]) {
    				prop_dev(input3, "value", /*a*/ ctx[3]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$7.name,
    		type: "if",
    		source: "(35:22) ",
    		ctx
    	});

    	return block;
    }

    // (30:1) {#if mode === 0}
    function create_if_block$g(ctx) {
    	let div;
    	let input0;
    	let t;
    	let input1;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			input0 = element("input");
    			t = space();
    			input1 = element("input");
    			input0.value = /*hex*/ ctx[1];
    			set_style(input0, "flex", "3");
    			attr_dev(input0, "class", "svelte-19fere0");
    			add_location(input0, file$I, 31, 3, 818);
    			input1.value = /*a*/ ctx[3];
    			attr_dev(input1, "type", "number");
    			attr_dev(input1, "min", "0");
    			attr_dev(input1, "max", "1");
    			attr_dev(input1, "step", "0.01");
    			attr_dev(input1, "class", "svelte-19fere0");
    			add_location(input1, file$I, 32, 3, 880);
    			attr_dev(div, "class", "input-container svelte-19fere0");
    			add_location(div, file$I, 30, 2, 785);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, input0);
    			append_dev(div, t);
    			append_dev(div, input1);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*updateHex*/ ctx[8], false, false, false),
    					listen_dev(input1, "input", /*updateRgb*/ ctx[9]('a'), false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*hex*/ 2 && input0.value !== /*hex*/ ctx[1]) {
    				prop_dev(input0, "value", /*hex*/ ctx[1]);
    			}

    			if (dirty & /*a*/ 8 && input1.value !== /*a*/ ctx[3]) {
    				prop_dev(input1, "value", /*a*/ ctx[3]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$g.name,
    		type: "if",
    		source: "(30:1) {#if mode === 0}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$N(ctx) {
    	let div;
    	let t0;
    	let button;
    	let t1_value = /*modes*/ ctx[7][/*mode*/ ctx[2]] + "";
    	let t1;
    	let mounted;
    	let dispose;

    	function select_block_type(ctx, dirty) {
    		if (/*mode*/ ctx[2] === 0) return create_if_block$g;
    		if (/*mode*/ ctx[2] === 1) return create_if_block_1$7;
    		return create_else_block$5;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if_block.c();
    			t0 = space();
    			button = element("button");
    			t1 = text(t1_value);
    			attr_dev(button, "class", "svelte-19fere0");
    			add_location(button, file$I, 49, 1, 1799);
    			attr_dev(div, "class", "container svelte-19fere0");
    			add_location(div, file$I, 28, 0, 741);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if_block.m(div, null);
    			append_dev(div, t0);
    			append_dev(div, button);
    			append_dev(button, t1);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[12], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(div, t0);
    				}
    			}

    			if (dirty & /*mode*/ 4 && t1_value !== (t1_value = /*modes*/ ctx[7][/*mode*/ ctx[2]] + "")) set_data_dev(t1, t1_value);
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if_block.d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$N.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const HEX_COLOR_REGEX = /^#?([A-F0-9]{6}|[A-F0-9]{8})$/i;

    function instance$L($$self, $$props, $$invalidate) {
    	let h;
    	let s;
    	let v;
    	let a;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('TextInput', slots, []);
    	let { rgb } = $$props;
    	let { hsv } = $$props;
    	let { hex } = $$props;
    	const modes = ['HEX', 'RGB', 'HSV'];
    	let mode = 0;

    	function updateHex(e) {
    		const target = e.target;

    		if (HEX_COLOR_REGEX.test(target.value)) {
    			$$invalidate(1, hex = target.value);
    		}
    	}

    	function updateRgb(property) {
    		return function (e) {
    			$$invalidate(0, rgb = {
    				...rgb,
    				[property]: parseFloat(e.target.value)
    			});
    		};
    	}

    	function updateHsv(property) {
    		return function (e) {
    			$$invalidate(11, hsv = {
    				...hsv,
    				[property]: parseFloat(e.target.value)
    			});
    		};
    	}

    	const writable_props = ['rgb', 'hsv', 'hex'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<TextInput> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => $$invalidate(2, mode = (mode + 1) % 3);

    	$$self.$$set = $$props => {
    		if ('rgb' in $$props) $$invalidate(0, rgb = $$props.rgb);
    		if ('hsv' in $$props) $$invalidate(11, hsv = $$props.hsv);
    		if ('hex' in $$props) $$invalidate(1, hex = $$props.hex);
    	};

    	$$self.$capture_state = () => ({
    		rgb,
    		hsv,
    		hex,
    		HEX_COLOR_REGEX,
    		modes,
    		mode,
    		updateHex,
    		updateRgb,
    		updateHsv,
    		a,
    		v,
    		s,
    		h
    	});

    	$$self.$inject_state = $$props => {
    		if ('rgb' in $$props) $$invalidate(0, rgb = $$props.rgb);
    		if ('hsv' in $$props) $$invalidate(11, hsv = $$props.hsv);
    		if ('hex' in $$props) $$invalidate(1, hex = $$props.hex);
    		if ('mode' in $$props) $$invalidate(2, mode = $$props.mode);
    		if ('a' in $$props) $$invalidate(3, a = $$props.a);
    		if ('v' in $$props) $$invalidate(4, v = $$props.v);
    		if ('s' in $$props) $$invalidate(5, s = $$props.s);
    		if ('h' in $$props) $$invalidate(6, h = $$props.h);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*hsv*/ 2048) {
    			$$invalidate(6, h = Math.round(hsv.h));
    		}

    		if ($$self.$$.dirty & /*hsv*/ 2048) {
    			$$invalidate(5, s = Math.round(hsv.s * 100) / 100);
    		}

    		if ($$self.$$.dirty & /*hsv*/ 2048) {
    			$$invalidate(4, v = Math.round(hsv.v * 100) / 100);
    		}

    		if ($$self.$$.dirty & /*hsv*/ 2048) {
    			$$invalidate(3, a = hsv.a === undefined ? 1 : Math.round(hsv.a * 100) / 100);
    		}
    	};

    	return [
    		rgb,
    		hex,
    		mode,
    		a,
    		v,
    		s,
    		h,
    		modes,
    		updateHex,
    		updateRgb,
    		updateHsv,
    		hsv,
    		click_handler
    	];
    }

    class TextInput extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$L, create_fragment$N, safe_not_equal, { rgb: 0, hsv: 11, hex: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TextInput",
    			options,
    			id: create_fragment$N.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*rgb*/ ctx[0] === undefined && !('rgb' in props)) {
    			console.warn("<TextInput> was created without expected prop 'rgb'");
    		}

    		if (/*hsv*/ ctx[11] === undefined && !('hsv' in props)) {
    			console.warn("<TextInput> was created without expected prop 'hsv'");
    		}

    		if (/*hex*/ ctx[1] === undefined && !('hex' in props)) {
    			console.warn("<TextInput> was created without expected prop 'hex'");
    		}
    	}

    	get rgb() {
    		throw new Error("<TextInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set rgb(value) {
    		throw new Error("<TextInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get hsv() {
    		throw new Error("<TextInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hsv(value) {
    		throw new Error("<TextInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get hex() {
    		throw new Error("<TextInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hex(value) {
    		throw new Error("<TextInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\svelte-awesome-color-picker\components\variant\default\SliderIndicator.svelte generated by Svelte v3.49.0 */

    const file$H = "node_modules\\svelte-awesome-color-picker\\components\\variant\\default\\SliderIndicator.svelte";

    function create_fragment$M(ctx) {
    	let div;
    	let div_style_value;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "style", div_style_value = "" + ((/*toRight*/ ctx[1] ? 'left' : 'top') + ": " + /*pos*/ ctx[0] + "%;"));
    			attr_dev(div, "class", "svelte-1vfj60t");
    			toggle_class(div, "to-right", /*toRight*/ ctx[1]);
    			add_location(div, file$H, 6, 0, 111);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*toRight, pos*/ 3 && div_style_value !== (div_style_value = "" + ((/*toRight*/ ctx[1] ? 'left' : 'top') + ": " + /*pos*/ ctx[0] + "%;"))) {
    				attr_dev(div, "style", div_style_value);
    			}

    			if (dirty & /*toRight*/ 2) {
    				toggle_class(div, "to-right", /*toRight*/ ctx[1]);
    			}
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$M.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$K($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SliderIndicator', slots, []);
    	let { pos } = $$props;
    	let { color } = $$props;
    	let { toRight } = $$props;
    	const writable_props = ['pos', 'color', 'toRight'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<SliderIndicator> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('pos' in $$props) $$invalidate(0, pos = $$props.pos);
    		if ('color' in $$props) $$invalidate(2, color = $$props.color);
    		if ('toRight' in $$props) $$invalidate(1, toRight = $$props.toRight);
    	};

    	$$self.$capture_state = () => ({ pos, color, toRight });

    	$$self.$inject_state = $$props => {
    		if ('pos' in $$props) $$invalidate(0, pos = $$props.pos);
    		if ('color' in $$props) $$invalidate(2, color = $$props.color);
    		if ('toRight' in $$props) $$invalidate(1, toRight = $$props.toRight);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [pos, toRight, color];
    }

    class SliderIndicator extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$K, create_fragment$M, safe_not_equal, { pos: 0, color: 2, toRight: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SliderIndicator",
    			options,
    			id: create_fragment$M.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*pos*/ ctx[0] === undefined && !('pos' in props)) {
    			console.warn("<SliderIndicator> was created without expected prop 'pos'");
    		}

    		if (/*color*/ ctx[2] === undefined && !('color' in props)) {
    			console.warn("<SliderIndicator> was created without expected prop 'color'");
    		}

    		if (/*toRight*/ ctx[1] === undefined && !('toRight' in props)) {
    			console.warn("<SliderIndicator> was created without expected prop 'toRight'");
    		}
    	}

    	get pos() {
    		throw new Error("<SliderIndicator>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set pos(value) {
    		throw new Error("<SliderIndicator>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error("<SliderIndicator>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<SliderIndicator>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get toRight() {
    		throw new Error("<SliderIndicator>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set toRight(value) {
    		throw new Error("<SliderIndicator>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\svelte-awesome-color-picker\components\variant\default\PickerIndicator.svelte generated by Svelte v3.49.0 */

    const file$G = "node_modules\\svelte-awesome-color-picker\\components\\variant\\default\\PickerIndicator.svelte";

    function create_fragment$L(ctx) {
    	let div;
    	let div_style_value;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "style", div_style_value = `left: ${/*pos*/ ctx[0].x}%; top: ${/*pos*/ ctx[0].y}%; background-color: ${/*color*/ ctx[1].hex}; border-color: ${/*isDark*/ ctx[2] ? 'white' : 'black'};`);
    			attr_dev(div, "class", "svelte-1pgi1uo");
    			add_location(div, file$G, 5, 0, 72);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*pos, color, isDark*/ 7 && div_style_value !== (div_style_value = `left: ${/*pos*/ ctx[0].x}%; top: ${/*pos*/ ctx[0].y}%; background-color: ${/*color*/ ctx[1].hex}; border-color: ${/*isDark*/ ctx[2] ? 'white' : 'black'};`)) {
    				attr_dev(div, "style", div_style_value);
    			}
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$L.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$J($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('PickerIndicator', slots, []);
    	let { pos } = $$props;
    	let { color } = $$props;
    	let { isDark } = $$props;
    	const writable_props = ['pos', 'color', 'isDark'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<PickerIndicator> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('pos' in $$props) $$invalidate(0, pos = $$props.pos);
    		if ('color' in $$props) $$invalidate(1, color = $$props.color);
    		if ('isDark' in $$props) $$invalidate(2, isDark = $$props.isDark);
    	};

    	$$self.$capture_state = () => ({ pos, color, isDark });

    	$$self.$inject_state = $$props => {
    		if ('pos' in $$props) $$invalidate(0, pos = $$props.pos);
    		if ('color' in $$props) $$invalidate(1, color = $$props.color);
    		if ('isDark' in $$props) $$invalidate(2, isDark = $$props.isDark);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [pos, color, isDark];
    }

    class PickerIndicator extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$J, create_fragment$L, safe_not_equal, { pos: 0, color: 1, isDark: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "PickerIndicator",
    			options,
    			id: create_fragment$L.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*pos*/ ctx[0] === undefined && !('pos' in props)) {
    			console.warn("<PickerIndicator> was created without expected prop 'pos'");
    		}

    		if (/*color*/ ctx[1] === undefined && !('color' in props)) {
    			console.warn("<PickerIndicator> was created without expected prop 'color'");
    		}

    		if (/*isDark*/ ctx[2] === undefined && !('isDark' in props)) {
    			console.warn("<PickerIndicator> was created without expected prop 'isDark'");
    		}
    	}

    	get pos() {
    		throw new Error("<PickerIndicator>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set pos(value) {
    		throw new Error("<PickerIndicator>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error("<PickerIndicator>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<PickerIndicator>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isDark() {
    		throw new Error("<PickerIndicator>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isDark(value) {
    		throw new Error("<PickerIndicator>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\svelte-awesome-color-picker\components\ArrowKeyHandler.svelte generated by Svelte v3.49.0 */

    function create_fragment$K(ctx) {
    	let mounted;
    	let dispose;

    	const block = {
    		c: noop$1,
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (!mounted) {
    				dispose = [
    					listen_dev(window, "keyup", /*keyup*/ ctx[0], false, false, false),
    					listen_dev(window, "keydown", /*keydown*/ ctx[1], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: noop$1,
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$K.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$I($$self, $$props, $$invalidate) {
    	let $keyPressed;
    	validate_store(keyPressed, 'keyPressed');
    	component_subscribe($$self, keyPressed, $$value => $$invalidate(2, $keyPressed = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ArrowKeyHandler', slots, []);

    	function keyup(e) {
    		if (['ArrowLeft', 'ArrowUp', 'ArrowRight', 'ArrowDown'].includes(e.key)) {
    			set_store_value(keyPressed, $keyPressed[e.key] = 0, $keyPressed);
    			keyPressed.set($keyPressed);
    		}
    	}

    	function keydown(e) {
    		if (['ArrowLeft', 'ArrowUp', 'ArrowRight', 'ArrowDown'].includes(e.key)) {
    			if (!e.repeat) {
    				set_store_value(keyPressed, $keyPressed[e.key] = 1, $keyPressed);
    				keyPressed.set($keyPressed);
    			}
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ArrowKeyHandler> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ keyPressed, keyup, keydown, $keyPressed });
    	return [keyup, keydown];
    }

    class ArrowKeyHandler extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$I, create_fragment$K, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ArrowKeyHandler",
    			options,
    			id: create_fragment$K.name
    		});
    	}
    }

    /* node_modules\svelte-awesome-color-picker\components\variant\default\PickerWrapper.svelte generated by Svelte v3.49.0 */

    const file$F = "node_modules\\svelte-awesome-color-picker\\components\\variant\\default\\PickerWrapper.svelte";

    function create_fragment$J(ctx) {
    	let div;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[3].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[2], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", "svelte-1uiperi");
    			toggle_class(div, "focused", /*focused*/ ctx[0]);
    			toggle_class(div, "to-right", /*toRight*/ ctx[1]);
    			add_location(div, file$F, 4, 0, 59);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 4)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[2],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[2])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[2], dirty, null),
    						null
    					);
    				}
    			}

    			if (dirty & /*focused*/ 1) {
    				toggle_class(div, "focused", /*focused*/ ctx[0]);
    			}

    			if (dirty & /*toRight*/ 2) {
    				toggle_class(div, "to-right", /*toRight*/ ctx[1]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$J.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$H($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('PickerWrapper', slots, ['default']);
    	let { focused } = $$props;
    	let { toRight } = $$props;
    	const writable_props = ['focused', 'toRight'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<PickerWrapper> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('focused' in $$props) $$invalidate(0, focused = $$props.focused);
    		if ('toRight' in $$props) $$invalidate(1, toRight = $$props.toRight);
    		if ('$$scope' in $$props) $$invalidate(2, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ focused, toRight });

    	$$self.$inject_state = $$props => {
    		if ('focused' in $$props) $$invalidate(0, focused = $$props.focused);
    		if ('toRight' in $$props) $$invalidate(1, toRight = $$props.toRight);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [focused, toRight, $$scope, slots];
    }

    class PickerWrapper extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$H, create_fragment$J, safe_not_equal, { focused: 0, toRight: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "PickerWrapper",
    			options,
    			id: create_fragment$J.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*focused*/ ctx[0] === undefined && !('focused' in props)) {
    			console.warn("<PickerWrapper> was created without expected prop 'focused'");
    		}

    		if (/*toRight*/ ctx[1] === undefined && !('toRight' in props)) {
    			console.warn("<PickerWrapper> was created without expected prop 'toRight'");
    		}
    	}

    	get focused() {
    		throw new Error("<PickerWrapper>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set focused(value) {
    		throw new Error("<PickerWrapper>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get toRight() {
    		throw new Error("<PickerWrapper>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set toRight(value) {
    		throw new Error("<PickerWrapper>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\svelte-awesome-color-picker\components\variant\default\SliderWrapper.svelte generated by Svelte v3.49.0 */

    const file$E = "node_modules\\svelte-awesome-color-picker\\components\\variant\\default\\SliderWrapper.svelte";

    function create_fragment$I(ctx) {
    	let div;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[3].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[2], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", "svelte-6vskim");
    			toggle_class(div, "focused", /*focused*/ ctx[0]);
    			toggle_class(div, "to-right", /*toRight*/ ctx[1]);
    			add_location(div, file$E, 4, 0, 59);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 4)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[2],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[2])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[2], dirty, null),
    						null
    					);
    				}
    			}

    			if (dirty & /*focused*/ 1) {
    				toggle_class(div, "focused", /*focused*/ ctx[0]);
    			}

    			if (dirty & /*toRight*/ 2) {
    				toggle_class(div, "to-right", /*toRight*/ ctx[1]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$I.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$G($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SliderWrapper', slots, ['default']);
    	let { focused } = $$props;
    	let { toRight } = $$props;
    	const writable_props = ['focused', 'toRight'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<SliderWrapper> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('focused' in $$props) $$invalidate(0, focused = $$props.focused);
    		if ('toRight' in $$props) $$invalidate(1, toRight = $$props.toRight);
    		if ('$$scope' in $$props) $$invalidate(2, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ focused, toRight });

    	$$self.$inject_state = $$props => {
    		if ('focused' in $$props) $$invalidate(0, focused = $$props.focused);
    		if ('toRight' in $$props) $$invalidate(1, toRight = $$props.toRight);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [focused, toRight, $$scope, slots];
    }

    class SliderWrapper extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$G, create_fragment$I, safe_not_equal, { focused: 0, toRight: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SliderWrapper",
    			options,
    			id: create_fragment$I.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*focused*/ ctx[0] === undefined && !('focused' in props)) {
    			console.warn("<SliderWrapper> was created without expected prop 'focused'");
    		}

    		if (/*toRight*/ ctx[1] === undefined && !('toRight' in props)) {
    			console.warn("<SliderWrapper> was created without expected prop 'toRight'");
    		}
    	}

    	get focused() {
    		throw new Error("<SliderWrapper>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set focused(value) {
    		throw new Error("<SliderWrapper>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get toRight() {
    		throw new Error("<SliderWrapper>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set toRight(value) {
    		throw new Error("<SliderWrapper>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\svelte-awesome-color-picker\components\variant\default\Input.svelte generated by Svelte v3.49.0 */

    const file$D = "node_modules\\svelte-awesome-color-picker\\components\\variant\\default\\Input.svelte";

    function create_fragment$H(ctx) {
    	let button_1;
    	let div;
    	let t0;
    	let t1;
    	let t2;
    	let input;
    	let input_value_value;

    	const block = {
    		c: function create() {
    			button_1 = element("button");
    			div = element("div");
    			t0 = space();
    			t1 = text(/*label*/ ctx[2]);
    			t2 = space();
    			input = element("input");
    			set_style(div, "background-color", /*color*/ ctx[1].hex);
    			attr_dev(div, "class", "svelte-1qwu023");
    			add_location(div, file$D, 8, 1, 160);
    			attr_dev(button_1, "class", "svelte-1qwu023");
    			add_location(button_1, file$D, 7, 0, 131);
    			attr_dev(input, "type", "hidden");
    			input.value = input_value_value = /*color*/ ctx[1].hex;
    			add_location(input, file$D, 11, 0, 226);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button_1, anchor);
    			append_dev(button_1, div);
    			append_dev(button_1, t0);
    			append_dev(button_1, t1);
    			/*button_1_binding*/ ctx[4](button_1);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, input, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*color*/ 2) {
    				set_style(div, "background-color", /*color*/ ctx[1].hex);
    			}

    			if (dirty & /*label*/ 4) set_data_dev(t1, /*label*/ ctx[2]);

    			if (dirty & /*color*/ 2 && input_value_value !== (input_value_value = /*color*/ ctx[1].hex)) {
    				prop_dev(input, "value", input_value_value);
    			}
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button_1);
    			/*button_1_binding*/ ctx[4](null);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(input);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$H.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$F($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Input', slots, []);
    	let { button } = $$props;
    	let { color } = $$props;
    	let { label } = $$props;
    	let { isOpen } = $$props;
    	const writable_props = ['button', 'color', 'label', 'isOpen'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Input> was created with unknown prop '${key}'`);
    	});

    	function button_1_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			button = $$value;
    			$$invalidate(0, button);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('button' in $$props) $$invalidate(0, button = $$props.button);
    		if ('color' in $$props) $$invalidate(1, color = $$props.color);
    		if ('label' in $$props) $$invalidate(2, label = $$props.label);
    		if ('isOpen' in $$props) $$invalidate(3, isOpen = $$props.isOpen);
    	};

    	$$self.$capture_state = () => ({ button, color, label, isOpen });

    	$$self.$inject_state = $$props => {
    		if ('button' in $$props) $$invalidate(0, button = $$props.button);
    		if ('color' in $$props) $$invalidate(1, color = $$props.color);
    		if ('label' in $$props) $$invalidate(2, label = $$props.label);
    		if ('isOpen' in $$props) $$invalidate(3, isOpen = $$props.isOpen);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [button, color, label, isOpen, button_1_binding];
    }

    class Input extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$F, create_fragment$H, safe_not_equal, { button: 0, color: 1, label: 2, isOpen: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Input",
    			options,
    			id: create_fragment$H.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*button*/ ctx[0] === undefined && !('button' in props)) {
    			console.warn("<Input> was created without expected prop 'button'");
    		}

    		if (/*color*/ ctx[1] === undefined && !('color' in props)) {
    			console.warn("<Input> was created without expected prop 'color'");
    		}

    		if (/*label*/ ctx[2] === undefined && !('label' in props)) {
    			console.warn("<Input> was created without expected prop 'label'");
    		}

    		if (/*isOpen*/ ctx[3] === undefined && !('isOpen' in props)) {
    			console.warn("<Input> was created without expected prop 'isOpen'");
    		}
    	}

    	get button() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set button(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get label() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set label(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isOpen() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isOpen(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\svelte-awesome-color-picker\components\variant\default\Wrapper.svelte generated by Svelte v3.49.0 */

    const file$C = "node_modules\\svelte-awesome-color-picker\\components\\variant\\default\\Wrapper.svelte";

    function create_fragment$G(ctx) {
    	let div;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[5].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[4], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", "wrapper svelte-w29n8e");
    			toggle_class(div, "isOpen", /*isOpen*/ ctx[1]);
    			toggle_class(div, "isPopup", /*isPopup*/ ctx[2]);
    			toggle_class(div, "to-right", /*toRight*/ ctx[3]);
    			add_location(div, file$C, 6, 0, 98);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			/*div_binding*/ ctx[6](div);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 16)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[4],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[4])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[4], dirty, null),
    						null
    					);
    				}
    			}

    			if (dirty & /*isOpen*/ 2) {
    				toggle_class(div, "isOpen", /*isOpen*/ ctx[1]);
    			}

    			if (dirty & /*isPopup*/ 4) {
    				toggle_class(div, "isPopup", /*isPopup*/ ctx[2]);
    			}

    			if (dirty & /*toRight*/ 8) {
    				toggle_class(div, "to-right", /*toRight*/ ctx[3]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    			/*div_binding*/ ctx[6](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$G.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$E($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Wrapper', slots, ['default']);
    	let { wrapper } = $$props;
    	let { isOpen } = $$props;
    	let { isPopup } = $$props;
    	let { toRight } = $$props;
    	const writable_props = ['wrapper', 'isOpen', 'isPopup', 'toRight'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Wrapper> was created with unknown prop '${key}'`);
    	});

    	function div_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			wrapper = $$value;
    			$$invalidate(0, wrapper);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('wrapper' in $$props) $$invalidate(0, wrapper = $$props.wrapper);
    		if ('isOpen' in $$props) $$invalidate(1, isOpen = $$props.isOpen);
    		if ('isPopup' in $$props) $$invalidate(2, isPopup = $$props.isPopup);
    		if ('toRight' in $$props) $$invalidate(3, toRight = $$props.toRight);
    		if ('$$scope' in $$props) $$invalidate(4, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ wrapper, isOpen, isPopup, toRight });

    	$$self.$inject_state = $$props => {
    		if ('wrapper' in $$props) $$invalidate(0, wrapper = $$props.wrapper);
    		if ('isOpen' in $$props) $$invalidate(1, isOpen = $$props.isOpen);
    		if ('isPopup' in $$props) $$invalidate(2, isPopup = $$props.isPopup);
    		if ('toRight' in $$props) $$invalidate(3, toRight = $$props.toRight);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [wrapper, isOpen, isPopup, toRight, $$scope, slots, div_binding];
    }

    class Wrapper extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$E, create_fragment$G, safe_not_equal, {
    			wrapper: 0,
    			isOpen: 1,
    			isPopup: 2,
    			toRight: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Wrapper",
    			options,
    			id: create_fragment$G.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*wrapper*/ ctx[0] === undefined && !('wrapper' in props)) {
    			console.warn("<Wrapper> was created without expected prop 'wrapper'");
    		}

    		if (/*isOpen*/ ctx[1] === undefined && !('isOpen' in props)) {
    			console.warn("<Wrapper> was created without expected prop 'isOpen'");
    		}

    		if (/*isPopup*/ ctx[2] === undefined && !('isPopup' in props)) {
    			console.warn("<Wrapper> was created without expected prop 'isPopup'");
    		}

    		if (/*toRight*/ ctx[3] === undefined && !('toRight' in props)) {
    			console.warn("<Wrapper> was created without expected prop 'toRight'");
    		}
    	}

    	get wrapper() {
    		throw new Error("<Wrapper>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set wrapper(value) {
    		throw new Error("<Wrapper>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isOpen() {
    		throw new Error("<Wrapper>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isOpen(value) {
    		throw new Error("<Wrapper>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isPopup() {
    		throw new Error("<Wrapper>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isPopup(value) {
    		throw new Error("<Wrapper>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get toRight() {
    		throw new Error("<Wrapper>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set toRight(value) {
    		throw new Error("<Wrapper>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\svelte-awesome-color-picker\components\ColorPicker.svelte generated by Svelte v3.49.0 */

    const { Object: Object_1$1 } = globals;
    const file$B = "node_modules\\svelte-awesome-color-picker\\components\\ColorPicker.svelte";

    // (123:1) {#if isInput}
    function create_if_block_2$4(ctx) {
    	let switch_instance;
    	let updating_button;
    	let updating_isOpen;
    	let switch_instance_anchor;
    	let current;

    	function switch_instance_button_binding(value) {
    		/*switch_instance_button_binding*/ ctx[19](value);
    	}

    	function switch_instance_isOpen_binding(value) {
    		/*switch_instance_isOpen_binding*/ ctx[20](value);
    	}

    	var switch_value = /*getComponents*/ ctx[14]().input;

    	function switch_props(ctx) {
    		let switch_instance_props = {
    			color: {
    				.../*hsv*/ ctx[1],
    				.../*rgb*/ ctx[0],
    				hex: /*hex*/ ctx[2]
    			},
    			label: /*label*/ ctx[5]
    		};

    		if (/*button*/ ctx[12] !== void 0) {
    			switch_instance_props.button = /*button*/ ctx[12];
    		}

    		if (/*isOpen*/ ctx[3] !== void 0) {
    			switch_instance_props.isOpen = /*isOpen*/ ctx[3];
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props(ctx));
    		binding_callbacks.push(() => bind(switch_instance, 'button', switch_instance_button_binding));
    		binding_callbacks.push(() => bind(switch_instance, 'isOpen', switch_instance_isOpen_binding));
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = {};

    			if (dirty[0] & /*hsv, rgb, hex*/ 7) switch_instance_changes.color = {
    				.../*hsv*/ ctx[1],
    				.../*rgb*/ ctx[0],
    				hex: /*hex*/ ctx[2]
    			};

    			if (dirty[0] & /*label*/ 32) switch_instance_changes.label = /*label*/ ctx[5];

    			if (!updating_button && dirty[0] & /*button*/ 4096) {
    				updating_button = true;
    				switch_instance_changes.button = /*button*/ ctx[12];
    				add_flush_callback(() => updating_button = false);
    			}

    			if (!updating_isOpen && dirty[0] & /*isOpen*/ 8) {
    				updating_isOpen = true;
    				switch_instance_changes.isOpen = /*isOpen*/ ctx[3];
    				add_flush_callback(() => updating_isOpen = false);
    			}

    			if (switch_value !== (switch_value = /*getComponents*/ ctx[14]().input)) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props(ctx));
    					binding_callbacks.push(() => bind(switch_instance, 'button', switch_instance_button_binding));
    					binding_callbacks.push(() => bind(switch_instance, 'isOpen', switch_instance_isOpen_binding));
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$4.name,
    		type: "if",
    		source: "(123:1) {#if isInput}",
    		ctx
    	});

    	return block;
    }

    // (144:2) {#if isAlpha}
    function create_if_block_1$6(ctx) {
    	let alpha;
    	let updating_a;
    	let updating_isOpen;
    	let current;

    	function alpha_a_binding(value) {
    		/*alpha_a_binding*/ ctx[25](value);
    	}

    	function alpha_isOpen_binding(value) {
    		/*alpha_isOpen_binding*/ ctx[26](value);
    	}

    	let alpha_props = {
    		components: /*getComponents*/ ctx[14](),
    		h: /*hsv*/ ctx[1].h,
    		s: /*hsv*/ ctx[1].s,
    		v: /*hsv*/ ctx[1].v,
    		hex: /*hex*/ ctx[2],
    		toRight: /*toRight*/ ctx[10]
    	};

    	if (/*hsv*/ ctx[1].a !== void 0) {
    		alpha_props.a = /*hsv*/ ctx[1].a;
    	}

    	if (/*isOpen*/ ctx[3] !== void 0) {
    		alpha_props.isOpen = /*isOpen*/ ctx[3];
    	}

    	alpha = new Alpha({ props: alpha_props, $$inline: true });
    	binding_callbacks.push(() => bind(alpha, 'a', alpha_a_binding));
    	binding_callbacks.push(() => bind(alpha, 'isOpen', alpha_isOpen_binding));

    	const block = {
    		c: function create() {
    			create_component(alpha.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(alpha, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const alpha_changes = {};
    			if (dirty[0] & /*hsv*/ 2) alpha_changes.h = /*hsv*/ ctx[1].h;
    			if (dirty[0] & /*hsv*/ 2) alpha_changes.s = /*hsv*/ ctx[1].s;
    			if (dirty[0] & /*hsv*/ 2) alpha_changes.v = /*hsv*/ ctx[1].v;
    			if (dirty[0] & /*hex*/ 4) alpha_changes.hex = /*hex*/ ctx[2];
    			if (dirty[0] & /*toRight*/ 1024) alpha_changes.toRight = /*toRight*/ ctx[10];

    			if (!updating_a && dirty[0] & /*hsv*/ 2) {
    				updating_a = true;
    				alpha_changes.a = /*hsv*/ ctx[1].a;
    				add_flush_callback(() => updating_a = false);
    			}

    			if (!updating_isOpen && dirty[0] & /*isOpen*/ 8) {
    				updating_isOpen = true;
    				alpha_changes.isOpen = /*isOpen*/ ctx[3];
    				add_flush_callback(() => updating_isOpen = false);
    			}

    			alpha.$set(alpha_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(alpha.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(alpha.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(alpha, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$6.name,
    		type: "if",
    		source: "(144:2) {#if isAlpha}",
    		ctx
    	});

    	return block;
    }

    // (156:2) {#if isTextInput}
    function create_if_block$f(ctx) {
    	let switch_instance;
    	let updating_hex;
    	let updating_rgb;
    	let updating_hsv;
    	let switch_instance_anchor;
    	let current;

    	function switch_instance_hex_binding(value) {
    		/*switch_instance_hex_binding*/ ctx[27](value);
    	}

    	function switch_instance_rgb_binding(value) {
    		/*switch_instance_rgb_binding*/ ctx[28](value);
    	}

    	function switch_instance_hsv_binding(value) {
    		/*switch_instance_hsv_binding*/ ctx[29](value);
    	}

    	var switch_value = /*getComponents*/ ctx[14]().textInput;

    	function switch_props(ctx) {
    		let switch_instance_props = {};

    		if (/*hex*/ ctx[2] !== void 0) {
    			switch_instance_props.hex = /*hex*/ ctx[2];
    		}

    		if (/*rgb*/ ctx[0] !== void 0) {
    			switch_instance_props.rgb = /*rgb*/ ctx[0];
    		}

    		if (/*hsv*/ ctx[1] !== void 0) {
    			switch_instance_props.hsv = /*hsv*/ ctx[1];
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props(ctx));
    		binding_callbacks.push(() => bind(switch_instance, 'hex', switch_instance_hex_binding));
    		binding_callbacks.push(() => bind(switch_instance, 'rgb', switch_instance_rgb_binding));
    		binding_callbacks.push(() => bind(switch_instance, 'hsv', switch_instance_hsv_binding));
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = {};

    			if (!updating_hex && dirty[0] & /*hex*/ 4) {
    				updating_hex = true;
    				switch_instance_changes.hex = /*hex*/ ctx[2];
    				add_flush_callback(() => updating_hex = false);
    			}

    			if (!updating_rgb && dirty[0] & /*rgb*/ 1) {
    				updating_rgb = true;
    				switch_instance_changes.rgb = /*rgb*/ ctx[0];
    				add_flush_callback(() => updating_rgb = false);
    			}

    			if (!updating_hsv && dirty[0] & /*hsv*/ 2) {
    				updating_hsv = true;
    				switch_instance_changes.hsv = /*hsv*/ ctx[1];
    				add_flush_callback(() => updating_hsv = false);
    			}

    			if (switch_value !== (switch_value = /*getComponents*/ ctx[14]().textInput)) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props(ctx));
    					binding_callbacks.push(() => bind(switch_instance, 'hex', switch_instance_hex_binding));
    					binding_callbacks.push(() => bind(switch_instance, 'rgb', switch_instance_rgb_binding));
    					binding_callbacks.push(() => bind(switch_instance, 'hsv', switch_instance_hsv_binding));
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$f.name,
    		type: "if",
    		source: "(156:2) {#if isTextInput}",
    		ctx
    	});

    	return block;
    }

    // (133:1) <svelte:component this={getComponents().wrapper} bind:wrapper {isOpen} {isPopup} {toRight}>
    function create_default_slot$7(ctx) {
    	let picker;
    	let updating_s;
    	let updating_v;
    	let updating_isOpen;
    	let t0;
    	let slider;
    	let updating_h;
    	let t1;
    	let t2;
    	let if_block1_anchor;
    	let current;

    	function picker_s_binding(value) {
    		/*picker_s_binding*/ ctx[21](value);
    	}

    	function picker_v_binding(value) {
    		/*picker_v_binding*/ ctx[22](value);
    	}

    	function picker_isOpen_binding(value) {
    		/*picker_isOpen_binding*/ ctx[23](value);
    	}

    	let picker_props = {
    		components: /*getComponents*/ ctx[14](),
    		h: /*hsv*/ ctx[1].h,
    		toRight: /*toRight*/ ctx[10],
    		isDark: /*isDark*/ ctx[4]
    	};

    	if (/*hsv*/ ctx[1].s !== void 0) {
    		picker_props.s = /*hsv*/ ctx[1].s;
    	}

    	if (/*hsv*/ ctx[1].v !== void 0) {
    		picker_props.v = /*hsv*/ ctx[1].v;
    	}

    	if (/*isOpen*/ ctx[3] !== void 0) {
    		picker_props.isOpen = /*isOpen*/ ctx[3];
    	}

    	picker = new Picker({ props: picker_props, $$inline: true });
    	binding_callbacks.push(() => bind(picker, 's', picker_s_binding));
    	binding_callbacks.push(() => bind(picker, 'v', picker_v_binding));
    	binding_callbacks.push(() => bind(picker, 'isOpen', picker_isOpen_binding));

    	function slider_h_binding(value) {
    		/*slider_h_binding*/ ctx[24](value);
    	}

    	let slider_props = {
    		components: /*getComponents*/ ctx[14](),
    		toRight: /*toRight*/ ctx[10]
    	};

    	if (/*hsv*/ ctx[1].h !== void 0) {
    		slider_props.h = /*hsv*/ ctx[1].h;
    	}

    	slider = new Slider({ props: slider_props, $$inline: true });
    	binding_callbacks.push(() => bind(slider, 'h', slider_h_binding));
    	let if_block0 = /*isAlpha*/ ctx[6] && create_if_block_1$6(ctx);
    	let if_block1 = /*isTextInput*/ ctx[8] && create_if_block$f(ctx);

    	const block = {
    		c: function create() {
    			create_component(picker.$$.fragment);
    			t0 = space();
    			create_component(slider.$$.fragment);
    			t1 = space();
    			if (if_block0) if_block0.c();
    			t2 = space();
    			if (if_block1) if_block1.c();
    			if_block1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			mount_component(picker, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(slider, target, anchor);
    			insert_dev(target, t1, anchor);
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t2, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, if_block1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const picker_changes = {};
    			if (dirty[0] & /*hsv*/ 2) picker_changes.h = /*hsv*/ ctx[1].h;
    			if (dirty[0] & /*toRight*/ 1024) picker_changes.toRight = /*toRight*/ ctx[10];
    			if (dirty[0] & /*isDark*/ 16) picker_changes.isDark = /*isDark*/ ctx[4];

    			if (!updating_s && dirty[0] & /*hsv*/ 2) {
    				updating_s = true;
    				picker_changes.s = /*hsv*/ ctx[1].s;
    				add_flush_callback(() => updating_s = false);
    			}

    			if (!updating_v && dirty[0] & /*hsv*/ 2) {
    				updating_v = true;
    				picker_changes.v = /*hsv*/ ctx[1].v;
    				add_flush_callback(() => updating_v = false);
    			}

    			if (!updating_isOpen && dirty[0] & /*isOpen*/ 8) {
    				updating_isOpen = true;
    				picker_changes.isOpen = /*isOpen*/ ctx[3];
    				add_flush_callback(() => updating_isOpen = false);
    			}

    			picker.$set(picker_changes);
    			const slider_changes = {};
    			if (dirty[0] & /*toRight*/ 1024) slider_changes.toRight = /*toRight*/ ctx[10];

    			if (!updating_h && dirty[0] & /*hsv*/ 2) {
    				updating_h = true;
    				slider_changes.h = /*hsv*/ ctx[1].h;
    				add_flush_callback(() => updating_h = false);
    			}

    			slider.$set(slider_changes);

    			if (/*isAlpha*/ ctx[6]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty[0] & /*isAlpha*/ 64) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_1$6(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(t2.parentNode, t2);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (/*isTextInput*/ ctx[8]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty[0] & /*isTextInput*/ 256) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block$f(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(picker.$$.fragment, local);
    			transition_in(slider.$$.fragment, local);
    			transition_in(if_block0);
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(picker.$$.fragment, local);
    			transition_out(slider.$$.fragment, local);
    			transition_out(if_block0);
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(picker, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(slider, detaching);
    			if (detaching) detach_dev(t1);
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t2);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(if_block1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$7.name,
    		type: "slot",
    		source: "(133:1) <svelte:component this={getComponents().wrapper} bind:wrapper {isOpen} {isPopup} {toRight}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$F(ctx) {
    	let arrowkeyhandler;
    	let t0;
    	let span_1;
    	let t1;
    	let switch_instance;
    	let updating_wrapper;
    	let current;
    	let mounted;
    	let dispose;
    	arrowkeyhandler = new ArrowKeyHandler({ $$inline: true });
    	let if_block = /*isInput*/ ctx[7] && create_if_block_2$4(ctx);

    	function switch_instance_wrapper_binding(value) {
    		/*switch_instance_wrapper_binding*/ ctx[30](value);
    	}

    	var switch_value = /*getComponents*/ ctx[14]().wrapper;

    	function switch_props(ctx) {
    		let switch_instance_props = {
    			isOpen: /*isOpen*/ ctx[3],
    			isPopup: /*isPopup*/ ctx[9],
    			toRight: /*toRight*/ ctx[10],
    			$$slots: { default: [create_default_slot$7] },
    			$$scope: { ctx }
    		};

    		if (/*wrapper*/ ctx[13] !== void 0) {
    			switch_instance_props.wrapper = /*wrapper*/ ctx[13];
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props(ctx));
    		binding_callbacks.push(() => bind(switch_instance, 'wrapper', switch_instance_wrapper_binding));
    	}

    	const block = {
    		c: function create() {
    			create_component(arrowkeyhandler.$$.fragment);
    			t0 = space();
    			span_1 = element("span");
    			if (if_block) if_block.c();
    			t1 = space();
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			add_location(span_1, file$B, 121, 0, 3678);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(arrowkeyhandler, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, span_1, anchor);
    			if (if_block) if_block.m(span_1, null);
    			append_dev(span_1, t1);

    			if (switch_instance) {
    				mount_component(switch_instance, span_1, null);
    			}

    			/*span_1_binding*/ ctx[31](span_1);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(window, "mousedown", /*mousedown*/ ctx[15], false, false, false),
    					listen_dev(window, "keydown", /*keydown*/ ctx[17], false, false, false),
    					listen_dev(window, "keyup", /*keyup*/ ctx[16], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (/*isInput*/ ctx[7]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty[0] & /*isInput*/ 128) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_2$4(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(span_1, t1);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			const switch_instance_changes = {};
    			if (dirty[0] & /*isOpen*/ 8) switch_instance_changes.isOpen = /*isOpen*/ ctx[3];
    			if (dirty[0] & /*isPopup*/ 512) switch_instance_changes.isPopup = /*isPopup*/ ctx[9];
    			if (dirty[0] & /*toRight*/ 1024) switch_instance_changes.toRight = /*toRight*/ ctx[10];

    			if (dirty[0] & /*hex, rgb, hsv, isTextInput, toRight, isOpen, isAlpha, isDark*/ 1375 | dirty[1] & /*$$scope*/ 64) {
    				switch_instance_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_wrapper && dirty[0] & /*wrapper*/ 8192) {
    				updating_wrapper = true;
    				switch_instance_changes.wrapper = /*wrapper*/ ctx[13];
    				add_flush_callback(() => updating_wrapper = false);
    			}

    			if (switch_value !== (switch_value = /*getComponents*/ ctx[14]().wrapper)) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props(ctx));
    					binding_callbacks.push(() => bind(switch_instance, 'wrapper', switch_instance_wrapper_binding));
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, span_1, null);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(arrowkeyhandler.$$.fragment, local);
    			transition_in(if_block);
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(arrowkeyhandler.$$.fragment, local);
    			transition_out(if_block);
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(arrowkeyhandler, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(span_1);
    			if (if_block) if_block.d();
    			if (switch_instance) destroy_component(switch_instance);
    			/*span_1_binding*/ ctx[31](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$F.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$D($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ColorPicker', slots, []);
    	let { components = {} } = $$props;
    	let { label = 'Choose a color' } = $$props;
    	let { isAlpha = true } = $$props;
    	let { isInput = true } = $$props;
    	let { isTextInput = true } = $$props;
    	let { isPopup = true } = $$props;
    	let { isOpen = !isInput } = $$props;
    	let { toRight = false } = $$props;
    	let { isDark = false } = $$props;
    	let { rgb = { r: 255, g: 0, b: 0 } } = $$props;
    	let { hsv = { h: 0, s: 1, v: 1 } } = $$props;
    	let { hex = '#ff0000' } = $$props;
    	let _rgb = { r: 255, g: 0, b: 0 };
    	let _hsv = { h: 0, s: 1, v: 1 };
    	let _hex = '#ff0000';
    	let span;

    	const default_components = {
    		sliderIndicator: SliderIndicator,
    		pickerIndicator: PickerIndicator,
    		alphaIndicator: SliderIndicator,
    		pickerWrapper: PickerWrapper,
    		sliderWrapper: SliderWrapper,
    		alphaWrapper: SliderWrapper,
    		textInput: TextInput,
    		input: Input,
    		wrapper: Wrapper
    	};

    	function getComponents() {
    		return { ...default_components, ...components };
    	}

    	let button;
    	let wrapper;

    	function mousedown({ target }) {
    		if (isInput) {
    			if (button.isSameNode(target)) {
    				$$invalidate(3, isOpen = !isOpen);
    			} else if (isOpen && !wrapper.contains(target)) {
    				$$invalidate(3, isOpen = false);
    			}
    		}
    	}

    	function keyup(e) {
    		if (e.key === 'Tab') {
    			$$invalidate(3, isOpen = span?.contains(document.activeElement));
    		}
    	}

    	/**
     * using a function seems to trigger the exported value change only once when all of them has been updated
     * and not just after the hsv change
     */
    	function updateColor() {
    		// reinitialize empty alpha values
    		if (hsv.a === undefined) $$invalidate(1, hsv.a = 1, hsv);

    		if (_hsv.a === undefined) _hsv.a = 1;
    		if (rgb.a === undefined) $$invalidate(0, rgb.a = 1, rgb);
    		if (_rgb.a === undefined) _rgb.a = 1;
    		if (hex?.substring(7) === 'ff') $$invalidate(2, hex = hex.substring(0, 7));
    		if (hex?.substring(7) === 'ff') $$invalidate(2, hex = hex.substring(0, 7));

    		// check which color format changed and updates the others accordingly
    		if (hsv.h !== _hsv.h || hsv.s !== _hsv.s || hsv.v !== _hsv.v || hsv.a !== _hsv.a) {
    			const color = umd.hsv2Color(hsv);
    			const { r, g, b, a, hex: cHex } = color;
    			$$invalidate(0, rgb = { r, g, b, a });
    			$$invalidate(2, hex = cHex);
    		} else if (rgb.r !== _rgb.r || rgb.g !== _rgb.g || rgb.b !== _rgb.b || rgb.a !== _rgb.a) {
    			const color = umd.rgb2Color(rgb);
    			const { h, s, v, a, hex: cHex } = color;
    			$$invalidate(1, hsv = { h, s, v, a });
    			$$invalidate(2, hex = cHex);
    		} else if (hex !== _hex) {
    			const color = umd.hex2Color({ hex });
    			const { r, g, b, h, s, v, a } = color;
    			$$invalidate(0, rgb = { r, g, b, a });
    			$$invalidate(1, hsv = { h, s, v, a });
    		}

    		$$invalidate(4, isDark = umd.isDark(rgb));

    		// update old colors
    		_hsv = Object.assign({}, hsv);

    		_rgb = Object.assign({}, rgb);
    		_hex = hex;
    	}

    	function keydown(e) {
    		if (e.key === 'Tab') span.classList.add('has-been-tabbed');
    	}

    	const writable_props = [
    		'components',
    		'label',
    		'isAlpha',
    		'isInput',
    		'isTextInput',
    		'isPopup',
    		'isOpen',
    		'toRight',
    		'isDark',
    		'rgb',
    		'hsv',
    		'hex'
    	];

    	Object_1$1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ColorPicker> was created with unknown prop '${key}'`);
    	});

    	function switch_instance_button_binding(value) {
    		button = value;
    		$$invalidate(12, button);
    	}

    	function switch_instance_isOpen_binding(value) {
    		isOpen = value;
    		$$invalidate(3, isOpen);
    	}

    	function picker_s_binding(value) {
    		if ($$self.$$.not_equal(hsv.s, value)) {
    			hsv.s = value;
    			$$invalidate(1, hsv);
    		}
    	}

    	function picker_v_binding(value) {
    		if ($$self.$$.not_equal(hsv.v, value)) {
    			hsv.v = value;
    			$$invalidate(1, hsv);
    		}
    	}

    	function picker_isOpen_binding(value) {
    		isOpen = value;
    		$$invalidate(3, isOpen);
    	}

    	function slider_h_binding(value) {
    		if ($$self.$$.not_equal(hsv.h, value)) {
    			hsv.h = value;
    			$$invalidate(1, hsv);
    		}
    	}

    	function alpha_a_binding(value) {
    		if ($$self.$$.not_equal(hsv.a, value)) {
    			hsv.a = value;
    			$$invalidate(1, hsv);
    		}
    	}

    	function alpha_isOpen_binding(value) {
    		isOpen = value;
    		$$invalidate(3, isOpen);
    	}

    	function switch_instance_hex_binding(value) {
    		hex = value;
    		$$invalidate(2, hex);
    	}

    	function switch_instance_rgb_binding(value) {
    		rgb = value;
    		$$invalidate(0, rgb);
    	}

    	function switch_instance_hsv_binding(value) {
    		hsv = value;
    		$$invalidate(1, hsv);
    	}

    	function switch_instance_wrapper_binding(value) {
    		wrapper = value;
    		$$invalidate(13, wrapper);
    	}

    	function span_1_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			span = $$value;
    			$$invalidate(11, span);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('components' in $$props) $$invalidate(18, components = $$props.components);
    		if ('label' in $$props) $$invalidate(5, label = $$props.label);
    		if ('isAlpha' in $$props) $$invalidate(6, isAlpha = $$props.isAlpha);
    		if ('isInput' in $$props) $$invalidate(7, isInput = $$props.isInput);
    		if ('isTextInput' in $$props) $$invalidate(8, isTextInput = $$props.isTextInput);
    		if ('isPopup' in $$props) $$invalidate(9, isPopup = $$props.isPopup);
    		if ('isOpen' in $$props) $$invalidate(3, isOpen = $$props.isOpen);
    		if ('toRight' in $$props) $$invalidate(10, toRight = $$props.toRight);
    		if ('isDark' in $$props) $$invalidate(4, isDark = $$props.isDark);
    		if ('rgb' in $$props) $$invalidate(0, rgb = $$props.rgb);
    		if ('hsv' in $$props) $$invalidate(1, hsv = $$props.hsv);
    		if ('hex' in $$props) $$invalidate(2, hex = $$props.hex);
    	};

    	$$self.$capture_state = () => ({
    		hsv2Color: umd.hsv2Color,
    		hex2Color: umd.hex2Color,
    		rgb2Color: umd.rgb2Color,
    		checkIsDark: umd.isDark,
    		Picker,
    		Slider,
    		Alpha,
    		TextInput,
    		SliderIndicator,
    		PickerIndicator,
    		ArrowKeyHandler,
    		PickerWrapper,
    		SliderWrapper,
    		Input,
    		Wrapper,
    		components,
    		label,
    		isAlpha,
    		isInput,
    		isTextInput,
    		isPopup,
    		isOpen,
    		toRight,
    		isDark,
    		rgb,
    		hsv,
    		hex,
    		_rgb,
    		_hsv,
    		_hex,
    		span,
    		default_components,
    		getComponents,
    		button,
    		wrapper,
    		mousedown,
    		keyup,
    		updateColor,
    		keydown
    	});

    	$$self.$inject_state = $$props => {
    		if ('components' in $$props) $$invalidate(18, components = $$props.components);
    		if ('label' in $$props) $$invalidate(5, label = $$props.label);
    		if ('isAlpha' in $$props) $$invalidate(6, isAlpha = $$props.isAlpha);
    		if ('isInput' in $$props) $$invalidate(7, isInput = $$props.isInput);
    		if ('isTextInput' in $$props) $$invalidate(8, isTextInput = $$props.isTextInput);
    		if ('isPopup' in $$props) $$invalidate(9, isPopup = $$props.isPopup);
    		if ('isOpen' in $$props) $$invalidate(3, isOpen = $$props.isOpen);
    		if ('toRight' in $$props) $$invalidate(10, toRight = $$props.toRight);
    		if ('isDark' in $$props) $$invalidate(4, isDark = $$props.isDark);
    		if ('rgb' in $$props) $$invalidate(0, rgb = $$props.rgb);
    		if ('hsv' in $$props) $$invalidate(1, hsv = $$props.hsv);
    		if ('hex' in $$props) $$invalidate(2, hex = $$props.hex);
    		if ('_rgb' in $$props) _rgb = $$props._rgb;
    		if ('_hsv' in $$props) _hsv = $$props._hsv;
    		if ('_hex' in $$props) _hex = $$props._hex;
    		if ('span' in $$props) $$invalidate(11, span = $$props.span);
    		if ('button' in $$props) $$invalidate(12, button = $$props.button);
    		if ('wrapper' in $$props) $$invalidate(13, wrapper = $$props.wrapper);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*hsv, rgb, hex*/ 7) {
    			if (hsv || rgb || hex) {
    				updateColor();
    			}
    		}
    	};

    	return [
    		rgb,
    		hsv,
    		hex,
    		isOpen,
    		isDark,
    		label,
    		isAlpha,
    		isInput,
    		isTextInput,
    		isPopup,
    		toRight,
    		span,
    		button,
    		wrapper,
    		getComponents,
    		mousedown,
    		keyup,
    		keydown,
    		components,
    		switch_instance_button_binding,
    		switch_instance_isOpen_binding,
    		picker_s_binding,
    		picker_v_binding,
    		picker_isOpen_binding,
    		slider_h_binding,
    		alpha_a_binding,
    		alpha_isOpen_binding,
    		switch_instance_hex_binding,
    		switch_instance_rgb_binding,
    		switch_instance_hsv_binding,
    		switch_instance_wrapper_binding,
    		span_1_binding
    	];
    }

    class ColorPicker extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$D,
    			create_fragment$F,
    			safe_not_equal,
    			{
    				components: 18,
    				label: 5,
    				isAlpha: 6,
    				isInput: 7,
    				isTextInput: 8,
    				isPopup: 9,
    				isOpen: 3,
    				toRight: 10,
    				isDark: 4,
    				rgb: 0,
    				hsv: 1,
    				hex: 2
    			},
    			null,
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ColorPicker",
    			options,
    			id: create_fragment$F.name
    		});
    	}

    	get components() {
    		throw new Error("<ColorPicker>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set components(value) {
    		throw new Error("<ColorPicker>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get label() {
    		throw new Error("<ColorPicker>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set label(value) {
    		throw new Error("<ColorPicker>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isAlpha() {
    		throw new Error("<ColorPicker>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isAlpha(value) {
    		throw new Error("<ColorPicker>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isInput() {
    		throw new Error("<ColorPicker>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isInput(value) {
    		throw new Error("<ColorPicker>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isTextInput() {
    		throw new Error("<ColorPicker>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isTextInput(value) {
    		throw new Error("<ColorPicker>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isPopup() {
    		throw new Error("<ColorPicker>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isPopup(value) {
    		throw new Error("<ColorPicker>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isOpen() {
    		throw new Error("<ColorPicker>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isOpen(value) {
    		throw new Error("<ColorPicker>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get toRight() {
    		throw new Error("<ColorPicker>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set toRight(value) {
    		throw new Error("<ColorPicker>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isDark() {
    		throw new Error("<ColorPicker>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isDark(value) {
    		throw new Error("<ColorPicker>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get rgb() {
    		throw new Error("<ColorPicker>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set rgb(value) {
    		throw new Error("<ColorPicker>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get hsv() {
    		throw new Error("<ColorPicker>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hsv(value) {
    		throw new Error("<ColorPicker>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get hex() {
    		throw new Error("<ColorPicker>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hex(value) {
    		throw new Error("<ColorPicker>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var tinycolor = createCommonjsModule(function (module) {
    // TinyColor v1.4.2
    // https://github.com/bgrins/TinyColor
    // Brian Grinstead, MIT License

    (function(Math) {

    var trimLeft = /^\s+/,
        trimRight = /\s+$/,
        tinyCounter = 0,
        mathRound = Math.round,
        mathMin = Math.min,
        mathMax = Math.max,
        mathRandom = Math.random;

    function tinycolor (color, opts) {

        color = (color) ? color : '';
        opts = opts || { };

        // If input is already a tinycolor, return itself
        if (color instanceof tinycolor) {
           return color;
        }
        // If we are called as a function, call using new instead
        if (!(this instanceof tinycolor)) {
            return new tinycolor(color, opts);
        }

        var rgb = inputToRGB(color);
        this._originalInput = color,
        this._r = rgb.r,
        this._g = rgb.g,
        this._b = rgb.b,
        this._a = rgb.a,
        this._roundA = mathRound(100*this._a) / 100,
        this._format = opts.format || rgb.format;
        this._gradientType = opts.gradientType;

        // Don't let the range of [0,255] come back in [0,1].
        // Potentially lose a little bit of precision here, but will fix issues where
        // .5 gets interpreted as half of the total, instead of half of 1
        // If it was supposed to be 128, this was already taken care of by `inputToRgb`
        if (this._r < 1) { this._r = mathRound(this._r); }
        if (this._g < 1) { this._g = mathRound(this._g); }
        if (this._b < 1) { this._b = mathRound(this._b); }

        this._ok = rgb.ok;
        this._tc_id = tinyCounter++;
    }

    tinycolor.prototype = {
        isDark: function() {
            return this.getBrightness() < 128;
        },
        isLight: function() {
            return !this.isDark();
        },
        isValid: function() {
            return this._ok;
        },
        getOriginalInput: function() {
          return this._originalInput;
        },
        getFormat: function() {
            return this._format;
        },
        getAlpha: function() {
            return this._a;
        },
        getBrightness: function() {
            //http://www.w3.org/TR/AERT#color-contrast
            var rgb = this.toRgb();
            return (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
        },
        getLuminance: function() {
            //http://www.w3.org/TR/2008/REC-WCAG20-20081211/#relativeluminancedef
            var rgb = this.toRgb();
            var RsRGB, GsRGB, BsRGB, R, G, B;
            RsRGB = rgb.r/255;
            GsRGB = rgb.g/255;
            BsRGB = rgb.b/255;

            if (RsRGB <= 0.03928) {R = RsRGB / 12.92;} else {R = Math.pow(((RsRGB + 0.055) / 1.055), 2.4);}
            if (GsRGB <= 0.03928) {G = GsRGB / 12.92;} else {G = Math.pow(((GsRGB + 0.055) / 1.055), 2.4);}
            if (BsRGB <= 0.03928) {B = BsRGB / 12.92;} else {B = Math.pow(((BsRGB + 0.055) / 1.055), 2.4);}
            return (0.2126 * R) + (0.7152 * G) + (0.0722 * B);
        },
        setAlpha: function(value) {
            this._a = boundAlpha(value);
            this._roundA = mathRound(100*this._a) / 100;
            return this;
        },
        toHsv: function() {
            var hsv = rgbToHsv(this._r, this._g, this._b);
            return { h: hsv.h * 360, s: hsv.s, v: hsv.v, a: this._a };
        },
        toHsvString: function() {
            var hsv = rgbToHsv(this._r, this._g, this._b);
            var h = mathRound(hsv.h * 360), s = mathRound(hsv.s * 100), v = mathRound(hsv.v * 100);
            return (this._a == 1) ?
              "hsv("  + h + ", " + s + "%, " + v + "%)" :
              "hsva(" + h + ", " + s + "%, " + v + "%, "+ this._roundA + ")";
        },
        toHsl: function() {
            var hsl = rgbToHsl(this._r, this._g, this._b);
            return { h: hsl.h * 360, s: hsl.s, l: hsl.l, a: this._a };
        },
        toHslString: function() {
            var hsl = rgbToHsl(this._r, this._g, this._b);
            var h = mathRound(hsl.h * 360), s = mathRound(hsl.s * 100), l = mathRound(hsl.l * 100);
            return (this._a == 1) ?
              "hsl("  + h + ", " + s + "%, " + l + "%)" :
              "hsla(" + h + ", " + s + "%, " + l + "%, "+ this._roundA + ")";
        },
        toHex: function(allow3Char) {
            return rgbToHex(this._r, this._g, this._b, allow3Char);
        },
        toHexString: function(allow3Char) {
            return '#' + this.toHex(allow3Char);
        },
        toHex8: function(allow4Char) {
            return rgbaToHex(this._r, this._g, this._b, this._a, allow4Char);
        },
        toHex8String: function(allow4Char) {
            return '#' + this.toHex8(allow4Char);
        },
        toRgb: function() {
            return { r: mathRound(this._r), g: mathRound(this._g), b: mathRound(this._b), a: this._a };
        },
        toRgbString: function() {
            return (this._a == 1) ?
              "rgb("  + mathRound(this._r) + ", " + mathRound(this._g) + ", " + mathRound(this._b) + ")" :
              "rgba(" + mathRound(this._r) + ", " + mathRound(this._g) + ", " + mathRound(this._b) + ", " + this._roundA + ")";
        },
        toPercentageRgb: function() {
            return { r: mathRound(bound01(this._r, 255) * 100) + "%", g: mathRound(bound01(this._g, 255) * 100) + "%", b: mathRound(bound01(this._b, 255) * 100) + "%", a: this._a };
        },
        toPercentageRgbString: function() {
            return (this._a == 1) ?
              "rgb("  + mathRound(bound01(this._r, 255) * 100) + "%, " + mathRound(bound01(this._g, 255) * 100) + "%, " + mathRound(bound01(this._b, 255) * 100) + "%)" :
              "rgba(" + mathRound(bound01(this._r, 255) * 100) + "%, " + mathRound(bound01(this._g, 255) * 100) + "%, " + mathRound(bound01(this._b, 255) * 100) + "%, " + this._roundA + ")";
        },
        toName: function() {
            if (this._a === 0) {
                return "transparent";
            }

            if (this._a < 1) {
                return false;
            }

            return hexNames[rgbToHex(this._r, this._g, this._b, true)] || false;
        },
        toFilter: function(secondColor) {
            var hex8String = '#' + rgbaToArgbHex(this._r, this._g, this._b, this._a);
            var secondHex8String = hex8String;
            var gradientType = this._gradientType ? "GradientType = 1, " : "";

            if (secondColor) {
                var s = tinycolor(secondColor);
                secondHex8String = '#' + rgbaToArgbHex(s._r, s._g, s._b, s._a);
            }

            return "progid:DXImageTransform.Microsoft.gradient("+gradientType+"startColorstr="+hex8String+",endColorstr="+secondHex8String+")";
        },
        toString: function(format) {
            var formatSet = !!format;
            format = format || this._format;

            var formattedString = false;
            var hasAlpha = this._a < 1 && this._a >= 0;
            var needsAlphaFormat = !formatSet && hasAlpha && (format === "hex" || format === "hex6" || format === "hex3" || format === "hex4" || format === "hex8" || format === "name");

            if (needsAlphaFormat) {
                // Special case for "transparent", all other non-alpha formats
                // will return rgba when there is transparency.
                if (format === "name" && this._a === 0) {
                    return this.toName();
                }
                return this.toRgbString();
            }
            if (format === "rgb") {
                formattedString = this.toRgbString();
            }
            if (format === "prgb") {
                formattedString = this.toPercentageRgbString();
            }
            if (format === "hex" || format === "hex6") {
                formattedString = this.toHexString();
            }
            if (format === "hex3") {
                formattedString = this.toHexString(true);
            }
            if (format === "hex4") {
                formattedString = this.toHex8String(true);
            }
            if (format === "hex8") {
                formattedString = this.toHex8String();
            }
            if (format === "name") {
                formattedString = this.toName();
            }
            if (format === "hsl") {
                formattedString = this.toHslString();
            }
            if (format === "hsv") {
                formattedString = this.toHsvString();
            }

            return formattedString || this.toHexString();
        },
        clone: function() {
            return tinycolor(this.toString());
        },

        _applyModification: function(fn, args) {
            var color = fn.apply(null, [this].concat([].slice.call(args)));
            this._r = color._r;
            this._g = color._g;
            this._b = color._b;
            this.setAlpha(color._a);
            return this;
        },
        lighten: function() {
            return this._applyModification(lighten, arguments);
        },
        brighten: function() {
            return this._applyModification(brighten, arguments);
        },
        darken: function() {
            return this._applyModification(darken, arguments);
        },
        desaturate: function() {
            return this._applyModification(desaturate, arguments);
        },
        saturate: function() {
            return this._applyModification(saturate, arguments);
        },
        greyscale: function() {
            return this._applyModification(greyscale, arguments);
        },
        spin: function() {
            return this._applyModification(spin, arguments);
        },

        _applyCombination: function(fn, args) {
            return fn.apply(null, [this].concat([].slice.call(args)));
        },
        analogous: function() {
            return this._applyCombination(analogous, arguments);
        },
        complement: function() {
            return this._applyCombination(complement, arguments);
        },
        monochromatic: function() {
            return this._applyCombination(monochromatic, arguments);
        },
        splitcomplement: function() {
            return this._applyCombination(splitcomplement, arguments);
        },
        triad: function() {
            return this._applyCombination(triad, arguments);
        },
        tetrad: function() {
            return this._applyCombination(tetrad, arguments);
        }
    };

    // If input is an object, force 1 into "1.0" to handle ratios properly
    // String input requires "1.0" as input, so 1 will be treated as 1
    tinycolor.fromRatio = function(color, opts) {
        if (typeof color == "object") {
            var newColor = {};
            for (var i in color) {
                if (color.hasOwnProperty(i)) {
                    if (i === "a") {
                        newColor[i] = color[i];
                    }
                    else {
                        newColor[i] = convertToPercentage(color[i]);
                    }
                }
            }
            color = newColor;
        }

        return tinycolor(color, opts);
    };

    // Given a string or object, convert that input to RGB
    // Possible string inputs:
    //
    //     "red"
    //     "#f00" or "f00"
    //     "#ff0000" or "ff0000"
    //     "#ff000000" or "ff000000"
    //     "rgb 255 0 0" or "rgb (255, 0, 0)"
    //     "rgb 1.0 0 0" or "rgb (1, 0, 0)"
    //     "rgba (255, 0, 0, 1)" or "rgba 255, 0, 0, 1"
    //     "rgba (1.0, 0, 0, 1)" or "rgba 1.0, 0, 0, 1"
    //     "hsl(0, 100%, 50%)" or "hsl 0 100% 50%"
    //     "hsla(0, 100%, 50%, 1)" or "hsla 0 100% 50%, 1"
    //     "hsv(0, 100%, 100%)" or "hsv 0 100% 100%"
    //
    function inputToRGB(color) {

        var rgb = { r: 0, g: 0, b: 0 };
        var a = 1;
        var s = null;
        var v = null;
        var l = null;
        var ok = false;
        var format = false;

        if (typeof color == "string") {
            color = stringInputToObject(color);
        }

        if (typeof color == "object") {
            if (isValidCSSUnit(color.r) && isValidCSSUnit(color.g) && isValidCSSUnit(color.b)) {
                rgb = rgbToRgb(color.r, color.g, color.b);
                ok = true;
                format = String(color.r).substr(-1) === "%" ? "prgb" : "rgb";
            }
            else if (isValidCSSUnit(color.h) && isValidCSSUnit(color.s) && isValidCSSUnit(color.v)) {
                s = convertToPercentage(color.s);
                v = convertToPercentage(color.v);
                rgb = hsvToRgb(color.h, s, v);
                ok = true;
                format = "hsv";
            }
            else if (isValidCSSUnit(color.h) && isValidCSSUnit(color.s) && isValidCSSUnit(color.l)) {
                s = convertToPercentage(color.s);
                l = convertToPercentage(color.l);
                rgb = hslToRgb(color.h, s, l);
                ok = true;
                format = "hsl";
            }

            if (color.hasOwnProperty("a")) {
                a = color.a;
            }
        }

        a = boundAlpha(a);

        return {
            ok: ok,
            format: color.format || format,
            r: mathMin(255, mathMax(rgb.r, 0)),
            g: mathMin(255, mathMax(rgb.g, 0)),
            b: mathMin(255, mathMax(rgb.b, 0)),
            a: a
        };
    }


    // Conversion Functions
    // --------------------

    // `rgbToHsl`, `rgbToHsv`, `hslToRgb`, `hsvToRgb` modified from:
    // <http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript>

    // `rgbToRgb`
    // Handle bounds / percentage checking to conform to CSS color spec
    // <http://www.w3.org/TR/css3-color/>
    // *Assumes:* r, g, b in [0, 255] or [0, 1]
    // *Returns:* { r, g, b } in [0, 255]
    function rgbToRgb(r, g, b){
        return {
            r: bound01(r, 255) * 255,
            g: bound01(g, 255) * 255,
            b: bound01(b, 255) * 255
        };
    }

    // `rgbToHsl`
    // Converts an RGB color value to HSL.
    // *Assumes:* r, g, and b are contained in [0, 255] or [0, 1]
    // *Returns:* { h, s, l } in [0,1]
    function rgbToHsl(r, g, b) {

        r = bound01(r, 255);
        g = bound01(g, 255);
        b = bound01(b, 255);

        var max = mathMax(r, g, b), min = mathMin(r, g, b);
        var h, s, l = (max + min) / 2;

        if(max == min) {
            h = s = 0; // achromatic
        }
        else {
            var d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch(max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }

            h /= 6;
        }

        return { h: h, s: s, l: l };
    }

    // `hslToRgb`
    // Converts an HSL color value to RGB.
    // *Assumes:* h is contained in [0, 1] or [0, 360] and s and l are contained [0, 1] or [0, 100]
    // *Returns:* { r, g, b } in the set [0, 255]
    function hslToRgb(h, s, l) {
        var r, g, b;

        h = bound01(h, 360);
        s = bound01(s, 100);
        l = bound01(l, 100);

        function hue2rgb(p, q, t) {
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }

        if(s === 0) {
            r = g = b = l; // achromatic
        }
        else {
            var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            var p = 2 * l - q;
            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }

        return { r: r * 255, g: g * 255, b: b * 255 };
    }

    // `rgbToHsv`
    // Converts an RGB color value to HSV
    // *Assumes:* r, g, and b are contained in the set [0, 255] or [0, 1]
    // *Returns:* { h, s, v } in [0,1]
    function rgbToHsv(r, g, b) {

        r = bound01(r, 255);
        g = bound01(g, 255);
        b = bound01(b, 255);

        var max = mathMax(r, g, b), min = mathMin(r, g, b);
        var h, s, v = max;

        var d = max - min;
        s = max === 0 ? 0 : d / max;

        if(max == min) {
            h = 0; // achromatic
        }
        else {
            switch(max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }
        return { h: h, s: s, v: v };
    }

    // `hsvToRgb`
    // Converts an HSV color value to RGB.
    // *Assumes:* h is contained in [0, 1] or [0, 360] and s and v are contained in [0, 1] or [0, 100]
    // *Returns:* { r, g, b } in the set [0, 255]
     function hsvToRgb(h, s, v) {

        h = bound01(h, 360) * 6;
        s = bound01(s, 100);
        v = bound01(v, 100);

        var i = Math.floor(h),
            f = h - i,
            p = v * (1 - s),
            q = v * (1 - f * s),
            t = v * (1 - (1 - f) * s),
            mod = i % 6,
            r = [v, q, p, p, t, v][mod],
            g = [t, v, v, q, p, p][mod],
            b = [p, p, t, v, v, q][mod];

        return { r: r * 255, g: g * 255, b: b * 255 };
    }

    // `rgbToHex`
    // Converts an RGB color to hex
    // Assumes r, g, and b are contained in the set [0, 255]
    // Returns a 3 or 6 character hex
    function rgbToHex(r, g, b, allow3Char) {

        var hex = [
            pad2(mathRound(r).toString(16)),
            pad2(mathRound(g).toString(16)),
            pad2(mathRound(b).toString(16))
        ];

        // Return a 3 character hex if possible
        if (allow3Char && hex[0].charAt(0) == hex[0].charAt(1) && hex[1].charAt(0) == hex[1].charAt(1) && hex[2].charAt(0) == hex[2].charAt(1)) {
            return hex[0].charAt(0) + hex[1].charAt(0) + hex[2].charAt(0);
        }

        return hex.join("");
    }

    // `rgbaToHex`
    // Converts an RGBA color plus alpha transparency to hex
    // Assumes r, g, b are contained in the set [0, 255] and
    // a in [0, 1]. Returns a 4 or 8 character rgba hex
    function rgbaToHex(r, g, b, a, allow4Char) {

        var hex = [
            pad2(mathRound(r).toString(16)),
            pad2(mathRound(g).toString(16)),
            pad2(mathRound(b).toString(16)),
            pad2(convertDecimalToHex(a))
        ];

        // Return a 4 character hex if possible
        if (allow4Char && hex[0].charAt(0) == hex[0].charAt(1) && hex[1].charAt(0) == hex[1].charAt(1) && hex[2].charAt(0) == hex[2].charAt(1) && hex[3].charAt(0) == hex[3].charAt(1)) {
            return hex[0].charAt(0) + hex[1].charAt(0) + hex[2].charAt(0) + hex[3].charAt(0);
        }

        return hex.join("");
    }

    // `rgbaToArgbHex`
    // Converts an RGBA color to an ARGB Hex8 string
    // Rarely used, but required for "toFilter()"
    function rgbaToArgbHex(r, g, b, a) {

        var hex = [
            pad2(convertDecimalToHex(a)),
            pad2(mathRound(r).toString(16)),
            pad2(mathRound(g).toString(16)),
            pad2(mathRound(b).toString(16))
        ];

        return hex.join("");
    }

    // `equals`
    // Can be called with any tinycolor input
    tinycolor.equals = function (color1, color2) {
        if (!color1 || !color2) { return false; }
        return tinycolor(color1).toRgbString() == tinycolor(color2).toRgbString();
    };

    tinycolor.random = function() {
        return tinycolor.fromRatio({
            r: mathRandom(),
            g: mathRandom(),
            b: mathRandom()
        });
    };


    // Modification Functions
    // ----------------------
    // Thanks to less.js for some of the basics here
    // <https://github.com/cloudhead/less.js/blob/master/lib/less/functions.js>

    function desaturate(color, amount) {
        amount = (amount === 0) ? 0 : (amount || 10);
        var hsl = tinycolor(color).toHsl();
        hsl.s -= amount / 100;
        hsl.s = clamp01(hsl.s);
        return tinycolor(hsl);
    }

    function saturate(color, amount) {
        amount = (amount === 0) ? 0 : (amount || 10);
        var hsl = tinycolor(color).toHsl();
        hsl.s += amount / 100;
        hsl.s = clamp01(hsl.s);
        return tinycolor(hsl);
    }

    function greyscale(color) {
        return tinycolor(color).desaturate(100);
    }

    function lighten (color, amount) {
        amount = (amount === 0) ? 0 : (amount || 10);
        var hsl = tinycolor(color).toHsl();
        hsl.l += amount / 100;
        hsl.l = clamp01(hsl.l);
        return tinycolor(hsl);
    }

    function brighten(color, amount) {
        amount = (amount === 0) ? 0 : (amount || 10);
        var rgb = tinycolor(color).toRgb();
        rgb.r = mathMax(0, mathMin(255, rgb.r - mathRound(255 * - (amount / 100))));
        rgb.g = mathMax(0, mathMin(255, rgb.g - mathRound(255 * - (amount / 100))));
        rgb.b = mathMax(0, mathMin(255, rgb.b - mathRound(255 * - (amount / 100))));
        return tinycolor(rgb);
    }

    function darken (color, amount) {
        amount = (amount === 0) ? 0 : (amount || 10);
        var hsl = tinycolor(color).toHsl();
        hsl.l -= amount / 100;
        hsl.l = clamp01(hsl.l);
        return tinycolor(hsl);
    }

    // Spin takes a positive or negative amount within [-360, 360] indicating the change of hue.
    // Values outside of this range will be wrapped into this range.
    function spin(color, amount) {
        var hsl = tinycolor(color).toHsl();
        var hue = (hsl.h + amount) % 360;
        hsl.h = hue < 0 ? 360 + hue : hue;
        return tinycolor(hsl);
    }

    // Combination Functions
    // ---------------------
    // Thanks to jQuery xColor for some of the ideas behind these
    // <https://github.com/infusion/jQuery-xcolor/blob/master/jquery.xcolor.js>

    function complement(color) {
        var hsl = tinycolor(color).toHsl();
        hsl.h = (hsl.h + 180) % 360;
        return tinycolor(hsl);
    }

    function triad(color) {
        var hsl = tinycolor(color).toHsl();
        var h = hsl.h;
        return [
            tinycolor(color),
            tinycolor({ h: (h + 120) % 360, s: hsl.s, l: hsl.l }),
            tinycolor({ h: (h + 240) % 360, s: hsl.s, l: hsl.l })
        ];
    }

    function tetrad(color) {
        var hsl = tinycolor(color).toHsl();
        var h = hsl.h;
        return [
            tinycolor(color),
            tinycolor({ h: (h + 90) % 360, s: hsl.s, l: hsl.l }),
            tinycolor({ h: (h + 180) % 360, s: hsl.s, l: hsl.l }),
            tinycolor({ h: (h + 270) % 360, s: hsl.s, l: hsl.l })
        ];
    }

    function splitcomplement(color) {
        var hsl = tinycolor(color).toHsl();
        var h = hsl.h;
        return [
            tinycolor(color),
            tinycolor({ h: (h + 72) % 360, s: hsl.s, l: hsl.l}),
            tinycolor({ h: (h + 216) % 360, s: hsl.s, l: hsl.l})
        ];
    }

    function analogous(color, results, slices) {
        results = results || 6;
        slices = slices || 30;

        var hsl = tinycolor(color).toHsl();
        var part = 360 / slices;
        var ret = [tinycolor(color)];

        for (hsl.h = ((hsl.h - (part * results >> 1)) + 720) % 360; --results; ) {
            hsl.h = (hsl.h + part) % 360;
            ret.push(tinycolor(hsl));
        }
        return ret;
    }

    function monochromatic(color, results) {
        results = results || 6;
        var hsv = tinycolor(color).toHsv();
        var h = hsv.h, s = hsv.s, v = hsv.v;
        var ret = [];
        var modification = 1 / results;

        while (results--) {
            ret.push(tinycolor({ h: h, s: s, v: v}));
            v = (v + modification) % 1;
        }

        return ret;
    }

    // Utility Functions
    // ---------------------

    tinycolor.mix = function(color1, color2, amount) {
        amount = (amount === 0) ? 0 : (amount || 50);

        var rgb1 = tinycolor(color1).toRgb();
        var rgb2 = tinycolor(color2).toRgb();

        var p = amount / 100;

        var rgba = {
            r: ((rgb2.r - rgb1.r) * p) + rgb1.r,
            g: ((rgb2.g - rgb1.g) * p) + rgb1.g,
            b: ((rgb2.b - rgb1.b) * p) + rgb1.b,
            a: ((rgb2.a - rgb1.a) * p) + rgb1.a
        };

        return tinycolor(rgba);
    };


    // Readability Functions
    // ---------------------
    // <http://www.w3.org/TR/2008/REC-WCAG20-20081211/#contrast-ratiodef (WCAG Version 2)

    // `contrast`
    // Analyze the 2 colors and returns the color contrast defined by (WCAG Version 2)
    tinycolor.readability = function(color1, color2) {
        var c1 = tinycolor(color1);
        var c2 = tinycolor(color2);
        return (Math.max(c1.getLuminance(),c2.getLuminance())+0.05) / (Math.min(c1.getLuminance(),c2.getLuminance())+0.05);
    };

    // `isReadable`
    // Ensure that foreground and background color combinations meet WCAG2 guidelines.
    // The third argument is an optional Object.
    //      the 'level' property states 'AA' or 'AAA' - if missing or invalid, it defaults to 'AA';
    //      the 'size' property states 'large' or 'small' - if missing or invalid, it defaults to 'small'.
    // If the entire object is absent, isReadable defaults to {level:"AA",size:"small"}.

    // *Example*
    //    tinycolor.isReadable("#000", "#111") => false
    //    tinycolor.isReadable("#000", "#111",{level:"AA",size:"large"}) => false
    tinycolor.isReadable = function(color1, color2, wcag2) {
        var readability = tinycolor.readability(color1, color2);
        var wcag2Parms, out;

        out = false;

        wcag2Parms = validateWCAG2Parms(wcag2);
        switch (wcag2Parms.level + wcag2Parms.size) {
            case "AAsmall":
            case "AAAlarge":
                out = readability >= 4.5;
                break;
            case "AAlarge":
                out = readability >= 3;
                break;
            case "AAAsmall":
                out = readability >= 7;
                break;
        }
        return out;

    };

    // `mostReadable`
    // Given a base color and a list of possible foreground or background
    // colors for that base, returns the most readable color.
    // Optionally returns Black or White if the most readable color is unreadable.
    // *Example*
    //    tinycolor.mostReadable(tinycolor.mostReadable("#123", ["#124", "#125"],{includeFallbackColors:false}).toHexString(); // "#112255"
    //    tinycolor.mostReadable(tinycolor.mostReadable("#123", ["#124", "#125"],{includeFallbackColors:true}).toHexString();  // "#ffffff"
    //    tinycolor.mostReadable("#a8015a", ["#faf3f3"],{includeFallbackColors:true,level:"AAA",size:"large"}).toHexString(); // "#faf3f3"
    //    tinycolor.mostReadable("#a8015a", ["#faf3f3"],{includeFallbackColors:true,level:"AAA",size:"small"}).toHexString(); // "#ffffff"
    tinycolor.mostReadable = function(baseColor, colorList, args) {
        var bestColor = null;
        var bestScore = 0;
        var readability;
        var includeFallbackColors, level, size ;
        args = args || {};
        includeFallbackColors = args.includeFallbackColors ;
        level = args.level;
        size = args.size;

        for (var i= 0; i < colorList.length ; i++) {
            readability = tinycolor.readability(baseColor, colorList[i]);
            if (readability > bestScore) {
                bestScore = readability;
                bestColor = tinycolor(colorList[i]);
            }
        }

        if (tinycolor.isReadable(baseColor, bestColor, {"level":level,"size":size}) || !includeFallbackColors) {
            return bestColor;
        }
        else {
            args.includeFallbackColors=false;
            return tinycolor.mostReadable(baseColor,["#fff", "#000"],args);
        }
    };


    // Big List of Colors
    // ------------------
    // <http://www.w3.org/TR/css3-color/#svg-color>
    var names = tinycolor.names = {
        aliceblue: "f0f8ff",
        antiquewhite: "faebd7",
        aqua: "0ff",
        aquamarine: "7fffd4",
        azure: "f0ffff",
        beige: "f5f5dc",
        bisque: "ffe4c4",
        black: "000",
        blanchedalmond: "ffebcd",
        blue: "00f",
        blueviolet: "8a2be2",
        brown: "a52a2a",
        burlywood: "deb887",
        burntsienna: "ea7e5d",
        cadetblue: "5f9ea0",
        chartreuse: "7fff00",
        chocolate: "d2691e",
        coral: "ff7f50",
        cornflowerblue: "6495ed",
        cornsilk: "fff8dc",
        crimson: "dc143c",
        cyan: "0ff",
        darkblue: "00008b",
        darkcyan: "008b8b",
        darkgoldenrod: "b8860b",
        darkgray: "a9a9a9",
        darkgreen: "006400",
        darkgrey: "a9a9a9",
        darkkhaki: "bdb76b",
        darkmagenta: "8b008b",
        darkolivegreen: "556b2f",
        darkorange: "ff8c00",
        darkorchid: "9932cc",
        darkred: "8b0000",
        darksalmon: "e9967a",
        darkseagreen: "8fbc8f",
        darkslateblue: "483d8b",
        darkslategray: "2f4f4f",
        darkslategrey: "2f4f4f",
        darkturquoise: "00ced1",
        darkviolet: "9400d3",
        deeppink: "ff1493",
        deepskyblue: "00bfff",
        dimgray: "696969",
        dimgrey: "696969",
        dodgerblue: "1e90ff",
        firebrick: "b22222",
        floralwhite: "fffaf0",
        forestgreen: "228b22",
        fuchsia: "f0f",
        gainsboro: "dcdcdc",
        ghostwhite: "f8f8ff",
        gold: "ffd700",
        goldenrod: "daa520",
        gray: "808080",
        green: "008000",
        greenyellow: "adff2f",
        grey: "808080",
        honeydew: "f0fff0",
        hotpink: "ff69b4",
        indianred: "cd5c5c",
        indigo: "4b0082",
        ivory: "fffff0",
        khaki: "f0e68c",
        lavender: "e6e6fa",
        lavenderblush: "fff0f5",
        lawngreen: "7cfc00",
        lemonchiffon: "fffacd",
        lightblue: "add8e6",
        lightcoral: "f08080",
        lightcyan: "e0ffff",
        lightgoldenrodyellow: "fafad2",
        lightgray: "d3d3d3",
        lightgreen: "90ee90",
        lightgrey: "d3d3d3",
        lightpink: "ffb6c1",
        lightsalmon: "ffa07a",
        lightseagreen: "20b2aa",
        lightskyblue: "87cefa",
        lightslategray: "789",
        lightslategrey: "789",
        lightsteelblue: "b0c4de",
        lightyellow: "ffffe0",
        lime: "0f0",
        limegreen: "32cd32",
        linen: "faf0e6",
        magenta: "f0f",
        maroon: "800000",
        mediumaquamarine: "66cdaa",
        mediumblue: "0000cd",
        mediumorchid: "ba55d3",
        mediumpurple: "9370db",
        mediumseagreen: "3cb371",
        mediumslateblue: "7b68ee",
        mediumspringgreen: "00fa9a",
        mediumturquoise: "48d1cc",
        mediumvioletred: "c71585",
        midnightblue: "191970",
        mintcream: "f5fffa",
        mistyrose: "ffe4e1",
        moccasin: "ffe4b5",
        navajowhite: "ffdead",
        navy: "000080",
        oldlace: "fdf5e6",
        olive: "808000",
        olivedrab: "6b8e23",
        orange: "ffa500",
        orangered: "ff4500",
        orchid: "da70d6",
        palegoldenrod: "eee8aa",
        palegreen: "98fb98",
        paleturquoise: "afeeee",
        palevioletred: "db7093",
        papayawhip: "ffefd5",
        peachpuff: "ffdab9",
        peru: "cd853f",
        pink: "ffc0cb",
        plum: "dda0dd",
        powderblue: "b0e0e6",
        purple: "800080",
        rebeccapurple: "663399",
        red: "f00",
        rosybrown: "bc8f8f",
        royalblue: "4169e1",
        saddlebrown: "8b4513",
        salmon: "fa8072",
        sandybrown: "f4a460",
        seagreen: "2e8b57",
        seashell: "fff5ee",
        sienna: "a0522d",
        silver: "c0c0c0",
        skyblue: "87ceeb",
        slateblue: "6a5acd",
        slategray: "708090",
        slategrey: "708090",
        snow: "fffafa",
        springgreen: "00ff7f",
        steelblue: "4682b4",
        tan: "d2b48c",
        teal: "008080",
        thistle: "d8bfd8",
        tomato: "ff6347",
        turquoise: "40e0d0",
        violet: "ee82ee",
        wheat: "f5deb3",
        white: "fff",
        whitesmoke: "f5f5f5",
        yellow: "ff0",
        yellowgreen: "9acd32"
    };

    // Make it easy to access colors via `hexNames[hex]`
    var hexNames = tinycolor.hexNames = flip(names);


    // Utilities
    // ---------

    // `{ 'name1': 'val1' }` becomes `{ 'val1': 'name1' }`
    function flip(o) {
        var flipped = { };
        for (var i in o) {
            if (o.hasOwnProperty(i)) {
                flipped[o[i]] = i;
            }
        }
        return flipped;
    }

    // Return a valid alpha value [0,1] with all invalid values being set to 1
    function boundAlpha(a) {
        a = parseFloat(a);

        if (isNaN(a) || a < 0 || a > 1) {
            a = 1;
        }

        return a;
    }

    // Take input from [0, n] and return it as [0, 1]
    function bound01(n, max) {
        if (isOnePointZero(n)) { n = "100%"; }

        var processPercent = isPercentage(n);
        n = mathMin(max, mathMax(0, parseFloat(n)));

        // Automatically convert percentage into number
        if (processPercent) {
            n = parseInt(n * max, 10) / 100;
        }

        // Handle floating point rounding errors
        if ((Math.abs(n - max) < 0.000001)) {
            return 1;
        }

        // Convert into [0, 1] range if it isn't already
        return (n % max) / parseFloat(max);
    }

    // Force a number between 0 and 1
    function clamp01(val) {
        return mathMin(1, mathMax(0, val));
    }

    // Parse a base-16 hex value into a base-10 integer
    function parseIntFromHex(val) {
        return parseInt(val, 16);
    }

    // Need to handle 1.0 as 100%, since once it is a number, there is no difference between it and 1
    // <http://stackoverflow.com/questions/7422072/javascript-how-to-detect-number-as-a-decimal-including-1-0>
    function isOnePointZero(n) {
        return typeof n == "string" && n.indexOf('.') != -1 && parseFloat(n) === 1;
    }

    // Check to see if string passed in is a percentage
    function isPercentage(n) {
        return typeof n === "string" && n.indexOf('%') != -1;
    }

    // Force a hex value to have 2 characters
    function pad2(c) {
        return c.length == 1 ? '0' + c : '' + c;
    }

    // Replace a decimal with it's percentage value
    function convertToPercentage(n) {
        if (n <= 1) {
            n = (n * 100) + "%";
        }

        return n;
    }

    // Converts a decimal to a hex value
    function convertDecimalToHex(d) {
        return Math.round(parseFloat(d) * 255).toString(16);
    }
    // Converts a hex value to a decimal
    function convertHexToDecimal(h) {
        return (parseIntFromHex(h) / 255);
    }

    var matchers = (function() {

        // <http://www.w3.org/TR/css3-values/#integers>
        var CSS_INTEGER = "[-\\+]?\\d+%?";

        // <http://www.w3.org/TR/css3-values/#number-value>
        var CSS_NUMBER = "[-\\+]?\\d*\\.\\d+%?";

        // Allow positive/negative integer/number.  Don't capture the either/or, just the entire outcome.
        var CSS_UNIT = "(?:" + CSS_NUMBER + ")|(?:" + CSS_INTEGER + ")";

        // Actual matching.
        // Parentheses and commas are optional, but not required.
        // Whitespace can take the place of commas or opening paren
        var PERMISSIVE_MATCH3 = "[\\s|\\(]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")\\s*\\)?";
        var PERMISSIVE_MATCH4 = "[\\s|\\(]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")\\s*\\)?";

        return {
            CSS_UNIT: new RegExp(CSS_UNIT),
            rgb: new RegExp("rgb" + PERMISSIVE_MATCH3),
            rgba: new RegExp("rgba" + PERMISSIVE_MATCH4),
            hsl: new RegExp("hsl" + PERMISSIVE_MATCH3),
            hsla: new RegExp("hsla" + PERMISSIVE_MATCH4),
            hsv: new RegExp("hsv" + PERMISSIVE_MATCH3),
            hsva: new RegExp("hsva" + PERMISSIVE_MATCH4),
            hex3: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
            hex6: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,
            hex4: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
            hex8: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/
        };
    })();

    // `isValidCSSUnit`
    // Take in a single string / number and check to see if it looks like a CSS unit
    // (see `matchers` above for definition).
    function isValidCSSUnit(color) {
        return !!matchers.CSS_UNIT.exec(color);
    }

    // `stringInputToObject`
    // Permissive string parsing.  Take in a number of formats, and output an object
    // based on detected format.  Returns `{ r, g, b }` or `{ h, s, l }` or `{ h, s, v}`
    function stringInputToObject(color) {

        color = color.replace(trimLeft,'').replace(trimRight, '').toLowerCase();
        var named = false;
        if (names[color]) {
            color = names[color];
            named = true;
        }
        else if (color == 'transparent') {
            return { r: 0, g: 0, b: 0, a: 0, format: "name" };
        }

        // Try to match string input using regular expressions.
        // Keep most of the number bounding out of this function - don't worry about [0,1] or [0,100] or [0,360]
        // Just return an object and let the conversion functions handle that.
        // This way the result will be the same whether the tinycolor is initialized with string or object.
        var match;
        if ((match = matchers.rgb.exec(color))) {
            return { r: match[1], g: match[2], b: match[3] };
        }
        if ((match = matchers.rgba.exec(color))) {
            return { r: match[1], g: match[2], b: match[3], a: match[4] };
        }
        if ((match = matchers.hsl.exec(color))) {
            return { h: match[1], s: match[2], l: match[3] };
        }
        if ((match = matchers.hsla.exec(color))) {
            return { h: match[1], s: match[2], l: match[3], a: match[4] };
        }
        if ((match = matchers.hsv.exec(color))) {
            return { h: match[1], s: match[2], v: match[3] };
        }
        if ((match = matchers.hsva.exec(color))) {
            return { h: match[1], s: match[2], v: match[3], a: match[4] };
        }
        if ((match = matchers.hex8.exec(color))) {
            return {
                r: parseIntFromHex(match[1]),
                g: parseIntFromHex(match[2]),
                b: parseIntFromHex(match[3]),
                a: convertHexToDecimal(match[4]),
                format: named ? "name" : "hex8"
            };
        }
        if ((match = matchers.hex6.exec(color))) {
            return {
                r: parseIntFromHex(match[1]),
                g: parseIntFromHex(match[2]),
                b: parseIntFromHex(match[3]),
                format: named ? "name" : "hex"
            };
        }
        if ((match = matchers.hex4.exec(color))) {
            return {
                r: parseIntFromHex(match[1] + '' + match[1]),
                g: parseIntFromHex(match[2] + '' + match[2]),
                b: parseIntFromHex(match[3] + '' + match[3]),
                a: convertHexToDecimal(match[4] + '' + match[4]),
                format: named ? "name" : "hex8"
            };
        }
        if ((match = matchers.hex3.exec(color))) {
            return {
                r: parseIntFromHex(match[1] + '' + match[1]),
                g: parseIntFromHex(match[2] + '' + match[2]),
                b: parseIntFromHex(match[3] + '' + match[3]),
                format: named ? "name" : "hex"
            };
        }

        return false;
    }

    function validateWCAG2Parms(parms) {
        // return valid WCAG2 parms for isReadable.
        // If input parms are invalid, return {"level":"AA", "size":"small"}
        var level, size;
        parms = parms || {"level":"AA", "size":"small"};
        level = (parms.level || "AA").toUpperCase();
        size = (parms.size || "small").toLowerCase();
        if (level !== "AA" && level !== "AAA") {
            level = "AA";
        }
        if (size !== "small" && size !== "large") {
            size = "small";
        }
        return {"level":level, "size":size};
    }

    // Node: Export function
    if (module.exports) {
        module.exports = tinycolor;
    }
    // AMD/requirejs: Define the module
    else {
        window.tinycolor = tinycolor;
    }

    })(Math);
    });

    /* src\components\tools\Colorpicker.svelte generated by Svelte v3.49.0 */
    const file$A = "src\\components\\tools\\Colorpicker.svelte";

    // (34:4) {#if alpha}
    function create_if_block_1$5(ctx) {
    	let label;
    	let span;
    	let t1;
    	let input;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			label = element("label");
    			span = element("span");
    			span.textContent = "A:";
    			t1 = space();
    			input = element("input");
    			add_location(span, file$A, 35, 6, 983);
    			attr_dev(input, "placeholder", "A");
    			attr_dev(input, "type", "number");
    			add_location(input, file$A, 36, 6, 1006);
    			add_location(label, file$A, 34, 5, 968);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label, anchor);
    			append_dev(label, span);
    			append_dev(label, t1);
    			append_dev(label, input);
    			set_input_value(input, /*rgb*/ ctx[1].a);

    			if (!mounted) {
    				dispose = listen_dev(input, "input", /*input_input_handler*/ ctx[12]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*rgb*/ 2 && to_number(input.value) !== /*rgb*/ ctx[1].a) {
    				set_input_value(input, /*rgb*/ ctx[1].a);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$5.name,
    		type: "if",
    		source: "(34:4) {#if alpha}",
    		ctx
    	});

    	return block;
    }

    // (45:5) <Control        {tips}        {legacy}        size="12px"        tiptext="Copy"        on:click={e => {                  navigator.clipboard.writeText(hex).then(() => {             ipcRenderer.send('action', "Color copied!");         }, () => {             ipcRenderer.send('action', "Failed to copy color");         });        }}       >
    function create_default_slot_1$6(ctx) {
    	let i;

    	const block = {
    		c: function create() {
    			i = element("i");
    			attr_dev(i, "class", "far fa-clipboard");
    			set_style(i, "transform", "translateY(-1px)");
    			add_location(i, file$A, 57, 6, 1597);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, i, anchor);
    		},
    		p: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(i);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$6.name,
    		type: "slot",
    		source: "(45:5) <Control        {tips}        {legacy}        size=\\\"12px\\\"        tiptext=\\\"Copy\\\"        on:click={e => {                  navigator.clipboard.writeText(hex).then(() => {             ipcRenderer.send('action', \\\"Color copied!\\\");         }, () => {             ipcRenderer.send('action', \\\"Failed to copy color\\\");         });        }}       >",
    		ctx
    	});

    	return block;
    }

    // (60:5) {#if reset}
    function create_if_block$e(ctx) {
    	let control;
    	let current;

    	control = new Control({
    			props: {
    				tips: /*tips*/ ctx[3],
    				legacy: /*legacy*/ ctx[2],
    				size: "12px",
    				tiptext: "Reset",
    				$$slots: { default: [create_default_slot$6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	control.$on("click", /*click_handler_1*/ ctx[15]);

    	const block = {
    		c: function create() {
    			create_component(control.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(control, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const control_changes = {};
    			if (dirty & /*tips*/ 8) control_changes.tips = /*tips*/ ctx[3];
    			if (dirty & /*legacy*/ 4) control_changes.legacy = /*legacy*/ ctx[2];

    			if (dirty & /*$$scope*/ 65536) {
    				control_changes.$$scope = { dirty, ctx };
    			}

    			control.$set(control_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(control.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(control.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(control, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$e.name,
    		type: "if",
    		source: "(60:5) {#if reset}",
    		ctx
    	});

    	return block;
    }

    // (61:6) <Control         {tips}         {legacy}         size="12px"         tiptext="Reset"         on:click={e => {          hex = reset;         }}        >
    function create_default_slot$6(ctx) {
    	let i;

    	const block = {
    		c: function create() {
    			i = element("i");
    			attr_dev(i, "class", "fas fa-redo");
    			add_location(i, file$A, 69, 7, 1869);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, i, anchor);
    		},
    		p: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(i);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$6.name,
    		type: "slot",
    		source: "(61:6) <Control         {tips}         {legacy}         size=\\\"12px\\\"         tiptext=\\\"Reset\\\"         on:click={e => {          hex = reset;         }}        >",
    		ctx
    	});

    	return block;
    }

    function create_fragment$E(ctx) {
    	let div4;
    	let colorpicker;
    	let updating_rgb;
    	let updating_hex;
    	let t0;
    	let div3;
    	let div2;
    	let div0;
    	let label0;
    	let span0;
    	let t2;
    	let input0;
    	let t3;
    	let label1;
    	let span1;
    	let t5;
    	let input1;
    	let t6;
    	let label2;
    	let span2;
    	let t8;
    	let input2;
    	let t9;
    	let t10;
    	let div1;
    	let label3;
    	let span3;
    	let t12;
    	let input3;
    	let t13;
    	let control;
    	let t14;
    	let current;
    	let mounted;
    	let dispose;

    	function colorpicker_rgb_binding(value) {
    		/*colorpicker_rgb_binding*/ ctx[7](value);
    	}

    	function colorpicker_hex_binding(value) {
    		/*colorpicker_hex_binding*/ ctx[8](value);
    	}

    	let colorpicker_props = {
    		isOpen: true,
    		isInput: false,
    		isAlpha: /*alpha*/ ctx[5],
    		isTextInput: false
    	};

    	if (/*rgb*/ ctx[1] !== void 0) {
    		colorpicker_props.rgb = /*rgb*/ ctx[1];
    	}

    	if (/*hex*/ ctx[0] !== void 0) {
    		colorpicker_props.hex = /*hex*/ ctx[0];
    	}

    	colorpicker = new ColorPicker({ props: colorpicker_props, $$inline: true });
    	binding_callbacks.push(() => bind(colorpicker, 'rgb', colorpicker_rgb_binding));
    	binding_callbacks.push(() => bind(colorpicker, 'hex', colorpicker_hex_binding));
    	let if_block0 = /*alpha*/ ctx[5] && create_if_block_1$5(ctx);

    	control = new Control({
    			props: {
    				tips: /*tips*/ ctx[3],
    				legacy: /*legacy*/ ctx[2],
    				size: "12px",
    				tiptext: "Copy",
    				$$slots: { default: [create_default_slot_1$6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	control.$on("click", /*click_handler*/ ctx[14]);
    	let if_block1 = /*reset*/ ctx[4] && create_if_block$e(ctx);

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			create_component(colorpicker.$$.fragment);
    			t0 = space();
    			div3 = element("div");
    			div2 = element("div");
    			div0 = element("div");
    			label0 = element("label");
    			span0 = element("span");
    			span0.textContent = "R:";
    			t2 = space();
    			input0 = element("input");
    			t3 = space();
    			label1 = element("label");
    			span1 = element("span");
    			span1.textContent = "G:";
    			t5 = space();
    			input1 = element("input");
    			t6 = space();
    			label2 = element("label");
    			span2 = element("span");
    			span2.textContent = "B:";
    			t8 = space();
    			input2 = element("input");
    			t9 = space();
    			if (if_block0) if_block0.c();
    			t10 = space();
    			div1 = element("div");
    			label3 = element("label");
    			span3 = element("span");
    			span3.textContent = "HEX:";
    			t12 = space();
    			input3 = element("input");
    			t13 = space();
    			create_component(control.$$.fragment);
    			t14 = space();
    			if (if_block1) if_block1.c();
    			add_location(span0, file$A, 22, 5, 628);
    			attr_dev(input0, "placeholder", "R");
    			attr_dev(input0, "type", "number");
    			add_location(input0, file$A, 23, 5, 650);
    			add_location(label0, file$A, 21, 4, 614);
    			add_location(span1, file$A, 26, 5, 740);
    			attr_dev(input1, "placeholder", "G");
    			attr_dev(input1, "type", "number");
    			add_location(input1, file$A, 27, 5, 762);
    			add_location(label1, file$A, 25, 4, 726);
    			add_location(span2, file$A, 30, 5, 852);
    			attr_dev(input2, "placeholder", "B");
    			attr_dev(input2, "type", "number");
    			add_location(input2, file$A, 31, 5, 874);
    			add_location(label2, file$A, 29, 4, 838);
    			attr_dev(div0, "class", "picker-controls-row");
    			add_location(div0, file$A, 20, 3, 575);
    			add_location(span3, file$A, 42, 5, 1157);
    			attr_dev(input3, "placeholder", "Hex");
    			attr_dev(input3, "type", "text");
    			input3.disabled = true;
    			add_location(input3, file$A, 43, 5, 1181);
    			add_location(label3, file$A, 41, 4, 1143);
    			attr_dev(div1, "class", "picker-controls-row");
    			add_location(div1, file$A, 40, 3, 1104);
    			attr_dev(div2, "class", "picker-controls");
    			add_location(div2, file$A, 19, 2, 541);
    			attr_dev(div3, "class", "picker-split");
    			add_location(div3, file$A, 18, 1, 511);
    			attr_dev(div4, "class", "picker-wrapper");
    			add_location(div4, file$A, 16, 0, 385);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			mount_component(colorpicker, div4, null);
    			append_dev(div4, t0);
    			append_dev(div4, div3);
    			append_dev(div3, div2);
    			append_dev(div2, div0);
    			append_dev(div0, label0);
    			append_dev(label0, span0);
    			append_dev(label0, t2);
    			append_dev(label0, input0);
    			set_input_value(input0, /*rgb*/ ctx[1].r);
    			append_dev(div0, t3);
    			append_dev(div0, label1);
    			append_dev(label1, span1);
    			append_dev(label1, t5);
    			append_dev(label1, input1);
    			set_input_value(input1, /*rgb*/ ctx[1].g);
    			append_dev(div0, t6);
    			append_dev(div0, label2);
    			append_dev(label2, span2);
    			append_dev(label2, t8);
    			append_dev(label2, input2);
    			set_input_value(input2, /*rgb*/ ctx[1].b);
    			append_dev(div0, t9);
    			if (if_block0) if_block0.m(div0, null);
    			append_dev(div2, t10);
    			append_dev(div2, div1);
    			append_dev(div1, label3);
    			append_dev(label3, span3);
    			append_dev(label3, t12);
    			append_dev(label3, input3);
    			set_input_value(input3, /*hex*/ ctx[0]);
    			append_dev(label3, t13);
    			mount_component(control, label3, null);
    			append_dev(label3, t14);
    			if (if_block1) if_block1.m(label3, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[9]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[10]),
    					listen_dev(input2, "input", /*input2_input_handler*/ ctx[11]),
    					listen_dev(input3, "input", /*input3_input_handler*/ ctx[13])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			const colorpicker_changes = {};
    			if (dirty & /*alpha*/ 32) colorpicker_changes.isAlpha = /*alpha*/ ctx[5];

    			if (!updating_rgb && dirty & /*rgb*/ 2) {
    				updating_rgb = true;
    				colorpicker_changes.rgb = /*rgb*/ ctx[1];
    				add_flush_callback(() => updating_rgb = false);
    			}

    			if (!updating_hex && dirty & /*hex*/ 1) {
    				updating_hex = true;
    				colorpicker_changes.hex = /*hex*/ ctx[0];
    				add_flush_callback(() => updating_hex = false);
    			}

    			colorpicker.$set(colorpicker_changes);

    			if (dirty & /*rgb*/ 2 && to_number(input0.value) !== /*rgb*/ ctx[1].r) {
    				set_input_value(input0, /*rgb*/ ctx[1].r);
    			}

    			if (dirty & /*rgb*/ 2 && to_number(input1.value) !== /*rgb*/ ctx[1].g) {
    				set_input_value(input1, /*rgb*/ ctx[1].g);
    			}

    			if (dirty & /*rgb*/ 2 && to_number(input2.value) !== /*rgb*/ ctx[1].b) {
    				set_input_value(input2, /*rgb*/ ctx[1].b);
    			}

    			if (/*alpha*/ ctx[5]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_1$5(ctx);
    					if_block0.c();
    					if_block0.m(div0, null);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (dirty & /*hex*/ 1 && input3.value !== /*hex*/ ctx[0]) {
    				set_input_value(input3, /*hex*/ ctx[0]);
    			}

    			const control_changes = {};
    			if (dirty & /*tips*/ 8) control_changes.tips = /*tips*/ ctx[3];
    			if (dirty & /*legacy*/ 4) control_changes.legacy = /*legacy*/ ctx[2];

    			if (dirty & /*$$scope*/ 65536) {
    				control_changes.$$scope = { dirty, ctx };
    			}

    			control.$set(control_changes);

    			if (/*reset*/ ctx[4]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty & /*reset*/ 16) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block$e(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(label3, null);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(colorpicker.$$.fragment, local);
    			transition_in(control.$$.fragment, local);
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(colorpicker.$$.fragment, local);
    			transition_out(control.$$.fragment, local);
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div4);
    			destroy_component(colorpicker);
    			if (if_block0) if_block0.d();
    			destroy_component(control);
    			if (if_block1) if_block1.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$E.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$C($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Colorpicker', slots, []);
    	const { ipcRenderer } = require('electron');
    	let { legacy = false } = $$props;
    	let { tips = false } = $$props;
    	let { reset } = $$props;
    	let { alpha = true } = $$props;
    	let { hex } = $$props;
    	let { rgb = tinycolor(hex).toRgb() } = $$props;
    	const writable_props = ['legacy', 'tips', 'reset', 'alpha', 'hex', 'rgb'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Colorpicker> was created with unknown prop '${key}'`);
    	});

    	function colorpicker_rgb_binding(value) {
    		rgb = value;
    		$$invalidate(1, rgb);
    	}

    	function colorpicker_hex_binding(value) {
    		hex = value;
    		$$invalidate(0, hex);
    	}

    	function input0_input_handler() {
    		rgb.r = to_number(this.value);
    		$$invalidate(1, rgb);
    	}

    	function input1_input_handler() {
    		rgb.g = to_number(this.value);
    		$$invalidate(1, rgb);
    	}

    	function input2_input_handler() {
    		rgb.b = to_number(this.value);
    		$$invalidate(1, rgb);
    	}

    	function input_input_handler() {
    		rgb.a = to_number(this.value);
    		$$invalidate(1, rgb);
    	}

    	function input3_input_handler() {
    		hex = this.value;
    		$$invalidate(0, hex);
    	}

    	const click_handler = e => {
    		navigator.clipboard.writeText(hex).then(
    			() => {
    				ipcRenderer.send('action', "Color copied!");
    			},
    			() => {
    				ipcRenderer.send('action', "Failed to copy color");
    			}
    		);
    	};

    	const click_handler_1 = e => {
    		$$invalidate(0, hex = reset);
    	};

    	$$self.$$set = $$props => {
    		if ('legacy' in $$props) $$invalidate(2, legacy = $$props.legacy);
    		if ('tips' in $$props) $$invalidate(3, tips = $$props.tips);
    		if ('reset' in $$props) $$invalidate(4, reset = $$props.reset);
    		if ('alpha' in $$props) $$invalidate(5, alpha = $$props.alpha);
    		if ('hex' in $$props) $$invalidate(0, hex = $$props.hex);
    		if ('rgb' in $$props) $$invalidate(1, rgb = $$props.rgb);
    	};

    	$$self.$capture_state = () => ({
    		ipcRenderer,
    		ColorPicker,
    		tinycolor,
    		Control,
    		legacy,
    		tips,
    		reset,
    		alpha,
    		hex,
    		rgb
    	});

    	$$self.$inject_state = $$props => {
    		if ('legacy' in $$props) $$invalidate(2, legacy = $$props.legacy);
    		if ('tips' in $$props) $$invalidate(3, tips = $$props.tips);
    		if ('reset' in $$props) $$invalidate(4, reset = $$props.reset);
    		if ('alpha' in $$props) $$invalidate(5, alpha = $$props.alpha);
    		if ('hex' in $$props) $$invalidate(0, hex = $$props.hex);
    		if ('rgb' in $$props) $$invalidate(1, rgb = $$props.rgb);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		hex,
    		rgb,
    		legacy,
    		tips,
    		reset,
    		alpha,
    		ipcRenderer,
    		colorpicker_rgb_binding,
    		colorpicker_hex_binding,
    		input0_input_handler,
    		input1_input_handler,
    		input2_input_handler,
    		input_input_handler,
    		input3_input_handler,
    		click_handler,
    		click_handler_1
    	];
    }

    class Colorpicker extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$C, create_fragment$E, safe_not_equal, {
    			legacy: 2,
    			tips: 3,
    			reset: 4,
    			alpha: 5,
    			hex: 0,
    			rgb: 1
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Colorpicker",
    			options,
    			id: create_fragment$E.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*reset*/ ctx[4] === undefined && !('reset' in props)) {
    			console.warn("<Colorpicker> was created without expected prop 'reset'");
    		}

    		if (/*hex*/ ctx[0] === undefined && !('hex' in props)) {
    			console.warn("<Colorpicker> was created without expected prop 'hex'");
    		}
    	}

    	get legacy() {
    		throw new Error("<Colorpicker>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set legacy(value) {
    		throw new Error("<Colorpicker>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get tips() {
    		throw new Error("<Colorpicker>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tips(value) {
    		throw new Error("<Colorpicker>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get reset() {
    		throw new Error("<Colorpicker>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set reset(value) {
    		throw new Error("<Colorpicker>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get alpha() {
    		throw new Error("<Colorpicker>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set alpha(value) {
    		throw new Error("<Colorpicker>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get hex() {
    		throw new Error("<Colorpicker>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hex(value) {
    		throw new Error("<Colorpicker>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get rgb() {
    		throw new Error("<Colorpicker>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set rgb(value) {
    		throw new Error("<Colorpicker>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\tools\Eyedropper.svelte generated by Svelte v3.49.0 */
    const file$z = "src\\components\\tools\\Eyedropper.svelte";

    // (25:0) <Tool   tips={tips}   size="12px"   legacy={legacy}   tiptext={"Pick a color"}   on:click={e => {    dispatch('pickColor');   }}  >
    function create_default_slot_1$5(ctx) {
    	let i;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			i = element("i");
    			attr_dev(i, "class", "fas fa-eye-dropper");
    			add_location(i, file$z, 33, 1, 721);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, i, anchor);

    			if (!mounted) {
    				dispose = action_destroyer(/*dropdownRef*/ ctx[5].call(null, i));
    				mounted = true;
    			}
    		},
    		p: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(i);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$5.name,
    		type: "slot",
    		source: "(25:0) <Tool   tips={tips}   size=\\\"12px\\\"   legacy={legacy}   tiptext={\\\"Pick a color\\\"}   on:click={e => {    dispatch('pickColor');   }}  >",
    		ctx
    	});

    	return block;
    }

    // (37:0) {#if showDropdown}
    function create_if_block$d(ctx) {
    	let dropdown;
    	let current;

    	dropdown = new Dropdown({
    			props: {
    				content: /*content*/ ctx[6],
    				$$slots: { default: [create_default_slot$5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	dropdown.$on("close", /*close_handler*/ ctx[9]);

    	const block = {
    		c: function create() {
    			create_component(dropdown.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(dropdown, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const dropdown_changes = {};

    			if (dirty & /*$$scope, legacy, tips, hex*/ 1031) {
    				dropdown_changes.$$scope = { dirty, ctx };
    			}

    			dropdown.$set(dropdown_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(dropdown.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(dropdown.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(dropdown, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$d.name,
    		type: "if",
    		source: "(37:0) {#if showDropdown}",
    		ctx
    	});

    	return block;
    }

    // (38:1) <Dropdown    {content}    on:close={e => { showDropdown = false; }}   >
    function create_default_slot$5(ctx) {
    	let colorpicker;
    	let updating_hex;
    	let current;

    	function colorpicker_hex_binding(value) {
    		/*colorpicker_hex_binding*/ ctx[8](value);
    	}

    	let colorpicker_props = {
    		alpha: false,
    		legacy: /*legacy*/ ctx[2],
    		tips: /*tips*/ ctx[1]
    	};

    	if (/*hex*/ ctx[0] !== void 0) {
    		colorpicker_props.hex = /*hex*/ ctx[0];
    	}

    	colorpicker = new Colorpicker({ props: colorpicker_props, $$inline: true });
    	binding_callbacks.push(() => bind(colorpicker, 'hex', colorpicker_hex_binding));

    	const block = {
    		c: function create() {
    			create_component(colorpicker.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(colorpicker, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const colorpicker_changes = {};
    			if (dirty & /*legacy*/ 4) colorpicker_changes.legacy = /*legacy*/ ctx[2];
    			if (dirty & /*tips*/ 2) colorpicker_changes.tips = /*tips*/ ctx[1];

    			if (!updating_hex && dirty & /*hex*/ 1) {
    				updating_hex = true;
    				colorpicker_changes.hex = /*hex*/ ctx[0];
    				add_flush_callback(() => updating_hex = false);
    			}

    			colorpicker.$set(colorpicker_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(colorpicker.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(colorpicker.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(colorpicker, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$5.name,
    		type: "slot",
    		source: "(38:1) <Dropdown    {content}    on:close={e => { showDropdown = false; }}   >",
    		ctx
    	});

    	return block;
    }

    function create_fragment$D(ctx) {
    	let tool;
    	let t;
    	let if_block_anchor;
    	let current;

    	tool = new Tool({
    			props: {
    				tips: /*tips*/ ctx[1],
    				size: "12px",
    				legacy: /*legacy*/ ctx[2],
    				tiptext: "Pick a color",
    				$$slots: { default: [create_default_slot_1$5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	tool.$on("click", /*click_handler*/ ctx[7]);
    	let if_block = /*showDropdown*/ ctx[3] && create_if_block$d(ctx);

    	const block = {
    		c: function create() {
    			create_component(tool.$$.fragment);
    			t = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(tool, target, anchor);
    			insert_dev(target, t, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const tool_changes = {};
    			if (dirty & /*tips*/ 2) tool_changes.tips = /*tips*/ ctx[1];
    			if (dirty & /*legacy*/ 4) tool_changes.legacy = /*legacy*/ ctx[2];

    			if (dirty & /*$$scope*/ 1024) {
    				tool_changes.$$scope = { dirty, ctx };
    			}

    			tool.$set(tool_changes);

    			if (/*showDropdown*/ ctx[3]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*showDropdown*/ 8) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$d(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tool.$$.fragment, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tool.$$.fragment, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(tool, detaching);
    			if (detaching) detach_dev(t);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$D.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$B($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Eyedropper', slots, []);
    	const dispatch = createEventDispatcher();

    	const [dropdownRef, content] = createPopperActions({
    		placement: 'right-start',
    		strategy: 'fixed'
    	});

    	let showDropdown = false;
    	let { hex } = $$props;
    	let { tips = false } = $$props;
    	let { legacy = false } = $$props;
    	const writable_props = ['hex', 'tips', 'legacy'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Eyedropper> was created with unknown prop '${key}'`);
    	});

    	const click_handler = e => {
    		dispatch('pickColor');
    	};

    	function colorpicker_hex_binding(value) {
    		hex = value;
    		$$invalidate(0, hex);
    	}

    	const close_handler = e => {
    		$$invalidate(3, showDropdown = false);
    	};

    	$$self.$$set = $$props => {
    		if ('hex' in $$props) $$invalidate(0, hex = $$props.hex);
    		if ('tips' in $$props) $$invalidate(1, tips = $$props.tips);
    		if ('legacy' in $$props) $$invalidate(2, legacy = $$props.legacy);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		createPopperActions,
    		Tool,
    		Dropdown,
    		Colorpicker,
    		dispatch,
    		dropdownRef,
    		content,
    		showDropdown,
    		hex,
    		tips,
    		legacy
    	});

    	$$self.$inject_state = $$props => {
    		if ('showDropdown' in $$props) $$invalidate(3, showDropdown = $$props.showDropdown);
    		if ('hex' in $$props) $$invalidate(0, hex = $$props.hex);
    		if ('tips' in $$props) $$invalidate(1, tips = $$props.tips);
    		if ('legacy' in $$props) $$invalidate(2, legacy = $$props.legacy);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*hex*/ 1) {
    			if (hex) $$invalidate(3, showDropdown = true);
    		}
    	};

    	return [
    		hex,
    		tips,
    		legacy,
    		showDropdown,
    		dispatch,
    		dropdownRef,
    		content,
    		click_handler,
    		colorpicker_hex_binding,
    		close_handler
    	];
    }

    class Eyedropper extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$B, create_fragment$D, safe_not_equal, { hex: 0, tips: 1, legacy: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Eyedropper",
    			options,
    			id: create_fragment$D.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*hex*/ ctx[0] === undefined && !('hex' in props)) {
    			console.warn("<Eyedropper> was created without expected prop 'hex'");
    		}
    	}

    	get hex() {
    		throw new Error("<Eyedropper>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hex(value) {
    		throw new Error("<Eyedropper>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get tips() {
    		throw new Error("<Eyedropper>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tips(value) {
    		throw new Error("<Eyedropper>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get legacy() {
    		throw new Error("<Eyedropper>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set legacy(value) {
    		throw new Error("<Eyedropper>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\tools\Palette.svelte generated by Svelte v3.49.0 */

    const { Object: Object_1 } = globals;
    const file$y = "src\\components\\tools\\Palette.svelte";

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[13] = list[i][0];
    	child_ctx[14] = list[i][1];
    	return child_ctx;
    }

    // (29:0) <Tool   {tips}   {legacy}   size="12px"   tiptext={"Generate palette"}   on:click={e => {    ipcRenderer.send('editImage', {     type: 'getPalette',     image: fileSelected    });      showDropdown = true;   }}  >
    function create_default_slot_1$4(ctx) {
    	let i;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			i = element("i");
    			attr_dev(i, "class", "fas fa-palette");
    			add_location(i, file$y, 42, 1, 924);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, i, anchor);

    			if (!mounted) {
    				dispose = action_destroyer(/*dropdownRef*/ ctx[7].call(null, i));
    				mounted = true;
    			}
    		},
    		p: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(i);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$4.name,
    		type: "slot",
    		source: "(29:0) <Tool   {tips}   {legacy}   size=\\\"12px\\\"   tiptext={\\\"Generate palette\\\"}   on:click={e => {    ipcRenderer.send('editImage', {     type: 'getPalette',     image: fileSelected    });      showDropdown = true;   }}  >",
    		ctx
    	});

    	return block;
    }

    // (46:0) {#if showDropdown}
    function create_if_block$c(ctx) {
    	let dropdown;
    	let current;

    	dropdown = new Dropdown({
    			props: {
    				content: /*dropdownContent*/ ctx[8],
    				$$slots: { default: [create_default_slot$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	dropdown.$on("close", /*close_handler*/ ctx[11]);

    	const block = {
    		c: function create() {
    			create_component(dropdown.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(dropdown, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const dropdown_changes = {};

    			if (dirty & /*$$scope, palette*/ 131088) {
    				dropdown_changes.$$scope = { dirty, ctx };
    			}

    			dropdown.$set(dropdown_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(dropdown.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(dropdown.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(dropdown, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$c.name,
    		type: "if",
    		source: "(46:0) {#if showDropdown}",
    		ctx
    	});

    	return block;
    }

    // (54:3) {#each Object.entries(palette) as [color_name, color_number]}
    function create_each_block$3(ctx) {
    	let div2;
    	let div0;
    	let t0_value = Math.floor(/*palette*/ ctx[4][/*color_name*/ ctx[13]]._rgb[0]) + "";
    	let t0;
    	let t1;
    	let t2_value = Math.floor(/*palette*/ ctx[4][/*color_name*/ ctx[13]]._rgb[1]) + "";
    	let t2;
    	let t3;
    	let t4_value = Math.floor(/*palette*/ ctx[4][/*color_name*/ ctx[13]]._rgb[2]) + "";
    	let t4;
    	let t5;
    	let div1;
    	let t6_value = /*tinycolor*/ ctx[6](`rgb(${/*palette*/ ctx[4][/*color_name*/ ctx[13]]._rgb})`).toHexString() + "";
    	let t6;
    	let t7;
    	let mounted;
    	let dispose;

    	function click_handler_1(...args) {
    		return /*click_handler_1*/ ctx[10](/*color_name*/ ctx[13], ...args);
    	}

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			t0 = text(t0_value);
    			t1 = text(",\r\n\t\t\t\t\t\t");
    			t2 = text(t2_value);
    			t3 = text(",\r\n\t\t\t\t\t\t");
    			t4 = text(t4_value);
    			t5 = space();
    			div1 = element("div");
    			t6 = text(t6_value);
    			t7 = space();
    			attr_dev(div0, "class", "item-detail svelte-1k3hh6i");
    			add_location(div0, file$y, 65, 5, 1591);
    			attr_dev(div1, "class", "item-detail svelte-1k3hh6i");
    			add_location(div1, file$y, 70, 5, 1785);
    			attr_dev(div2, "class", "item svelte-1k3hh6i");
    			set_style(div2, "background", "rgb(" + /*palette*/ ctx[4][/*color_name*/ ctx[13]]._rgb + ")");
    			add_location(div2, file$y, 54, 4, 1195);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div0, t0);
    			append_dev(div0, t1);
    			append_dev(div0, t2);
    			append_dev(div0, t3);
    			append_dev(div0, t4);
    			append_dev(div2, t5);
    			append_dev(div2, div1);
    			append_dev(div1, t6);
    			append_dev(div2, t7);

    			if (!mounted) {
    				dispose = listen_dev(div2, "click", click_handler_1, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*palette*/ 16 && t0_value !== (t0_value = Math.floor(/*palette*/ ctx[4][/*color_name*/ ctx[13]]._rgb[0]) + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*palette*/ 16 && t2_value !== (t2_value = Math.floor(/*palette*/ ctx[4][/*color_name*/ ctx[13]]._rgb[1]) + "")) set_data_dev(t2, t2_value);
    			if (dirty & /*palette*/ 16 && t4_value !== (t4_value = Math.floor(/*palette*/ ctx[4][/*color_name*/ ctx[13]]._rgb[2]) + "")) set_data_dev(t4, t4_value);
    			if (dirty & /*palette*/ 16 && t6_value !== (t6_value = /*tinycolor*/ ctx[6](`rgb(${/*palette*/ ctx[4][/*color_name*/ ctx[13]]._rgb})`).toHexString() + "")) set_data_dev(t6, t6_value);

    			if (dirty & /*palette*/ 16) {
    				set_style(div2, "background", "rgb(" + /*palette*/ ctx[4][/*color_name*/ ctx[13]]._rgb + ")");
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$3.name,
    		type: "each",
    		source: "(54:3) {#each Object.entries(palette) as [color_name, color_number]}",
    		ctx
    	});

    	return block;
    }

    // (47:1) <Dropdown    content={dropdownContent}    on:close={e => {     showDropdown = false;    }}   >
    function create_default_slot$4(ctx) {
    	let div;
    	let each_value = Object.entries(/*palette*/ ctx[4]);
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "palette svelte-1k3hh6i");
    			add_location(div, file$y, 52, 2, 1102);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*palette, Object, navigator, tinycolor, ipcRenderer, Math*/ 112) {
    				each_value = Object.entries(/*palette*/ ctx[4]);
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$3(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$3(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$4.name,
    		type: "slot",
    		source: "(47:1) <Dropdown    content={dropdownContent}    on:close={e => {     showDropdown = false;    }}   >",
    		ctx
    	});

    	return block;
    }

    function create_fragment$C(ctx) {
    	let tool;
    	let t;
    	let if_block_anchor;
    	let current;

    	tool = new Tool({
    			props: {
    				tips: /*tips*/ ctx[1],
    				legacy: /*legacy*/ ctx[2],
    				size: "12px",
    				tiptext: "Generate palette",
    				$$slots: { default: [create_default_slot_1$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	tool.$on("click", /*click_handler*/ ctx[9]);
    	let if_block = /*showDropdown*/ ctx[3] && create_if_block$c(ctx);

    	const block = {
    		c: function create() {
    			create_component(tool.$$.fragment);
    			t = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(tool, target, anchor);
    			insert_dev(target, t, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const tool_changes = {};
    			if (dirty & /*tips*/ 2) tool_changes.tips = /*tips*/ ctx[1];
    			if (dirty & /*legacy*/ 4) tool_changes.legacy = /*legacy*/ ctx[2];

    			if (dirty & /*$$scope*/ 131072) {
    				tool_changes.$$scope = { dirty, ctx };
    			}

    			tool.$set(tool_changes);

    			if (/*showDropdown*/ ctx[3]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*showDropdown*/ 8) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$c(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tool.$$.fragment, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tool.$$.fragment, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(tool, detaching);
    			if (detaching) detach_dev(t);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$C.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$A($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Palette', slots, []);
    	const { ipcRenderer } = require('electron');
    	const tinycolor = require("tinycolor2");
    	const dispatch = createEventDispatcher();

    	const [dropdownRef, dropdownContent] = createPopperActions({
    		placement: 'right-start',
    		strategy: 'fixed'
    	});

    	let showDropdown = false;
    	let palette = {};
    	let { fileSelected = false } = $$props;
    	let { tips = false } = $$props;
    	let { legacy = false } = $$props;

    	ipcRenderer.on('palette', (event, arg) => {
    		$$invalidate(4, palette = arg);
    	});

    	const writable_props = ['fileSelected', 'tips', 'legacy'];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Palette> was created with unknown prop '${key}'`);
    	});

    	const click_handler = e => {
    		ipcRenderer.send('editImage', { type: 'getPalette', image: fileSelected });
    		$$invalidate(3, showDropdown = true);
    	};

    	const click_handler_1 = (color_name, e) => {
    		navigator.clipboard.writeText(tinycolor(`rgb(${palette[color_name]._rgb})`).toHexString()).then(
    			() => {
    				ipcRenderer.send('action', "Color copied!");
    			},
    			() => {
    				ipcRenderer.send('action', "Failed to copy color");
    			}
    		);
    	};

    	const close_handler = e => {
    		$$invalidate(3, showDropdown = false);
    	};

    	$$self.$$set = $$props => {
    		if ('fileSelected' in $$props) $$invalidate(0, fileSelected = $$props.fileSelected);
    		if ('tips' in $$props) $$invalidate(1, tips = $$props.tips);
    		if ('legacy' in $$props) $$invalidate(2, legacy = $$props.legacy);
    	};

    	$$self.$capture_state = () => ({
    		ipcRenderer,
    		createEventDispatcher,
    		createPopperActions,
    		tinycolor,
    		Tool,
    		Dropdown,
    		dispatch,
    		dropdownRef,
    		dropdownContent,
    		showDropdown,
    		palette,
    		fileSelected,
    		tips,
    		legacy
    	});

    	$$self.$inject_state = $$props => {
    		if ('showDropdown' in $$props) $$invalidate(3, showDropdown = $$props.showDropdown);
    		if ('palette' in $$props) $$invalidate(4, palette = $$props.palette);
    		if ('fileSelected' in $$props) $$invalidate(0, fileSelected = $$props.fileSelected);
    		if ('tips' in $$props) $$invalidate(1, tips = $$props.tips);
    		if ('legacy' in $$props) $$invalidate(2, legacy = $$props.legacy);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		fileSelected,
    		tips,
    		legacy,
    		showDropdown,
    		palette,
    		ipcRenderer,
    		tinycolor,
    		dropdownRef,
    		dropdownContent,
    		click_handler,
    		click_handler_1,
    		close_handler
    	];
    }

    class Palette extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$A, create_fragment$C, safe_not_equal, { fileSelected: 0, tips: 1, legacy: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Palette",
    			options,
    			id: create_fragment$C.name
    		});
    	}

    	get fileSelected() {
    		throw new Error("<Palette>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set fileSelected(value) {
    		throw new Error("<Palette>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get tips() {
    		throw new Error("<Palette>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tips(value) {
    		throw new Error("<Palette>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get legacy() {
    		throw new Error("<Palette>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set legacy(value) {
    		throw new Error("<Palette>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\tools\Background.svelte generated by Svelte v3.49.0 */
    const file$x = "src\\components\\tools\\Background.svelte";

    // (24:0) <Tool   {tips}   {legacy}   size="12px"   tiptext={"Change background"}   on:click={e => {    showDropdown = true;   }}  >
    function create_default_slot_1$3(ctx) {
    	let i;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			i = element("i");
    			attr_dev(i, "class", "fas fa-fill");
    			add_location(i, file$x, 32, 1, 728);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, i, anchor);

    			if (!mounted) {
    				dispose = action_destroyer(/*dropdownRef*/ ctx[4].call(null, i));
    				mounted = true;
    			}
    		},
    		p: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(i);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$3.name,
    		type: "slot",
    		source: "(24:0) <Tool   {tips}   {legacy}   size=\\\"12px\\\"   tiptext={\\\"Change background\\\"}   on:click={e => {    showDropdown = true;   }}  >",
    		ctx
    	});

    	return block;
    }

    // (36:0) {#if showDropdown}
    function create_if_block$b(ctx) {
    	let dropdown;
    	let current;

    	dropdown = new Dropdown({
    			props: {
    				content: /*dropdownContent*/ ctx[5],
    				$$slots: { default: [create_default_slot$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	dropdown.$on("close", /*close_handler*/ ctx[8]);

    	const block = {
    		c: function create() {
    			create_component(dropdown.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(dropdown, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const dropdown_changes = {};

    			if (dirty & /*$$scope, tips, legacy, backdropColor*/ 1031) {
    				dropdown_changes.$$scope = { dirty, ctx };
    			}

    			dropdown.$set(dropdown_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(dropdown.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(dropdown.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(dropdown, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$b.name,
    		type: "if",
    		source: "(36:0) {#if showDropdown}",
    		ctx
    	});

    	return block;
    }

    // (37:1) <Dropdown    content={dropdownContent}    on:close={e => {     showDropdown = false;    }}   >
    function create_default_slot$3(ctx) {
    	let colorpicker;
    	let updating_hex;
    	let current;

    	function colorpicker_hex_binding(value) {
    		/*colorpicker_hex_binding*/ ctx[7](value);
    	}

    	let colorpicker_props = {
    		tips: /*tips*/ ctx[1],
    		legacy: /*legacy*/ ctx[2],
    		reset: /*legacy*/ ctx[2] ? "#111111" : "#2F2E33"
    	};

    	if (/*backdropColor*/ ctx[0] !== void 0) {
    		colorpicker_props.hex = /*backdropColor*/ ctx[0];
    	}

    	colorpicker = new Colorpicker({ props: colorpicker_props, $$inline: true });
    	binding_callbacks.push(() => bind(colorpicker, 'hex', colorpicker_hex_binding));

    	const block = {
    		c: function create() {
    			create_component(colorpicker.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(colorpicker, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const colorpicker_changes = {};
    			if (dirty & /*tips*/ 2) colorpicker_changes.tips = /*tips*/ ctx[1];
    			if (dirty & /*legacy*/ 4) colorpicker_changes.legacy = /*legacy*/ ctx[2];
    			if (dirty & /*legacy*/ 4) colorpicker_changes.reset = /*legacy*/ ctx[2] ? "#111111" : "#2F2E33";

    			if (!updating_hex && dirty & /*backdropColor*/ 1) {
    				updating_hex = true;
    				colorpicker_changes.hex = /*backdropColor*/ ctx[0];
    				add_flush_callback(() => updating_hex = false);
    			}

    			colorpicker.$set(colorpicker_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(colorpicker.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(colorpicker.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(colorpicker, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$3.name,
    		type: "slot",
    		source: "(37:1) <Dropdown    content={dropdownContent}    on:close={e => {     showDropdown = false;    }}   >",
    		ctx
    	});

    	return block;
    }

    function create_fragment$B(ctx) {
    	let tool;
    	let t;
    	let if_block_anchor;
    	let current;

    	tool = new Tool({
    			props: {
    				tips: /*tips*/ ctx[1],
    				legacy: /*legacy*/ ctx[2],
    				size: "12px",
    				tiptext: "Change background",
    				$$slots: { default: [create_default_slot_1$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	tool.$on("click", /*click_handler*/ ctx[6]);
    	let if_block = /*showDropdown*/ ctx[3] && create_if_block$b(ctx);

    	const block = {
    		c: function create() {
    			create_component(tool.$$.fragment);
    			t = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(tool, target, anchor);
    			insert_dev(target, t, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const tool_changes = {};
    			if (dirty & /*tips*/ 2) tool_changes.tips = /*tips*/ ctx[1];
    			if (dirty & /*legacy*/ 4) tool_changes.legacy = /*legacy*/ ctx[2];

    			if (dirty & /*$$scope*/ 1024) {
    				tool_changes.$$scope = { dirty, ctx };
    			}

    			tool.$set(tool_changes);

    			if (/*showDropdown*/ ctx[3]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*showDropdown*/ 8) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$b(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tool.$$.fragment, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tool.$$.fragment, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(tool, detaching);
    			if (detaching) detach_dev(t);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$B.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$z($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Background', slots, []);
    	const dispatch = createEventDispatcher();

    	const [dropdownRef, dropdownContent] = createPopperActions({
    		placement: 'right-start',
    		strategy: 'fixed'
    	});

    	let { backdropColor = legacy ? "#111111" : "#2F2E33" } = $$props;
    	let showDropdown = false;
    	let { tips = false } = $$props;
    	let { legacy = false } = $$props;
    	const writable_props = ['backdropColor', 'tips', 'legacy'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Background> was created with unknown prop '${key}'`);
    	});

    	const click_handler = e => {
    		$$invalidate(3, showDropdown = true);
    	};

    	function colorpicker_hex_binding(value) {
    		backdropColor = value;
    		$$invalidate(0, backdropColor);
    	}

    	const close_handler = e => {
    		$$invalidate(3, showDropdown = false);
    	};

    	$$self.$$set = $$props => {
    		if ('backdropColor' in $$props) $$invalidate(0, backdropColor = $$props.backdropColor);
    		if ('tips' in $$props) $$invalidate(1, tips = $$props.tips);
    		if ('legacy' in $$props) $$invalidate(2, legacy = $$props.legacy);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		createPopperActions,
    		Tool,
    		Dropdown,
    		Colorpicker,
    		dispatch,
    		dropdownRef,
    		dropdownContent,
    		backdropColor,
    		showDropdown,
    		tips,
    		legacy
    	});

    	$$self.$inject_state = $$props => {
    		if ('backdropColor' in $$props) $$invalidate(0, backdropColor = $$props.backdropColor);
    		if ('showDropdown' in $$props) $$invalidate(3, showDropdown = $$props.showDropdown);
    		if ('tips' in $$props) $$invalidate(1, tips = $$props.tips);
    		if ('legacy' in $$props) $$invalidate(2, legacy = $$props.legacy);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		backdropColor,
    		tips,
    		legacy,
    		showDropdown,
    		dropdownRef,
    		dropdownContent,
    		click_handler,
    		colorpicker_hex_binding,
    		close_handler
    	];
    }

    class Background extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$z, create_fragment$B, safe_not_equal, { backdropColor: 0, tips: 1, legacy: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Background",
    			options,
    			id: create_fragment$B.name
    		});
    	}

    	get backdropColor() {
    		throw new Error("<Background>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set backdropColor(value) {
    		throw new Error("<Background>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get tips() {
    		throw new Error("<Background>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tips(value) {
    		throw new Error("<Background>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get legacy() {
    		throw new Error("<Background>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set legacy(value) {
    		throw new Error("<Background>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\Toolbox.svelte generated by Svelte v3.49.0 */

    const { console: console_1$2, window: window_1 } = globals;
    const file$w = "src\\components\\Toolbox.svelte";

    // (78:1) {#if fileSelected && !settingsOpen}
    function create_if_block$a(ctx) {
    	let tool0;
    	let t0;
    	let tool1;
    	let t1;
    	let tool2;
    	let t2;
    	let eyedropper;
    	let updating_hex;
    	let t3;
    	let background;
    	let updating_backdropColor;
    	let t4;
    	let palette;
    	let updating_fileSelected;
    	let t5;
    	let tool3;
    	let t6;
    	let tool4;
    	let current;

    	tool0 = new Tool({
    			props: {
    				tips: /*tips*/ ctx[5],
    				legacy: /*legacy*/ ctx[4],
    				size: "13px",
    				tiptext: "Save image",
    				$$slots: { default: [create_default_slot_4$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	tool0.$on("click", /*click_handler*/ ctx[16]);

    	tool1 = new Tool({
    			props: {
    				tips: /*tips*/ ctx[5],
    				legacy: /*legacy*/ ctx[4],
    				size: "13px",
    				tiptext: "Copy image",
    				$$slots: { default: [create_default_slot_3$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	tool1.$on("click", /*copyImage*/ ctx[6]);

    	tool2 = new Tool({
    			props: {
    				tips: /*tips*/ ctx[5],
    				legacy: /*legacy*/ ctx[4],
    				size: "13px",
    				tiptext: "Crop image",
    				$$slots: { default: [create_default_slot_2$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	tool2.$on("click", /*click_handler_1*/ ctx[17]);

    	function eyedropper_hex_binding(value) {
    		/*eyedropper_hex_binding*/ ctx[18](value);
    	}

    	let eyedropper_props = {
    		tips: /*tips*/ ctx[5],
    		legacy: /*legacy*/ ctx[4]
    	};

    	if (/*hex*/ ctx[2] !== void 0) {
    		eyedropper_props.hex = /*hex*/ ctx[2];
    	}

    	eyedropper = new Eyedropper({ props: eyedropper_props, $$inline: true });
    	binding_callbacks.push(() => bind(eyedropper, 'hex', eyedropper_hex_binding));
    	eyedropper.$on("pickColor", /*pickColor_handler*/ ctx[19]);

    	function background_backdropColor_binding(value) {
    		/*background_backdropColor_binding*/ ctx[20](value);
    	}

    	let background_props = {
    		tips: /*tips*/ ctx[5],
    		legacy: /*legacy*/ ctx[4]
    	};

    	if (/*backdropColor*/ ctx[1] !== void 0) {
    		background_props.backdropColor = /*backdropColor*/ ctx[1];
    	}

    	background = new Background({ props: background_props, $$inline: true });
    	binding_callbacks.push(() => bind(background, 'backdropColor', background_backdropColor_binding));

    	function palette_fileSelected_binding(value) {
    		/*palette_fileSelected_binding*/ ctx[21](value);
    	}

    	let palette_props = {
    		tips: /*tips*/ ctx[5],
    		legacy: /*legacy*/ ctx[4]
    	};

    	if (/*fileSelected*/ ctx[0] !== void 0) {
    		palette_props.fileSelected = /*fileSelected*/ ctx[0];
    	}

    	palette = new Palette({ props: palette_props, $$inline: true });
    	binding_callbacks.push(() => bind(palette, 'fileSelected', palette_fileSelected_binding));

    	tool3 = new Tool({
    			props: {
    				tips: /*tips*/ ctx[5],
    				legacy: /*legacy*/ ctx[4],
    				size: "13px",
    				tiptext: "Flip image",
    				$$slots: { default: [create_default_slot_1$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	tool3.$on("click", /*click_handler_2*/ ctx[22]);

    	tool4 = new Tool({
    			props: {
    				tips: /*tips*/ ctx[5],
    				legacy: /*legacy*/ ctx[4],
    				size: "12px",
    				tiptext: "Rotate image",
    				$$slots: { default: [create_default_slot$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	tool4.$on("click", /*click_handler_3*/ ctx[23]);

    	const block = {
    		c: function create() {
    			create_component(tool0.$$.fragment);
    			t0 = space();
    			create_component(tool1.$$.fragment);
    			t1 = space();
    			create_component(tool2.$$.fragment);
    			t2 = space();
    			create_component(eyedropper.$$.fragment);
    			t3 = space();
    			create_component(background.$$.fragment);
    			t4 = space();
    			create_component(palette.$$.fragment);
    			t5 = space();
    			create_component(tool3.$$.fragment);
    			t6 = space();
    			create_component(tool4.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(tool0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(tool1, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(tool2, target, anchor);
    			insert_dev(target, t2, anchor);
    			mount_component(eyedropper, target, anchor);
    			insert_dev(target, t3, anchor);
    			mount_component(background, target, anchor);
    			insert_dev(target, t4, anchor);
    			mount_component(palette, target, anchor);
    			insert_dev(target, t5, anchor);
    			mount_component(tool3, target, anchor);
    			insert_dev(target, t6, anchor);
    			mount_component(tool4, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const tool0_changes = {};
    			if (dirty & /*tips*/ 32) tool0_changes.tips = /*tips*/ ctx[5];
    			if (dirty & /*legacy*/ 16) tool0_changes.legacy = /*legacy*/ ctx[4];

    			if (dirty & /*$$scope*/ 16777216) {
    				tool0_changes.$$scope = { dirty, ctx };
    			}

    			tool0.$set(tool0_changes);
    			const tool1_changes = {};
    			if (dirty & /*tips*/ 32) tool1_changes.tips = /*tips*/ ctx[5];
    			if (dirty & /*legacy*/ 16) tool1_changes.legacy = /*legacy*/ ctx[4];

    			if (dirty & /*$$scope*/ 16777216) {
    				tool1_changes.$$scope = { dirty, ctx };
    			}

    			tool1.$set(tool1_changes);
    			const tool2_changes = {};
    			if (dirty & /*tips*/ 32) tool2_changes.tips = /*tips*/ ctx[5];
    			if (dirty & /*legacy*/ 16) tool2_changes.legacy = /*legacy*/ ctx[4];

    			if (dirty & /*$$scope*/ 16777216) {
    				tool2_changes.$$scope = { dirty, ctx };
    			}

    			tool2.$set(tool2_changes);
    			const eyedropper_changes = {};
    			if (dirty & /*tips*/ 32) eyedropper_changes.tips = /*tips*/ ctx[5];
    			if (dirty & /*legacy*/ 16) eyedropper_changes.legacy = /*legacy*/ ctx[4];

    			if (!updating_hex && dirty & /*hex*/ 4) {
    				updating_hex = true;
    				eyedropper_changes.hex = /*hex*/ ctx[2];
    				add_flush_callback(() => updating_hex = false);
    			}

    			eyedropper.$set(eyedropper_changes);
    			const background_changes = {};
    			if (dirty & /*tips*/ 32) background_changes.tips = /*tips*/ ctx[5];
    			if (dirty & /*legacy*/ 16) background_changes.legacy = /*legacy*/ ctx[4];

    			if (!updating_backdropColor && dirty & /*backdropColor*/ 2) {
    				updating_backdropColor = true;
    				background_changes.backdropColor = /*backdropColor*/ ctx[1];
    				add_flush_callback(() => updating_backdropColor = false);
    			}

    			background.$set(background_changes);
    			const palette_changes = {};
    			if (dirty & /*tips*/ 32) palette_changes.tips = /*tips*/ ctx[5];
    			if (dirty & /*legacy*/ 16) palette_changes.legacy = /*legacy*/ ctx[4];

    			if (!updating_fileSelected && dirty & /*fileSelected*/ 1) {
    				updating_fileSelected = true;
    				palette_changes.fileSelected = /*fileSelected*/ ctx[0];
    				add_flush_callback(() => updating_fileSelected = false);
    			}

    			palette.$set(palette_changes);
    			const tool3_changes = {};
    			if (dirty & /*tips*/ 32) tool3_changes.tips = /*tips*/ ctx[5];
    			if (dirty & /*legacy*/ 16) tool3_changes.legacy = /*legacy*/ ctx[4];

    			if (dirty & /*$$scope*/ 16777216) {
    				tool3_changes.$$scope = { dirty, ctx };
    			}

    			tool3.$set(tool3_changes);
    			const tool4_changes = {};
    			if (dirty & /*tips*/ 32) tool4_changes.tips = /*tips*/ ctx[5];
    			if (dirty & /*legacy*/ 16) tool4_changes.legacy = /*legacy*/ ctx[4];

    			if (dirty & /*$$scope*/ 16777216) {
    				tool4_changes.$$scope = { dirty, ctx };
    			}

    			tool4.$set(tool4_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tool0.$$.fragment, local);
    			transition_in(tool1.$$.fragment, local);
    			transition_in(tool2.$$.fragment, local);
    			transition_in(eyedropper.$$.fragment, local);
    			transition_in(background.$$.fragment, local);
    			transition_in(palette.$$.fragment, local);
    			transition_in(tool3.$$.fragment, local);
    			transition_in(tool4.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tool0.$$.fragment, local);
    			transition_out(tool1.$$.fragment, local);
    			transition_out(tool2.$$.fragment, local);
    			transition_out(eyedropper.$$.fragment, local);
    			transition_out(background.$$.fragment, local);
    			transition_out(palette.$$.fragment, local);
    			transition_out(tool3.$$.fragment, local);
    			transition_out(tool4.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(tool0, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(tool1, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(tool2, detaching);
    			if (detaching) detach_dev(t2);
    			destroy_component(eyedropper, detaching);
    			if (detaching) detach_dev(t3);
    			destroy_component(background, detaching);
    			if (detaching) detach_dev(t4);
    			destroy_component(palette, detaching);
    			if (detaching) detach_dev(t5);
    			destroy_component(tool3, detaching);
    			if (detaching) detach_dev(t6);
    			destroy_component(tool4, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$a.name,
    		type: "if",
    		source: "(78:1) {#if fileSelected && !settingsOpen}",
    		ctx
    	});

    	return block;
    }

    // (79:2) <Tool     {tips}     {legacy}     size="13px"     tiptext={"Save image"}     on:click={() => editImage("save")}    >
    function create_default_slot_4$1(ctx) {
    	let i;

    	const block = {
    		c: function create() {
    			i = element("i");
    			attr_dev(i, "class", "far fa-save");
    			add_location(i, file$w, 85, 3, 2261);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, i, anchor);
    		},
    		p: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(i);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4$1.name,
    		type: "slot",
    		source: "(79:2) <Tool     {tips}     {legacy}     size=\\\"13px\\\"     tiptext={\\\"Save image\\\"}     on:click={() => editImage(\\\"save\\\")}    >",
    		ctx
    	});

    	return block;
    }

    // (88:2) <Tool     {tips}     {legacy}     size="13px"     tiptext={"Copy image"}     on:click={copyImage}    >
    function create_default_slot_3$1(ctx) {
    	let i;

    	const block = {
    		c: function create() {
    			i = element("i");
    			attr_dev(i, "class", "far fa-clipboard");
    			set_style(i, "transform", "translateY(-2px)");
    			add_location(i, file$w, 94, 6, 2413);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, i, anchor);
    		},
    		p: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(i);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3$1.name,
    		type: "slot",
    		source: "(88:2) <Tool     {tips}     {legacy}     size=\\\"13px\\\"     tiptext={\\\"Copy image\\\"}     on:click={copyImage}    >",
    		ctx
    	});

    	return block;
    }

    // (97:2) <Tool     {tips}     {legacy}     size="13px"     tiptext={"Crop image"}     on:click={() => dispatch("cropImage")}    >
    function create_default_slot_2$1(ctx) {
    	let i;

    	const block = {
    		c: function create() {
    			i = element("i");
    			attr_dev(i, "class", "far fa-crop-alt");
    			attr_dev(i, "style", "");
    			add_location(i, file$w, 103, 6, 2625);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, i, anchor);
    		},
    		p: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(i);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$1.name,
    		type: "slot",
    		source: "(97:2) <Tool     {tips}     {legacy}     size=\\\"13px\\\"     tiptext={\\\"Crop image\\\"}     on:click={() => dispatch(\\\"cropImage\\\")}    >",
    		ctx
    	});

    	return block;
    }

    // (122:2) <Tool     {tips}     {legacy}     size="13px"     tiptext={"Flip image"}     on:click={() => editImage("flipHorizontal")}    >
    function create_default_slot_1$2(ctx) {
    	let i;

    	const block = {
    		c: function create() {
    			i = element("i");
    			attr_dev(i, "class", "fas fa-sync-alt");
    			add_location(i, file$w, 128, 6, 3051);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, i, anchor);
    		},
    		p: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(i);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$2.name,
    		type: "slot",
    		source: "(122:2) <Tool     {tips}     {legacy}     size=\\\"13px\\\"     tiptext={\\\"Flip image\\\"}     on:click={() => editImage(\\\"flipHorizontal\\\")}    >",
    		ctx
    	});

    	return block;
    }

    // (131:2) <Tool     {tips}     {legacy}     size="12px"     tiptext={"Rotate image"}     on:click={() => editImage("rotateRight")}    >
    function create_default_slot$2(ctx) {
    	let i;

    	const block = {
    		c: function create() {
    			i = element("i");
    			attr_dev(i, "class", "fas fa-redo");
    			add_location(i, file$w, 137, 6, 3230);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, i, anchor);
    		},
    		p: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(i);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$2.name,
    		type: "slot",
    		source: "(131:2) <Tool     {tips}     {legacy}     size=\\\"12px\\\"     tiptext={\\\"Rotate image\\\"}     on:click={() => editImage(\\\"rotateRight\\\")}    >",
    		ctx
    	});

    	return block;
    }

    function create_fragment$A(ctx) {
    	let mousetrap_action;
    	let div;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block = /*fileSelected*/ ctx[0] && !/*settingsOpen*/ ctx[3] && create_if_block$a(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block) if_block.c();
    			attr_dev(div, "class", "toolbox svelte-b7ouig");
    			toggle_class(div, "legacy", /*legacy*/ ctx[4]);
    			add_location(div, file$w, 73, 0, 2058);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block) if_block.m(div, null);
    			current = true;

    			if (!mounted) {
    				dispose = action_destroyer(mousetrap_action = use.call(null, window_1, [
    					['command+s', 'ctrl+s', /*mousetrap_function*/ ctx[10]],
    					['command+c', 'ctrl+c', /*copyImage*/ ctx[6]],
    					[']', /*mousetrap_function_1*/ ctx[11]],
    					['[', /*mousetrap_function_2*/ ctx[12]],
    					['.', /*mousetrap_function_3*/ ctx[13]],
    					[',', /*mousetrap_function_4*/ ctx[14]],
    					['command+z', 'ctrl+z', /*mousetrap_function_5*/ ctx[15]]
    				]));

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (mousetrap_action && is_function(mousetrap_action.update) && dirty & /*fileSelected*/ 1) mousetrap_action.update.call(null, [
    				['command+s', 'ctrl+s', /*mousetrap_function*/ ctx[10]],
    				['command+c', 'ctrl+c', /*copyImage*/ ctx[6]],
    				[']', /*mousetrap_function_1*/ ctx[11]],
    				['[', /*mousetrap_function_2*/ ctx[12]],
    				['.', /*mousetrap_function_3*/ ctx[13]],
    				[',', /*mousetrap_function_4*/ ctx[14]],
    				['command+z', 'ctrl+z', /*mousetrap_function_5*/ ctx[15]]
    			]);

    			if (/*fileSelected*/ ctx[0] && !/*settingsOpen*/ ctx[3]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*fileSelected, settingsOpen*/ 9) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$a(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div, null);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			if (dirty & /*legacy*/ 16) {
    				toggle_class(div, "legacy", /*legacy*/ ctx[4]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block) if_block.d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$A.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function getSelectedText() {
    	var text = "";

    	if (typeof window.getSelection != "undefined") {
    		text = window.getSelection().toString();
    	} else if (typeof document.selection != "undefined" && document.selection.type == "Text") {
    		text = document.selection.createRange().text;
    	}

    	return text;
    }

    function instance$y($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Toolbox', slots, []);
    	const { ipcRenderer } = require('electron');
    	const dispatch = createEventDispatcher();
    	let { fileSelected = false } = $$props;
    	let { settingsOpen = false } = $$props;
    	let { legacy = false } = $$props;
    	let { tips = false } = $$props;
    	let { backdropColor = legacy ? "#111111" : "#2F2E33" } = $$props;
    	let { hex } = $$props;

    	function editImage(type) {
    		if (!fileSelected) return;
    		ipcRenderer.send('editImage', { type, image: fileSelected });
    	}

    	const copyImage = () => {
    		if (!fileSelected || getSelectedText() != "") return;
    		let xhr = new XMLHttpRequest();

    		xhr.onload = () => {
    			try {
    				let response = xhr.response.slice(0, xhr.response.size, "image/png");
    				const item = new ClipboardItem({ "image/png": response });
    				navigator.clipboard.write([item]);
    				ipcRenderer.send('action', "Image copied!");
    			} catch(e) {
    				console.log(e);
    			}
    		};

    		xhr.open('GET', fileSelected);
    		xhr.responseType = 'blob';
    		xhr.send();
    	};

    	const writable_props = ['fileSelected', 'settingsOpen', 'legacy', 'tips', 'backdropColor', 'hex'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$2.warn(`<Toolbox> was created with unknown prop '${key}'`);
    	});

    	const mousetrap_function = () => editImage("save");
    	const mousetrap_function_1 = () => editImage("rotateRight");
    	const mousetrap_function_2 = () => editImage("rotateLeft");
    	const mousetrap_function_3 = () => editImage("flipHorizontal");
    	const mousetrap_function_4 = () => editImage("flipVertical");

    	const mousetrap_function_5 = () => {
    		if (!fileSelected) return;
    		ipcRenderer.send('undo', fileSelected);
    	};

    	const click_handler = () => editImage("save");
    	const click_handler_1 = () => dispatch("cropImage");

    	function eyedropper_hex_binding(value) {
    		hex = value;
    		$$invalidate(2, hex);
    	}

    	const pickColor_handler = () => dispatch("pickColor");

    	function background_backdropColor_binding(value) {
    		backdropColor = value;
    		$$invalidate(1, backdropColor);
    	}

    	function palette_fileSelected_binding(value) {
    		fileSelected = value;
    		$$invalidate(0, fileSelected);
    	}

    	const click_handler_2 = () => editImage("flipHorizontal");
    	const click_handler_3 = () => editImage("rotateRight");

    	$$self.$$set = $$props => {
    		if ('fileSelected' in $$props) $$invalidate(0, fileSelected = $$props.fileSelected);
    		if ('settingsOpen' in $$props) $$invalidate(3, settingsOpen = $$props.settingsOpen);
    		if ('legacy' in $$props) $$invalidate(4, legacy = $$props.legacy);
    		if ('tips' in $$props) $$invalidate(5, tips = $$props.tips);
    		if ('backdropColor' in $$props) $$invalidate(1, backdropColor = $$props.backdropColor);
    		if ('hex' in $$props) $$invalidate(2, hex = $$props.hex);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		mousetrap: use,
    		ipcRenderer,
    		Tool,
    		Eyedropper,
    		Palette,
    		Background,
    		dispatch,
    		fileSelected,
    		settingsOpen,
    		legacy,
    		tips,
    		backdropColor,
    		hex,
    		editImage,
    		getSelectedText,
    		copyImage
    	});

    	$$self.$inject_state = $$props => {
    		if ('fileSelected' in $$props) $$invalidate(0, fileSelected = $$props.fileSelected);
    		if ('settingsOpen' in $$props) $$invalidate(3, settingsOpen = $$props.settingsOpen);
    		if ('legacy' in $$props) $$invalidate(4, legacy = $$props.legacy);
    		if ('tips' in $$props) $$invalidate(5, tips = $$props.tips);
    		if ('backdropColor' in $$props) $$invalidate(1, backdropColor = $$props.backdropColor);
    		if ('hex' in $$props) $$invalidate(2, hex = $$props.hex);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		fileSelected,
    		backdropColor,
    		hex,
    		settingsOpen,
    		legacy,
    		tips,
    		copyImage,
    		ipcRenderer,
    		dispatch,
    		editImage,
    		mousetrap_function,
    		mousetrap_function_1,
    		mousetrap_function_2,
    		mousetrap_function_3,
    		mousetrap_function_4,
    		mousetrap_function_5,
    		click_handler,
    		click_handler_1,
    		eyedropper_hex_binding,
    		pickColor_handler,
    		background_backdropColor_binding,
    		palette_fileSelected_binding,
    		click_handler_2,
    		click_handler_3
    	];
    }

    class Toolbox extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$y, create_fragment$A, safe_not_equal, {
    			fileSelected: 0,
    			settingsOpen: 3,
    			legacy: 4,
    			tips: 5,
    			backdropColor: 1,
    			hex: 2,
    			copyImage: 6
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Toolbox",
    			options,
    			id: create_fragment$A.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*hex*/ ctx[2] === undefined && !('hex' in props)) {
    			console_1$2.warn("<Toolbox> was created without expected prop 'hex'");
    		}
    	}

    	get fileSelected() {
    		throw new Error("<Toolbox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set fileSelected(value) {
    		throw new Error("<Toolbox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get settingsOpen() {
    		throw new Error("<Toolbox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set settingsOpen(value) {
    		throw new Error("<Toolbox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get legacy() {
    		throw new Error("<Toolbox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set legacy(value) {
    		throw new Error("<Toolbox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get tips() {
    		throw new Error("<Toolbox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tips(value) {
    		throw new Error("<Toolbox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get backdropColor() {
    		throw new Error("<Toolbox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set backdropColor(value) {
    		throw new Error("<Toolbox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get hex() {
    		throw new Error("<Toolbox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hex(value) {
    		throw new Error("<Toolbox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get copyImage() {
    		return this.$$.ctx[6];
    	}

    	set copyImage(value) {
    		throw new Error("<Toolbox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    function createNotificationStore (timeout) {
        const _notifications = writable([]);

        function send (message, type = "default", timeout) {
            _notifications.update(state => {
                return [...state, { id: id(), type, message, timeout }]
            });
        }

        const notifications = derived(_notifications, ($_notifications, set) => {
            set($_notifications);
            if ($_notifications.length > 0) {
                const timer = setTimeout(() => {
                    _notifications.update(state => {
                        state.shift();
                        return state;
                    });
                }, $_notifications[0].timeout);
                return () => {
                    clearTimeout(timer);
                };
            }
        });
        const { subscribe } = notifications;

        return {
            subscribe,
            send,
            default: (msg, timeout) => send(msg, "default", timeout)
        };
    }

    function id() {
        return '_' + Math.random().toString(36).substr(2, 9);
    }

    const notifications = createNotificationStore();

    /* src\components\Actions.svelte generated by Svelte v3.49.0 */
    const file$v = "src\\components\\Actions.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i];
    	return child_ctx;
    }

    // (12:4) {#each $notifications as notification (notification.id)}
    function create_each_block$2(key_1, ctx) {
    	let div;
    	let t0_value = /*notification*/ ctx[2].message + "";
    	let t0;
    	let t1;
    	let div_transition;
    	let current;

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			div = element("div");
    			t0 = text(t0_value);
    			t1 = space();
    			attr_dev(div, "class", "actions-item svelte-1slud6k");
    			add_location(div, file$v, 12, 8, 363);
    			this.first = div;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t0);
    			append_dev(div, t1);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if ((!current || dirty & /*$notifications*/ 1) && t0_value !== (t0_value = /*notification*/ ctx[2].message + "")) set_data_dev(t0, t0_value);
    		},
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (!div_transition) div_transition = create_bidirectional_transition(div, fade, {}, true);
    				div_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (!div_transition) div_transition = create_bidirectional_transition(div, fade, {}, false);
    			div_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (detaching && div_transition) div_transition.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(12:4) {#each $notifications as notification (notification.id)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$z(ctx) {
    	let div;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let current;
    	let each_value = /*$notifications*/ ctx[0];
    	validate_each_argument(each_value);
    	const get_key = ctx => /*notification*/ ctx[2].id;
    	validate_each_keys(ctx, each_value, get_each_context$2, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context$2(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block$2(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "actions svelte-1slud6k");
    			add_location(div, file$v, 10, 0, 270);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$notifications*/ 1) {
    				each_value = /*$notifications*/ ctx[0];
    				validate_each_argument(each_value);
    				group_outros();
    				validate_each_keys(ctx, each_value, get_each_context$2, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, div, outro_and_destroy_block, create_each_block$2, null, get_each_context$2);
    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$z.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$x($$self, $$props, $$invalidate) {
    	let $notifications;
    	validate_store(notifications, 'notifications');
    	component_subscribe($$self, notifications, $$value => $$invalidate(0, $notifications = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Actions', slots, []);
    	const { ipcRenderer } = require('electron');

    	ipcRenderer.on('action', (event, arg) => {
    		notifications.default(arg, 2000);
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Actions> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		ipcRenderer,
    		fade,
    		notifications,
    		$notifications
    	});

    	return [$notifications];
    }

    class Actions extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$x, create_fragment$z, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Actions",
    			options,
    			id: create_fragment$z.name
    		});
    	}
    }

    /* src\components\Dropfield.svelte generated by Svelte v3.49.0 */

    const file$u = "src\\components\\Dropfield.svelte";

    // (8:3) {#if !legacy}
    function create_if_block$9(ctx) {
    	let div;
    	let i;

    	const block = {
    		c: function create() {
    			div = element("div");
    			i = element("i");
    			attr_dev(i, "class", "fas fa-upload");
    			add_location(i, file$u, 9, 5, 235);
    			attr_dev(div, "class", "dropfield-inner-icon svelte-1imzacy");
    			add_location(div, file$u, 8, 4, 194);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, i);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$9.name,
    		type: "if",
    		source: "(8:3) {#if !legacy}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$y(ctx) {
    	let div4;
    	let div3;
    	let div2;
    	let t0;
    	let div1;
    	let div0;
    	let if_block = !/*legacy*/ ctx[0] && create_if_block$9(ctx);

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			div3 = element("div");
    			div2 = element("div");
    			if (if_block) if_block.c();
    			t0 = space();
    			div1 = element("div");
    			div0 = element("div");
    			div0.textContent = "Drop image here";
    			attr_dev(div0, "class", "dropfield-inner-text-line");
    			add_location(div0, file$u, 13, 4, 331);
    			attr_dev(div1, "class", "dropfield-inner-text svelte-1imzacy");
    			add_location(div1, file$u, 12, 3, 291);
    			attr_dev(div2, "class", "dropfield-inner svelte-1imzacy");
    			add_location(div2, file$u, 6, 2, 141);
    			attr_dev(div3, "class", "dropfield-inner-wrapper svelte-1imzacy");
    			add_location(div3, file$u, 5, 1, 100);
    			attr_dev(div4, "class", "dropfield svelte-1imzacy");
    			toggle_class(div4, "legacy", /*legacy*/ ctx[0]);
    			add_location(div4, file$u, 4, 0, 52);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			append_dev(div4, div3);
    			append_dev(div3, div2);
    			if (if_block) if_block.m(div2, null);
    			append_dev(div2, t0);
    			append_dev(div2, div1);
    			append_dev(div1, div0);
    		},
    		p: function update(ctx, [dirty]) {
    			if (!/*legacy*/ ctx[0]) {
    				if (if_block) ; else {
    					if_block = create_if_block$9(ctx);
    					if_block.c();
    					if_block.m(div2, t0);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty & /*legacy*/ 1) {
    				toggle_class(div4, "legacy", /*legacy*/ ctx[0]);
    			}
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div4);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$y.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$w($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Dropfield', slots, []);
    	let { legacy = false } = $$props;
    	const writable_props = ['legacy'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Dropfield> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('legacy' in $$props) $$invalidate(0, legacy = $$props.legacy);
    	};

    	$$self.$capture_state = () => ({ legacy });

    	$$self.$inject_state = $$props => {
    		if ('legacy' in $$props) $$invalidate(0, legacy = $$props.legacy);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [legacy];
    }

    class Dropfield extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$w, create_fragment$y, safe_not_equal, { legacy: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Dropfield",
    			options,
    			id: create_fragment$y.name
    		});
    	}

    	get legacy() {
    		throw new Error("<Dropfield>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set legacy(value) {
    		throw new Error("<Dropfield>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\menu\Settings.svelte generated by Svelte v3.49.0 */

    const file$t = "src\\components\\menu\\Settings.svelte";

    function create_fragment$x(ctx) {
    	let div4;
    	let div3;
    	let div0;
    	let t1;
    	let div1;
    	let span0;
    	let t2_value = /*settings*/ ctx[0].zoom + "";
    	let t2;
    	let t3;
    	let div2;
    	let input0;
    	let t4;
    	let div9;
    	let div7;
    	let div5;
    	let t6;
    	let div6;
    	let label0;
    	let input1;
    	let t7;
    	let span1;
    	let t8;
    	let div8;
    	let t10;
    	let div13;
    	let div12;
    	let div10;
    	let t12;
    	let div11;
    	let label1;
    	let input2;
    	let t13;
    	let span2;
    	let t14;
    	let div17;
    	let div16;
    	let div14;
    	let t16;
    	let div15;
    	let label2;
    	let input3;
    	let t17;
    	let span3;
    	let t18;
    	let div22;
    	let div20;
    	let div18;
    	let t20;
    	let div19;
    	let label3;
    	let input4;
    	let t21;
    	let span4;
    	let t22;
    	let div21;
    	let t24;
    	let div26;
    	let div25;
    	let div23;
    	let t26;
    	let div24;
    	let label4;
    	let input5;
    	let t27;
    	let span5;
    	let t28;
    	let div31;
    	let div29;
    	let div27;
    	let t30;
    	let div28;
    	let input6;
    	let t31;
    	let button0;
    	let t32_value = (/*settings*/ ctx[0].savedir ? "Change" : "Browse") + "";
    	let t32;
    	let t33;
    	let div30;
    	let t35;
    	let div36;
    	let div34;
    	let div32;
    	let t37;
    	let div33;
    	let button1;
    	let t38;
    	let t39;
    	let div35;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			div3 = element("div");
    			div0 = element("div");
    			div0.textContent = "Zoom amount";
    			t1 = space();
    			div1 = element("div");
    			span0 = element("span");
    			t2 = text(t2_value);
    			t3 = space();
    			div2 = element("div");
    			input0 = element("input");
    			t4 = space();
    			div9 = element("div");
    			div7 = element("div");
    			div5 = element("div");
    			div5.textContent = "Allow overwrite";
    			t6 = space();
    			div6 = element("div");
    			label0 = element("label");
    			input1 = element("input");
    			t7 = space();
    			span1 = element("span");
    			t8 = space();
    			div8 = element("div");
    			div8.textContent = "Allow selecting a new image while another image is loaded.";
    			t10 = space();
    			div13 = element("div");
    			div12 = element("div");
    			div10 = element("div");
    			div10.textContent = "Legacy theme";
    			t12 = space();
    			div11 = element("div");
    			label1 = element("label");
    			input2 = element("input");
    			t13 = space();
    			span2 = element("span");
    			t14 = space();
    			div17 = element("div");
    			div16 = element("div");
    			div14 = element("div");
    			div14.textContent = "Disable tooltips";
    			t16 = space();
    			div15 = element("div");
    			label2 = element("label");
    			input3 = element("input");
    			t17 = space();
    			span3 = element("span");
    			t18 = space();
    			div22 = element("div");
    			div20 = element("div");
    			div18 = element("div");
    			div18.textContent = "Ignore transparency";
    			t20 = space();
    			div19 = element("div");
    			label3 = element("label");
    			input4 = element("input");
    			t21 = space();
    			span4 = element("span");
    			t22 = space();
    			div21 = element("div");
    			div21.textContent = "Make the image ignore background transparency and stay opaque.";
    			t24 = space();
    			div26 = element("div");
    			div25 = element("div");
    			div23 = element("div");
    			div23.textContent = "Auto-save screenshots";
    			t26 = space();
    			div24 = element("div");
    			label4 = element("label");
    			input5 = element("input");
    			t27 = space();
    			span5 = element("span");
    			t28 = space();
    			div31 = element("div");
    			div29 = element("div");
    			div27 = element("div");
    			div27.textContent = "Auto-save directory";
    			t30 = space();
    			div28 = element("div");
    			input6 = element("input");
    			t31 = space();
    			button0 = element("button");
    			t32 = text(t32_value);
    			t33 = space();
    			div30 = element("div");
    			div30.textContent = "Choose the directory where to save screenshots";
    			t35 = space();
    			div36 = element("div");
    			div34 = element("div");
    			div32 = element("div");
    			div32.textContent = "Reset settings";
    			t37 = space();
    			div33 = element("div");
    			button1 = element("button");
    			t38 = text(/*resetText*/ ctx[1]);
    			t39 = space();
    			div35 = element("div");
    			div35.textContent = "Reset the settings back to their defaults";
    			attr_dev(div0, "class", "setting-title svelte-183mina");
    			add_location(div0, file$t, 45, 2, 961);
    			attr_dev(span0, "class", "setting-control-info svelte-183mina");
    			add_location(span0, file$t, 49, 3, 1052);
    			attr_dev(div1, "class", "setting-control svelte-183mina");
    			add_location(div1, file$t, 48, 2, 1018);
    			attr_dev(input0, "type", "range");
    			attr_dev(input0, "step", "0.1");
    			attr_dev(input0, "max", "1");
    			attr_dev(input0, "min", "0.1");
    			attr_dev(input0, "class", "svelte-183mina");
    			add_location(input0, file$t, 52, 3, 1163);
    			attr_dev(div2, "class", "setting-control-large svelte-183mina");
    			add_location(div2, file$t, 51, 2, 1123);
    			attr_dev(div3, "class", "setting-inner svelte-183mina");
    			add_location(div3, file$t, 44, 1, 930);
    			attr_dev(div4, "class", "setting svelte-183mina");
    			add_location(div4, file$t, 43, 0, 906);
    			attr_dev(div5, "class", "setting-title svelte-183mina");
    			add_location(div5, file$t, 58, 2, 1323);
    			attr_dev(input1, "type", "checkbox");
    			attr_dev(input1, "class", "svelte-183mina");
    			add_location(input1, file$t, 63, 4, 1446);
    			attr_dev(span1, "class", "slider svelte-183mina");
    			add_location(span1, file$t, 64, 4, 1509);
    			attr_dev(label0, "class", "switch svelte-183mina");
    			add_location(label0, file$t, 62, 3, 1418);
    			attr_dev(div6, "class", "setting-control svelte-183mina");
    			add_location(div6, file$t, 61, 2, 1384);
    			attr_dev(div7, "class", "setting-inner svelte-183mina");
    			add_location(div7, file$t, 57, 1, 1292);
    			attr_dev(div8, "class", "setting-description svelte-183mina");
    			add_location(div8, file$t, 68, 1, 1572);
    			attr_dev(div9, "class", "setting svelte-183mina");
    			add_location(div9, file$t, 56, 0, 1268);
    			attr_dev(div10, "class", "setting-title svelte-183mina");
    			add_location(div10, file$t, 74, 2, 1741);
    			attr_dev(input2, "type", "checkbox");
    			attr_dev(input2, "class", "svelte-183mina");
    			add_location(input2, file$t, 79, 4, 1861);
    			attr_dev(span2, "class", "slider svelte-183mina");
    			add_location(span2, file$t, 80, 4, 1920);
    			attr_dev(label1, "class", "switch svelte-183mina");
    			add_location(label1, file$t, 78, 3, 1833);
    			attr_dev(div11, "class", "setting-control svelte-183mina");
    			add_location(div11, file$t, 77, 2, 1799);
    			attr_dev(div12, "class", "setting-inner svelte-183mina");
    			add_location(div12, file$t, 73, 1, 1710);
    			attr_dev(div13, "class", "setting svelte-183mina");
    			add_location(div13, file$t, 72, 0, 1686);
    			attr_dev(div14, "class", "setting-title svelte-183mina");
    			add_location(div14, file$t, 87, 2, 2045);
    			attr_dev(input3, "type", "checkbox");
    			attr_dev(input3, "class", "svelte-183mina");
    			add_location(input3, file$t, 92, 4, 2169);
    			attr_dev(span3, "class", "slider svelte-183mina");
    			add_location(span3, file$t, 93, 4, 2231);
    			attr_dev(label2, "class", "switch svelte-183mina");
    			add_location(label2, file$t, 91, 3, 2141);
    			attr_dev(div15, "class", "setting-control svelte-183mina");
    			add_location(div15, file$t, 90, 2, 2107);
    			attr_dev(div16, "class", "setting-inner svelte-183mina");
    			add_location(div16, file$t, 86, 1, 2014);
    			attr_dev(div17, "class", "setting svelte-183mina");
    			add_location(div17, file$t, 85, 0, 1990);
    			attr_dev(div18, "class", "setting-title svelte-183mina");
    			add_location(div18, file$t, 100, 2, 2356);
    			attr_dev(input4, "type", "checkbox");
    			attr_dev(input4, "class", "svelte-183mina");
    			add_location(input4, file$t, 105, 4, 2483);
    			attr_dev(span4, "class", "slider svelte-183mina");
    			add_location(span4, file$t, 106, 4, 2549);
    			attr_dev(label3, "class", "switch svelte-183mina");
    			add_location(label3, file$t, 104, 3, 2455);
    			attr_dev(div19, "class", "setting-control svelte-183mina");
    			add_location(div19, file$t, 103, 2, 2421);
    			attr_dev(div20, "class", "setting-inner svelte-183mina");
    			add_location(div20, file$t, 99, 1, 2325);
    			attr_dev(div21, "class", "setting-description svelte-183mina");
    			add_location(div21, file$t, 110, 1, 2612);
    			attr_dev(div22, "class", "setting svelte-183mina");
    			add_location(div22, file$t, 98, 0, 2301);
    			attr_dev(div23, "class", "setting-title svelte-183mina");
    			add_location(div23, file$t, 116, 2, 2785);
    			attr_dev(input5, "type", "checkbox");
    			attr_dev(input5, "class", "svelte-183mina");
    			add_location(input5, file$t, 121, 4, 2914);
    			attr_dev(span5, "class", "slider svelte-183mina");
    			add_location(span5, file$t, 122, 4, 2976);
    			attr_dev(label4, "class", "switch svelte-183mina");
    			add_location(label4, file$t, 120, 3, 2886);
    			attr_dev(div24, "class", "setting-control svelte-183mina");
    			add_location(div24, file$t, 119, 2, 2852);
    			attr_dev(div25, "class", "setting-inner svelte-183mina");
    			add_location(div25, file$t, 115, 1, 2754);
    			attr_dev(div26, "class", "setting svelte-183mina");
    			add_location(div26, file$t, 114, 0, 2730);
    			attr_dev(div27, "class", "setting-title svelte-183mina");
    			add_location(div27, file$t, 129, 2, 3137);
    			attr_dev(input6, "type", "hidden");
    			add_location(input6, file$t, 133, 3, 3236);
    			attr_dev(button0, "class", "button svelte-183mina");
    			add_location(button0, file$t, 134, 3, 3292);
    			attr_dev(div28, "class", "setting-control svelte-183mina");
    			add_location(div28, file$t, 132, 2, 3202);
    			attr_dev(div29, "class", "setting-inner svelte-183mina");
    			add_location(div29, file$t, 128, 1, 3106);
    			attr_dev(div30, "class", "setting-description svelte-183mina");
    			add_location(div30, file$t, 139, 1, 3455);
    			attr_dev(div31, "class", "setting svelte-183mina");
    			toggle_class(div31, "disabled", !/*settings*/ ctx[0].autosave);
    			add_location(div31, file$t, 127, 0, 3046);
    			attr_dev(div32, "class", "setting-title svelte-183mina");
    			add_location(div32, file$t, 145, 2, 3612);
    			attr_dev(button1, "class", "button svelte-183mina");
    			add_location(button1, file$t, 149, 3, 3706);
    			attr_dev(div33, "class", "setting-control svelte-183mina");
    			add_location(div33, file$t, 148, 2, 3672);
    			attr_dev(div34, "class", "setting-inner svelte-183mina");
    			add_location(div34, file$t, 144, 1, 3581);
    			attr_dev(div35, "class", "setting-description svelte-183mina");
    			add_location(div35, file$t, 152, 1, 3794);
    			attr_dev(div36, "class", "setting svelte-183mina");
    			add_location(div36, file$t, 143, 0, 3557);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			append_dev(div4, div3);
    			append_dev(div3, div0);
    			append_dev(div3, t1);
    			append_dev(div3, div1);
    			append_dev(div1, span0);
    			append_dev(span0, t2);
    			append_dev(div3, t3);
    			append_dev(div3, div2);
    			append_dev(div2, input0);
    			set_input_value(input0, /*settings*/ ctx[0].zoom);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, div9, anchor);
    			append_dev(div9, div7);
    			append_dev(div7, div5);
    			append_dev(div7, t6);
    			append_dev(div7, div6);
    			append_dev(div6, label0);
    			append_dev(label0, input1);
    			input1.checked = /*settings*/ ctx[0].overwrite;
    			append_dev(label0, t7);
    			append_dev(label0, span1);
    			append_dev(div9, t8);
    			append_dev(div9, div8);
    			insert_dev(target, t10, anchor);
    			insert_dev(target, div13, anchor);
    			append_dev(div13, div12);
    			append_dev(div12, div10);
    			append_dev(div12, t12);
    			append_dev(div12, div11);
    			append_dev(div11, label1);
    			append_dev(label1, input2);
    			input2.checked = /*settings*/ ctx[0].theme;
    			append_dev(label1, t13);
    			append_dev(label1, span2);
    			insert_dev(target, t14, anchor);
    			insert_dev(target, div17, anchor);
    			append_dev(div17, div16);
    			append_dev(div16, div14);
    			append_dev(div16, t16);
    			append_dev(div16, div15);
    			append_dev(div15, label2);
    			append_dev(label2, input3);
    			input3.checked = /*settings*/ ctx[0].tooltips;
    			append_dev(label2, t17);
    			append_dev(label2, span3);
    			insert_dev(target, t18, anchor);
    			insert_dev(target, div22, anchor);
    			append_dev(div22, div20);
    			append_dev(div20, div18);
    			append_dev(div20, t20);
    			append_dev(div20, div19);
    			append_dev(div19, label3);
    			append_dev(label3, input4);
    			input4.checked = /*settings*/ ctx[0].transparency;
    			append_dev(label3, t21);
    			append_dev(label3, span4);
    			append_dev(div22, t22);
    			append_dev(div22, div21);
    			insert_dev(target, t24, anchor);
    			insert_dev(target, div26, anchor);
    			append_dev(div26, div25);
    			append_dev(div25, div23);
    			append_dev(div25, t26);
    			append_dev(div25, div24);
    			append_dev(div24, label4);
    			append_dev(label4, input5);
    			input5.checked = /*settings*/ ctx[0].autosave;
    			append_dev(label4, t27);
    			append_dev(label4, span5);
    			insert_dev(target, t28, anchor);
    			insert_dev(target, div31, anchor);
    			append_dev(div31, div29);
    			append_dev(div29, div27);
    			append_dev(div29, t30);
    			append_dev(div29, div28);
    			append_dev(div28, input6);
    			set_input_value(input6, /*settings*/ ctx[0].savedir);
    			append_dev(div28, t31);
    			append_dev(div28, button0);
    			append_dev(button0, t32);
    			append_dev(div31, t33);
    			append_dev(div31, div30);
    			insert_dev(target, t35, anchor);
    			insert_dev(target, div36, anchor);
    			append_dev(div36, div34);
    			append_dev(div34, div32);
    			append_dev(div34, t37);
    			append_dev(div34, div33);
    			append_dev(div33, button1);
    			append_dev(button1, t38);
    			append_dev(div36, t39);
    			append_dev(div36, div35);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "change", /*input0_change_input_handler*/ ctx[5]),
    					listen_dev(input0, "input", /*input0_change_input_handler*/ ctx[5]),
    					listen_dev(input1, "change", /*input1_change_handler*/ ctx[6]),
    					listen_dev(input2, "change", /*input2_change_handler*/ ctx[7]),
    					listen_dev(input3, "change", /*input3_change_handler*/ ctx[8]),
    					listen_dev(input4, "change", /*input4_change_handler*/ ctx[9]),
    					listen_dev(input5, "change", /*input5_change_handler*/ ctx[10]),
    					listen_dev(input6, "input", /*input6_input_handler*/ ctx[11]),
    					listen_dev(button0, "click", /*click_handler*/ ctx[12], false, false, false),
    					listen_dev(button1, "click", /*handleReset*/ ctx[3], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*settings*/ 1 && t2_value !== (t2_value = /*settings*/ ctx[0].zoom + "")) set_data_dev(t2, t2_value);

    			if (dirty & /*settings*/ 1) {
    				set_input_value(input0, /*settings*/ ctx[0].zoom);
    			}

    			if (dirty & /*settings*/ 1) {
    				input1.checked = /*settings*/ ctx[0].overwrite;
    			}

    			if (dirty & /*settings*/ 1) {
    				input2.checked = /*settings*/ ctx[0].theme;
    			}

    			if (dirty & /*settings*/ 1) {
    				input3.checked = /*settings*/ ctx[0].tooltips;
    			}

    			if (dirty & /*settings*/ 1) {
    				input4.checked = /*settings*/ ctx[0].transparency;
    			}

    			if (dirty & /*settings*/ 1) {
    				input5.checked = /*settings*/ ctx[0].autosave;
    			}

    			if (dirty & /*settings*/ 1) {
    				set_input_value(input6, /*settings*/ ctx[0].savedir);
    			}

    			if (dirty & /*settings*/ 1 && t32_value !== (t32_value = (/*settings*/ ctx[0].savedir ? "Change" : "Browse") + "")) set_data_dev(t32, t32_value);

    			if (dirty & /*settings*/ 1) {
    				toggle_class(div31, "disabled", !/*settings*/ ctx[0].autosave);
    			}

    			if (dirty & /*resetText*/ 2) set_data_dev(t38, /*resetText*/ ctx[1]);
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div4);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(div9);
    			if (detaching) detach_dev(t10);
    			if (detaching) detach_dev(div13);
    			if (detaching) detach_dev(t14);
    			if (detaching) detach_dev(div17);
    			if (detaching) detach_dev(t18);
    			if (detaching) detach_dev(div22);
    			if (detaching) detach_dev(t24);
    			if (detaching) detach_dev(div26);
    			if (detaching) detach_dev(t28);
    			if (detaching) detach_dev(div31);
    			if (detaching) detach_dev(t35);
    			if (detaching) detach_dev(div36);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$x.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$v($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Settings', slots, []);
    	const { ipcRenderer } = require('electron');
    	let { settings = { zoom: 0.3 } } = $$props;
    	let timeout;
    	let resetConfirmed = false;
    	let resetText = "Reset";

    	function handleReset() {
    		if (!resetConfirmed) {
    			$$invalidate(1, resetText = "Are you sure?");
    			resetConfirmed = true;
    			return;
    		}

    		//settings = { zoom: 0.3 };
    		$$invalidate(0, settings.zoom = 0.3, settings);

    		$$invalidate(0, settings.overwrite = false, settings);
    		$$invalidate(0, settings.theme = false, settings);
    		$$invalidate(0, settings.tooltips = false, settings);
    		$$invalidate(0, settings.transparency = false, settings);
    		$$invalidate(0, settings.autosave = false, settings);
    		$$invalidate(0, settings.savedir = false, settings);
    		resetConfirmed = false;
    		$$invalidate(1, resetText = "Reset");
    	}

    	ipcRenderer.on('getDirectory', (event, arg) => {
    		$$invalidate(0, settings.savedir = arg, settings);
    	});

    	const writable_props = ['settings'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Settings> was created with unknown prop '${key}'`);
    	});

    	function input0_change_input_handler() {
    		settings.zoom = to_number(this.value);
    		$$invalidate(0, settings);
    	}

    	function input1_change_handler() {
    		settings.overwrite = this.checked;
    		$$invalidate(0, settings);
    	}

    	function input2_change_handler() {
    		settings.theme = this.checked;
    		$$invalidate(0, settings);
    	}

    	function input3_change_handler() {
    		settings.tooltips = this.checked;
    		$$invalidate(0, settings);
    	}

    	function input4_change_handler() {
    		settings.transparency = this.checked;
    		$$invalidate(0, settings);
    	}

    	function input5_change_handler() {
    		settings.autosave = this.checked;
    		$$invalidate(0, settings);
    	}

    	function input6_input_handler() {
    		settings.savedir = this.value;
    		$$invalidate(0, settings);
    	}

    	const click_handler = () => ipcRenderer.send('select:saveDirectory');

    	$$self.$$set = $$props => {
    		if ('settings' in $$props) $$invalidate(0, settings = $$props.settings);
    	};

    	$$self.$capture_state = () => ({
    		ipcRenderer,
    		settings,
    		timeout,
    		resetConfirmed,
    		resetText,
    		handleReset
    	});

    	$$self.$inject_state = $$props => {
    		if ('settings' in $$props) $$invalidate(0, settings = $$props.settings);
    		if ('timeout' in $$props) $$invalidate(4, timeout = $$props.timeout);
    		if ('resetConfirmed' in $$props) resetConfirmed = $$props.resetConfirmed;
    		if ('resetText' in $$props) $$invalidate(1, resetText = $$props.resetText);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*timeout, settings*/ 17) {
    			{
    				clearTimeout(timeout);

    				$$invalidate(4, timeout = setTimeout(
    					() => {
    						ipcRenderer.send('settings:write', settings);
    					},
    					500
    				));
    			}
    		}
    	};

    	return [
    		settings,
    		resetText,
    		ipcRenderer,
    		handleReset,
    		timeout,
    		input0_change_input_handler,
    		input1_change_handler,
    		input2_change_handler,
    		input3_change_handler,
    		input4_change_handler,
    		input5_change_handler,
    		input6_input_handler,
    		click_handler
    	];
    }

    class Settings extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$v, create_fragment$x, safe_not_equal, { settings: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Settings",
    			options,
    			id: create_fragment$x.name
    		});
    	}

    	get settings() {
    		throw new Error("<Settings>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set settings(value) {
    		throw new Error("<Settings>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\menu\About.svelte generated by Svelte v3.49.0 */

    const file$s = "src\\components\\menu\\About.svelte";

    // (5:0) {#if version}
    function create_if_block$8(ctx) {
    	let div;
    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t0 = text("v. ");
    			t1 = text(/*version*/ ctx[0]);
    			attr_dev(div, "class", "about-text svelte-fc0wla");
    			add_location(div, file$s, 5, 1, 61);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t0);
    			append_dev(div, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*version*/ 1) set_data_dev(t1, /*version*/ ctx[0]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$8.name,
    		type: "if",
    		source: "(5:0) {#if version}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$w(ctx) {
    	let t0;
    	let div0;
    	let t2;
    	let div1;
    	let t4;
    	let div2;
    	let t5;
    	let br0;
    	let t6;
    	let br1;
    	let t7;
    	let br2;
    	let t8;
    	let br3;
    	let t9;
    	let t10;
    	let div3;
    	let t12;
    	let div4;
    	let t13;
    	let br4;
    	let t14;
    	let br5;
    	let t15;
    	let t16;
    	let div5;
    	let t18;
    	let div6;
    	let ul;
    	let li0;
    	let a0;
    	let i0;
    	let t19;
    	let li1;
    	let a1;
    	let i1;
    	let t20;
    	let li2;
    	let a2;
    	let i2;
    	let if_block = /*version*/ ctx[0] && create_if_block$8(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			t0 = space();
    			div0 = element("div");
    			div0.textContent = "source.dog © 2018-2022";
    			t2 = space();
    			div1 = element("div");
    			div1.textContent = "Special thanks to:";
    			t4 = space();
    			div2 = element("div");
    			t5 = text("GHOST");
    			br0 = element("br");
    			t6 = text("\r\n\tSade");
    			br1 = element("br");
    			t7 = text("\r\n\tEnnoriel");
    			br2 = element("br");
    			t8 = text("\r\n\thrfn");
    			br3 = element("br");
    			t9 = text("\r\n\tCharalian");
    			t10 = space();
    			div3 = element("div");
    			div3.textContent = "Made with:";
    			t12 = space();
    			div4 = element("div");
    			t13 = text("Electron");
    			br4 = element("br");
    			t14 = text("\r\n\tSvelte");
    			br5 = element("br");
    			t15 = text("\r\n\tSharp");
    			t16 = space();
    			div5 = element("div");
    			div5.textContent = "Links:";
    			t18 = space();
    			div6 = element("div");
    			ul = element("ul");
    			li0 = element("li");
    			a0 = element("a");
    			i0 = element("i");
    			t19 = space();
    			li1 = element("li");
    			a1 = element("a");
    			i1 = element("i");
    			t20 = space();
    			li2 = element("li");
    			a2 = element("a");
    			i2 = element("i");
    			attr_dev(div0, "class", "about-text svelte-fc0wla");
    			add_location(div0, file$s, 9, 0, 119);
    			attr_dev(div1, "class", "about-text-title svelte-fc0wla");
    			add_location(div1, file$s, 12, 0, 183);
    			add_location(br0, file$s, 16, 6, 276);
    			add_location(br1, file$s, 17, 5, 287);
    			add_location(br2, file$s, 18, 9, 302);
    			add_location(br3, file$s, 19, 5, 313);
    			attr_dev(div2, "class", "about-text svelte-fc0wla");
    			add_location(div2, file$s, 15, 0, 244);
    			attr_dev(div3, "class", "about-text-title svelte-fc0wla");
    			add_location(div3, file$s, 22, 0, 339);
    			add_location(br4, file$s, 26, 9, 427);
    			add_location(br5, file$s, 27, 7, 440);
    			attr_dev(div4, "class", "about-text svelte-fc0wla");
    			add_location(div4, file$s, 25, 0, 392);
    			attr_dev(div5, "class", "about-text-title svelte-fc0wla");
    			add_location(div5, file$s, 30, 0, 462);
    			attr_dev(i0, "class", "fab fa-trello");
    			add_location(i0, file$s, 36, 53, 648);
    			attr_dev(a0, "href", "https://trello.com/b/NlCLf8lW/refviewer");
    			attr_dev(a0, "class", "svelte-fc0wla");
    			add_location(a0, file$s, 36, 3, 598);
    			attr_dev(li0, "class", "about-list-icon svelte-fc0wla");
    			add_location(li0, file$s, 35, 2, 565);
    			attr_dev(i1, "class", "fab fa-github-square");
    			add_location(i1, file$s, 39, 57, 781);
    			attr_dev(a1, "href", "https://github.com/atomic-addison/refviewer");
    			attr_dev(a1, "class", "svelte-fc0wla");
    			add_location(a1, file$s, 39, 3, 727);
    			attr_dev(li1, "class", "about-list-icon svelte-fc0wla");
    			add_location(li1, file$s, 38, 2, 694);
    			attr_dev(i2, "class", "fas fa-home");
    			add_location(i2, file$s, 42, 32, 896);
    			attr_dev(a2, "href", "https://source.dog");
    			attr_dev(a2, "class", "svelte-fc0wla");
    			add_location(a2, file$s, 42, 3, 867);
    			attr_dev(li2, "class", "about-list-icon svelte-fc0wla");
    			add_location(li2, file$s, 41, 2, 834);
    			attr_dev(ul, "class", "about-list svelte-fc0wla");
    			add_location(ul, file$s, 34, 1, 538);
    			attr_dev(div6, "class", "about-text svelte-fc0wla");
    			add_location(div6, file$s, 33, 0, 511);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div0, anchor);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, div1, anchor);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, div2, anchor);
    			append_dev(div2, t5);
    			append_dev(div2, br0);
    			append_dev(div2, t6);
    			append_dev(div2, br1);
    			append_dev(div2, t7);
    			append_dev(div2, br2);
    			append_dev(div2, t8);
    			append_dev(div2, br3);
    			append_dev(div2, t9);
    			insert_dev(target, t10, anchor);
    			insert_dev(target, div3, anchor);
    			insert_dev(target, t12, anchor);
    			insert_dev(target, div4, anchor);
    			append_dev(div4, t13);
    			append_dev(div4, br4);
    			append_dev(div4, t14);
    			append_dev(div4, br5);
    			append_dev(div4, t15);
    			insert_dev(target, t16, anchor);
    			insert_dev(target, div5, anchor);
    			insert_dev(target, t18, anchor);
    			insert_dev(target, div6, anchor);
    			append_dev(div6, ul);
    			append_dev(ul, li0);
    			append_dev(li0, a0);
    			append_dev(a0, i0);
    			append_dev(ul, t19);
    			append_dev(ul, li1);
    			append_dev(li1, a1);
    			append_dev(a1, i1);
    			append_dev(ul, t20);
    			append_dev(ul, li2);
    			append_dev(li2, a2);
    			append_dev(a2, i2);
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*version*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$8(ctx);
    					if_block.c();
    					if_block.m(t0.parentNode, t0);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(div1);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(div2);
    			if (detaching) detach_dev(t10);
    			if (detaching) detach_dev(div3);
    			if (detaching) detach_dev(t12);
    			if (detaching) detach_dev(div4);
    			if (detaching) detach_dev(t16);
    			if (detaching) detach_dev(div5);
    			if (detaching) detach_dev(t18);
    			if (detaching) detach_dev(div6);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$w.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$u($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('About', slots, []);
    	let { version } = $$props;
    	const writable_props = ['version'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<About> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('version' in $$props) $$invalidate(0, version = $$props.version);
    	};

    	$$self.$capture_state = () => ({ version });

    	$$self.$inject_state = $$props => {
    		if ('version' in $$props) $$invalidate(0, version = $$props.version);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [version];
    }

    class About extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$u, create_fragment$w, safe_not_equal, { version: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "About",
    			options,
    			id: create_fragment$w.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*version*/ ctx[0] === undefined && !('version' in props)) {
    			console.warn("<About> was created without expected prop 'version'");
    		}
    	}

    	get version() {
    		throw new Error("<About>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set version(value) {
    		throw new Error("<About>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\common\Loader.svelte generated by Svelte v3.49.0 */

    const file$r = "src\\components\\common\\Loader.svelte";

    function create_fragment$v(ctx) {
    	let div3;
    	let div2;
    	let div0;
    	let t;
    	let div1;

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div2 = element("div");
    			div0 = element("div");
    			t = space();
    			div1 = element("div");
    			set_style(div0, "border-color", /*color*/ ctx[0]);
    			attr_dev(div0, "class", "svelte-1asu0hl");
    			add_location(div0, file$r, 6, 2, 106);
    			set_style(div1, "border-color", /*color*/ ctx[0]);
    			attr_dev(div1, "class", "svelte-1asu0hl");
    			add_location(div1, file$r, 7, 2, 152);
    			attr_dev(div2, "class", "lds-ripple svelte-1asu0hl");
    			add_location(div2, file$r, 5, 1, 78);
    			attr_dev(div3, "class", "loader svelte-1asu0hl");
    			add_location(div3, file$r, 4, 0, 55);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div2);
    			append_dev(div2, div0);
    			append_dev(div2, t);
    			append_dev(div2, div1);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*color*/ 1) {
    				set_style(div0, "border-color", /*color*/ ctx[0]);
    			}

    			if (dirty & /*color*/ 1) {
    				set_style(div1, "border-color", /*color*/ ctx[0]);
    			}
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$v.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$t($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Loader', slots, []);
    	let { color = "#3A3940" } = $$props;
    	const writable_props = ['color'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Loader> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('color' in $$props) $$invalidate(0, color = $$props.color);
    	};

    	$$self.$capture_state = () => ({ color });

    	$$self.$inject_state = $$props => {
    		if ('color' in $$props) $$invalidate(0, color = $$props.color);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [color];
    }

    class Loader extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$t, create_fragment$v, safe_not_equal, { color: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Loader",
    			options,
    			id: create_fragment$v.name
    		});
    	}

    	get color() {
    		throw new Error("<Loader>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<Loader>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\menu\Recent.svelte generated by Svelte v3.49.0 */
    const file$q = "src\\components\\menu\\Recent.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[7] = list[i];
    	return child_ctx;
    }

    // (61:1) {:else}
    function create_else_block_1$1(ctx) {
    	let loader;
    	let current;

    	loader = new Loader({
    			props: { color: "#B7B9BC" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(loader.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(loader, target, anchor);
    			current = true;
    		},
    		p: noop$1,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(loader.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(loader.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(loader, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1$1.name,
    		type: "else",
    		source: "(61:1) {:else}",
    		ctx
    	});

    	return block;
    }

    // (36:1) {#if recents}
    function create_if_block$7(ctx) {
    	let if_block_anchor;

    	function select_block_type_1(ctx, dirty) {
    		if (/*recents*/ ctx[0].length) return create_if_block_1$4;
    		return create_else_block$4;
    	}

    	let current_block_type = select_block_type_1(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type_1(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$7.name,
    		type: "if",
    		source: "(36:1) {#if recents}",
    		ctx
    	});

    	return block;
    }

    // (56:2) {:else}
    function create_else_block$4(ctx) {
    	let span;

    	const block = {
    		c: function create() {
    			span = element("span");
    			span.textContent = "No recent files found yet!";
    			attr_dev(span, "class", "recents-list-fallback svelte-xakwss");
    			add_location(span, file$q, 56, 3, 1226);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    		},
    		p: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$4.name,
    		type: "else",
    		source: "(56:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (37:2) {#if recents.length}
    function create_if_block_1$4(ctx) {
    	let t0;
    	let li;
    	let button;
    	let t1;
    	let mounted;
    	let dispose;
    	let each_value = /*recents*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t0 = space();
    			li = element("li");
    			button = element("button");
    			t1 = text(/*resetText*/ ctx[1]);
    			attr_dev(button, "class", "svelte-xakwss");
    			add_location(button, file$q, 53, 4, 1149);
    			attr_dev(li, "class", "list-button svelte-xakwss");
    			add_location(li, file$q, 52, 3, 1119);
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, t0, anchor);
    			insert_dev(target, li, anchor);
    			append_dev(li, button);
    			append_dev(button, t1);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*handleReset*/ ctx[4], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*recents, ipcRenderer, dispatch*/ 13) {
    				each_value = /*recents*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(t0.parentNode, t0);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*resetText*/ 2) set_data_dev(t1, /*resetText*/ ctx[1]);
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(li);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$4.name,
    		type: "if",
    		source: "(37:2) {#if recents.length}",
    		ctx
    	});

    	return block;
    }

    // (38:3) {#each recents as item}
    function create_each_block$1(ctx) {
    	let li;
    	let a;
    	let t_value = /*item*/ ctx[7] + "";
    	let t;
    	let a_href_value;
    	let mounted;
    	let dispose;

    	function click_handler(...args) {
    		return /*click_handler*/ ctx[5](/*item*/ ctx[7], ...args);
    	}

    	const block = {
    		c: function create() {
    			li = element("li");
    			a = element("a");
    			t = text(t_value);
    			attr_dev(a, "class", "recents-list-item svelte-xakwss");
    			attr_dev(a, "href", a_href_value = /*item*/ ctx[7]);
    			add_location(a, file$q, 39, 5, 812);
    			attr_dev(li, "class", "svelte-xakwss");
    			add_location(li, file$q, 38, 4, 801);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, a);
    			append_dev(a, t);

    			if (!mounted) {
    				dispose = listen_dev(a, "click", click_handler, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*recents*/ 1 && t_value !== (t_value = /*item*/ ctx[7] + "")) set_data_dev(t, t_value);

    			if (dirty & /*recents*/ 1 && a_href_value !== (a_href_value = /*item*/ ctx[7])) {
    				attr_dev(a, "href", a_href_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(38:3) {#each recents as item}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$u(ctx) {
    	let ul;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	const if_block_creators = [create_if_block$7, create_else_block_1$1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*recents*/ ctx[0]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			ul = element("ul");
    			if_block.c();
    			attr_dev(ul, "class", "recents-list svelte-xakwss");
    			add_location(ul, file$q, 34, 0, 702);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, ul, anchor);
    			if_blocks[current_block_type_index].m(ul, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(ul, null);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(ul);
    			if_blocks[current_block_type_index].d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$u.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$s($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Recent', slots, []);
    	const { ipcRenderer } = require('electron');
    	const dispatch = createEventDispatcher();
    	let recents;
    	let resetConfirmed = false;
    	let resetText = "Clear";

    	function handleReset() {
    		if (!resetConfirmed) {
    			$$invalidate(1, resetText = "Are you sure?");
    			resetConfirmed = true;
    			return;
    		}

    		ipcRenderer.send('clearRecents');
    		resetConfirmed = false;
    		$$invalidate(1, resetText = "Clear");
    	}

    	ipcRenderer.on('recents', (event, arg) => {
    		$$invalidate(0, recents = arg);
    	});

    	onMount(async () => {
    		ipcRenderer.send('getRecents');
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Recent> was created with unknown prop '${key}'`);
    	});

    	const click_handler = (item, e) => {
    		e.preventDefault();
    		ipcRenderer.send('file', item);
    		ipcRenderer.send('loading', true);
    		dispatch('settingsOpen', false);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		onMount,
    		ipcRenderer,
    		Loader,
    		dispatch,
    		recents,
    		resetConfirmed,
    		resetText,
    		handleReset
    	});

    	$$self.$inject_state = $$props => {
    		if ('recents' in $$props) $$invalidate(0, recents = $$props.recents);
    		if ('resetConfirmed' in $$props) resetConfirmed = $$props.resetConfirmed;
    		if ('resetText' in $$props) $$invalidate(1, resetText = $$props.resetText);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [recents, resetText, ipcRenderer, dispatch, handleReset, click_handler];
    }

    class Recent extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$s, create_fragment$u, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Recent",
    			options,
    			id: create_fragment$u.name
    		});
    	}
    }

    function supressWarnings() {
      const origWarn = console.warn;

      console.warn = (message) => {
        if (message.includes('unknown prop')) return
        if (message.includes('unexpected slot')) return
        origWarn(message);
      };

      onMount(() => {
        console.warn = origWarn;
      });
    }

    /* node_modules\svelte-markdown\src\Parser.svelte generated by Svelte v3.49.0 */

    function get_each_context_5(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[18] = list[i];
    	return child_ctx;
    }

    function get_each_context_4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[18] = list[i];
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[10] = list[i];
    	return child_ctx;
    }

    function get_each_context_2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[13] = list[i];
    	child_ctx[15] = i;
    	return child_ctx;
    }

    function get_each_context_3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[16] = list[i];
    	child_ctx[15] = i;
    	return child_ctx;
    }

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[7] = list[i];
    	return child_ctx;
    }

    // (19:2) {#if renderers[type]}
    function create_if_block_1$3(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_2$3, create_if_block_3$3, create_else_block_1];
    	const if_blocks = [];

    	function select_block_type_1(ctx, dirty) {
    		if (/*type*/ ctx[0] === 'table') return 0;
    		if (/*type*/ ctx[0] === 'list') return 1;
    		return 2;
    	}

    	current_block_type_index = select_block_type_1(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type_1(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$3.name,
    		type: "if",
    		source: "(19:2) {#if renderers[type]}",
    		ctx
    	});

    	return block;
    }

    // (14:0) {#if !type}
    function create_if_block$6(ctx) {
    	let each_1_anchor;
    	let current;
    	let each_value = /*tokens*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*tokens, renderers*/ 34) {
    				each_value = /*tokens*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$6.name,
    		type: "if",
    		source: "(14:0) {#if !type}",
    		ctx
    	});

    	return block;
    }

    // (69:4) {:else}
    function create_else_block_1(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	const switch_instance_spread_levels = [/*$$restProps*/ ctx[6]];
    	var switch_value = /*renderers*/ ctx[5][/*type*/ ctx[0]];

    	function switch_props(ctx) {
    		let switch_instance_props = {
    			$$slots: { default: [create_default_slot_11] },
    			$$scope: { ctx }
    		};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props(ctx));
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = (dirty & /*$$restProps*/ 64)
    			? get_spread_update(switch_instance_spread_levels, [get_spread_object(/*$$restProps*/ ctx[6])])
    			: {};

    			if (dirty & /*$$scope, tokens, renderers, $$restProps*/ 8388706) {
    				switch_instance_changes.$$scope = { dirty, ctx };
    			}

    			if (switch_value !== (switch_value = /*renderers*/ ctx[5][/*type*/ ctx[0]])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props(ctx));
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1.name,
    		type: "else",
    		source: "(69:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (51:30) 
    function create_if_block_3$3(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_4$3, create_else_block$3];
    	const if_blocks = [];

    	function select_block_type_2(ctx, dirty) {
    		if (/*ordered*/ ctx[4]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type_2(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type_2(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$3.name,
    		type: "if",
    		source: "(51:30) ",
    		ctx
    	});

    	return block;
    }

    // (20:4) {#if type === 'table'}
    function create_if_block_2$3(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	var switch_value = /*renderers*/ ctx[5].table;

    	function switch_props(ctx) {
    		return {
    			props: {
    				$$slots: { default: [create_default_slot$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props(ctx));
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = {};

    			if (dirty & /*$$scope, renderers, rows, $$restProps, header*/ 8388716) {
    				switch_instance_changes.$$scope = { dirty, ctx };
    			}

    			if (switch_value !== (switch_value = /*renderers*/ ctx[5].table)) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props(ctx));
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$3.name,
    		type: "if",
    		source: "(20:4) {#if type === 'table'}",
    		ctx
    	});

    	return block;
    }

    // (73:8) {:else}
    function create_else_block_2(ctx) {
    	let t_value = /*$$restProps*/ ctx[6].raw + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$$restProps*/ 64 && t_value !== (t_value = /*$$restProps*/ ctx[6].raw + "")) set_data_dev(t, t_value);
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_2.name,
    		type: "else",
    		source: "(73:8) {:else}",
    		ctx
    	});

    	return block;
    }

    // (71:8) {#if tokens}
    function create_if_block_5$2(ctx) {
    	let parser;
    	let current;

    	parser = new Parser$1({
    			props: {
    				tokens: /*tokens*/ ctx[1],
    				renderers: /*renderers*/ ctx[5]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(parser.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(parser, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const parser_changes = {};
    			if (dirty & /*tokens*/ 2) parser_changes.tokens = /*tokens*/ ctx[1];
    			if (dirty & /*renderers*/ 32) parser_changes.renderers = /*renderers*/ ctx[5];
    			parser.$set(parser_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(parser.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(parser.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(parser, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5$2.name,
    		type: "if",
    		source: "(71:8) {#if tokens}",
    		ctx
    	});

    	return block;
    }

    // (70:6) <svelte:component this={renderers[type]} {...$$restProps}>
    function create_default_slot_11(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_5$2, create_else_block_2];
    	const if_blocks = [];

    	function select_block_type_3(ctx, dirty) {
    		if (/*tokens*/ ctx[1]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type_3(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type_3(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_11.name,
    		type: "slot",
    		source: "(70:6) <svelte:component this={renderers[type]} {...$$restProps}>",
    		ctx
    	});

    	return block;
    }

    // (60:6) {:else}
    function create_else_block$3(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	const switch_instance_spread_levels = [{ ordered: /*ordered*/ ctx[4] }, /*$$restProps*/ ctx[6]];
    	var switch_value = /*renderers*/ ctx[5].list;

    	function switch_props(ctx) {
    		let switch_instance_props = {
    			$$slots: { default: [create_default_slot_9] },
    			$$scope: { ctx }
    		};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props(ctx));
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = (dirty & /*ordered, $$restProps*/ 80)
    			? get_spread_update(switch_instance_spread_levels, [
    					dirty & /*ordered*/ 16 && { ordered: /*ordered*/ ctx[4] },
    					dirty & /*$$restProps*/ 64 && get_spread_object(/*$$restProps*/ ctx[6])
    				])
    			: {};

    			if (dirty & /*$$scope, $$restProps, renderers*/ 8388704) {
    				switch_instance_changes.$$scope = { dirty, ctx };
    			}

    			if (switch_value !== (switch_value = /*renderers*/ ctx[5].list)) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props(ctx));
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$3.name,
    		type: "else",
    		source: "(60:6) {:else}",
    		ctx
    	});

    	return block;
    }

    // (52:6) {#if ordered}
    function create_if_block_4$3(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	const switch_instance_spread_levels = [{ ordered: /*ordered*/ ctx[4] }, /*$$restProps*/ ctx[6]];
    	var switch_value = /*renderers*/ ctx[5].list;

    	function switch_props(ctx) {
    		let switch_instance_props = {
    			$$slots: { default: [create_default_slot_7] },
    			$$scope: { ctx }
    		};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props(ctx));
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = (dirty & /*ordered, $$restProps*/ 80)
    			? get_spread_update(switch_instance_spread_levels, [
    					dirty & /*ordered*/ 16 && { ordered: /*ordered*/ ctx[4] },
    					dirty & /*$$restProps*/ 64 && get_spread_object(/*$$restProps*/ ctx[6])
    				])
    			: {};

    			if (dirty & /*$$scope, $$restProps, renderers*/ 8388704) {
    				switch_instance_changes.$$scope = { dirty, ctx };
    			}

    			if (switch_value !== (switch_value = /*renderers*/ ctx[5].list)) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props(ctx));
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4$3.name,
    		type: "if",
    		source: "(52:6) {#if ordered}",
    		ctx
    	});

    	return block;
    }

    // (63:12) <svelte:component this={renderers.unorderedlistitem || renderers.listitem} {...item}>
    function create_default_slot_10(ctx) {
    	let parser;
    	let t;
    	let current;

    	parser = new Parser$1({
    			props: {
    				tokens: /*item*/ ctx[18].tokens,
    				renderers: /*renderers*/ ctx[5]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(parser.$$.fragment);
    			t = space();
    		},
    		m: function mount(target, anchor) {
    			mount_component(parser, target, anchor);
    			insert_dev(target, t, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const parser_changes = {};
    			if (dirty & /*$$restProps*/ 64) parser_changes.tokens = /*item*/ ctx[18].tokens;
    			if (dirty & /*renderers*/ 32) parser_changes.renderers = /*renderers*/ ctx[5];
    			parser.$set(parser_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(parser.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(parser.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(parser, detaching);
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_10.name,
    		type: "slot",
    		source: "(63:12) <svelte:component this={renderers.unorderedlistitem || renderers.listitem} {...item}>",
    		ctx
    	});

    	return block;
    }

    // (62:10) {#each $$restProps.items as item}
    function create_each_block_5(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	const switch_instance_spread_levels = [/*item*/ ctx[18]];
    	var switch_value = /*renderers*/ ctx[5].unorderedlistitem || /*renderers*/ ctx[5].listitem;

    	function switch_props(ctx) {
    		let switch_instance_props = {
    			$$slots: { default: [create_default_slot_10] },
    			$$scope: { ctx }
    		};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props(ctx));
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = (dirty & /*$$restProps*/ 64)
    			? get_spread_update(switch_instance_spread_levels, [get_spread_object(/*item*/ ctx[18])])
    			: {};

    			if (dirty & /*$$scope, $$restProps, renderers*/ 8388704) {
    				switch_instance_changes.$$scope = { dirty, ctx };
    			}

    			if (switch_value !== (switch_value = /*renderers*/ ctx[5].unorderedlistitem || /*renderers*/ ctx[5].listitem)) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props(ctx));
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_5.name,
    		type: "each",
    		source: "(62:10) {#each $$restProps.items as item}",
    		ctx
    	});

    	return block;
    }

    // (61:8) <svelte:component this={renderers.list} {ordered} {...$$restProps}>
    function create_default_slot_9(ctx) {
    	let each_1_anchor;
    	let current;
    	let each_value_5 = /*$$restProps*/ ctx[6].items;
    	validate_each_argument(each_value_5);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_5.length; i += 1) {
    		each_blocks[i] = create_each_block_5(get_each_context_5(ctx, each_value_5, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*renderers, $$restProps*/ 96) {
    				each_value_5 = /*$$restProps*/ ctx[6].items;
    				validate_each_argument(each_value_5);
    				let i;

    				for (i = 0; i < each_value_5.length; i += 1) {
    					const child_ctx = get_each_context_5(ctx, each_value_5, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block_5(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				group_outros();

    				for (i = each_value_5.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value_5.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_9.name,
    		type: "slot",
    		source: "(61:8) <svelte:component this={renderers.list} {ordered} {...$$restProps}>",
    		ctx
    	});

    	return block;
    }

    // (55:12) <svelte:component this={renderers.orderedlistitem || renderers.listitem} {...item}>
    function create_default_slot_8(ctx) {
    	let parser;
    	let t;
    	let current;

    	parser = new Parser$1({
    			props: {
    				tokens: /*item*/ ctx[18].tokens,
    				renderers: /*renderers*/ ctx[5]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(parser.$$.fragment);
    			t = space();
    		},
    		m: function mount(target, anchor) {
    			mount_component(parser, target, anchor);
    			insert_dev(target, t, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const parser_changes = {};
    			if (dirty & /*$$restProps*/ 64) parser_changes.tokens = /*item*/ ctx[18].tokens;
    			if (dirty & /*renderers*/ 32) parser_changes.renderers = /*renderers*/ ctx[5];
    			parser.$set(parser_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(parser.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(parser.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(parser, detaching);
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_8.name,
    		type: "slot",
    		source: "(55:12) <svelte:component this={renderers.orderedlistitem || renderers.listitem} {...item}>",
    		ctx
    	});

    	return block;
    }

    // (54:10) {#each $$restProps.items as item}
    function create_each_block_4(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	const switch_instance_spread_levels = [/*item*/ ctx[18]];
    	var switch_value = /*renderers*/ ctx[5].orderedlistitem || /*renderers*/ ctx[5].listitem;

    	function switch_props(ctx) {
    		let switch_instance_props = {
    			$$slots: { default: [create_default_slot_8] },
    			$$scope: { ctx }
    		};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props(ctx));
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = (dirty & /*$$restProps*/ 64)
    			? get_spread_update(switch_instance_spread_levels, [get_spread_object(/*item*/ ctx[18])])
    			: {};

    			if (dirty & /*$$scope, $$restProps, renderers*/ 8388704) {
    				switch_instance_changes.$$scope = { dirty, ctx };
    			}

    			if (switch_value !== (switch_value = /*renderers*/ ctx[5].orderedlistitem || /*renderers*/ ctx[5].listitem)) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props(ctx));
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_4.name,
    		type: "each",
    		source: "(54:10) {#each $$restProps.items as item}",
    		ctx
    	});

    	return block;
    }

    // (53:8) <svelte:component this={renderers.list} {ordered} {...$$restProps}>
    function create_default_slot_7(ctx) {
    	let each_1_anchor;
    	let current;
    	let each_value_4 = /*$$restProps*/ ctx[6].items;
    	validate_each_argument(each_value_4);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_4.length; i += 1) {
    		each_blocks[i] = create_each_block_4(get_each_context_4(ctx, each_value_4, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*renderers, $$restProps*/ 96) {
    				each_value_4 = /*$$restProps*/ ctx[6].items;
    				validate_each_argument(each_value_4);
    				let i;

    				for (i = 0; i < each_value_4.length; i += 1) {
    					const child_ctx = get_each_context_4(ctx, each_value_4, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block_4(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				group_outros();

    				for (i = each_value_4.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value_4.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_7.name,
    		type: "slot",
    		source: "(53:8) <svelte:component this={renderers.list} {ordered} {...$$restProps}>",
    		ctx
    	});

    	return block;
    }

    // (25:14) <svelte:component                 this={renderers.tablecell}                 header={true}                 align={$$restProps.align[i] || 'center'}                 >
    function create_default_slot_6(ctx) {
    	let parser;
    	let t;
    	let current;

    	parser = new Parser$1({
    			props: {
    				tokens: /*headerItem*/ ctx[16].tokens,
    				renderers: /*renderers*/ ctx[5]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(parser.$$.fragment);
    			t = space();
    		},
    		m: function mount(target, anchor) {
    			mount_component(parser, target, anchor);
    			insert_dev(target, t, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const parser_changes = {};
    			if (dirty & /*header*/ 4) parser_changes.tokens = /*headerItem*/ ctx[16].tokens;
    			if (dirty & /*renderers*/ 32) parser_changes.renderers = /*renderers*/ ctx[5];
    			parser.$set(parser_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(parser.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(parser.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(parser, detaching);
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_6.name,
    		type: "slot",
    		source: "(25:14) <svelte:component                 this={renderers.tablecell}                 header={true}                 align={$$restProps.align[i] || 'center'}                 >",
    		ctx
    	});

    	return block;
    }

    // (24:12) {#each header as headerItem, i}
    function create_each_block_3(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	var switch_value = /*renderers*/ ctx[5].tablecell;

    	function switch_props(ctx) {
    		return {
    			props: {
    				header: true,
    				align: /*$$restProps*/ ctx[6].align[/*i*/ ctx[15]] || 'center',
    				$$slots: { default: [create_default_slot_6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props(ctx));
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = {};
    			if (dirty & /*$$restProps*/ 64) switch_instance_changes.align = /*$$restProps*/ ctx[6].align[/*i*/ ctx[15]] || 'center';

    			if (dirty & /*$$scope, header, renderers*/ 8388644) {
    				switch_instance_changes.$$scope = { dirty, ctx };
    			}

    			if (switch_value !== (switch_value = /*renderers*/ ctx[5].tablecell)) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props(ctx));
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_3.name,
    		type: "each",
    		source: "(24:12) {#each header as headerItem, i}",
    		ctx
    	});

    	return block;
    }

    // (23:10) <svelte:component this={renderers.tablerow}>
    function create_default_slot_5(ctx) {
    	let each_1_anchor;
    	let current;
    	let each_value_3 = /*header*/ ctx[2];
    	validate_each_argument(each_value_3);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_3.length; i += 1) {
    		each_blocks[i] = create_each_block_3(get_each_context_3(ctx, each_value_3, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*renderers, $$restProps, header*/ 100) {
    				each_value_3 = /*header*/ ctx[2];
    				validate_each_argument(each_value_3);
    				let i;

    				for (i = 0; i < each_value_3.length; i += 1) {
    					const child_ctx = get_each_context_3(ctx, each_value_3, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block_3(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				group_outros();

    				for (i = each_value_3.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value_3.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_5.name,
    		type: "slot",
    		source: "(23:10) <svelte:component this={renderers.tablerow}>",
    		ctx
    	});

    	return block;
    }

    // (22:8) <svelte:component this={renderers.tablehead}>
    function create_default_slot_4(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	var switch_value = /*renderers*/ ctx[5].tablerow;

    	function switch_props(ctx) {
    		return {
    			props: {
    				$$slots: { default: [create_default_slot_5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props(ctx));
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = {};

    			if (dirty & /*$$scope, header, renderers, $$restProps*/ 8388708) {
    				switch_instance_changes.$$scope = { dirty, ctx };
    			}

    			if (switch_value !== (switch_value = /*renderers*/ ctx[5].tablerow)) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props(ctx));
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4.name,
    		type: "slot",
    		source: "(22:8) <svelte:component this={renderers.tablehead}>",
    		ctx
    	});

    	return block;
    }

    // (39:16) <svelte:component                   this={renderers.tablecell}                   header={false}                   align={$$restProps.align[i] || 'center'}                   >
    function create_default_slot_3(ctx) {
    	let parser;
    	let current;

    	parser = new Parser$1({
    			props: {
    				tokens: /*cells*/ ctx[13].tokens,
    				renderers: /*renderers*/ ctx[5]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(parser.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(parser, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const parser_changes = {};
    			if (dirty & /*rows*/ 8) parser_changes.tokens = /*cells*/ ctx[13].tokens;
    			if (dirty & /*renderers*/ 32) parser_changes.renderers = /*renderers*/ ctx[5];
    			parser.$set(parser_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(parser.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(parser.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(parser, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3.name,
    		type: "slot",
    		source: "(39:16) <svelte:component                   this={renderers.tablecell}                   header={false}                   align={$$restProps.align[i] || 'center'}                   >",
    		ctx
    	});

    	return block;
    }

    // (38:14) {#each row as cells, i}
    function create_each_block_2(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	var switch_value = /*renderers*/ ctx[5].tablecell;

    	function switch_props(ctx) {
    		return {
    			props: {
    				header: false,
    				align: /*$$restProps*/ ctx[6].align[/*i*/ ctx[15]] || 'center',
    				$$slots: { default: [create_default_slot_3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props(ctx));
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = {};
    			if (dirty & /*$$restProps*/ 64) switch_instance_changes.align = /*$$restProps*/ ctx[6].align[/*i*/ ctx[15]] || 'center';

    			if (dirty & /*$$scope, rows, renderers*/ 8388648) {
    				switch_instance_changes.$$scope = { dirty, ctx };
    			}

    			if (switch_value !== (switch_value = /*renderers*/ ctx[5].tablecell)) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props(ctx));
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2.name,
    		type: "each",
    		source: "(38:14) {#each row as cells, i}",
    		ctx
    	});

    	return block;
    }

    // (37:12) <svelte:component this={renderers.tablerow}>
    function create_default_slot_2(ctx) {
    	let t;
    	let current;
    	let each_value_2 = /*row*/ ctx[10];
    	validate_each_argument(each_value_2);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks[i] = create_each_block_2(get_each_context_2(ctx, each_value_2, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t = space();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, t, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*renderers, $$restProps, rows*/ 104) {
    				each_value_2 = /*row*/ ctx[10];
    				validate_each_argument(each_value_2);
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2(ctx, each_value_2, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block_2(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(t.parentNode, t);
    					}
    				}

    				group_outros();

    				for (i = each_value_2.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value_2.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2.name,
    		type: "slot",
    		source: "(37:12) <svelte:component this={renderers.tablerow}>",
    		ctx
    	});

    	return block;
    }

    // (36:10) {#each rows as row}
    function create_each_block_1(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	var switch_value = /*renderers*/ ctx[5].tablerow;

    	function switch_props(ctx) {
    		return {
    			props: {
    				$$slots: { default: [create_default_slot_2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props(ctx));
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = {};

    			if (dirty & /*$$scope, rows, renderers, $$restProps*/ 8388712) {
    				switch_instance_changes.$$scope = { dirty, ctx };
    			}

    			if (switch_value !== (switch_value = /*renderers*/ ctx[5].tablerow)) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props(ctx));
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(36:10) {#each rows as row}",
    		ctx
    	});

    	return block;
    }

    // (35:8) <svelte:component this={renderers.tablebody}>
    function create_default_slot_1$1(ctx) {
    	let each_1_anchor;
    	let current;
    	let each_value_1 = /*rows*/ ctx[3];
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*renderers, rows, $$restProps*/ 104) {
    				each_value_1 = /*rows*/ ctx[3];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block_1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				group_outros();

    				for (i = each_value_1.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value_1.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$1.name,
    		type: "slot",
    		source: "(35:8) <svelte:component this={renderers.tablebody}>",
    		ctx
    	});

    	return block;
    }

    // (21:6) <svelte:component this={renderers.table}>
    function create_default_slot$1(ctx) {
    	let switch_instance0;
    	let t;
    	let switch_instance1;
    	let switch_instance1_anchor;
    	let current;
    	var switch_value = /*renderers*/ ctx[5].tablehead;

    	function switch_props(ctx) {
    		return {
    			props: {
    				$$slots: { default: [create_default_slot_4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance0 = new switch_value(switch_props(ctx));
    	}

    	var switch_value_1 = /*renderers*/ ctx[5].tablebody;

    	function switch_props_1(ctx) {
    		return {
    			props: {
    				$$slots: { default: [create_default_slot_1$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		};
    	}

    	if (switch_value_1) {
    		switch_instance1 = new switch_value_1(switch_props_1(ctx));
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance0) create_component(switch_instance0.$$.fragment);
    			t = space();
    			if (switch_instance1) create_component(switch_instance1.$$.fragment);
    			switch_instance1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance0) {
    				mount_component(switch_instance0, target, anchor);
    			}

    			insert_dev(target, t, anchor);

    			if (switch_instance1) {
    				mount_component(switch_instance1, target, anchor);
    			}

    			insert_dev(target, switch_instance1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance0_changes = {};

    			if (dirty & /*$$scope, renderers, header, $$restProps*/ 8388708) {
    				switch_instance0_changes.$$scope = { dirty, ctx };
    			}

    			if (switch_value !== (switch_value = /*renderers*/ ctx[5].tablehead)) {
    				if (switch_instance0) {
    					group_outros();
    					const old_component = switch_instance0;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance0 = new switch_value(switch_props(ctx));
    					create_component(switch_instance0.$$.fragment);
    					transition_in(switch_instance0.$$.fragment, 1);
    					mount_component(switch_instance0, t.parentNode, t);
    				} else {
    					switch_instance0 = null;
    				}
    			} else if (switch_value) {
    				switch_instance0.$set(switch_instance0_changes);
    			}

    			const switch_instance1_changes = {};

    			if (dirty & /*$$scope, rows, renderers, $$restProps*/ 8388712) {
    				switch_instance1_changes.$$scope = { dirty, ctx };
    			}

    			if (switch_value_1 !== (switch_value_1 = /*renderers*/ ctx[5].tablebody)) {
    				if (switch_instance1) {
    					group_outros();
    					const old_component = switch_instance1;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value_1) {
    					switch_instance1 = new switch_value_1(switch_props_1(ctx));
    					create_component(switch_instance1.$$.fragment);
    					transition_in(switch_instance1.$$.fragment, 1);
    					mount_component(switch_instance1, switch_instance1_anchor.parentNode, switch_instance1_anchor);
    				} else {
    					switch_instance1 = null;
    				}
    			} else if (switch_value_1) {
    				switch_instance1.$set(switch_instance1_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance0) transition_in(switch_instance0.$$.fragment, local);
    			if (switch_instance1) transition_in(switch_instance1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance0) transition_out(switch_instance0.$$.fragment, local);
    			if (switch_instance1) transition_out(switch_instance1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (switch_instance0) destroy_component(switch_instance0, detaching);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(switch_instance1_anchor);
    			if (switch_instance1) destroy_component(switch_instance1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(21:6) <svelte:component this={renderers.table}>",
    		ctx
    	});

    	return block;
    }

    // (15:2) {#each tokens as token}
    function create_each_block(ctx) {
    	let parser;
    	let current;
    	const parser_spread_levels = [/*token*/ ctx[7], { renderers: /*renderers*/ ctx[5] }];
    	let parser_props = {};

    	for (let i = 0; i < parser_spread_levels.length; i += 1) {
    		parser_props = assign(parser_props, parser_spread_levels[i]);
    	}

    	parser = new Parser$1({ props: parser_props, $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(parser.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(parser, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const parser_changes = (dirty & /*tokens, renderers*/ 34)
    			? get_spread_update(parser_spread_levels, [
    					dirty & /*tokens*/ 2 && get_spread_object(/*token*/ ctx[7]),
    					dirty & /*renderers*/ 32 && { renderers: /*renderers*/ ctx[5] }
    				])
    			: {};

    			parser.$set(parser_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(parser.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(parser.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(parser, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(15:2) {#each tokens as token}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$t(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$6, create_if_block_1$3];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (!/*type*/ ctx[0]) return 0;
    		if (/*renderers*/ ctx[5][/*type*/ ctx[0]]) return 1;
    		return -1;
    	}

    	if (~(current_block_type_index = select_block_type(ctx))) {
    		if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	}

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].m(target, anchor);
    			}

    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if (~current_block_type_index) {
    					if_blocks[current_block_type_index].p(ctx, dirty);
    				}
    			} else {
    				if (if_block) {
    					group_outros();

    					transition_out(if_blocks[previous_block_index], 1, 1, () => {
    						if_blocks[previous_block_index] = null;
    					});

    					check_outros();
    				}

    				if (~current_block_type_index) {
    					if_block = if_blocks[current_block_type_index];

    					if (!if_block) {
    						if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    						if_block.c();
    					} else {
    						if_block.p(ctx, dirty);
    					}

    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				} else {
    					if_block = null;
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].d(detaching);
    			}

    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$t.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$r($$self, $$props, $$invalidate) {
    	const omit_props_names = ["type","tokens","header","rows","ordered","renderers"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Parser', slots, []);
    	let { type = undefined } = $$props;
    	let { tokens = undefined } = $$props;
    	let { header = undefined } = $$props;
    	let { rows = undefined } = $$props;
    	let { ordered = false } = $$props;
    	let { renderers } = $$props;
    	supressWarnings();

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(6, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('type' in $$new_props) $$invalidate(0, type = $$new_props.type);
    		if ('tokens' in $$new_props) $$invalidate(1, tokens = $$new_props.tokens);
    		if ('header' in $$new_props) $$invalidate(2, header = $$new_props.header);
    		if ('rows' in $$new_props) $$invalidate(3, rows = $$new_props.rows);
    		if ('ordered' in $$new_props) $$invalidate(4, ordered = $$new_props.ordered);
    		if ('renderers' in $$new_props) $$invalidate(5, renderers = $$new_props.renderers);
    	};

    	$$self.$capture_state = () => ({
    		supressWarnings,
    		type,
    		tokens,
    		header,
    		rows,
    		ordered,
    		renderers
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('type' in $$props) $$invalidate(0, type = $$new_props.type);
    		if ('tokens' in $$props) $$invalidate(1, tokens = $$new_props.tokens);
    		if ('header' in $$props) $$invalidate(2, header = $$new_props.header);
    		if ('rows' in $$props) $$invalidate(3, rows = $$new_props.rows);
    		if ('ordered' in $$props) $$invalidate(4, ordered = $$new_props.ordered);
    		if ('renderers' in $$props) $$invalidate(5, renderers = $$new_props.renderers);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [type, tokens, header, rows, ordered, renderers, $$restProps];
    }

    class Parser$1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$r, create_fragment$t, safe_not_equal, {
    			type: 0,
    			tokens: 1,
    			header: 2,
    			rows: 3,
    			ordered: 4,
    			renderers: 5
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Parser",
    			options,
    			id: create_fragment$t.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*renderers*/ ctx[5] === undefined && !('renderers' in props)) {
    			console.warn("<Parser> was created without expected prop 'renderers'");
    		}
    	}

    	get type() {
    		throw new Error("<Parser>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set type(value) {
    		throw new Error("<Parser>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get tokens() {
    		throw new Error("<Parser>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tokens(value) {
    		throw new Error("<Parser>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get header() {
    		throw new Error("<Parser>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set header(value) {
    		throw new Error("<Parser>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get rows() {
    		throw new Error("<Parser>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set rows(value) {
    		throw new Error("<Parser>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ordered() {
    		throw new Error("<Parser>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ordered(value) {
    		throw new Error("<Parser>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get renderers() {
    		throw new Error("<Parser>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set renderers(value) {
    		throw new Error("<Parser>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /**
     * marked - a markdown parser
     * Copyright (c) 2011-2022, Christopher Jeffrey. (MIT Licensed)
     * https://github.com/markedjs/marked
     */

    /**
     * DO NOT EDIT THIS FILE
     * The code in this file is generated from files in ./src/
     */

    function getDefaults() {
      return {
        baseUrl: null,
        breaks: false,
        extensions: null,
        gfm: true,
        headerIds: true,
        headerPrefix: '',
        highlight: null,
        langPrefix: 'language-',
        mangle: true,
        pedantic: false,
        renderer: null,
        sanitize: false,
        sanitizer: null,
        silent: false,
        smartLists: false,
        smartypants: false,
        tokenizer: null,
        walkTokens: null,
        xhtml: false
      };
    }

    let defaults = getDefaults();

    /**
     * Helpers
     */
    const escapeTest = /[&<>"']/;
    const escapeReplace = /[&<>"']/g;
    const escapeTestNoEncode = /[<>"']|&(?!#?\w+;)/;
    const escapeReplaceNoEncode = /[<>"']|&(?!#?\w+;)/g;
    const escapeReplacements = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    };
    const getEscapeReplacement = (ch) => escapeReplacements[ch];
    function escape(html, encode) {
      if (encode) {
        if (escapeTest.test(html)) {
          return html.replace(escapeReplace, getEscapeReplacement);
        }
      } else {
        if (escapeTestNoEncode.test(html)) {
          return html.replace(escapeReplaceNoEncode, getEscapeReplacement);
        }
      }

      return html;
    }

    const unescapeTest = /&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig;

    /**
     * @param {string} html
     */
    function unescape(html) {
      // explicitly match decimal, hex, and named HTML entities
      return html.replace(unescapeTest, (_, n) => {
        n = n.toLowerCase();
        if (n === 'colon') return ':';
        if (n.charAt(0) === '#') {
          return n.charAt(1) === 'x'
            ? String.fromCharCode(parseInt(n.substring(2), 16))
            : String.fromCharCode(+n.substring(1));
        }
        return '';
      });
    }

    const caret = /(^|[^\[])\^/g;

    /**
     * @param {string | RegExp} regex
     * @param {string} opt
     */
    function edit(regex, opt) {
      regex = typeof regex === 'string' ? regex : regex.source;
      opt = opt || '';
      const obj = {
        replace: (name, val) => {
          val = val.source || val;
          val = val.replace(caret, '$1');
          regex = regex.replace(name, val);
          return obj;
        },
        getRegex: () => {
          return new RegExp(regex, opt);
        }
      };
      return obj;
    }

    const nonWordAndColonTest = /[^\w:]/g;
    const originIndependentUrl = /^$|^[a-z][a-z0-9+.-]*:|^[?#]/i;

    /**
     * @param {boolean} sanitize
     * @param {string} base
     * @param {string} href
     */
    function cleanUrl(sanitize, base, href) {
      if (sanitize) {
        let prot;
        try {
          prot = decodeURIComponent(unescape(href))
            .replace(nonWordAndColonTest, '')
            .toLowerCase();
        } catch (e) {
          return null;
        }
        if (prot.indexOf('javascript:') === 0 || prot.indexOf('vbscript:') === 0 || prot.indexOf('data:') === 0) {
          return null;
        }
      }
      if (base && !originIndependentUrl.test(href)) {
        href = resolveUrl(base, href);
      }
      try {
        href = encodeURI(href).replace(/%25/g, '%');
      } catch (e) {
        return null;
      }
      return href;
    }

    const baseUrls = {};
    const justDomain = /^[^:]+:\/*[^/]*$/;
    const protocol = /^([^:]+:)[\s\S]*$/;
    const domain = /^([^:]+:\/*[^/]*)[\s\S]*$/;

    /**
     * @param {string} base
     * @param {string} href
     */
    function resolveUrl(base, href) {
      if (!baseUrls[' ' + base]) {
        // we can ignore everything in base after the last slash of its path component,
        // but we might need to add _that_
        // https://tools.ietf.org/html/rfc3986#section-3
        if (justDomain.test(base)) {
          baseUrls[' ' + base] = base + '/';
        } else {
          baseUrls[' ' + base] = rtrim(base, '/', true);
        }
      }
      base = baseUrls[' ' + base];
      const relativeBase = base.indexOf(':') === -1;

      if (href.substring(0, 2) === '//') {
        if (relativeBase) {
          return href;
        }
        return base.replace(protocol, '$1') + href;
      } else if (href.charAt(0) === '/') {
        if (relativeBase) {
          return href;
        }
        return base.replace(domain, '$1') + href;
      } else {
        return base + href;
      }
    }

    const noopTest = { exec: function noopTest() {} };

    function merge(obj) {
      let i = 1,
        target,
        key;

      for (; i < arguments.length; i++) {
        target = arguments[i];
        for (key in target) {
          if (Object.prototype.hasOwnProperty.call(target, key)) {
            obj[key] = target[key];
          }
        }
      }

      return obj;
    }

    function splitCells(tableRow, count) {
      // ensure that every cell-delimiting pipe has a space
      // before it to distinguish it from an escaped pipe
      const row = tableRow.replace(/\|/g, (match, offset, str) => {
          let escaped = false,
            curr = offset;
          while (--curr >= 0 && str[curr] === '\\') escaped = !escaped;
          if (escaped) {
            // odd number of slashes means | is escaped
            // so we leave it alone
            return '|';
          } else {
            // add space before unescaped |
            return ' |';
          }
        }),
        cells = row.split(/ \|/);
      let i = 0;

      // First/last cell in a row cannot be empty if it has no leading/trailing pipe
      if (!cells[0].trim()) { cells.shift(); }
      if (cells.length > 0 && !cells[cells.length - 1].trim()) { cells.pop(); }

      if (cells.length > count) {
        cells.splice(count);
      } else {
        while (cells.length < count) cells.push('');
      }

      for (; i < cells.length; i++) {
        // leading or trailing whitespace is ignored per the gfm spec
        cells[i] = cells[i].trim().replace(/\\\|/g, '|');
      }
      return cells;
    }

    /**
     * Remove trailing 'c's. Equivalent to str.replace(/c*$/, '').
     * /c*$/ is vulnerable to REDOS.
     *
     * @param {string} str
     * @param {string} c
     * @param {boolean} invert Remove suffix of non-c chars instead. Default falsey.
     */
    function rtrim(str, c, invert) {
      const l = str.length;
      if (l === 0) {
        return '';
      }

      // Length of suffix matching the invert condition.
      let suffLen = 0;

      // Step left until we fail to match the invert condition.
      while (suffLen < l) {
        const currChar = str.charAt(l - suffLen - 1);
        if (currChar === c && !invert) {
          suffLen++;
        } else if (currChar !== c && invert) {
          suffLen++;
        } else {
          break;
        }
      }

      return str.slice(0, l - suffLen);
    }

    function findClosingBracket(str, b) {
      if (str.indexOf(b[1]) === -1) {
        return -1;
      }
      const l = str.length;
      let level = 0,
        i = 0;
      for (; i < l; i++) {
        if (str[i] === '\\') {
          i++;
        } else if (str[i] === b[0]) {
          level++;
        } else if (str[i] === b[1]) {
          level--;
          if (level < 0) {
            return i;
          }
        }
      }
      return -1;
    }

    // copied from https://stackoverflow.com/a/5450113/806777
    /**
     * @param {string} pattern
     * @param {number} count
     */
    function repeatString(pattern, count) {
      if (count < 1) {
        return '';
      }
      let result = '';
      while (count > 1) {
        if (count & 1) {
          result += pattern;
        }
        count >>= 1;
        pattern += pattern;
      }
      return result + pattern;
    }

    function outputLink(cap, link, raw, lexer) {
      const href = link.href;
      const title = link.title ? escape(link.title) : null;
      const text = cap[1].replace(/\\([\[\]])/g, '$1');

      if (cap[0].charAt(0) !== '!') {
        lexer.state.inLink = true;
        const token = {
          type: 'link',
          raw,
          href,
          title,
          text,
          tokens: lexer.inlineTokens(text, [])
        };
        lexer.state.inLink = false;
        return token;
      }
      return {
        type: 'image',
        raw,
        href,
        title,
        text: escape(text)
      };
    }

    function indentCodeCompensation(raw, text) {
      const matchIndentToCode = raw.match(/^(\s+)(?:```)/);

      if (matchIndentToCode === null) {
        return text;
      }

      const indentToCode = matchIndentToCode[1];

      return text
        .split('\n')
        .map(node => {
          const matchIndentInNode = node.match(/^\s+/);
          if (matchIndentInNode === null) {
            return node;
          }

          const [indentInNode] = matchIndentInNode;

          if (indentInNode.length >= indentToCode.length) {
            return node.slice(indentToCode.length);
          }

          return node;
        })
        .join('\n');
    }

    /**
     * Tokenizer
     */
    class Tokenizer {
      constructor(options) {
        this.options = options || defaults;
      }

      space(src) {
        const cap = this.rules.block.newline.exec(src);
        if (cap && cap[0].length > 0) {
          return {
            type: 'space',
            raw: cap[0]
          };
        }
      }

      code(src) {
        const cap = this.rules.block.code.exec(src);
        if (cap) {
          const text = cap[0].replace(/^ {1,4}/gm, '');
          return {
            type: 'code',
            raw: cap[0],
            codeBlockStyle: 'indented',
            text: !this.options.pedantic
              ? rtrim(text, '\n')
              : text
          };
        }
      }

      fences(src) {
        const cap = this.rules.block.fences.exec(src);
        if (cap) {
          const raw = cap[0];
          const text = indentCodeCompensation(raw, cap[3] || '');

          return {
            type: 'code',
            raw,
            lang: cap[2] ? cap[2].trim() : cap[2],
            text
          };
        }
      }

      heading(src) {
        const cap = this.rules.block.heading.exec(src);
        if (cap) {
          let text = cap[2].trim();

          // remove trailing #s
          if (/#$/.test(text)) {
            const trimmed = rtrim(text, '#');
            if (this.options.pedantic) {
              text = trimmed.trim();
            } else if (!trimmed || / $/.test(trimmed)) {
              // CommonMark requires space before trailing #s
              text = trimmed.trim();
            }
          }

          const token = {
            type: 'heading',
            raw: cap[0],
            depth: cap[1].length,
            text,
            tokens: []
          };
          this.lexer.inline(token.text, token.tokens);
          return token;
        }
      }

      hr(src) {
        const cap = this.rules.block.hr.exec(src);
        if (cap) {
          return {
            type: 'hr',
            raw: cap[0]
          };
        }
      }

      blockquote(src) {
        const cap = this.rules.block.blockquote.exec(src);
        if (cap) {
          const text = cap[0].replace(/^ *>[ \t]?/gm, '');

          return {
            type: 'blockquote',
            raw: cap[0],
            tokens: this.lexer.blockTokens(text, []),
            text
          };
        }
      }

      list(src) {
        let cap = this.rules.block.list.exec(src);
        if (cap) {
          let raw, istask, ischecked, indent, i, blankLine, endsWithBlankLine,
            line, nextLine, rawLine, itemContents, endEarly;

          let bull = cap[1].trim();
          const isordered = bull.length > 1;

          const list = {
            type: 'list',
            raw: '',
            ordered: isordered,
            start: isordered ? +bull.slice(0, -1) : '',
            loose: false,
            items: []
          };

          bull = isordered ? `\\d{1,9}\\${bull.slice(-1)}` : `\\${bull}`;

          if (this.options.pedantic) {
            bull = isordered ? bull : '[*+-]';
          }

          // Get next list item
          const itemRegex = new RegExp(`^( {0,3}${bull})((?:[\t ][^\\n]*)?(?:\\n|$))`);

          // Check if current bullet point can start a new List Item
          while (src) {
            endEarly = false;
            if (!(cap = itemRegex.exec(src))) {
              break;
            }

            if (this.rules.block.hr.test(src)) { // End list if bullet was actually HR (possibly move into itemRegex?)
              break;
            }

            raw = cap[0];
            src = src.substring(raw.length);

            line = cap[2].split('\n', 1)[0];
            nextLine = src.split('\n', 1)[0];

            if (this.options.pedantic) {
              indent = 2;
              itemContents = line.trimLeft();
            } else {
              indent = cap[2].search(/[^ ]/); // Find first non-space char
              indent = indent > 4 ? 1 : indent; // Treat indented code blocks (> 4 spaces) as having only 1 indent
              itemContents = line.slice(indent);
              indent += cap[1].length;
            }

            blankLine = false;

            if (!line && /^ *$/.test(nextLine)) { // Items begin with at most one blank line
              raw += nextLine + '\n';
              src = src.substring(nextLine.length + 1);
              endEarly = true;
            }

            if (!endEarly) {
              const nextBulletRegex = new RegExp(`^ {0,${Math.min(3, indent - 1)}}(?:[*+-]|\\d{1,9}[.)])((?: [^\\n]*)?(?:\\n|$))`);
              const hrRegex = new RegExp(`^ {0,${Math.min(3, indent - 1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`);
              const fencesBeginRegex = new RegExp(`^ {0,${Math.min(3, indent - 1)}}(?:\`\`\`|~~~)`);
              const headingBeginRegex = new RegExp(`^ {0,${Math.min(3, indent - 1)}}#`);

              // Check if following lines should be included in List Item
              while (src) {
                rawLine = src.split('\n', 1)[0];
                line = rawLine;

                // Re-align to follow commonmark nesting rules
                if (this.options.pedantic) {
                  line = line.replace(/^ {1,4}(?=( {4})*[^ ])/g, '  ');
                }

                // End list item if found code fences
                if (fencesBeginRegex.test(line)) {
                  break;
                }

                // End list item if found start of new heading
                if (headingBeginRegex.test(line)) {
                  break;
                }

                // End list item if found start of new bullet
                if (nextBulletRegex.test(line)) {
                  break;
                }

                // Horizontal rule found
                if (hrRegex.test(src)) {
                  break;
                }

                if (line.search(/[^ ]/) >= indent || !line.trim()) { // Dedent if possible
                  itemContents += '\n' + line.slice(indent);
                } else if (!blankLine) { // Until blank line, item doesn't need indentation
                  itemContents += '\n' + line;
                } else { // Otherwise, improper indentation ends this item
                  break;
                }

                if (!blankLine && !line.trim()) { // Check if current line is blank
                  blankLine = true;
                }

                raw += rawLine + '\n';
                src = src.substring(rawLine.length + 1);
              }
            }

            if (!list.loose) {
              // If the previous item ended with a blank line, the list is loose
              if (endsWithBlankLine) {
                list.loose = true;
              } else if (/\n *\n *$/.test(raw)) {
                endsWithBlankLine = true;
              }
            }

            // Check for task list items
            if (this.options.gfm) {
              istask = /^\[[ xX]\] /.exec(itemContents);
              if (istask) {
                ischecked = istask[0] !== '[ ] ';
                itemContents = itemContents.replace(/^\[[ xX]\] +/, '');
              }
            }

            list.items.push({
              type: 'list_item',
              raw,
              task: !!istask,
              checked: ischecked,
              loose: false,
              text: itemContents
            });

            list.raw += raw;
          }

          // Do not consume newlines at end of final item. Alternatively, make itemRegex *start* with any newlines to simplify/speed up endsWithBlankLine logic
          list.items[list.items.length - 1].raw = raw.trimRight();
          list.items[list.items.length - 1].text = itemContents.trimRight();
          list.raw = list.raw.trimRight();

          const l = list.items.length;

          // Item child tokens handled here at end because we needed to have the final item to trim it first
          for (i = 0; i < l; i++) {
            this.lexer.state.top = false;
            list.items[i].tokens = this.lexer.blockTokens(list.items[i].text, []);
            const spacers = list.items[i].tokens.filter(t => t.type === 'space');
            const hasMultipleLineBreaks = spacers.every(t => {
              const chars = t.raw.split('');
              let lineBreaks = 0;
              for (const char of chars) {
                if (char === '\n') {
                  lineBreaks += 1;
                }
                if (lineBreaks > 1) {
                  return true;
                }
              }

              return false;
            });

            if (!list.loose && spacers.length && hasMultipleLineBreaks) {
              // Having a single line break doesn't mean a list is loose. A single line break is terminating the last list item
              list.loose = true;
              list.items[i].loose = true;
            }
          }

          return list;
        }
      }

      html(src) {
        const cap = this.rules.block.html.exec(src);
        if (cap) {
          const token = {
            type: 'html',
            raw: cap[0],
            pre: !this.options.sanitizer
              && (cap[1] === 'pre' || cap[1] === 'script' || cap[1] === 'style'),
            text: cap[0]
          };
          if (this.options.sanitize) {
            token.type = 'paragraph';
            token.text = this.options.sanitizer ? this.options.sanitizer(cap[0]) : escape(cap[0]);
            token.tokens = [];
            this.lexer.inline(token.text, token.tokens);
          }
          return token;
        }
      }

      def(src) {
        const cap = this.rules.block.def.exec(src);
        if (cap) {
          if (cap[3]) cap[3] = cap[3].substring(1, cap[3].length - 1);
          const tag = cap[1].toLowerCase().replace(/\s+/g, ' ');
          return {
            type: 'def',
            tag,
            raw: cap[0],
            href: cap[2],
            title: cap[3]
          };
        }
      }

      table(src) {
        const cap = this.rules.block.table.exec(src);
        if (cap) {
          const item = {
            type: 'table',
            header: splitCells(cap[1]).map(c => { return { text: c }; }),
            align: cap[2].replace(/^ *|\| *$/g, '').split(/ *\| */),
            rows: cap[3] && cap[3].trim() ? cap[3].replace(/\n[ \t]*$/, '').split('\n') : []
          };

          if (item.header.length === item.align.length) {
            item.raw = cap[0];

            let l = item.align.length;
            let i, j, k, row;
            for (i = 0; i < l; i++) {
              if (/^ *-+: *$/.test(item.align[i])) {
                item.align[i] = 'right';
              } else if (/^ *:-+: *$/.test(item.align[i])) {
                item.align[i] = 'center';
              } else if (/^ *:-+ *$/.test(item.align[i])) {
                item.align[i] = 'left';
              } else {
                item.align[i] = null;
              }
            }

            l = item.rows.length;
            for (i = 0; i < l; i++) {
              item.rows[i] = splitCells(item.rows[i], item.header.length).map(c => { return { text: c }; });
            }

            // parse child tokens inside headers and cells

            // header child tokens
            l = item.header.length;
            for (j = 0; j < l; j++) {
              item.header[j].tokens = [];
              this.lexer.inline(item.header[j].text, item.header[j].tokens);
            }

            // cell child tokens
            l = item.rows.length;
            for (j = 0; j < l; j++) {
              row = item.rows[j];
              for (k = 0; k < row.length; k++) {
                row[k].tokens = [];
                this.lexer.inline(row[k].text, row[k].tokens);
              }
            }

            return item;
          }
        }
      }

      lheading(src) {
        const cap = this.rules.block.lheading.exec(src);
        if (cap) {
          const token = {
            type: 'heading',
            raw: cap[0],
            depth: cap[2].charAt(0) === '=' ? 1 : 2,
            text: cap[1],
            tokens: []
          };
          this.lexer.inline(token.text, token.tokens);
          return token;
        }
      }

      paragraph(src) {
        const cap = this.rules.block.paragraph.exec(src);
        if (cap) {
          const token = {
            type: 'paragraph',
            raw: cap[0],
            text: cap[1].charAt(cap[1].length - 1) === '\n'
              ? cap[1].slice(0, -1)
              : cap[1],
            tokens: []
          };
          this.lexer.inline(token.text, token.tokens);
          return token;
        }
      }

      text(src) {
        const cap = this.rules.block.text.exec(src);
        if (cap) {
          const token = {
            type: 'text',
            raw: cap[0],
            text: cap[0],
            tokens: []
          };
          this.lexer.inline(token.text, token.tokens);
          return token;
        }
      }

      escape(src) {
        const cap = this.rules.inline.escape.exec(src);
        if (cap) {
          return {
            type: 'escape',
            raw: cap[0],
            text: escape(cap[1])
          };
        }
      }

      tag(src) {
        const cap = this.rules.inline.tag.exec(src);
        if (cap) {
          if (!this.lexer.state.inLink && /^<a /i.test(cap[0])) {
            this.lexer.state.inLink = true;
          } else if (this.lexer.state.inLink && /^<\/a>/i.test(cap[0])) {
            this.lexer.state.inLink = false;
          }
          if (!this.lexer.state.inRawBlock && /^<(pre|code|kbd|script)(\s|>)/i.test(cap[0])) {
            this.lexer.state.inRawBlock = true;
          } else if (this.lexer.state.inRawBlock && /^<\/(pre|code|kbd|script)(\s|>)/i.test(cap[0])) {
            this.lexer.state.inRawBlock = false;
          }

          return {
            type: this.options.sanitize
              ? 'text'
              : 'html',
            raw: cap[0],
            inLink: this.lexer.state.inLink,
            inRawBlock: this.lexer.state.inRawBlock,
            text: this.options.sanitize
              ? (this.options.sanitizer
                ? this.options.sanitizer(cap[0])
                : escape(cap[0]))
              : cap[0]
          };
        }
      }

      link(src) {
        const cap = this.rules.inline.link.exec(src);
        if (cap) {
          const trimmedUrl = cap[2].trim();
          if (!this.options.pedantic && /^</.test(trimmedUrl)) {
            // commonmark requires matching angle brackets
            if (!(/>$/.test(trimmedUrl))) {
              return;
            }

            // ending angle bracket cannot be escaped
            const rtrimSlash = rtrim(trimmedUrl.slice(0, -1), '\\');
            if ((trimmedUrl.length - rtrimSlash.length) % 2 === 0) {
              return;
            }
          } else {
            // find closing parenthesis
            const lastParenIndex = findClosingBracket(cap[2], '()');
            if (lastParenIndex > -1) {
              const start = cap[0].indexOf('!') === 0 ? 5 : 4;
              const linkLen = start + cap[1].length + lastParenIndex;
              cap[2] = cap[2].substring(0, lastParenIndex);
              cap[0] = cap[0].substring(0, linkLen).trim();
              cap[3] = '';
            }
          }
          let href = cap[2];
          let title = '';
          if (this.options.pedantic) {
            // split pedantic href and title
            const link = /^([^'"]*[^\s])\s+(['"])(.*)\2/.exec(href);

            if (link) {
              href = link[1];
              title = link[3];
            }
          } else {
            title = cap[3] ? cap[3].slice(1, -1) : '';
          }

          href = href.trim();
          if (/^</.test(href)) {
            if (this.options.pedantic && !(/>$/.test(trimmedUrl))) {
              // pedantic allows starting angle bracket without ending angle bracket
              href = href.slice(1);
            } else {
              href = href.slice(1, -1);
            }
          }
          return outputLink(cap, {
            href: href ? href.replace(this.rules.inline._escapes, '$1') : href,
            title: title ? title.replace(this.rules.inline._escapes, '$1') : title
          }, cap[0], this.lexer);
        }
      }

      reflink(src, links) {
        let cap;
        if ((cap = this.rules.inline.reflink.exec(src))
            || (cap = this.rules.inline.nolink.exec(src))) {
          let link = (cap[2] || cap[1]).replace(/\s+/g, ' ');
          link = links[link.toLowerCase()];
          if (!link || !link.href) {
            const text = cap[0].charAt(0);
            return {
              type: 'text',
              raw: text,
              text
            };
          }
          return outputLink(cap, link, cap[0], this.lexer);
        }
      }

      emStrong(src, maskedSrc, prevChar = '') {
        let match = this.rules.inline.emStrong.lDelim.exec(src);
        if (!match) return;

        // _ can't be between two alphanumerics. \p{L}\p{N} includes non-english alphabet/numbers as well
        if (match[3] && prevChar.match(/[\p{L}\p{N}]/u)) return;

        const nextChar = match[1] || match[2] || '';

        if (!nextChar || (nextChar && (prevChar === '' || this.rules.inline.punctuation.exec(prevChar)))) {
          const lLength = match[0].length - 1;
          let rDelim, rLength, delimTotal = lLength, midDelimTotal = 0;

          const endReg = match[0][0] === '*' ? this.rules.inline.emStrong.rDelimAst : this.rules.inline.emStrong.rDelimUnd;
          endReg.lastIndex = 0;

          // Clip maskedSrc to same section of string as src (move to lexer?)
          maskedSrc = maskedSrc.slice(-1 * src.length + lLength);

          while ((match = endReg.exec(maskedSrc)) != null) {
            rDelim = match[1] || match[2] || match[3] || match[4] || match[5] || match[6];

            if (!rDelim) continue; // skip single * in __abc*abc__

            rLength = rDelim.length;

            if (match[3] || match[4]) { // found another Left Delim
              delimTotal += rLength;
              continue;
            } else if (match[5] || match[6]) { // either Left or Right Delim
              if (lLength % 3 && !((lLength + rLength) % 3)) {
                midDelimTotal += rLength;
                continue; // CommonMark Emphasis Rules 9-10
              }
            }

            delimTotal -= rLength;

            if (delimTotal > 0) continue; // Haven't found enough closing delimiters

            // Remove extra characters. *a*** -> *a*
            rLength = Math.min(rLength, rLength + delimTotal + midDelimTotal);

            // Create `em` if smallest delimiter has odd char count. *a***
            if (Math.min(lLength, rLength) % 2) {
              const text = src.slice(1, lLength + match.index + rLength);
              return {
                type: 'em',
                raw: src.slice(0, lLength + match.index + rLength + 1),
                text,
                tokens: this.lexer.inlineTokens(text, [])
              };
            }

            // Create 'strong' if smallest delimiter has even char count. **a***
            const text = src.slice(2, lLength + match.index + rLength - 1);
            return {
              type: 'strong',
              raw: src.slice(0, lLength + match.index + rLength + 1),
              text,
              tokens: this.lexer.inlineTokens(text, [])
            };
          }
        }
      }

      codespan(src) {
        const cap = this.rules.inline.code.exec(src);
        if (cap) {
          let text = cap[2].replace(/\n/g, ' ');
          const hasNonSpaceChars = /[^ ]/.test(text);
          const hasSpaceCharsOnBothEnds = /^ /.test(text) && / $/.test(text);
          if (hasNonSpaceChars && hasSpaceCharsOnBothEnds) {
            text = text.substring(1, text.length - 1);
          }
          text = escape(text, true);
          return {
            type: 'codespan',
            raw: cap[0],
            text
          };
        }
      }

      br(src) {
        const cap = this.rules.inline.br.exec(src);
        if (cap) {
          return {
            type: 'br',
            raw: cap[0]
          };
        }
      }

      del(src) {
        const cap = this.rules.inline.del.exec(src);
        if (cap) {
          return {
            type: 'del',
            raw: cap[0],
            text: cap[2],
            tokens: this.lexer.inlineTokens(cap[2], [])
          };
        }
      }

      autolink(src, mangle) {
        const cap = this.rules.inline.autolink.exec(src);
        if (cap) {
          let text, href;
          if (cap[2] === '@') {
            text = escape(this.options.mangle ? mangle(cap[1]) : cap[1]);
            href = 'mailto:' + text;
          } else {
            text = escape(cap[1]);
            href = text;
          }

          return {
            type: 'link',
            raw: cap[0],
            text,
            href,
            tokens: [
              {
                type: 'text',
                raw: text,
                text
              }
            ]
          };
        }
      }

      url(src, mangle) {
        let cap;
        if (cap = this.rules.inline.url.exec(src)) {
          let text, href;
          if (cap[2] === '@') {
            text = escape(this.options.mangle ? mangle(cap[0]) : cap[0]);
            href = 'mailto:' + text;
          } else {
            // do extended autolink path validation
            let prevCapZero;
            do {
              prevCapZero = cap[0];
              cap[0] = this.rules.inline._backpedal.exec(cap[0])[0];
            } while (prevCapZero !== cap[0]);
            text = escape(cap[0]);
            if (cap[1] === 'www.') {
              href = 'http://' + text;
            } else {
              href = text;
            }
          }
          return {
            type: 'link',
            raw: cap[0],
            text,
            href,
            tokens: [
              {
                type: 'text',
                raw: text,
                text
              }
            ]
          };
        }
      }

      inlineText(src, smartypants) {
        const cap = this.rules.inline.text.exec(src);
        if (cap) {
          let text;
          if (this.lexer.state.inRawBlock) {
            text = this.options.sanitize ? (this.options.sanitizer ? this.options.sanitizer(cap[0]) : escape(cap[0])) : cap[0];
          } else {
            text = escape(this.options.smartypants ? smartypants(cap[0]) : cap[0]);
          }
          return {
            type: 'text',
            raw: cap[0],
            text
          };
        }
      }
    }

    /**
     * Block-Level Grammar
     */
    const block = {
      newline: /^(?: *(?:\n|$))+/,
      code: /^( {4}[^\n]+(?:\n(?: *(?:\n|$))*)?)+/,
      fences: /^ {0,3}(`{3,}(?=[^`\n]*\n)|~{3,})([^\n]*)\n(?:|([\s\S]*?)\n)(?: {0,3}\1[~`]* *(?=\n|$)|$)/,
      hr: /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/,
      heading: /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/,
      blockquote: /^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/,
      list: /^( {0,3}bull)([ \t][^\n]+?)?(?:\n|$)/,
      html: '^ {0,3}(?:' // optional indentation
        + '<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)' // (1)
        + '|comment[^\\n]*(\\n+|$)' // (2)
        + '|<\\?[\\s\\S]*?(?:\\?>\\n*|$)' // (3)
        + '|<![A-Z][\\s\\S]*?(?:>\\n*|$)' // (4)
        + '|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)' // (5)
        + '|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n *)+\\n|$)' // (6)
        + '|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n *)+\\n|$)' // (7) open tag
        + '|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n *)+\\n|$)' // (7) closing tag
        + ')',
      def: /^ {0,3}\[(label)\]: *(?:\n *)?<?([^\s>]+)>?(?:(?: +(?:\n *)?| *\n *)(title))? *(?:\n+|$)/,
      table: noopTest,
      lheading: /^([^\n]+)\n {0,3}(=+|-+) *(?:\n+|$)/,
      // regex template, placeholders will be replaced according to different paragraph
      // interruption rules of commonmark and the original markdown spec:
      _paragraph: /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/,
      text: /^[^\n]+/
    };

    block._label = /(?!\s*\])(?:\\.|[^\[\]\\])+/;
    block._title = /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/;
    block.def = edit(block.def)
      .replace('label', block._label)
      .replace('title', block._title)
      .getRegex();

    block.bullet = /(?:[*+-]|\d{1,9}[.)])/;
    block.listItemStart = edit(/^( *)(bull) */)
      .replace('bull', block.bullet)
      .getRegex();

    block.list = edit(block.list)
      .replace(/bull/g, block.bullet)
      .replace('hr', '\\n+(?=\\1?(?:(?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$))')
      .replace('def', '\\n+(?=' + block.def.source + ')')
      .getRegex();

    block._tag = 'address|article|aside|base|basefont|blockquote|body|caption'
      + '|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption'
      + '|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe'
      + '|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option'
      + '|p|param|section|source|summary|table|tbody|td|tfoot|th|thead|title|tr'
      + '|track|ul';
    block._comment = /<!--(?!-?>)[\s\S]*?(?:-->|$)/;
    block.html = edit(block.html, 'i')
      .replace('comment', block._comment)
      .replace('tag', block._tag)
      .replace('attribute', / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/)
      .getRegex();

    block.paragraph = edit(block._paragraph)
      .replace('hr', block.hr)
      .replace('heading', ' {0,3}#{1,6} ')
      .replace('|lheading', '') // setex headings don't interrupt commonmark paragraphs
      .replace('|table', '')
      .replace('blockquote', ' {0,3}>')
      .replace('fences', ' {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n')
      .replace('list', ' {0,3}(?:[*+-]|1[.)]) ') // only lists starting from 1 can interrupt
      .replace('html', '</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)')
      .replace('tag', block._tag) // pars can be interrupted by type (6) html blocks
      .getRegex();

    block.blockquote = edit(block.blockquote)
      .replace('paragraph', block.paragraph)
      .getRegex();

    /**
     * Normal Block Grammar
     */

    block.normal = merge({}, block);

    /**
     * GFM Block Grammar
     */

    block.gfm = merge({}, block.normal, {
      table: '^ *([^\\n ].*\\|.*)\\n' // Header
        + ' {0,3}(?:\\| *)?(:?-+:? *(?:\\| *:?-+:? *)*)(?:\\| *)?' // Align
        + '(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)' // Cells
    });

    block.gfm.table = edit(block.gfm.table)
      .replace('hr', block.hr)
      .replace('heading', ' {0,3}#{1,6} ')
      .replace('blockquote', ' {0,3}>')
      .replace('code', ' {4}[^\\n]')
      .replace('fences', ' {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n')
      .replace('list', ' {0,3}(?:[*+-]|1[.)]) ') // only lists starting from 1 can interrupt
      .replace('html', '</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)')
      .replace('tag', block._tag) // tables can be interrupted by type (6) html blocks
      .getRegex();

    block.gfm.paragraph = edit(block._paragraph)
      .replace('hr', block.hr)
      .replace('heading', ' {0,3}#{1,6} ')
      .replace('|lheading', '') // setex headings don't interrupt commonmark paragraphs
      .replace('table', block.gfm.table) // interrupt paragraphs with table
      .replace('blockquote', ' {0,3}>')
      .replace('fences', ' {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n')
      .replace('list', ' {0,3}(?:[*+-]|1[.)]) ') // only lists starting from 1 can interrupt
      .replace('html', '</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)')
      .replace('tag', block._tag) // pars can be interrupted by type (6) html blocks
      .getRegex();
    /**
     * Pedantic grammar (original John Gruber's loose markdown specification)
     */

    block.pedantic = merge({}, block.normal, {
      html: edit(
        '^ *(?:comment *(?:\\n|\\s*$)'
        + '|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)' // closed tag
        + '|<tag(?:"[^"]*"|\'[^\']*\'|\\s[^\'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))')
        .replace('comment', block._comment)
        .replace(/tag/g, '(?!(?:'
          + 'a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub'
          + '|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)'
          + '\\b)\\w+(?!:|[^\\w\\s@]*@)\\b')
        .getRegex(),
      def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,
      heading: /^(#{1,6})(.*)(?:\n+|$)/,
      fences: noopTest, // fences not supported
      paragraph: edit(block.normal._paragraph)
        .replace('hr', block.hr)
        .replace('heading', ' *#{1,6} *[^\n]')
        .replace('lheading', block.lheading)
        .replace('blockquote', ' {0,3}>')
        .replace('|fences', '')
        .replace('|list', '')
        .replace('|html', '')
        .getRegex()
    });

    /**
     * Inline-Level Grammar
     */
    const inline = {
      escape: /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,
      autolink: /^<(scheme:[^\s\x00-\x1f<>]*|email)>/,
      url: noopTest,
      tag: '^comment'
        + '|^</[a-zA-Z][\\w:-]*\\s*>' // self-closing tag
        + '|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>' // open tag
        + '|^<\\?[\\s\\S]*?\\?>' // processing instruction, e.g. <?php ?>
        + '|^<![a-zA-Z]+\\s[\\s\\S]*?>' // declaration, e.g. <!DOCTYPE html>
        + '|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>', // CDATA section
      link: /^!?\[(label)\]\(\s*(href)(?:\s+(title))?\s*\)/,
      reflink: /^!?\[(label)\]\[(ref)\]/,
      nolink: /^!?\[(ref)\](?:\[\])?/,
      reflinkSearch: 'reflink|nolink(?!\\()',
      emStrong: {
        lDelim: /^(?:\*+(?:([punct_])|[^\s*]))|^_+(?:([punct*])|([^\s_]))/,
        //        (1) and (2) can only be a Right Delimiter. (3) and (4) can only be Left.  (5) and (6) can be either Left or Right.
        //          () Skip orphan inside strong  () Consume to delim (1) #***                (2) a***#, a***                   (3) #***a, ***a                 (4) ***#              (5) #***#                 (6) a***a
        rDelimAst: /^[^_*]*?\_\_[^_*]*?\*[^_*]*?(?=\_\_)|[^*]+(?=[^*])|[punct_](\*+)(?=[\s]|$)|[^punct*_\s](\*+)(?=[punct_\s]|$)|[punct_\s](\*+)(?=[^punct*_\s])|[\s](\*+)(?=[punct_])|[punct_](\*+)(?=[punct_])|[^punct*_\s](\*+)(?=[^punct*_\s])/,
        rDelimUnd: /^[^_*]*?\*\*[^_*]*?\_[^_*]*?(?=\*\*)|[^_]+(?=[^_])|[punct*](\_+)(?=[\s]|$)|[^punct*_\s](\_+)(?=[punct*\s]|$)|[punct*\s](\_+)(?=[^punct*_\s])|[\s](\_+)(?=[punct*])|[punct*](\_+)(?=[punct*])/ // ^- Not allowed for _
      },
      code: /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,
      br: /^( {2,}|\\)\n(?!\s*$)/,
      del: noopTest,
      text: /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/,
      punctuation: /^([\spunctuation])/
    };

    // list of punctuation marks from CommonMark spec
    // without * and _ to handle the different emphasis markers * and _
    inline._punctuation = '!"#$%&\'()+\\-.,/:;<=>?@\\[\\]`^{|}~';
    inline.punctuation = edit(inline.punctuation).replace(/punctuation/g, inline._punctuation).getRegex();

    // sequences em should skip over [title](link), `code`, <html>
    inline.blockSkip = /\[[^\]]*?\]\([^\)]*?\)|`[^`]*?`|<[^>]*?>/g;
    inline.escapedEmSt = /\\\*|\\_/g;

    inline._comment = edit(block._comment).replace('(?:-->|$)', '-->').getRegex();

    inline.emStrong.lDelim = edit(inline.emStrong.lDelim)
      .replace(/punct/g, inline._punctuation)
      .getRegex();

    inline.emStrong.rDelimAst = edit(inline.emStrong.rDelimAst, 'g')
      .replace(/punct/g, inline._punctuation)
      .getRegex();

    inline.emStrong.rDelimUnd = edit(inline.emStrong.rDelimUnd, 'g')
      .replace(/punct/g, inline._punctuation)
      .getRegex();

    inline._escapes = /\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/g;

    inline._scheme = /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/;
    inline._email = /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/;
    inline.autolink = edit(inline.autolink)
      .replace('scheme', inline._scheme)
      .replace('email', inline._email)
      .getRegex();

    inline._attribute = /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/;

    inline.tag = edit(inline.tag)
      .replace('comment', inline._comment)
      .replace('attribute', inline._attribute)
      .getRegex();

    inline._label = /(?:\[(?:\\.|[^\[\]\\])*\]|\\.|`[^`]*`|[^\[\]\\`])*?/;
    inline._href = /<(?:\\.|[^\n<>\\])+>|[^\s\x00-\x1f]*/;
    inline._title = /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/;

    inline.link = edit(inline.link)
      .replace('label', inline._label)
      .replace('href', inline._href)
      .replace('title', inline._title)
      .getRegex();

    inline.reflink = edit(inline.reflink)
      .replace('label', inline._label)
      .replace('ref', block._label)
      .getRegex();

    inline.nolink = edit(inline.nolink)
      .replace('ref', block._label)
      .getRegex();

    inline.reflinkSearch = edit(inline.reflinkSearch, 'g')
      .replace('reflink', inline.reflink)
      .replace('nolink', inline.nolink)
      .getRegex();

    /**
     * Normal Inline Grammar
     */

    inline.normal = merge({}, inline);

    /**
     * Pedantic Inline Grammar
     */

    inline.pedantic = merge({}, inline.normal, {
      strong: {
        start: /^__|\*\*/,
        middle: /^__(?=\S)([\s\S]*?\S)__(?!_)|^\*\*(?=\S)([\s\S]*?\S)\*\*(?!\*)/,
        endAst: /\*\*(?!\*)/g,
        endUnd: /__(?!_)/g
      },
      em: {
        start: /^_|\*/,
        middle: /^()\*(?=\S)([\s\S]*?\S)\*(?!\*)|^_(?=\S)([\s\S]*?\S)_(?!_)/,
        endAst: /\*(?!\*)/g,
        endUnd: /_(?!_)/g
      },
      link: edit(/^!?\[(label)\]\((.*?)\)/)
        .replace('label', inline._label)
        .getRegex(),
      reflink: edit(/^!?\[(label)\]\s*\[([^\]]*)\]/)
        .replace('label', inline._label)
        .getRegex()
    });

    /**
     * GFM Inline Grammar
     */

    inline.gfm = merge({}, inline.normal, {
      escape: edit(inline.escape).replace('])', '~|])').getRegex(),
      _extended_email: /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/,
      url: /^((?:ftp|https?):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/,
      _backpedal: /(?:[^?!.,:;*_~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_~)]+(?!$))+/,
      del: /^(~~?)(?=[^\s~])([\s\S]*?[^\s~])\1(?=[^~]|$)/,
      text: /^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|https?:\/\/|ftp:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/
    });

    inline.gfm.url = edit(inline.gfm.url, 'i')
      .replace('email', inline.gfm._extended_email)
      .getRegex();
    /**
     * GFM + Line Breaks Inline Grammar
     */

    inline.breaks = merge({}, inline.gfm, {
      br: edit(inline.br).replace('{2,}', '*').getRegex(),
      text: edit(inline.gfm.text)
        .replace('\\b_', '\\b_| {2,}\\n')
        .replace(/\{2,\}/g, '*')
        .getRegex()
    });

    /**
     * smartypants text replacement
     * @param {string} text
     */
    function smartypants(text) {
      return text
        // em-dashes
        .replace(/---/g, '\u2014')
        // en-dashes
        .replace(/--/g, '\u2013')
        // opening singles
        .replace(/(^|[-\u2014/(\[{"\s])'/g, '$1\u2018')
        // closing singles & apostrophes
        .replace(/'/g, '\u2019')
        // opening doubles
        .replace(/(^|[-\u2014/(\[{\u2018\s])"/g, '$1\u201c')
        // closing doubles
        .replace(/"/g, '\u201d')
        // ellipses
        .replace(/\.{3}/g, '\u2026');
    }

    /**
     * mangle email addresses
     * @param {string} text
     */
    function mangle(text) {
      let out = '',
        i,
        ch;

      const l = text.length;
      for (i = 0; i < l; i++) {
        ch = text.charCodeAt(i);
        if (Math.random() > 0.5) {
          ch = 'x' + ch.toString(16);
        }
        out += '&#' + ch + ';';
      }

      return out;
    }

    /**
     * Block Lexer
     */
    class Lexer {
      constructor(options) {
        this.tokens = [];
        this.tokens.links = Object.create(null);
        this.options = options || defaults;
        this.options.tokenizer = this.options.tokenizer || new Tokenizer();
        this.tokenizer = this.options.tokenizer;
        this.tokenizer.options = this.options;
        this.tokenizer.lexer = this;
        this.inlineQueue = [];
        this.state = {
          inLink: false,
          inRawBlock: false,
          top: true
        };

        const rules = {
          block: block.normal,
          inline: inline.normal
        };

        if (this.options.pedantic) {
          rules.block = block.pedantic;
          rules.inline = inline.pedantic;
        } else if (this.options.gfm) {
          rules.block = block.gfm;
          if (this.options.breaks) {
            rules.inline = inline.breaks;
          } else {
            rules.inline = inline.gfm;
          }
        }
        this.tokenizer.rules = rules;
      }

      /**
       * Expose Rules
       */
      static get rules() {
        return {
          block,
          inline
        };
      }

      /**
       * Static Lex Method
       */
      static lex(src, options) {
        const lexer = new Lexer(options);
        return lexer.lex(src);
      }

      /**
       * Static Lex Inline Method
       */
      static lexInline(src, options) {
        const lexer = new Lexer(options);
        return lexer.inlineTokens(src);
      }

      /**
       * Preprocessing
       */
      lex(src) {
        src = src
          .replace(/\r\n|\r/g, '\n');

        this.blockTokens(src, this.tokens);

        let next;
        while (next = this.inlineQueue.shift()) {
          this.inlineTokens(next.src, next.tokens);
        }

        return this.tokens;
      }

      /**
       * Lexing
       */
      blockTokens(src, tokens = []) {
        if (this.options.pedantic) {
          src = src.replace(/\t/g, '    ').replace(/^ +$/gm, '');
        } else {
          src = src.replace(/^( *)(\t+)/gm, (_, leading, tabs) => {
            return leading + '    '.repeat(tabs.length);
          });
        }

        let token, lastToken, cutSrc, lastParagraphClipped;

        while (src) {
          if (this.options.extensions
            && this.options.extensions.block
            && this.options.extensions.block.some((extTokenizer) => {
              if (token = extTokenizer.call({ lexer: this }, src, tokens)) {
                src = src.substring(token.raw.length);
                tokens.push(token);
                return true;
              }
              return false;
            })) {
            continue;
          }

          // newline
          if (token = this.tokenizer.space(src)) {
            src = src.substring(token.raw.length);
            if (token.raw.length === 1 && tokens.length > 0) {
              // if there's a single \n as a spacer, it's terminating the last line,
              // so move it there so that we don't get unecessary paragraph tags
              tokens[tokens.length - 1].raw += '\n';
            } else {
              tokens.push(token);
            }
            continue;
          }

          // code
          if (token = this.tokenizer.code(src)) {
            src = src.substring(token.raw.length);
            lastToken = tokens[tokens.length - 1];
            // An indented code block cannot interrupt a paragraph.
            if (lastToken && (lastToken.type === 'paragraph' || lastToken.type === 'text')) {
              lastToken.raw += '\n' + token.raw;
              lastToken.text += '\n' + token.text;
              this.inlineQueue[this.inlineQueue.length - 1].src = lastToken.text;
            } else {
              tokens.push(token);
            }
            continue;
          }

          // fences
          if (token = this.tokenizer.fences(src)) {
            src = src.substring(token.raw.length);
            tokens.push(token);
            continue;
          }

          // heading
          if (token = this.tokenizer.heading(src)) {
            src = src.substring(token.raw.length);
            tokens.push(token);
            continue;
          }

          // hr
          if (token = this.tokenizer.hr(src)) {
            src = src.substring(token.raw.length);
            tokens.push(token);
            continue;
          }

          // blockquote
          if (token = this.tokenizer.blockquote(src)) {
            src = src.substring(token.raw.length);
            tokens.push(token);
            continue;
          }

          // list
          if (token = this.tokenizer.list(src)) {
            src = src.substring(token.raw.length);
            tokens.push(token);
            continue;
          }

          // html
          if (token = this.tokenizer.html(src)) {
            src = src.substring(token.raw.length);
            tokens.push(token);
            continue;
          }

          // def
          if (token = this.tokenizer.def(src)) {
            src = src.substring(token.raw.length);
            lastToken = tokens[tokens.length - 1];
            if (lastToken && (lastToken.type === 'paragraph' || lastToken.type === 'text')) {
              lastToken.raw += '\n' + token.raw;
              lastToken.text += '\n' + token.raw;
              this.inlineQueue[this.inlineQueue.length - 1].src = lastToken.text;
            } else if (!this.tokens.links[token.tag]) {
              this.tokens.links[token.tag] = {
                href: token.href,
                title: token.title
              };
            }
            continue;
          }

          // table (gfm)
          if (token = this.tokenizer.table(src)) {
            src = src.substring(token.raw.length);
            tokens.push(token);
            continue;
          }

          // lheading
          if (token = this.tokenizer.lheading(src)) {
            src = src.substring(token.raw.length);
            tokens.push(token);
            continue;
          }

          // top-level paragraph
          // prevent paragraph consuming extensions by clipping 'src' to extension start
          cutSrc = src;
          if (this.options.extensions && this.options.extensions.startBlock) {
            let startIndex = Infinity;
            const tempSrc = src.slice(1);
            let tempStart;
            this.options.extensions.startBlock.forEach(function(getStartIndex) {
              tempStart = getStartIndex.call({ lexer: this }, tempSrc);
              if (typeof tempStart === 'number' && tempStart >= 0) { startIndex = Math.min(startIndex, tempStart); }
            });
            if (startIndex < Infinity && startIndex >= 0) {
              cutSrc = src.substring(0, startIndex + 1);
            }
          }
          if (this.state.top && (token = this.tokenizer.paragraph(cutSrc))) {
            lastToken = tokens[tokens.length - 1];
            if (lastParagraphClipped && lastToken.type === 'paragraph') {
              lastToken.raw += '\n' + token.raw;
              lastToken.text += '\n' + token.text;
              this.inlineQueue.pop();
              this.inlineQueue[this.inlineQueue.length - 1].src = lastToken.text;
            } else {
              tokens.push(token);
            }
            lastParagraphClipped = (cutSrc.length !== src.length);
            src = src.substring(token.raw.length);
            continue;
          }

          // text
          if (token = this.tokenizer.text(src)) {
            src = src.substring(token.raw.length);
            lastToken = tokens[tokens.length - 1];
            if (lastToken && lastToken.type === 'text') {
              lastToken.raw += '\n' + token.raw;
              lastToken.text += '\n' + token.text;
              this.inlineQueue.pop();
              this.inlineQueue[this.inlineQueue.length - 1].src = lastToken.text;
            } else {
              tokens.push(token);
            }
            continue;
          }

          if (src) {
            const errMsg = 'Infinite loop on byte: ' + src.charCodeAt(0);
            if (this.options.silent) {
              console.error(errMsg);
              break;
            } else {
              throw new Error(errMsg);
            }
          }
        }

        this.state.top = true;
        return tokens;
      }

      inline(src, tokens) {
        this.inlineQueue.push({ src, tokens });
      }

      /**
       * Lexing/Compiling
       */
      inlineTokens(src, tokens = []) {
        let token, lastToken, cutSrc;

        // String with links masked to avoid interference with em and strong
        let maskedSrc = src;
        let match;
        let keepPrevChar, prevChar;

        // Mask out reflinks
        if (this.tokens.links) {
          const links = Object.keys(this.tokens.links);
          if (links.length > 0) {
            while ((match = this.tokenizer.rules.inline.reflinkSearch.exec(maskedSrc)) != null) {
              if (links.includes(match[0].slice(match[0].lastIndexOf('[') + 1, -1))) {
                maskedSrc = maskedSrc.slice(0, match.index) + '[' + repeatString('a', match[0].length - 2) + ']' + maskedSrc.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex);
              }
            }
          }
        }
        // Mask out other blocks
        while ((match = this.tokenizer.rules.inline.blockSkip.exec(maskedSrc)) != null) {
          maskedSrc = maskedSrc.slice(0, match.index) + '[' + repeatString('a', match[0].length - 2) + ']' + maskedSrc.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);
        }

        // Mask out escaped em & strong delimiters
        while ((match = this.tokenizer.rules.inline.escapedEmSt.exec(maskedSrc)) != null) {
          maskedSrc = maskedSrc.slice(0, match.index) + '++' + maskedSrc.slice(this.tokenizer.rules.inline.escapedEmSt.lastIndex);
        }

        while (src) {
          if (!keepPrevChar) {
            prevChar = '';
          }
          keepPrevChar = false;

          // extensions
          if (this.options.extensions
            && this.options.extensions.inline
            && this.options.extensions.inline.some((extTokenizer) => {
              if (token = extTokenizer.call({ lexer: this }, src, tokens)) {
                src = src.substring(token.raw.length);
                tokens.push(token);
                return true;
              }
              return false;
            })) {
            continue;
          }

          // escape
          if (token = this.tokenizer.escape(src)) {
            src = src.substring(token.raw.length);
            tokens.push(token);
            continue;
          }

          // tag
          if (token = this.tokenizer.tag(src)) {
            src = src.substring(token.raw.length);
            lastToken = tokens[tokens.length - 1];
            if (lastToken && token.type === 'text' && lastToken.type === 'text') {
              lastToken.raw += token.raw;
              lastToken.text += token.text;
            } else {
              tokens.push(token);
            }
            continue;
          }

          // link
          if (token = this.tokenizer.link(src)) {
            src = src.substring(token.raw.length);
            tokens.push(token);
            continue;
          }

          // reflink, nolink
          if (token = this.tokenizer.reflink(src, this.tokens.links)) {
            src = src.substring(token.raw.length);
            lastToken = tokens[tokens.length - 1];
            if (lastToken && token.type === 'text' && lastToken.type === 'text') {
              lastToken.raw += token.raw;
              lastToken.text += token.text;
            } else {
              tokens.push(token);
            }
            continue;
          }

          // em & strong
          if (token = this.tokenizer.emStrong(src, maskedSrc, prevChar)) {
            src = src.substring(token.raw.length);
            tokens.push(token);
            continue;
          }

          // code
          if (token = this.tokenizer.codespan(src)) {
            src = src.substring(token.raw.length);
            tokens.push(token);
            continue;
          }

          // br
          if (token = this.tokenizer.br(src)) {
            src = src.substring(token.raw.length);
            tokens.push(token);
            continue;
          }

          // del (gfm)
          if (token = this.tokenizer.del(src)) {
            src = src.substring(token.raw.length);
            tokens.push(token);
            continue;
          }

          // autolink
          if (token = this.tokenizer.autolink(src, mangle)) {
            src = src.substring(token.raw.length);
            tokens.push(token);
            continue;
          }

          // url (gfm)
          if (!this.state.inLink && (token = this.tokenizer.url(src, mangle))) {
            src = src.substring(token.raw.length);
            tokens.push(token);
            continue;
          }

          // text
          // prevent inlineText consuming extensions by clipping 'src' to extension start
          cutSrc = src;
          if (this.options.extensions && this.options.extensions.startInline) {
            let startIndex = Infinity;
            const tempSrc = src.slice(1);
            let tempStart;
            this.options.extensions.startInline.forEach(function(getStartIndex) {
              tempStart = getStartIndex.call({ lexer: this }, tempSrc);
              if (typeof tempStart === 'number' && tempStart >= 0) { startIndex = Math.min(startIndex, tempStart); }
            });
            if (startIndex < Infinity && startIndex >= 0) {
              cutSrc = src.substring(0, startIndex + 1);
            }
          }
          if (token = this.tokenizer.inlineText(cutSrc, smartypants)) {
            src = src.substring(token.raw.length);
            if (token.raw.slice(-1) !== '_') { // Track prevChar before string of ____ started
              prevChar = token.raw.slice(-1);
            }
            keepPrevChar = true;
            lastToken = tokens[tokens.length - 1];
            if (lastToken && lastToken.type === 'text') {
              lastToken.raw += token.raw;
              lastToken.text += token.text;
            } else {
              tokens.push(token);
            }
            continue;
          }

          if (src) {
            const errMsg = 'Infinite loop on byte: ' + src.charCodeAt(0);
            if (this.options.silent) {
              console.error(errMsg);
              break;
            } else {
              throw new Error(errMsg);
            }
          }
        }

        return tokens;
      }
    }

    /**
     * Renderer
     */
    class Renderer {
      constructor(options) {
        this.options = options || defaults;
      }

      code(code, infostring, escaped) {
        const lang = (infostring || '').match(/\S*/)[0];
        if (this.options.highlight) {
          const out = this.options.highlight(code, lang);
          if (out != null && out !== code) {
            escaped = true;
            code = out;
          }
        }

        code = code.replace(/\n$/, '') + '\n';

        if (!lang) {
          return '<pre><code>'
            + (escaped ? code : escape(code, true))
            + '</code></pre>\n';
        }

        return '<pre><code class="'
          + this.options.langPrefix
          + escape(lang, true)
          + '">'
          + (escaped ? code : escape(code, true))
          + '</code></pre>\n';
      }

      /**
       * @param {string} quote
       */
      blockquote(quote) {
        return `<blockquote>\n${quote}</blockquote>\n`;
      }

      html(html) {
        return html;
      }

      /**
       * @param {string} text
       * @param {string} level
       * @param {string} raw
       * @param {any} slugger
       */
      heading(text, level, raw, slugger) {
        if (this.options.headerIds) {
          const id = this.options.headerPrefix + slugger.slug(raw);
          return `<h${level} id="${id}">${text}</h${level}>\n`;
        }

        // ignore IDs
        return `<h${level}>${text}</h${level}>\n`;
      }

      hr() {
        return this.options.xhtml ? '<hr/>\n' : '<hr>\n';
      }

      list(body, ordered, start) {
        const type = ordered ? 'ol' : 'ul',
          startatt = (ordered && start !== 1) ? (' start="' + start + '"') : '';
        return '<' + type + startatt + '>\n' + body + '</' + type + '>\n';
      }

      /**
       * @param {string} text
       */
      listitem(text) {
        return `<li>${text}</li>\n`;
      }

      checkbox(checked) {
        return '<input '
          + (checked ? 'checked="" ' : '')
          + 'disabled="" type="checkbox"'
          + (this.options.xhtml ? ' /' : '')
          + '> ';
      }

      /**
       * @param {string} text
       */
      paragraph(text) {
        return `<p>${text}</p>\n`;
      }

      /**
       * @param {string} header
       * @param {string} body
       */
      table(header, body) {
        if (body) body = `<tbody>${body}</tbody>`;

        return '<table>\n'
          + '<thead>\n'
          + header
          + '</thead>\n'
          + body
          + '</table>\n';
      }

      /**
       * @param {string} content
       */
      tablerow(content) {
        return `<tr>\n${content}</tr>\n`;
      }

      tablecell(content, flags) {
        const type = flags.header ? 'th' : 'td';
        const tag = flags.align
          ? `<${type} align="${flags.align}">`
          : `<${type}>`;
        return tag + content + `</${type}>\n`;
      }

      /**
       * span level renderer
       * @param {string} text
       */
      strong(text) {
        return `<strong>${text}</strong>`;
      }

      /**
       * @param {string} text
       */
      em(text) {
        return `<em>${text}</em>`;
      }

      /**
       * @param {string} text
       */
      codespan(text) {
        return `<code>${text}</code>`;
      }

      br() {
        return this.options.xhtml ? '<br/>' : '<br>';
      }

      /**
       * @param {string} text
       */
      del(text) {
        return `<del>${text}</del>`;
      }

      /**
       * @param {string} href
       * @param {string} title
       * @param {string} text
       */
      link(href, title, text) {
        href = cleanUrl(this.options.sanitize, this.options.baseUrl, href);
        if (href === null) {
          return text;
        }
        let out = '<a href="' + escape(href) + '"';
        if (title) {
          out += ' title="' + title + '"';
        }
        out += '>' + text + '</a>';
        return out;
      }

      /**
       * @param {string} href
       * @param {string} title
       * @param {string} text
       */
      image(href, title, text) {
        href = cleanUrl(this.options.sanitize, this.options.baseUrl, href);
        if (href === null) {
          return text;
        }

        let out = `<img src="${href}" alt="${text}"`;
        if (title) {
          out += ` title="${title}"`;
        }
        out += this.options.xhtml ? '/>' : '>';
        return out;
      }

      text(text) {
        return text;
      }
    }

    /**
     * TextRenderer
     * returns only the textual part of the token
     */
    class TextRenderer {
      // no need for block level renderers
      strong(text) {
        return text;
      }

      em(text) {
        return text;
      }

      codespan(text) {
        return text;
      }

      del(text) {
        return text;
      }

      html(text) {
        return text;
      }

      text(text) {
        return text;
      }

      link(href, title, text) {
        return '' + text;
      }

      image(href, title, text) {
        return '' + text;
      }

      br() {
        return '';
      }
    }

    /**
     * Slugger generates header id
     */
    class Slugger {
      constructor() {
        this.seen = {};
      }

      /**
       * @param {string} value
       */
      serialize(value) {
        return value
          .toLowerCase()
          .trim()
          // remove html tags
          .replace(/<[!\/a-z].*?>/ig, '')
          // remove unwanted chars
          .replace(/[\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,./:;<=>?@[\]^`{|}~]/g, '')
          .replace(/\s/g, '-');
      }

      /**
       * Finds the next safe (unique) slug to use
       * @param {string} originalSlug
       * @param {boolean} isDryRun
       */
      getNextSafeSlug(originalSlug, isDryRun) {
        let slug = originalSlug;
        let occurenceAccumulator = 0;
        if (this.seen.hasOwnProperty(slug)) {
          occurenceAccumulator = this.seen[originalSlug];
          do {
            occurenceAccumulator++;
            slug = originalSlug + '-' + occurenceAccumulator;
          } while (this.seen.hasOwnProperty(slug));
        }
        if (!isDryRun) {
          this.seen[originalSlug] = occurenceAccumulator;
          this.seen[slug] = 0;
        }
        return slug;
      }

      /**
       * Convert string to unique id
       * @param {object} [options]
       * @param {boolean} [options.dryrun] Generates the next unique slug without
       * updating the internal accumulator.
       */
      slug(value, options = {}) {
        const slug = this.serialize(value);
        return this.getNextSafeSlug(slug, options.dryrun);
      }
    }

    /**
     * Parsing & Compiling
     */
    class Parser {
      constructor(options) {
        this.options = options || defaults;
        this.options.renderer = this.options.renderer || new Renderer();
        this.renderer = this.options.renderer;
        this.renderer.options = this.options;
        this.textRenderer = new TextRenderer();
        this.slugger = new Slugger();
      }

      /**
       * Static Parse Method
       */
      static parse(tokens, options) {
        const parser = new Parser(options);
        return parser.parse(tokens);
      }

      /**
       * Static Parse Inline Method
       */
      static parseInline(tokens, options) {
        const parser = new Parser(options);
        return parser.parseInline(tokens);
      }

      /**
       * Parse Loop
       */
      parse(tokens, top = true) {
        let out = '',
          i,
          j,
          k,
          l2,
          l3,
          row,
          cell,
          header,
          body,
          token,
          ordered,
          start,
          loose,
          itemBody,
          item,
          checked,
          task,
          checkbox,
          ret;

        const l = tokens.length;
        for (i = 0; i < l; i++) {
          token = tokens[i];

          // Run any renderer extensions
          if (this.options.extensions && this.options.extensions.renderers && this.options.extensions.renderers[token.type]) {
            ret = this.options.extensions.renderers[token.type].call({ parser: this }, token);
            if (ret !== false || !['space', 'hr', 'heading', 'code', 'table', 'blockquote', 'list', 'html', 'paragraph', 'text'].includes(token.type)) {
              out += ret || '';
              continue;
            }
          }

          switch (token.type) {
            case 'space': {
              continue;
            }
            case 'hr': {
              out += this.renderer.hr();
              continue;
            }
            case 'heading': {
              out += this.renderer.heading(
                this.parseInline(token.tokens),
                token.depth,
                unescape(this.parseInline(token.tokens, this.textRenderer)),
                this.slugger);
              continue;
            }
            case 'code': {
              out += this.renderer.code(token.text,
                token.lang,
                token.escaped);
              continue;
            }
            case 'table': {
              header = '';

              // header
              cell = '';
              l2 = token.header.length;
              for (j = 0; j < l2; j++) {
                cell += this.renderer.tablecell(
                  this.parseInline(token.header[j].tokens),
                  { header: true, align: token.align[j] }
                );
              }
              header += this.renderer.tablerow(cell);

              body = '';
              l2 = token.rows.length;
              for (j = 0; j < l2; j++) {
                row = token.rows[j];

                cell = '';
                l3 = row.length;
                for (k = 0; k < l3; k++) {
                  cell += this.renderer.tablecell(
                    this.parseInline(row[k].tokens),
                    { header: false, align: token.align[k] }
                  );
                }

                body += this.renderer.tablerow(cell);
              }
              out += this.renderer.table(header, body);
              continue;
            }
            case 'blockquote': {
              body = this.parse(token.tokens);
              out += this.renderer.blockquote(body);
              continue;
            }
            case 'list': {
              ordered = token.ordered;
              start = token.start;
              loose = token.loose;
              l2 = token.items.length;

              body = '';
              for (j = 0; j < l2; j++) {
                item = token.items[j];
                checked = item.checked;
                task = item.task;

                itemBody = '';
                if (item.task) {
                  checkbox = this.renderer.checkbox(checked);
                  if (loose) {
                    if (item.tokens.length > 0 && item.tokens[0].type === 'paragraph') {
                      item.tokens[0].text = checkbox + ' ' + item.tokens[0].text;
                      if (item.tokens[0].tokens && item.tokens[0].tokens.length > 0 && item.tokens[0].tokens[0].type === 'text') {
                        item.tokens[0].tokens[0].text = checkbox + ' ' + item.tokens[0].tokens[0].text;
                      }
                    } else {
                      item.tokens.unshift({
                        type: 'text',
                        text: checkbox
                      });
                    }
                  } else {
                    itemBody += checkbox;
                  }
                }

                itemBody += this.parse(item.tokens, loose);
                body += this.renderer.listitem(itemBody, task, checked);
              }

              out += this.renderer.list(body, ordered, start);
              continue;
            }
            case 'html': {
              // TODO parse inline content if parameter markdown=1
              out += this.renderer.html(token.text);
              continue;
            }
            case 'paragraph': {
              out += this.renderer.paragraph(this.parseInline(token.tokens));
              continue;
            }
            case 'text': {
              body = token.tokens ? this.parseInline(token.tokens) : token.text;
              while (i + 1 < l && tokens[i + 1].type === 'text') {
                token = tokens[++i];
                body += '\n' + (token.tokens ? this.parseInline(token.tokens) : token.text);
              }
              out += top ? this.renderer.paragraph(body) : body;
              continue;
            }

            default: {
              const errMsg = 'Token with "' + token.type + '" type was not found.';
              if (this.options.silent) {
                console.error(errMsg);
                return;
              } else {
                throw new Error(errMsg);
              }
            }
          }
        }

        return out;
      }

      /**
       * Parse Inline Tokens
       */
      parseInline(tokens, renderer) {
        renderer = renderer || this.renderer;
        let out = '',
          i,
          token,
          ret;

        const l = tokens.length;
        for (i = 0; i < l; i++) {
          token = tokens[i];

          // Run any renderer extensions
          if (this.options.extensions && this.options.extensions.renderers && this.options.extensions.renderers[token.type]) {
            ret = this.options.extensions.renderers[token.type].call({ parser: this }, token);
            if (ret !== false || !['escape', 'html', 'link', 'image', 'strong', 'em', 'codespan', 'br', 'del', 'text'].includes(token.type)) {
              out += ret || '';
              continue;
            }
          }

          switch (token.type) {
            case 'escape': {
              out += renderer.text(token.text);
              break;
            }
            case 'html': {
              out += renderer.html(token.text);
              break;
            }
            case 'link': {
              out += renderer.link(token.href, token.title, this.parseInline(token.tokens, renderer));
              break;
            }
            case 'image': {
              out += renderer.image(token.href, token.title, token.text);
              break;
            }
            case 'strong': {
              out += renderer.strong(this.parseInline(token.tokens, renderer));
              break;
            }
            case 'em': {
              out += renderer.em(this.parseInline(token.tokens, renderer));
              break;
            }
            case 'codespan': {
              out += renderer.codespan(token.text);
              break;
            }
            case 'br': {
              out += renderer.br();
              break;
            }
            case 'del': {
              out += renderer.del(this.parseInline(token.tokens, renderer));
              break;
            }
            case 'text': {
              out += renderer.text(token.text);
              break;
            }
            default: {
              const errMsg = 'Token with "' + token.type + '" type was not found.';
              if (this.options.silent) {
                console.error(errMsg);
                return;
              } else {
                throw new Error(errMsg);
              }
            }
          }
        }
        return out;
      }
    }
    Parser.parse;
    Lexer.lex;

    const key = {};

    /* node_modules\svelte-markdown\src\renderers\Heading.svelte generated by Svelte v3.49.0 */
    const file$p = "node_modules\\svelte-markdown\\src\\renderers\\Heading.svelte";

    // (28:0) {:else}
    function create_else_block$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*raw*/ ctx[1]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*raw*/ 2) set_data_dev(t, /*raw*/ ctx[1]);
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(28:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (26:22) 
    function create_if_block_5$1(ctx) {
    	let h6;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[5].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[4], null);

    	const block = {
    		c: function create() {
    			h6 = element("h6");
    			if (default_slot) default_slot.c();
    			attr_dev(h6, "id", /*id*/ ctx[2]);
    			add_location(h6, file$p, 26, 2, 596);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h6, anchor);

    			if (default_slot) {
    				default_slot.m(h6, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 16)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[4],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[4])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[4], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*id*/ 4) {
    				attr_dev(h6, "id", /*id*/ ctx[2]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h6);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5$1.name,
    		type: "if",
    		source: "(26:22) ",
    		ctx
    	});

    	return block;
    }

    // (24:22) 
    function create_if_block_4$2(ctx) {
    	let h5;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[5].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[4], null);

    	const block = {
    		c: function create() {
    			h5 = element("h5");
    			if (default_slot) default_slot.c();
    			attr_dev(h5, "id", /*id*/ ctx[2]);
    			add_location(h5, file$p, 24, 2, 543);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h5, anchor);

    			if (default_slot) {
    				default_slot.m(h5, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 16)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[4],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[4])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[4], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*id*/ 4) {
    				attr_dev(h5, "id", /*id*/ ctx[2]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h5);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4$2.name,
    		type: "if",
    		source: "(24:22) ",
    		ctx
    	});

    	return block;
    }

    // (22:22) 
    function create_if_block_3$2(ctx) {
    	let h4;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[5].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[4], null);

    	const block = {
    		c: function create() {
    			h4 = element("h4");
    			if (default_slot) default_slot.c();
    			attr_dev(h4, "id", /*id*/ ctx[2]);
    			add_location(h4, file$p, 22, 2, 490);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h4, anchor);

    			if (default_slot) {
    				default_slot.m(h4, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 16)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[4],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[4])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[4], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*id*/ 4) {
    				attr_dev(h4, "id", /*id*/ ctx[2]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h4);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$2.name,
    		type: "if",
    		source: "(22:22) ",
    		ctx
    	});

    	return block;
    }

    // (20:22) 
    function create_if_block_2$2(ctx) {
    	let h3;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[5].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[4], null);

    	const block = {
    		c: function create() {
    			h3 = element("h3");
    			if (default_slot) default_slot.c();
    			attr_dev(h3, "id", /*id*/ ctx[2]);
    			add_location(h3, file$p, 20, 2, 437);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h3, anchor);

    			if (default_slot) {
    				default_slot.m(h3, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 16)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[4],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[4])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[4], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*id*/ 4) {
    				attr_dev(h3, "id", /*id*/ ctx[2]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h3);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$2.name,
    		type: "if",
    		source: "(20:22) ",
    		ctx
    	});

    	return block;
    }

    // (18:22) 
    function create_if_block_1$2(ctx) {
    	let h2;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[5].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[4], null);

    	const block = {
    		c: function create() {
    			h2 = element("h2");
    			if (default_slot) default_slot.c();
    			attr_dev(h2, "id", /*id*/ ctx[2]);
    			add_location(h2, file$p, 18, 2, 384);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h2, anchor);

    			if (default_slot) {
    				default_slot.m(h2, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 16)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[4],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[4])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[4], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*id*/ 4) {
    				attr_dev(h2, "id", /*id*/ ctx[2]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h2);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(18:22) ",
    		ctx
    	});

    	return block;
    }

    // (16:0) {#if depth === 1}
    function create_if_block$5(ctx) {
    	let h1;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[5].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[4], null);

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			if (default_slot) default_slot.c();
    			attr_dev(h1, "id", /*id*/ ctx[2]);
    			add_location(h1, file$p, 16, 2, 331);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);

    			if (default_slot) {
    				default_slot.m(h1, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 16)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[4],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[4])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[4], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*id*/ 4) {
    				attr_dev(h1, "id", /*id*/ ctx[2]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$5.name,
    		type: "if",
    		source: "(16:0) {#if depth === 1}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$s(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;

    	const if_block_creators = [
    		create_if_block$5,
    		create_if_block_1$2,
    		create_if_block_2$2,
    		create_if_block_3$2,
    		create_if_block_4$2,
    		create_if_block_5$1,
    		create_else_block$2
    	];

    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*depth*/ ctx[0] === 1) return 0;
    		if (/*depth*/ ctx[0] === 2) return 1;
    		if (/*depth*/ ctx[0] === 3) return 2;
    		if (/*depth*/ ctx[0] === 4) return 3;
    		if (/*depth*/ ctx[0] === 5) return 4;
    		if (/*depth*/ ctx[0] === 6) return 5;
    		return 6;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$s.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$q($$self, $$props, $$invalidate) {
    	let id;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Heading', slots, ['default']);
    	let { depth } = $$props;
    	let { raw } = $$props;
    	let { text } = $$props;
    	const { slug, getOptions } = getContext(key);
    	const options = getOptions();
    	const writable_props = ['depth', 'raw', 'text'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Heading> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('depth' in $$props) $$invalidate(0, depth = $$props.depth);
    		if ('raw' in $$props) $$invalidate(1, raw = $$props.raw);
    		if ('text' in $$props) $$invalidate(3, text = $$props.text);
    		if ('$$scope' in $$props) $$invalidate(4, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		key,
    		depth,
    		raw,
    		text,
    		slug,
    		getOptions,
    		options,
    		id
    	});

    	$$self.$inject_state = $$props => {
    		if ('depth' in $$props) $$invalidate(0, depth = $$props.depth);
    		if ('raw' in $$props) $$invalidate(1, raw = $$props.raw);
    		if ('text' in $$props) $$invalidate(3, text = $$props.text);
    		if ('id' in $$props) $$invalidate(2, id = $$props.id);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*text*/ 8) {
    			$$invalidate(2, id = options.headerIds
    			? options.headerPrefix + slug(text)
    			: undefined);
    		}
    	};

    	return [depth, raw, id, text, $$scope, slots];
    }

    class Heading extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$q, create_fragment$s, safe_not_equal, { depth: 0, raw: 1, text: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Heading",
    			options,
    			id: create_fragment$s.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*depth*/ ctx[0] === undefined && !('depth' in props)) {
    			console.warn("<Heading> was created without expected prop 'depth'");
    		}

    		if (/*raw*/ ctx[1] === undefined && !('raw' in props)) {
    			console.warn("<Heading> was created without expected prop 'raw'");
    		}

    		if (/*text*/ ctx[3] === undefined && !('text' in props)) {
    			console.warn("<Heading> was created without expected prop 'text'");
    		}
    	}

    	get depth() {
    		throw new Error("<Heading>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set depth(value) {
    		throw new Error("<Heading>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get raw() {
    		throw new Error("<Heading>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set raw(value) {
    		throw new Error("<Heading>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get text() {
    		throw new Error("<Heading>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set text(value) {
    		throw new Error("<Heading>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\svelte-markdown\src\renderers\Paragraph.svelte generated by Svelte v3.49.0 */

    const file$o = "node_modules\\svelte-markdown\\src\\renderers\\Paragraph.svelte";

    function create_fragment$r(ctx) {
    	let p;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[1].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[0], null);

    	const block = {
    		c: function create() {
    			p = element("p");
    			if (default_slot) default_slot.c();
    			add_location(p, file$o, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);

    			if (default_slot) {
    				default_slot.m(p, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 1)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[0],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[0])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[0], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$r.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$p($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Paragraph', slots, ['default']);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Paragraph> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('$$scope' in $$props) $$invalidate(0, $$scope = $$props.$$scope);
    	};

    	return [$$scope, slots];
    }

    class Paragraph extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$p, create_fragment$r, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Paragraph",
    			options,
    			id: create_fragment$r.name
    		});
    	}
    }

    /* node_modules\svelte-markdown\src\renderers\Text.svelte generated by Svelte v3.49.0 */

    function create_fragment$q(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[3].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[2], null);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 4)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[2],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[2])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[2], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$q.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$o($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Text', slots, ['default']);
    	let { text } = $$props;
    	let { raw } = $$props;
    	const writable_props = ['text', 'raw'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Text> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('text' in $$props) $$invalidate(0, text = $$props.text);
    		if ('raw' in $$props) $$invalidate(1, raw = $$props.raw);
    		if ('$$scope' in $$props) $$invalidate(2, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ text, raw });

    	$$self.$inject_state = $$props => {
    		if ('text' in $$props) $$invalidate(0, text = $$props.text);
    		if ('raw' in $$props) $$invalidate(1, raw = $$props.raw);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [text, raw, $$scope, slots];
    }

    class Text extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$o, create_fragment$q, safe_not_equal, { text: 0, raw: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Text",
    			options,
    			id: create_fragment$q.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*text*/ ctx[0] === undefined && !('text' in props)) {
    			console.warn("<Text> was created without expected prop 'text'");
    		}

    		if (/*raw*/ ctx[1] === undefined && !('raw' in props)) {
    			console.warn("<Text> was created without expected prop 'raw'");
    		}
    	}

    	get text() {
    		throw new Error("<Text>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set text(value) {
    		throw new Error("<Text>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get raw() {
    		throw new Error("<Text>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set raw(value) {
    		throw new Error("<Text>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\svelte-markdown\src\renderers\Image.svelte generated by Svelte v3.49.0 */

    const file$n = "node_modules\\svelte-markdown\\src\\renderers\\Image.svelte";

    function create_fragment$p(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = /*href*/ ctx[0])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "title", /*title*/ ctx[1]);
    			attr_dev(img, "alt", /*text*/ ctx[2]);
    			add_location(img, file$n, 6, 0, 97);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*href*/ 1 && !src_url_equal(img.src, img_src_value = /*href*/ ctx[0])) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*title*/ 2) {
    				attr_dev(img, "title", /*title*/ ctx[1]);
    			}

    			if (dirty & /*text*/ 4) {
    				attr_dev(img, "alt", /*text*/ ctx[2]);
    			}
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$p.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$n($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Image', slots, []);
    	let { href = '' } = $$props;
    	let { title = undefined } = $$props;
    	let { text = '' } = $$props;
    	const writable_props = ['href', 'title', 'text'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Image> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('href' in $$props) $$invalidate(0, href = $$props.href);
    		if ('title' in $$props) $$invalidate(1, title = $$props.title);
    		if ('text' in $$props) $$invalidate(2, text = $$props.text);
    	};

    	$$self.$capture_state = () => ({ href, title, text });

    	$$self.$inject_state = $$props => {
    		if ('href' in $$props) $$invalidate(0, href = $$props.href);
    		if ('title' in $$props) $$invalidate(1, title = $$props.title);
    		if ('text' in $$props) $$invalidate(2, text = $$props.text);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [href, title, text];
    }

    class Image$1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$n, create_fragment$p, safe_not_equal, { href: 0, title: 1, text: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Image",
    			options,
    			id: create_fragment$p.name
    		});
    	}

    	get href() {
    		throw new Error("<Image>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set href(value) {
    		throw new Error("<Image>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get title() {
    		throw new Error("<Image>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<Image>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get text() {
    		throw new Error("<Image>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set text(value) {
    		throw new Error("<Image>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\svelte-markdown\src\renderers\Link.svelte generated by Svelte v3.49.0 */

    const file$m = "node_modules\\svelte-markdown\\src\\renderers\\Link.svelte";

    function create_fragment$o(ctx) {
    	let a;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[3].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[2], null);

    	const block = {
    		c: function create() {
    			a = element("a");
    			if (default_slot) default_slot.c();
    			attr_dev(a, "href", /*href*/ ctx[0]);
    			attr_dev(a, "title", /*title*/ ctx[1]);
    			add_location(a, file$m, 5, 0, 74);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);

    			if (default_slot) {
    				default_slot.m(a, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 4)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[2],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[2])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[2], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*href*/ 1) {
    				attr_dev(a, "href", /*href*/ ctx[0]);
    			}

    			if (!current || dirty & /*title*/ 2) {
    				attr_dev(a, "title", /*title*/ ctx[1]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$o.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$m($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Link', slots, ['default']);
    	let { href = '' } = $$props;
    	let { title = undefined } = $$props;
    	const writable_props = ['href', 'title'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Link> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('href' in $$props) $$invalidate(0, href = $$props.href);
    		if ('title' in $$props) $$invalidate(1, title = $$props.title);
    		if ('$$scope' in $$props) $$invalidate(2, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ href, title });

    	$$self.$inject_state = $$props => {
    		if ('href' in $$props) $$invalidate(0, href = $$props.href);
    		if ('title' in $$props) $$invalidate(1, title = $$props.title);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [href, title, $$scope, slots];
    }

    class Link extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$m, create_fragment$o, safe_not_equal, { href: 0, title: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Link",
    			options,
    			id: create_fragment$o.name
    		});
    	}

    	get href() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set href(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get title() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\svelte-markdown\src\renderers\Em.svelte generated by Svelte v3.49.0 */

    const file$l = "node_modules\\svelte-markdown\\src\\renderers\\Em.svelte";

    function create_fragment$n(ctx) {
    	let em;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[1].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[0], null);

    	const block = {
    		c: function create() {
    			em = element("em");
    			if (default_slot) default_slot.c();
    			add_location(em, file$l, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, em, anchor);

    			if (default_slot) {
    				default_slot.m(em, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 1)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[0],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[0])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[0], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(em);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$n.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$l($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Em', slots, ['default']);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Em> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('$$scope' in $$props) $$invalidate(0, $$scope = $$props.$$scope);
    	};

    	return [$$scope, slots];
    }

    class Em extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$l, create_fragment$n, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Em",
    			options,
    			id: create_fragment$n.name
    		});
    	}
    }

    /* node_modules\svelte-markdown\src\renderers\Del.svelte generated by Svelte v3.49.0 */

    const file$k = "node_modules\\svelte-markdown\\src\\renderers\\Del.svelte";

    function create_fragment$m(ctx) {
    	let del;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[1].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[0], null);

    	const block = {
    		c: function create() {
    			del = element("del");
    			if (default_slot) default_slot.c();
    			add_location(del, file$k, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, del, anchor);

    			if (default_slot) {
    				default_slot.m(del, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 1)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[0],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[0])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[0], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(del);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$m.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$k($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Del', slots, ['default']);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Del> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('$$scope' in $$props) $$invalidate(0, $$scope = $$props.$$scope);
    	};

    	return [$$scope, slots];
    }

    class Del extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$k, create_fragment$m, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Del",
    			options,
    			id: create_fragment$m.name
    		});
    	}
    }

    /* node_modules\svelte-markdown\src\renderers\Codespan.svelte generated by Svelte v3.49.0 */

    const file$j = "node_modules\\svelte-markdown\\src\\renderers\\Codespan.svelte";

    function create_fragment$l(ctx) {
    	let code;
    	let t_value = /*raw*/ ctx[0].replace(/`/g, '') + "";
    	let t;

    	const block = {
    		c: function create() {
    			code = element("code");
    			t = text(t_value);
    			add_location(code, file$j, 4, 0, 37);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, code, anchor);
    			append_dev(code, t);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*raw*/ 1 && t_value !== (t_value = /*raw*/ ctx[0].replace(/`/g, '') + "")) set_data_dev(t, t_value);
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(code);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$l.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$j($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Codespan', slots, []);
    	let { raw } = $$props;
    	const writable_props = ['raw'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Codespan> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('raw' in $$props) $$invalidate(0, raw = $$props.raw);
    	};

    	$$self.$capture_state = () => ({ raw });

    	$$self.$inject_state = $$props => {
    		if ('raw' in $$props) $$invalidate(0, raw = $$props.raw);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [raw];
    }

    class Codespan extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$j, create_fragment$l, safe_not_equal, { raw: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Codespan",
    			options,
    			id: create_fragment$l.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*raw*/ ctx[0] === undefined && !('raw' in props)) {
    			console.warn("<Codespan> was created without expected prop 'raw'");
    		}
    	}

    	get raw() {
    		throw new Error("<Codespan>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set raw(value) {
    		throw new Error("<Codespan>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\svelte-markdown\src\renderers\Strong.svelte generated by Svelte v3.49.0 */

    const file$i = "node_modules\\svelte-markdown\\src\\renderers\\Strong.svelte";

    function create_fragment$k(ctx) {
    	let strong;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[1].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[0], null);

    	const block = {
    		c: function create() {
    			strong = element("strong");
    			if (default_slot) default_slot.c();
    			add_location(strong, file$i, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, strong, anchor);

    			if (default_slot) {
    				default_slot.m(strong, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 1)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[0],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[0])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[0], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(strong);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$k.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$i($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Strong', slots, ['default']);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Strong> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('$$scope' in $$props) $$invalidate(0, $$scope = $$props.$$scope);
    	};

    	return [$$scope, slots];
    }

    class Strong extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$i, create_fragment$k, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Strong",
    			options,
    			id: create_fragment$k.name
    		});
    	}
    }

    /* node_modules\svelte-markdown\src\renderers\Table.svelte generated by Svelte v3.49.0 */

    const file$h = "node_modules\\svelte-markdown\\src\\renderers\\Table.svelte";

    function create_fragment$j(ctx) {
    	let table;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[1].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[0], null);

    	const block = {
    		c: function create() {
    			table = element("table");
    			if (default_slot) default_slot.c();
    			add_location(table, file$h, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, table, anchor);

    			if (default_slot) {
    				default_slot.m(table, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 1)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[0],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[0])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[0], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(table);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$j.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$h($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Table', slots, ['default']);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Table> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('$$scope' in $$props) $$invalidate(0, $$scope = $$props.$$scope);
    	};

    	return [$$scope, slots];
    }

    class Table extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$h, create_fragment$j, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Table",
    			options,
    			id: create_fragment$j.name
    		});
    	}
    }

    /* node_modules\svelte-markdown\src\renderers\TableHead.svelte generated by Svelte v3.49.0 */

    const file$g = "node_modules\\svelte-markdown\\src\\renderers\\TableHead.svelte";

    function create_fragment$i(ctx) {
    	let thead;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[1].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[0], null);

    	const block = {
    		c: function create() {
    			thead = element("thead");
    			if (default_slot) default_slot.c();
    			add_location(thead, file$g, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, thead, anchor);

    			if (default_slot) {
    				default_slot.m(thead, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 1)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[0],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[0])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[0], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(thead);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$i.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$g($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('TableHead', slots, ['default']);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<TableHead> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('$$scope' in $$props) $$invalidate(0, $$scope = $$props.$$scope);
    	};

    	return [$$scope, slots];
    }

    class TableHead extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$g, create_fragment$i, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TableHead",
    			options,
    			id: create_fragment$i.name
    		});
    	}
    }

    /* node_modules\svelte-markdown\src\renderers\TableBody.svelte generated by Svelte v3.49.0 */

    const file$f = "node_modules\\svelte-markdown\\src\\renderers\\TableBody.svelte";

    function create_fragment$h(ctx) {
    	let tbody;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[1].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[0], null);

    	const block = {
    		c: function create() {
    			tbody = element("tbody");
    			if (default_slot) default_slot.c();
    			add_location(tbody, file$f, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tbody, anchor);

    			if (default_slot) {
    				default_slot.m(tbody, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 1)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[0],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[0])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[0], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tbody);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$h.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$f($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('TableBody', slots, ['default']);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<TableBody> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('$$scope' in $$props) $$invalidate(0, $$scope = $$props.$$scope);
    	};

    	return [$$scope, slots];
    }

    class TableBody extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$f, create_fragment$h, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TableBody",
    			options,
    			id: create_fragment$h.name
    		});
    	}
    }

    /* node_modules\svelte-markdown\src\renderers\TableRow.svelte generated by Svelte v3.49.0 */

    const file$e = "node_modules\\svelte-markdown\\src\\renderers\\TableRow.svelte";

    function create_fragment$g(ctx) {
    	let tr;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[1].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[0], null);

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			if (default_slot) default_slot.c();
    			add_location(tr, file$e, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);

    			if (default_slot) {
    				default_slot.m(tr, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 1)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[0],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[0])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[0], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$g.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$e($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('TableRow', slots, ['default']);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<TableRow> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('$$scope' in $$props) $$invalidate(0, $$scope = $$props.$$scope);
    	};

    	return [$$scope, slots];
    }

    class TableRow extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$e, create_fragment$g, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TableRow",
    			options,
    			id: create_fragment$g.name
    		});
    	}
    }

    /* node_modules\svelte-markdown\src\renderers\TableCell.svelte generated by Svelte v3.49.0 */

    const file$d = "node_modules\\svelte-markdown\\src\\renderers\\TableCell.svelte";

    // (8:0) {:else}
    function create_else_block$1(ctx) {
    	let td;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[3].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[2], null);

    	const block = {
    		c: function create() {
    			td = element("td");
    			if (default_slot) default_slot.c();
    			attr_dev(td, "align", /*align*/ ctx[1]);
    			add_location(td, file$d, 8, 2, 115);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, td, anchor);

    			if (default_slot) {
    				default_slot.m(td, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 4)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[2],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[2])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[2], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*align*/ 2) {
    				attr_dev(td, "align", /*align*/ ctx[1]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(td);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(8:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (6:0) {#if header}
    function create_if_block$4(ctx) {
    	let th;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[3].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[2], null);

    	const block = {
    		c: function create() {
    			th = element("th");
    			if (default_slot) default_slot.c();
    			attr_dev(th, "align", /*align*/ ctx[1]);
    			add_location(th, file$d, 6, 2, 74);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, th, anchor);

    			if (default_slot) {
    				default_slot.m(th, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 4)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[2],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[2])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[2], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*align*/ 2) {
    				attr_dev(th, "align", /*align*/ ctx[1]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(th);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(6:0) {#if header}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$f(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$4, create_else_block$1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*header*/ ctx[0]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$f.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$d($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('TableCell', slots, ['default']);
    	let { header } = $$props;
    	let { align } = $$props;
    	const writable_props = ['header', 'align'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<TableCell> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('header' in $$props) $$invalidate(0, header = $$props.header);
    		if ('align' in $$props) $$invalidate(1, align = $$props.align);
    		if ('$$scope' in $$props) $$invalidate(2, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ header, align });

    	$$self.$inject_state = $$props => {
    		if ('header' in $$props) $$invalidate(0, header = $$props.header);
    		if ('align' in $$props) $$invalidate(1, align = $$props.align);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [header, align, $$scope, slots];
    }

    class TableCell extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$d, create_fragment$f, safe_not_equal, { header: 0, align: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TableCell",
    			options,
    			id: create_fragment$f.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*header*/ ctx[0] === undefined && !('header' in props)) {
    			console.warn("<TableCell> was created without expected prop 'header'");
    		}

    		if (/*align*/ ctx[1] === undefined && !('align' in props)) {
    			console.warn("<TableCell> was created without expected prop 'align'");
    		}
    	}

    	get header() {
    		throw new Error("<TableCell>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set header(value) {
    		throw new Error("<TableCell>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get align() {
    		throw new Error("<TableCell>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set align(value) {
    		throw new Error("<TableCell>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\svelte-markdown\src\renderers\List.svelte generated by Svelte v3.49.0 */

    const file$c = "node_modules\\svelte-markdown\\src\\renderers\\List.svelte";

    // (8:0) {:else}
    function create_else_block(ctx) {
    	let ul;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[3].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[2], null);

    	const block = {
    		c: function create() {
    			ul = element("ul");
    			if (default_slot) default_slot.c();
    			add_location(ul, file$c, 8, 2, 117);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, ul, anchor);

    			if (default_slot) {
    				default_slot.m(ul, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 4)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[2],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[2])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[2], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(ul);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(8:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (6:0) {#if ordered}
    function create_if_block$3(ctx) {
    	let ol;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[3].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[2], null);

    	const block = {
    		c: function create() {
    			ol = element("ol");
    			if (default_slot) default_slot.c();
    			attr_dev(ol, "start", /*start*/ ctx[1]);
    			add_location(ol, file$c, 6, 2, 76);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, ol, anchor);

    			if (default_slot) {
    				default_slot.m(ol, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 4)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[2],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[2])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[2], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*start*/ 2) {
    				attr_dev(ol, "start", /*start*/ ctx[1]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(ol);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(6:0) {#if ordered}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$e(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$3, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*ordered*/ ctx[0]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$e.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$c($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('List', slots, ['default']);
    	let { ordered } = $$props;
    	let { start } = $$props;
    	const writable_props = ['ordered', 'start'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<List> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('ordered' in $$props) $$invalidate(0, ordered = $$props.ordered);
    		if ('start' in $$props) $$invalidate(1, start = $$props.start);
    		if ('$$scope' in $$props) $$invalidate(2, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ ordered, start });

    	$$self.$inject_state = $$props => {
    		if ('ordered' in $$props) $$invalidate(0, ordered = $$props.ordered);
    		if ('start' in $$props) $$invalidate(1, start = $$props.start);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [ordered, start, $$scope, slots];
    }

    class List extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$c, create_fragment$e, safe_not_equal, { ordered: 0, start: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "List",
    			options,
    			id: create_fragment$e.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*ordered*/ ctx[0] === undefined && !('ordered' in props)) {
    			console.warn("<List> was created without expected prop 'ordered'");
    		}

    		if (/*start*/ ctx[1] === undefined && !('start' in props)) {
    			console.warn("<List> was created without expected prop 'start'");
    		}
    	}

    	get ordered() {
    		throw new Error("<List>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ordered(value) {
    		throw new Error("<List>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get start() {
    		throw new Error("<List>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set start(value) {
    		throw new Error("<List>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\svelte-markdown\src\renderers\ListItem.svelte generated by Svelte v3.49.0 */

    const file$b = "node_modules\\svelte-markdown\\src\\renderers\\ListItem.svelte";

    function create_fragment$d(ctx) {
    	let li;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[1].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[0], null);

    	const block = {
    		c: function create() {
    			li = element("li");
    			if (default_slot) default_slot.c();
    			add_location(li, file$b, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);

    			if (default_slot) {
    				default_slot.m(li, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 1)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[0],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[0])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[0], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ListItem', slots, ['default']);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ListItem> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('$$scope' in $$props) $$invalidate(0, $$scope = $$props.$$scope);
    	};

    	return [$$scope, slots];
    }

    class ListItem extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$b, create_fragment$d, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ListItem",
    			options,
    			id: create_fragment$d.name
    		});
    	}
    }

    /* node_modules\svelte-markdown\src\renderers\Hr.svelte generated by Svelte v3.49.0 */

    const file$a = "node_modules\\svelte-markdown\\src\\renderers\\Hr.svelte";

    function create_fragment$c(ctx) {
    	let hr;

    	const block = {
    		c: function create() {
    			hr = element("hr");
    			add_location(hr, file$a, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, hr, anchor);
    		},
    		p: noop$1,
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(hr);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Hr', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Hr> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Hr extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$c, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Hr",
    			options,
    			id: create_fragment$c.name
    		});
    	}
    }

    /* node_modules\svelte-markdown\src\renderers\Html.svelte generated by Svelte v3.49.0 */

    function create_fragment$b(ctx) {
    	let html_tag;
    	let html_anchor;

    	const block = {
    		c: function create() {
    			html_tag = new HtmlTag(false);
    			html_anchor = empty();
    			html_tag.a = html_anchor;
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			html_tag.m(/*text*/ ctx[0], target, anchor);
    			insert_dev(target, html_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*text*/ 1) html_tag.p(/*text*/ ctx[0]);
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(html_anchor);
    			if (detaching) html_tag.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Html', slots, []);
    	let { text } = $$props;
    	const writable_props = ['text'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Html> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('text' in $$props) $$invalidate(0, text = $$props.text);
    	};

    	$$self.$capture_state = () => ({ text });

    	$$self.$inject_state = $$props => {
    		if ('text' in $$props) $$invalidate(0, text = $$props.text);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [text];
    }

    class Html extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$b, safe_not_equal, { text: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Html",
    			options,
    			id: create_fragment$b.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*text*/ ctx[0] === undefined && !('text' in props)) {
    			console.warn("<Html> was created without expected prop 'text'");
    		}
    	}

    	get text() {
    		throw new Error("<Html>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set text(value) {
    		throw new Error("<Html>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\svelte-markdown\src\renderers\Blockquote.svelte generated by Svelte v3.49.0 */

    const file$9 = "node_modules\\svelte-markdown\\src\\renderers\\Blockquote.svelte";

    function create_fragment$a(ctx) {
    	let blockquote;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[1].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[0], null);

    	const block = {
    		c: function create() {
    			blockquote = element("blockquote");
    			if (default_slot) default_slot.c();
    			add_location(blockquote, file$9, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, blockquote, anchor);

    			if (default_slot) {
    				default_slot.m(blockquote, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 1)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[0],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[0])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[0], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(blockquote);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Blockquote', slots, ['default']);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Blockquote> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('$$scope' in $$props) $$invalidate(0, $$scope = $$props.$$scope);
    	};

    	return [$$scope, slots];
    }

    class Blockquote extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$a, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Blockquote",
    			options,
    			id: create_fragment$a.name
    		});
    	}
    }

    /* node_modules\svelte-markdown\src\renderers\Code.svelte generated by Svelte v3.49.0 */

    const file$8 = "node_modules\\svelte-markdown\\src\\renderers\\Code.svelte";

    function create_fragment$9(ctx) {
    	let pre;
    	let code;
    	let t;

    	const block = {
    		c: function create() {
    			pre = element("pre");
    			code = element("code");
    			t = text(/*text*/ ctx[1]);
    			add_location(code, file$8, 5, 18, 74);
    			attr_dev(pre, "class", /*lang*/ ctx[0]);
    			add_location(pre, file$8, 5, 0, 56);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, pre, anchor);
    			append_dev(pre, code);
    			append_dev(code, t);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*text*/ 2) set_data_dev(t, /*text*/ ctx[1]);

    			if (dirty & /*lang*/ 1) {
    				attr_dev(pre, "class", /*lang*/ ctx[0]);
    			}
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(pre);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Code', slots, []);
    	let { lang } = $$props;
    	let { text } = $$props;
    	const writable_props = ['lang', 'text'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Code> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('lang' in $$props) $$invalidate(0, lang = $$props.lang);
    		if ('text' in $$props) $$invalidate(1, text = $$props.text);
    	};

    	$$self.$capture_state = () => ({ lang, text });

    	$$self.$inject_state = $$props => {
    		if ('lang' in $$props) $$invalidate(0, lang = $$props.lang);
    		if ('text' in $$props) $$invalidate(1, text = $$props.text);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [lang, text];
    }

    class Code extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$9, safe_not_equal, { lang: 0, text: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Code",
    			options,
    			id: create_fragment$9.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*lang*/ ctx[0] === undefined && !('lang' in props)) {
    			console.warn("<Code> was created without expected prop 'lang'");
    		}

    		if (/*text*/ ctx[1] === undefined && !('text' in props)) {
    			console.warn("<Code> was created without expected prop 'text'");
    		}
    	}

    	get lang() {
    		throw new Error("<Code>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set lang(value) {
    		throw new Error("<Code>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get text() {
    		throw new Error("<Code>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set text(value) {
    		throw new Error("<Code>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\svelte-markdown\src\renderers\Br.svelte generated by Svelte v3.49.0 */

    const file$7 = "node_modules\\svelte-markdown\\src\\renderers\\Br.svelte";

    function create_fragment$8(ctx) {
    	let br;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[1].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[0], null);

    	const block = {
    		c: function create() {
    			br = element("br");
    			if (default_slot) default_slot.c();
    			add_location(br, file$7, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, br, anchor);

    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 1)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[0],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[0])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[0], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(br);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Br', slots, ['default']);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Br> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('$$scope' in $$props) $$invalidate(0, $$scope = $$props.$$scope);
    	};

    	return [$$scope, slots];
    }

    class Br extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$8, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Br",
    			options,
    			id: create_fragment$8.name
    		});
    	}
    }

    const defaultRenderers = {
      heading: Heading,
      paragraph: Paragraph,
      text: Text,
      image: Image$1,
      link: Link,
      em: Em,
      strong: Strong,
      codespan: Codespan,
      del: Del,
      table: Table,
      tablehead: TableHead,
      tablebody: TableBody,
      tablerow: TableRow,
      tablecell: TableCell,
      list: List,
      orderedlistitem: null,
      unorderedlistitem: null,
      listitem: ListItem,
      hr: Hr,
      html: Html,
      blockquote: Blockquote,
      code: Code,
      br: Br,
    };
    const defaultOptions$1 = {
      baseUrl: null,
      breaks: false,
      gfm: true,
      headerIds: true,
      headerPrefix: '',
      highlight: null,
      langPrefix: 'language-',
      mangle: true,
      pedantic: false,
      renderer: null,
      sanitize: false,
      sanitizer: null,
      silent: false,
      smartLists: false,
      smartypants: false,
      tokenizer: null,
      xhtml: false,
    };

    /* node_modules\svelte-markdown\src\SvelteMarkdown.svelte generated by Svelte v3.49.0 */

    function create_fragment$7(ctx) {
    	let parser;
    	let current;

    	parser = new Parser$1({
    			props: {
    				tokens: /*tokens*/ ctx[0],
    				renderers: /*combinedRenderers*/ ctx[1]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(parser.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(parser, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const parser_changes = {};
    			if (dirty & /*tokens*/ 1) parser_changes.tokens = /*tokens*/ ctx[0];
    			if (dirty & /*combinedRenderers*/ 2) parser_changes.renderers = /*combinedRenderers*/ ctx[1];
    			parser.$set(parser_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(parser.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(parser.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(parser, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let slugger;
    	let combinedOptions;
    	let combinedRenderers;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SvelteMarkdown', slots, []);
    	let { source = '' } = $$props;
    	let { renderers = {} } = $$props;
    	let { options = {} } = $$props;
    	let { isInline = false } = $$props;
    	const dispatch = createEventDispatcher();
    	let tokens;
    	let lexer;
    	let mounted;

    	setContext(key, {
    		slug: val => slugger ? slugger.slug(val) : '',
    		getOptions: () => combinedOptions
    	});

    	onMount(() => {
    		$$invalidate(7, mounted = true);
    	});

    	const writable_props = ['source', 'renderers', 'options', 'isInline'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<SvelteMarkdown> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('source' in $$props) $$invalidate(2, source = $$props.source);
    		if ('renderers' in $$props) $$invalidate(3, renderers = $$props.renderers);
    		if ('options' in $$props) $$invalidate(4, options = $$props.options);
    		if ('isInline' in $$props) $$invalidate(5, isInline = $$props.isInline);
    	};

    	$$self.$capture_state = () => ({
    		setContext,
    		createEventDispatcher,
    		onMount,
    		Parser: Parser$1,
    		Lexer,
    		Slugger,
    		defaultOptions: defaultOptions$1,
    		defaultRenderers,
    		key,
    		source,
    		renderers,
    		options,
    		isInline,
    		dispatch,
    		tokens,
    		lexer,
    		mounted,
    		combinedOptions,
    		slugger,
    		combinedRenderers
    	});

    	$$self.$inject_state = $$props => {
    		if ('source' in $$props) $$invalidate(2, source = $$props.source);
    		if ('renderers' in $$props) $$invalidate(3, renderers = $$props.renderers);
    		if ('options' in $$props) $$invalidate(4, options = $$props.options);
    		if ('isInline' in $$props) $$invalidate(5, isInline = $$props.isInline);
    		if ('tokens' in $$props) $$invalidate(0, tokens = $$props.tokens);
    		if ('lexer' in $$props) $$invalidate(6, lexer = $$props.lexer);
    		if ('mounted' in $$props) $$invalidate(7, mounted = $$props.mounted);
    		if ('combinedOptions' in $$props) $$invalidate(8, combinedOptions = $$props.combinedOptions);
    		if ('slugger' in $$props) slugger = $$props.slugger;
    		if ('combinedRenderers' in $$props) $$invalidate(1, combinedRenderers = $$props.combinedRenderers);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*source*/ 4) {
    			slugger = source ? new Slugger() : undefined;
    		}

    		if ($$self.$$.dirty & /*options*/ 16) {
    			$$invalidate(8, combinedOptions = { ...defaultOptions$1, ...options });
    		}

    		if ($$self.$$.dirty & /*combinedOptions, isInline, lexer, source, tokens*/ 357) {
    			{
    				$$invalidate(6, lexer = new Lexer(combinedOptions));

    				$$invalidate(0, tokens = isInline
    				? lexer.inlineTokens(source)
    				: lexer.lex(source));

    				dispatch('parsed', { tokens });
    			}
    		}

    		if ($$self.$$.dirty & /*renderers*/ 8) {
    			$$invalidate(1, combinedRenderers = { ...defaultRenderers, ...renderers });
    		}

    		if ($$self.$$.dirty & /*mounted, tokens*/ 129) {
    			mounted && dispatch('parsed', { tokens });
    		}
    	};

    	return [
    		tokens,
    		combinedRenderers,
    		source,
    		renderers,
    		options,
    		isInline,
    		lexer,
    		mounted,
    		combinedOptions
    	];
    }

    class SvelteMarkdown extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$5, create_fragment$7, safe_not_equal, {
    			source: 2,
    			renderers: 3,
    			options: 4,
    			isInline: 5
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SvelteMarkdown",
    			options,
    			id: create_fragment$7.name
    		});
    	}

    	get source() {
    		throw new Error("<SvelteMarkdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set source(value) {
    		throw new Error("<SvelteMarkdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get renderers() {
    		throw new Error("<SvelteMarkdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set renderers(value) {
    		throw new Error("<SvelteMarkdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get options() {
    		throw new Error("<SvelteMarkdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set options(value) {
    		throw new Error("<SvelteMarkdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isInline() {
    		throw new Error("<SvelteMarkdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isInline(value) {
    		throw new Error("<SvelteMarkdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\menu\Changelog.svelte generated by Svelte v3.49.0 */

    const { Error: Error_1$2 } = globals;
    const file$6 = "src\\components\\menu\\Changelog.svelte";

    // (20:0) {:catch error}
    function create_catch_block$1(ctx) {
    	let div;
    	let p;

    	const block = {
    		c: function create() {
    			div = element("div");
    			p = element("p");
    			p.textContent = `Failed to fetch the changelog... Maybe there is no changelog for v${/*version*/ ctx[0]}?`;
    			add_location(p, file$6, 21, 2, 649);
    			attr_dev(div, "class", "changelog-wrapper svelte-14da7td");
    			add_location(div, file$6, 20, 1, 614);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, p);
    		},
    		p: noop$1,
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_catch_block$1.name,
    		type: "catch",
    		source: "(20:0) {:catch error}",
    		ctx
    	});

    	return block;
    }

    // (16:0) {:then data}
    function create_then_block$1(ctx) {
    	let div;
    	let sveltemarkdown;
    	let current;

    	sveltemarkdown = new SvelteMarkdown({
    			props: { source: /*data*/ ctx[2].body },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(sveltemarkdown.$$.fragment);
    			attr_dev(div, "class", "changelog-wrapper svelte-14da7td");
    			add_location(div, file$6, 16, 1, 514);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(sveltemarkdown, div, null);
    			current = true;
    		},
    		p: noop$1,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(sveltemarkdown.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(sveltemarkdown.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(sveltemarkdown);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_then_block$1.name,
    		type: "then",
    		source: "(16:0) {:then data}",
    		ctx
    	});

    	return block;
    }

    // (14:23)    <Loader color="#B7B9BC" />  {:then data}
    function create_pending_block$1(ctx) {
    	let loader;
    	let current;

    	loader = new Loader({
    			props: { color: "#B7B9BC" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(loader.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(loader, target, anchor);
    			current = true;
    		},
    		p: noop$1,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(loader.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(loader.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(loader, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_pending_block$1.name,
    		type: "pending",
    		source: "(14:23)    <Loader color=\\\"#B7B9BC\\\" />  {:then data}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let await_block_anchor;
    	let current;

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		hasCatch: true,
    		pending: create_pending_block$1,
    		then: create_then_block$1,
    		catch: create_catch_block$1,
    		value: 2,
    		error: 3,
    		blocks: [,,,]
    	};

    	handle_promise(/*fetchChangelog*/ ctx[1], info);

    	const block = {
    		c: function create() {
    			await_block_anchor = empty();
    			info.block.c();
    		},
    		l: function claim(nodes) {
    			throw new Error_1$2("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, await_block_anchor, anchor);
    			info.block.m(target, info.anchor = anchor);
    			info.mount = () => await_block_anchor.parentNode;
    			info.anchor = await_block_anchor;
    			current = true;
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;
    			update_await_block_branch(info, ctx, dirty);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(info.block);
    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < 3; i += 1) {
    				const block = info.blocks[i];
    				transition_out(block);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(await_block_anchor);
    			info.block.d(detaching);
    			info.token = null;
    			info = null;
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Changelog', slots, []);
    	const { version } = require('../package.json');

    	const fetchChangelog = (async () => {
    		const response = await fetch('https://api.github.com/repos/starbrat/refviewer/releases/tags/v' + version);
    		if (response.status === 200) return await response.json(); else throw new Error(response.statusText);
    	})();

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Changelog> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		SvelteMarkdown,
    		Loader,
    		version,
    		fetchChangelog
    	});

    	return [version, fetchChangelog];
    }

    class Changelog extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$6, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Changelog",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    /* src\components\menu\Menu.svelte generated by Svelte v3.49.0 */

    const { Error: Error_1$1, console: console_1$1 } = globals;
    const file$5 = "src\\components\\menu\\Menu.svelte";

    // (65:3) {:catch error}
    function create_catch_block(ctx) {
    	let t_value = (console.log(/*error*/ ctx[13]) || '') + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_catch_block.name,
    		type: "catch",
    		source: "(65:3) {:catch error}",
    		ctx
    	});

    	return block;
    }

    // (54:33)       {#if data[0].tag_name != 'v' + version}
    function create_then_block(ctx) {
    	let if_block_anchor;
    	let if_block = /*data*/ ctx[12][0].tag_name != 'v' + /*version*/ ctx[2] && create_if_block_4$1(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (/*data*/ ctx[12][0].tag_name != 'v' + /*version*/ ctx[2]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_4$1(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_then_block.name,
    		type: "then",
    		source: "(54:33)       {#if data[0].tag_name != 'v' + version}",
    		ctx
    	});

    	return block;
    }

    // (55:4) {#if data[0].tag_name != 'v' + version}
    function create_if_block_4$1(ctx) {
    	let li;
    	let mounted;
    	let dispose;

    	function click_handler_4(...args) {
    		return /*click_handler_4*/ ctx[10](/*data*/ ctx[12], ...args);
    	}

    	const block = {
    		c: function create() {
    			li = element("li");
    			li.textContent = "Update";
    			attr_dev(li, "class", "svelte-i7rdg0");
    			add_location(li, file$5, 55, 5, 1366);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);

    			if (!mounted) {
    				dispose = listen_dev(li, "click", click_handler_4, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4$1.name,
    		type: "if",
    		source: "(55:4) {#if data[0].tag_name != 'v' + version}",
    		ctx
    	});

    	return block;
    }

    // (1:0) <script>   import { createEventDispatcher }
    function create_pending_block(ctx) {
    	const block = { c: noop$1, m: noop$1, p: noop$1, d: noop$1 };

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_pending_block.name,
    		type: "pending",
    		source: "(1:0) <script>   import { createEventDispatcher }",
    		ctx
    	});

    	return block;
    }

    // (83:35) 
    function create_if_block_3$1(ctx) {
    	let div;
    	let changelog;
    	let current;

    	changelog = new Changelog({
    			props: { version: /*version*/ ctx[2] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(changelog.$$.fragment);
    			attr_dev(div, "class", "settings-w-inner svelte-i7rdg0");
    			add_location(div, file$5, 83, 3, 2034);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(changelog, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const changelog_changes = {};
    			if (dirty & /*version*/ 4) changelog_changes.version = /*version*/ ctx[2];
    			changelog.$set(changelog_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(changelog.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(changelog.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(changelog);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$1.name,
    		type: "if",
    		source: "(83:35) ",
    		ctx
    	});

    	return block;
    }

    // (79:31) 
    function create_if_block_2$1(ctx) {
    	let div;
    	let about;
    	let current;

    	about = new About({
    			props: { version: /*version*/ ctx[2] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(about.$$.fragment);
    			attr_dev(div, "class", "settings-w-inner svelte-i7rdg0");
    			add_location(div, file$5, 79, 3, 1926);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(about, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const about_changes = {};
    			if (dirty & /*version*/ 4) about_changes.version = /*version*/ ctx[2];
    			about.$set(about_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(about.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(about.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(about);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$1.name,
    		type: "if",
    		source: "(79:31) ",
    		ctx
    	});

    	return block;
    }

    // (75:34) 
    function create_if_block_1$1(ctx) {
    	let div;
    	let settings_1;
    	let current;

    	settings_1 = new Settings({
    			props: { settings: /*settings*/ ctx[1] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(settings_1.$$.fragment);
    			attr_dev(div, "class", "settings-w-inner svelte-i7rdg0");
    			add_location(div, file$5, 75, 3, 1818);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(settings_1, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const settings_1_changes = {};
    			if (dirty & /*settings*/ 2) settings_1_changes.settings = /*settings*/ ctx[1];
    			settings_1.$set(settings_1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(settings_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(settings_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(settings_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(75:34) ",
    		ctx
    	});

    	return block;
    }

    // (71:2) {#if setWindow=="recent"}
    function create_if_block$2(ctx) {
    	let div;
    	let recent;
    	let current;
    	recent = new Recent({ $$inline: true });
    	recent.$on("settingsOpen", /*settingsOpen_handler*/ ctx[11]);

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(recent.$$.fragment);
    			attr_dev(div, "class", "settings-w-inner svelte-i7rdg0");
    			add_location(div, file$5, 71, 3, 1657);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(recent, div, null);
    			current = true;
    		},
    		p: noop$1,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(recent.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(recent.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(recent);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(71:2) {#if setWindow==\\\"recent\\\"}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let div2;
    	let div0;
    	let ul;
    	let li0;
    	let t1;
    	let li1;
    	let t3;
    	let li2;
    	let t5;
    	let li3;
    	let t7;
    	let t8;
    	let div1;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	let mounted;
    	let dispose;

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		hasCatch: true,
    		pending: create_pending_block,
    		then: create_then_block,
    		catch: create_catch_block,
    		value: 12,
    		error: 13
    	};

    	handle_promise(/*fetchLatest*/ ctx[5], info);
    	const if_block_creators = [create_if_block$2, create_if_block_1$1, create_if_block_2$1, create_if_block_3$1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*setWindow*/ ctx[3] == "recent") return 0;
    		if (/*setWindow*/ ctx[3] == "settings") return 1;
    		if (/*setWindow*/ ctx[3] == "about") return 2;
    		if (/*setWindow*/ ctx[3] == "changelog") return 3;
    		return -1;
    	}

    	if (~(current_block_type_index = select_block_type(ctx))) {
    		if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	}

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			ul = element("ul");
    			li0 = element("li");
    			li0.textContent = "Recent";
    			t1 = space();
    			li1 = element("li");
    			li1.textContent = "Settings";
    			t3 = space();
    			li2 = element("li");
    			li2.textContent = "About";
    			t5 = space();
    			li3 = element("li");
    			li3.textContent = "Changelog";
    			t7 = space();
    			info.block.c();
    			t8 = space();
    			div1 = element("div");
    			if (if_block) if_block.c();
    			attr_dev(li0, "class", "svelte-i7rdg0");
    			toggle_class(li0, "active", /*setWindow*/ ctx[3] == "recent");
    			add_location(li0, file$5, 29, 3, 788);
    			attr_dev(li1, "class", "svelte-i7rdg0");
    			toggle_class(li1, "active", /*setWindow*/ ctx[3] == "settings");
    			add_location(li1, file$5, 35, 3, 909);
    			attr_dev(li2, "class", "svelte-i7rdg0");
    			toggle_class(li2, "active", /*setWindow*/ ctx[3] == "about");
    			add_location(li2, file$5, 41, 3, 1036);
    			attr_dev(li3, "class", "svelte-i7rdg0");
    			toggle_class(li3, "active", /*setWindow*/ ctx[3] == "changelog");
    			add_location(li3, file$5, 47, 3, 1154);
    			attr_dev(ul, "class", "settings-container-menu svelte-i7rdg0");
    			add_location(ul, file$5, 28, 2, 747);
    			attr_dev(div0, "class", "settings-container-sidebar svelte-i7rdg0");
    			add_location(div0, file$5, 27, 1, 703);
    			attr_dev(div1, "class", "settings-container-main svelte-i7rdg0");
    			add_location(div1, file$5, 69, 1, 1586);
    			attr_dev(div2, "class", "settings-container svelte-i7rdg0");
    			toggle_class(div2, "legacy", /*legacy*/ ctx[0]);
    			add_location(div2, file$5, 23, 0, 649);
    		},
    		l: function claim(nodes) {
    			throw new Error_1$1("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div0, ul);
    			append_dev(ul, li0);
    			append_dev(ul, t1);
    			append_dev(ul, li1);
    			append_dev(ul, t3);
    			append_dev(ul, li2);
    			append_dev(ul, t5);
    			append_dev(ul, li3);
    			append_dev(ul, t7);
    			info.block.m(ul, info.anchor = null);
    			info.mount = () => ul;
    			info.anchor = null;
    			append_dev(div2, t8);
    			append_dev(div2, div1);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].m(div1, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(li0, "click", /*click_handler*/ ctx[6], false, false, false),
    					listen_dev(li1, "click", /*click_handler_1*/ ctx[7], false, false, false),
    					listen_dev(li2, "click", /*click_handler_2*/ ctx[8], false, false, false),
    					listen_dev(li3, "click", /*click_handler_3*/ ctx[9], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;

    			if (dirty & /*setWindow*/ 8) {
    				toggle_class(li0, "active", /*setWindow*/ ctx[3] == "recent");
    			}

    			if (dirty & /*setWindow*/ 8) {
    				toggle_class(li1, "active", /*setWindow*/ ctx[3] == "settings");
    			}

    			if (dirty & /*setWindow*/ 8) {
    				toggle_class(li2, "active", /*setWindow*/ ctx[3] == "about");
    			}

    			if (dirty & /*setWindow*/ 8) {
    				toggle_class(li3, "active", /*setWindow*/ ctx[3] == "changelog");
    			}

    			update_await_block_branch(info, ctx, dirty);
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if (~current_block_type_index) {
    					if_blocks[current_block_type_index].p(ctx, dirty);
    				}
    			} else {
    				if (if_block) {
    					group_outros();

    					transition_out(if_blocks[previous_block_index], 1, 1, () => {
    						if_blocks[previous_block_index] = null;
    					});

    					check_outros();
    				}

    				if (~current_block_type_index) {
    					if_block = if_blocks[current_block_type_index];

    					if (!if_block) {
    						if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    						if_block.c();
    					} else {
    						if_block.p(ctx, dirty);
    					}

    					transition_in(if_block, 1);
    					if_block.m(div1, null);
    				} else {
    					if_block = null;
    				}
    			}

    			if (dirty & /*legacy*/ 1) {
    				toggle_class(div2, "legacy", /*legacy*/ ctx[0]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			info.block.d();
    			info.token = null;
    			info = null;

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].d();
    			}

    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Menu', slots, []);
    	const dispatch = createEventDispatcher();
    	let setWindow = "recent";
    	let { legacy = false } = $$props;
    	let { settings } = $$props;
    	let { version } = $$props;

    	const fetchLatest = (async () => {
    		const response = await fetch('https://api.github.com/repos/starbrat/refviewer/releases');
    		if (response.status === 200) return await response.json(); else throw new Error(response.statusText);
    	})();

    	const writable_props = ['legacy', 'settings', 'version'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$1.warn(`<Menu> was created with unknown prop '${key}'`);
    	});

    	const click_handler = e => {
    		$$invalidate(3, setWindow = "recent");
    	};

    	const click_handler_1 = e => {
    		$$invalidate(3, setWindow = "settings");
    	};

    	const click_handler_2 = e => {
    		$$invalidate(3, setWindow = "about");
    	};

    	const click_handler_3 = e => {
    		$$invalidate(3, setWindow = "changelog");
    	};

    	const click_handler_4 = (data, e) => {
    		window.location.href = data[0].html_url;
    	};

    	const settingsOpen_handler = e => {
    		dispatch('settingsOpen', e.detail);
    	};

    	$$self.$$set = $$props => {
    		if ('legacy' in $$props) $$invalidate(0, legacy = $$props.legacy);
    		if ('settings' in $$props) $$invalidate(1, settings = $$props.settings);
    		if ('version' in $$props) $$invalidate(2, version = $$props.version);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		Settings,
    		About,
    		Recent,
    		Changelog,
    		dispatch,
    		setWindow,
    		legacy,
    		settings,
    		version,
    		fetchLatest
    	});

    	$$self.$inject_state = $$props => {
    		if ('setWindow' in $$props) $$invalidate(3, setWindow = $$props.setWindow);
    		if ('legacy' in $$props) $$invalidate(0, legacy = $$props.legacy);
    		if ('settings' in $$props) $$invalidate(1, settings = $$props.settings);
    		if ('version' in $$props) $$invalidate(2, version = $$props.version);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		legacy,
    		settings,
    		version,
    		setWindow,
    		dispatch,
    		fetchLatest,
    		click_handler,
    		click_handler_1,
    		click_handler_2,
    		click_handler_3,
    		click_handler_4,
    		settingsOpen_handler
    	];
    }

    class Menu extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$5, safe_not_equal, { legacy: 0, settings: 1, version: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Menu",
    			options,
    			id: create_fragment$5.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*settings*/ ctx[1] === undefined && !('settings' in props)) {
    			console_1$1.warn("<Menu> was created without expected prop 'settings'");
    		}

    		if (/*version*/ ctx[2] === undefined && !('version' in props)) {
    			console_1$1.warn("<Menu> was created without expected prop 'version'");
    		}
    	}

    	get legacy() {
    		throw new Error_1$1("<Menu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set legacy(value) {
    		throw new Error_1$1("<Menu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get settings() {
    		throw new Error_1$1("<Menu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set settings(value) {
    		throw new Error_1$1("<Menu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get version() {
    		throw new Error_1$1("<Menu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set version(value) {
    		throw new Error_1$1("<Menu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\Cursor.svelte generated by Svelte v3.49.0 */

    const file$4 = "src\\components\\Cursor.svelte";

    function create_fragment$4(ctx) {
    	let div6;
    	let div2;
    	let div0;
    	let t0;
    	let div1;
    	let t1;
    	let div5;
    	let div3;
    	let t2;
    	let div4;

    	const block = {
    		c: function create() {
    			div6 = element("div");
    			div2 = element("div");
    			div0 = element("div");
    			t0 = space();
    			div1 = element("div");
    			t1 = space();
    			div5 = element("div");
    			div3 = element("div");
    			t2 = space();
    			div4 = element("div");
    			attr_dev(div0, "class", "cursor-pointer svelte-1bquivv");
    			add_location(div0, file$4, 8, 2, 167);
    			attr_dev(div1, "class", "cursor-color svelte-1bquivv");
    			add_location(div1, file$4, 9, 2, 205);
    			attr_dev(div2, "class", "cursor-backdrop svelte-1bquivv");
    			add_location(div2, file$4, 7, 1, 134);
    			attr_dev(div3, "class", "cursor-pointer svelte-1bquivv");
    			add_location(div3, file$4, 12, 2, 281);
    			attr_dev(div4, "class", "cursor-color svelte-1bquivv");
    			set_style(div4, "background", /*chosenColor*/ ctx[0]);
    			add_location(div4, file$4, 13, 2, 319);
    			attr_dev(div5, "class", "cursor-content svelte-1bquivv");
    			add_location(div5, file$4, 11, 1, 249);
    			attr_dev(div6, "class", "cursor svelte-1bquivv");
    			set_style(div6, "top", /*y*/ ctx[2] + "px");
    			set_style(div6, "left", /*x*/ ctx[1] + "px");
    			add_location(div6, file$4, 6, 0, 81);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div6, anchor);
    			append_dev(div6, div2);
    			append_dev(div2, div0);
    			append_dev(div2, t0);
    			append_dev(div2, div1);
    			append_dev(div6, t1);
    			append_dev(div6, div5);
    			append_dev(div5, div3);
    			append_dev(div5, t2);
    			append_dev(div5, div4);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*chosenColor*/ 1) {
    				set_style(div4, "background", /*chosenColor*/ ctx[0]);
    			}

    			if (dirty & /*y*/ 4) {
    				set_style(div6, "top", /*y*/ ctx[2] + "px");
    			}

    			if (dirty & /*x*/ 2) {
    				set_style(div6, "left", /*x*/ ctx[1] + "px");
    			}
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div6);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Cursor', slots, []);
    	let { chosenColor } = $$props;
    	let { x } = $$props;
    	let { y } = $$props;
    	const writable_props = ['chosenColor', 'x', 'y'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Cursor> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('chosenColor' in $$props) $$invalidate(0, chosenColor = $$props.chosenColor);
    		if ('x' in $$props) $$invalidate(1, x = $$props.x);
    		if ('y' in $$props) $$invalidate(2, y = $$props.y);
    	};

    	$$self.$capture_state = () => ({ chosenColor, x, y });

    	$$self.$inject_state = $$props => {
    		if ('chosenColor' in $$props) $$invalidate(0, chosenColor = $$props.chosenColor);
    		if ('x' in $$props) $$invalidate(1, x = $$props.x);
    		if ('y' in $$props) $$invalidate(2, y = $$props.y);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [chosenColor, x, y];
    }

    class Cursor extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$4, safe_not_equal, { chosenColor: 0, x: 1, y: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Cursor",
    			options,
    			id: create_fragment$4.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*chosenColor*/ ctx[0] === undefined && !('chosenColor' in props)) {
    			console.warn("<Cursor> was created without expected prop 'chosenColor'");
    		}

    		if (/*x*/ ctx[1] === undefined && !('x' in props)) {
    			console.warn("<Cursor> was created without expected prop 'x'");
    		}

    		if (/*y*/ ctx[2] === undefined && !('y' in props)) {
    			console.warn("<Cursor> was created without expected prop 'y'");
    		}
    	}

    	get chosenColor() {
    		throw new Error("<Cursor>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set chosenColor(value) {
    		throw new Error("<Cursor>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get x() {
    		throw new Error("<Cursor>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set x(value) {
    		throw new Error("<Cursor>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get y() {
    		throw new Error("<Cursor>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set y(value) {
    		throw new Error("<Cursor>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\Zoomscale.svelte generated by Svelte v3.49.0 */

    const file$3 = "src\\components\\Zoomscale.svelte";

    // (6:0) {#if zoomscale != 1}
    function create_if_block$1(ctx) {
    	let div;
    	let t0;
    	let t1;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t0 = text("x");
    			t1 = text(/*zoomscale*/ ctx[1]);
    			attr_dev(div, "class", "zoomscale svelte-1ey8ynp");
    			add_location(div, file$3, 6, 1, 93);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t0);
    			append_dev(div, t1);

    			if (!mounted) {
    				dispose = listen_dev(div, "click", /*click_handler*/ ctx[2], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*zoomscale*/ 2) set_data_dev(t1, /*zoomscale*/ ctx[1]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(6:0) {#if zoomscale != 1}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let if_block_anchor;
    	let if_block = /*zoomscale*/ ctx[1] != 1 && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*zoomscale*/ ctx[1] != 1) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$1(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance_1$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Zoomscale', slots, []);
    	let { instance } = $$props;
    	let { zoomscale } = $$props;
    	const writable_props = ['instance', 'zoomscale'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Zoomscale> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => {
    		instance.zoom(1, { animate: false });
    		instance.pan(0, 0);
    	};

    	$$self.$$set = $$props => {
    		if ('instance' in $$props) $$invalidate(0, instance = $$props.instance);
    		if ('zoomscale' in $$props) $$invalidate(1, zoomscale = $$props.zoomscale);
    	};

    	$$self.$capture_state = () => ({ instance, zoomscale });

    	$$self.$inject_state = $$props => {
    		if ('instance' in $$props) $$invalidate(0, instance = $$props.instance);
    		if ('zoomscale' in $$props) $$invalidate(1, zoomscale = $$props.zoomscale);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [instance, zoomscale, click_handler];
    }

    class Zoomscale extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance_1$1, create_fragment$3, safe_not_equal, { instance: 0, zoomscale: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Zoomscale",
    			options,
    			id: create_fragment$3.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*instance*/ ctx[0] === undefined && !('instance' in props)) {
    			console.warn("<Zoomscale> was created without expected prop 'instance'");
    		}

    		if (/*zoomscale*/ ctx[1] === undefined && !('zoomscale' in props)) {
    			console.warn("<Zoomscale> was created without expected prop 'zoomscale'");
    		}
    	}

    	get instance() {
    		throw new Error("<Zoomscale>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set instance(value) {
    		throw new Error("<Zoomscale>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get zoomscale() {
    		throw new Error("<Zoomscale>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set zoomscale(value) {
    		throw new Error("<Zoomscale>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /**
    * Panzoom for panning and zooming elements using CSS transforms
    * Copyright Timmy Willison and other contributors
    * https://github.com/timmywil/panzoom/blob/main/MIT-License.txt
    */
    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    /* eslint-disable no-var */
    if (typeof window !== 'undefined') {
      // Support: IE11 only
      if (window.NodeList && !NodeList.prototype.forEach) {
        NodeList.prototype.forEach = Array.prototype.forEach;
      }
      // Support: IE11 only
      // CustomEvent is an object instead of a constructor
      if (typeof window.CustomEvent !== 'function') {
        window.CustomEvent = function CustomEvent(event, params) {
          params = params || { bubbles: false, cancelable: false, detail: null };
          var evt = document.createEvent('CustomEvent');
          evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
          return evt
        };
      }
    }

    /**
     * Utilites for working with multiple pointer events
     */
    function findEventIndex(pointers, event) {
        var i = pointers.length;
        while (i--) {
            if (pointers[i].pointerId === event.pointerId) {
                return i;
            }
        }
        return -1;
    }
    function addPointer(pointers, event) {
        var i;
        // Add touches if applicable
        if (event.touches) {
            i = 0;
            for (var _i = 0, _a = event.touches; _i < _a.length; _i++) {
                var touch = _a[_i];
                touch.pointerId = i++;
                addPointer(pointers, touch);
            }
            return;
        }
        i = findEventIndex(pointers, event);
        // Update if already present
        if (i > -1) {
            pointers.splice(i, 1);
        }
        pointers.push(event);
    }
    function removePointer(pointers, event) {
        // Add touches if applicable
        if (event.touches) {
            // Remove all touches
            while (pointers.length) {
                pointers.pop();
            }
            return;
        }
        var i = findEventIndex(pointers, event);
        if (i > -1) {
            pointers.splice(i, 1);
        }
    }
    /**
     * Calculates a center point between
     * the given pointer events, for panning
     * with multiple pointers.
     */
    function getMiddle(pointers) {
        // Copy to avoid changing by reference
        pointers = pointers.slice(0);
        var event1 = pointers.pop();
        var event2;
        while ((event2 = pointers.pop())) {
            event1 = {
                clientX: (event2.clientX - event1.clientX) / 2 + event1.clientX,
                clientY: (event2.clientY - event1.clientY) / 2 + event1.clientY
            };
        }
        return event1;
    }
    /**
     * Calculates the distance between two points
     * for pinch zooming.
     * Limits to the first 2
     */
    function getDistance(pointers) {
        if (pointers.length < 2) {
            return 0;
        }
        var event1 = pointers[0];
        var event2 = pointers[1];
        return Math.sqrt(Math.pow(Math.abs(event2.clientX - event1.clientX), 2) +
            Math.pow(Math.abs(event2.clientY - event1.clientY), 2));
    }

    var events$1 = {
        down: 'mousedown',
        move: 'mousemove',
        up: 'mouseup mouseleave'
    };
    if (typeof window !== 'undefined') {
        if (typeof window.PointerEvent === 'function') {
            events$1 = {
                down: 'pointerdown',
                move: 'pointermove',
                up: 'pointerup pointerleave pointercancel'
            };
        }
        else if (typeof window.TouchEvent === 'function') {
            events$1 = {
                down: 'touchstart',
                move: 'touchmove',
                up: 'touchend touchcancel'
            };
        }
    }
    function onPointer(event, elem, handler, eventOpts) {
        events$1[event].split(' ').forEach(function (name) {
            elem.addEventListener(name, handler, eventOpts);
        });
    }
    function destroyPointer(event, elem, handler) {
        events$1[event].split(' ').forEach(function (name) {
            elem.removeEventListener(name, handler);
        });
    }

    var isIE = typeof document !== 'undefined' && !!document.documentMode;
    /**
     * Lazy creation of a CSS style declaration
     */
    var divStyle;
    function createStyle() {
        if (divStyle) {
            return divStyle;
        }
        return (divStyle = document.createElement('div').style);
    }
    /**
     * Proper prefixing for cross-browser compatibility
     */
    var prefixes = ['webkit', 'moz', 'ms'];
    var prefixCache = {};
    function getPrefixedName(name) {
        if (prefixCache[name]) {
            return prefixCache[name];
        }
        var divStyle = createStyle();
        if (name in divStyle) {
            return (prefixCache[name] = name);
        }
        var capName = name[0].toUpperCase() + name.slice(1);
        var i = prefixes.length;
        while (i--) {
            var prefixedName = "" + prefixes[i] + capName;
            if (prefixedName in divStyle) {
                return (prefixCache[name] = prefixedName);
            }
        }
    }
    /**
     * Gets a style value expected to be a number
     */
    function getCSSNum(name, style) {
        return parseFloat(style[getPrefixedName(name)]) || 0;
    }
    function getBoxStyle(elem, name, style) {
        if (style === void 0) { style = window.getComputedStyle(elem); }
        // Support: FF 68+
        // Firefox requires specificity for border
        var suffix = name === 'border' ? 'Width' : '';
        return {
            left: getCSSNum(name + "Left" + suffix, style),
            right: getCSSNum(name + "Right" + suffix, style),
            top: getCSSNum(name + "Top" + suffix, style),
            bottom: getCSSNum(name + "Bottom" + suffix, style)
        };
    }
    /**
     * Set a style using the properly prefixed name
     */
    function setStyle(elem, name, value) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        elem.style[getPrefixedName(name)] = value;
    }
    /**
     * Constructs the transition from panzoom options
     * and takes care of prefixing the transition and transform
     */
    function setTransition(elem, options) {
        var transform = getPrefixedName('transform');
        setStyle(elem, 'transition', transform + " " + options.duration + "ms " + options.easing);
    }
    /**
     * Set the transform using the proper prefix
     *
     * Override the transform setter.
     * This is exposed mostly so the user could
     * set other parts of a transform
     * aside from scale and translate.
     * Default is defined in src/css.ts.
     *
     * ```js
     * // This example always sets a rotation
     * // when setting the scale and translation
     * const panzoom = Panzoom(elem, {
     *   setTransform: (elem, { scale, x, y }) => {
     *     panzoom.setStyle('transform', `rotate(0.5turn) scale(${scale}) translate(${x}px, ${y}px)`)
     *   }
     * })
     * ```
     */
    function setTransform(elem, _a, _options) {
        var x = _a.x, y = _a.y, scale = _a.scale, isSVG = _a.isSVG;
        setStyle(elem, 'transform', "scale(" + scale + ") translate(" + x + "px, " + y + "px)");
        if (isSVG && isIE) {
            var matrixValue = window.getComputedStyle(elem).getPropertyValue('transform');
            elem.setAttribute('transform', matrixValue);
        }
    }
    /**
     * Dimensions used in containment and focal point zooming
     */
    function getDimensions(elem) {
        var parent = elem.parentNode;
        var style = window.getComputedStyle(elem);
        var parentStyle = window.getComputedStyle(parent);
        var rectElem = elem.getBoundingClientRect();
        var rectParent = parent.getBoundingClientRect();
        return {
            elem: {
                style: style,
                width: rectElem.width,
                height: rectElem.height,
                top: rectElem.top,
                bottom: rectElem.bottom,
                left: rectElem.left,
                right: rectElem.right,
                margin: getBoxStyle(elem, 'margin', style),
                border: getBoxStyle(elem, 'border', style)
            },
            parent: {
                style: parentStyle,
                width: rectParent.width,
                height: rectParent.height,
                top: rectParent.top,
                bottom: rectParent.bottom,
                left: rectParent.left,
                right: rectParent.right,
                padding: getBoxStyle(parent, 'padding', parentStyle),
                border: getBoxStyle(parent, 'border', parentStyle)
            }
        };
    }

    /**
     * Determine if an element is attached to the DOM
     * Panzoom requires this so events work properly
     */
    function isAttached(elem) {
        var doc = elem.ownerDocument;
        var parent = elem.parentNode;
        return (doc &&
            parent &&
            doc.nodeType === 9 &&
            parent.nodeType === 1 &&
            doc.documentElement.contains(parent));
    }

    function getClass(elem) {
        return (elem.getAttribute('class') || '').trim();
    }
    function hasClass(elem, className) {
        return elem.nodeType === 1 && (" " + getClass(elem) + " ").indexOf(" " + className + " ") > -1;
    }
    function isExcluded(elem, options) {
        for (var cur = elem; cur != null; cur = cur.parentNode) {
            if (hasClass(cur, options.excludeClass) || options.exclude.indexOf(cur) > -1) {
                return true;
            }
        }
        return false;
    }

    /**
     * Determine if an element is SVG by checking the namespace
     * Exception: the <svg> element itself should be treated like HTML
     */
    var rsvg = /^http:[\w\.\/]+svg$/;
    function isSVGElement(elem) {
        return rsvg.test(elem.namespaceURI) && elem.nodeName.toLowerCase() !== 'svg';
    }

    function shallowClone(obj) {
        var clone = {};
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                clone[key] = obj[key];
            }
        }
        return clone;
    }

    var defaultOptions = {
        animate: false,
        canvas: false,
        cursor: 'move',
        disablePan: false,
        disableZoom: false,
        disableXAxis: false,
        disableYAxis: false,
        duration: 200,
        easing: 'ease-in-out',
        exclude: [],
        excludeClass: 'panzoom-exclude',
        handleStartEvent: function (e) {
            e.preventDefault();
            e.stopPropagation();
        },
        maxScale: 4,
        minScale: 0.125,
        overflow: 'hidden',
        panOnlyWhenZoomed: false,
        relative: false,
        setTransform: setTransform,
        startX: 0,
        startY: 0,
        startScale: 1,
        step: 0.3,
        touchAction: 'none'
    };
    function Panzoom(elem, options) {
        if (!elem) {
            throw new Error('Panzoom requires an element as an argument');
        }
        if (elem.nodeType !== 1) {
            throw new Error('Panzoom requires an element with a nodeType of 1');
        }
        if (!isAttached(elem)) {
            throw new Error('Panzoom should be called on elements that have been attached to the DOM');
        }
        options = __assign(__assign({}, defaultOptions), options);
        var isSVG = isSVGElement(elem);
        var parent = elem.parentNode;
        // Set parent styles
        parent.style.overflow = options.overflow;
        parent.style.userSelect = 'none';
        // This is important for mobile to
        // prevent scrolling while panning
        parent.style.touchAction = options.touchAction;
        (options.canvas ? parent : elem).style.cursor = options.cursor;
        // Set element styles
        elem.style.userSelect = 'none';
        elem.style.touchAction = options.touchAction;
        // The default for HTML is '50% 50%'
        // The default for SVG is '0 0'
        // SVG can't be changed in IE
        setStyle(elem, 'transformOrigin', typeof options.origin === 'string' ? options.origin : isSVG ? '0 0' : '50% 50%');
        function resetStyle() {
            parent.style.overflow = '';
            parent.style.userSelect = '';
            parent.style.touchAction = '';
            parent.style.cursor = '';
            elem.style.cursor = '';
            elem.style.userSelect = '';
            elem.style.touchAction = '';
            setStyle(elem, 'transformOrigin', '');
        }
        function setOptions(opts) {
            if (opts === void 0) { opts = {}; }
            for (var key in opts) {
                if (opts.hasOwnProperty(key)) {
                    options[key] = opts[key];
                }
            }
            // Handle option side-effects
            if (opts.hasOwnProperty('cursor') || opts.hasOwnProperty('canvas')) {
                parent.style.cursor = elem.style.cursor = '';
                (options.canvas ? parent : elem).style.cursor = options.cursor;
            }
            if (opts.hasOwnProperty('overflow')) {
                parent.style.overflow = opts.overflow;
            }
            if (opts.hasOwnProperty('touchAction')) {
                parent.style.touchAction = opts.touchAction;
                elem.style.touchAction = opts.touchAction;
            }
        }
        var x = 0;
        var y = 0;
        var scale = 1;
        var isPanning = false;
        zoom(options.startScale, { animate: false, force: true });
        // Wait for scale to update
        // for accurate dimensions
        // to constrain initial values
        setTimeout(function () {
            pan(options.startX, options.startY, { animate: false, force: true });
        });
        function trigger(eventName, detail, opts) {
            if (opts.silent) {
                return;
            }
            var event = new CustomEvent(eventName, { detail: detail });
            elem.dispatchEvent(event);
        }
        function setTransformWithEvent(eventName, opts, originalEvent) {
            var value = { x: x, y: y, scale: scale, isSVG: isSVG, originalEvent: originalEvent };
            requestAnimationFrame(function () {
                if (typeof opts.animate === 'boolean') {
                    if (opts.animate) {
                        setTransition(elem, opts);
                    }
                    else {
                        setStyle(elem, 'transition', 'none');
                    }
                }
                opts.setTransform(elem, value, opts);
                trigger(eventName, value, opts);
                trigger('panzoomchange', value, opts);
            });
            return value;
        }
        function constrainXY(toX, toY, toScale, panOptions) {
            var opts = __assign(__assign({}, options), panOptions);
            var result = { x: x, y: y, opts: opts };
            if (!opts.force && (opts.disablePan || (opts.panOnlyWhenZoomed && scale === opts.startScale))) {
                return result;
            }
            toX = parseFloat(toX);
            toY = parseFloat(toY);
            if (!opts.disableXAxis) {
                result.x = (opts.relative ? x : 0) + toX;
            }
            if (!opts.disableYAxis) {
                result.y = (opts.relative ? y : 0) + toY;
            }
            if (opts.contain) {
                var dims = getDimensions(elem);
                var realWidth = dims.elem.width / scale;
                var realHeight = dims.elem.height / scale;
                var scaledWidth = realWidth * toScale;
                var scaledHeight = realHeight * toScale;
                var diffHorizontal = (scaledWidth - realWidth) / 2;
                var diffVertical = (scaledHeight - realHeight) / 2;
                if (opts.contain === 'inside') {
                    var minX = (-dims.elem.margin.left - dims.parent.padding.left + diffHorizontal) / toScale;
                    var maxX = (dims.parent.width -
                        scaledWidth -
                        dims.parent.padding.left -
                        dims.elem.margin.left -
                        dims.parent.border.left -
                        dims.parent.border.right +
                        diffHorizontal) /
                        toScale;
                    result.x = Math.max(Math.min(result.x, maxX), minX);
                    var minY = (-dims.elem.margin.top - dims.parent.padding.top + diffVertical) / toScale;
                    var maxY = (dims.parent.height -
                        scaledHeight -
                        dims.parent.padding.top -
                        dims.elem.margin.top -
                        dims.parent.border.top -
                        dims.parent.border.bottom +
                        diffVertical) /
                        toScale;
                    result.y = Math.max(Math.min(result.y, maxY), minY);
                }
                else if (opts.contain === 'outside') {
                    var minX = (-(scaledWidth - dims.parent.width) -
                        dims.parent.padding.left -
                        dims.parent.border.left -
                        dims.parent.border.right +
                        diffHorizontal) /
                        toScale;
                    var maxX = (diffHorizontal - dims.parent.padding.left) / toScale;
                    result.x = Math.max(Math.min(result.x, maxX), minX);
                    var minY = (-(scaledHeight - dims.parent.height) -
                        dims.parent.padding.top -
                        dims.parent.border.top -
                        dims.parent.border.bottom +
                        diffVertical) /
                        toScale;
                    var maxY = (diffVertical - dims.parent.padding.top) / toScale;
                    result.y = Math.max(Math.min(result.y, maxY), minY);
                }
            }
            if (opts.roundPixels) {
                result.x = Math.round(result.x);
                result.y = Math.round(result.y);
            }
            return result;
        }
        function constrainScale(toScale, zoomOptions) {
            var opts = __assign(__assign({}, options), zoomOptions);
            var result = { scale: scale, opts: opts };
            if (!opts.force && opts.disableZoom) {
                return result;
            }
            var minScale = options.minScale;
            var maxScale = options.maxScale;
            if (opts.contain) {
                var dims = getDimensions(elem);
                var elemWidth = dims.elem.width / scale;
                var elemHeight = dims.elem.height / scale;
                if (elemWidth > 1 && elemHeight > 1) {
                    var parentWidth = dims.parent.width - dims.parent.border.left - dims.parent.border.right;
                    var parentHeight = dims.parent.height - dims.parent.border.top - dims.parent.border.bottom;
                    var elemScaledWidth = parentWidth / elemWidth;
                    var elemScaledHeight = parentHeight / elemHeight;
                    if (options.contain === 'inside') {
                        maxScale = Math.min(maxScale, elemScaledWidth, elemScaledHeight);
                    }
                    else if (options.contain === 'outside') {
                        minScale = Math.max(minScale, elemScaledWidth, elemScaledHeight);
                    }
                }
            }
            result.scale = Math.min(Math.max(toScale, minScale), maxScale);
            return result;
        }
        function pan(toX, toY, panOptions, originalEvent) {
            var result = constrainXY(toX, toY, scale, panOptions);
            // Only try to set if the result is somehow different
            if (x !== result.x || y !== result.y) {
                x = result.x;
                y = result.y;
                return setTransformWithEvent('panzoompan', result.opts, originalEvent);
            }
            return { x: x, y: y, scale: scale, isSVG: isSVG, originalEvent: originalEvent };
        }
        function zoom(toScale, zoomOptions, originalEvent) {
            var result = constrainScale(toScale, zoomOptions);
            var opts = result.opts;
            if (!opts.force && opts.disableZoom) {
                return;
            }
            toScale = result.scale;
            var toX = x;
            var toY = y;
            if (opts.focal) {
                // The difference between the point after the scale and the point before the scale
                // plus the current translation after the scale
                // neutralized to no scale (as the transform scale will apply to the translation)
                var focal = opts.focal;
                toX = (focal.x / toScale - focal.x / scale + x * toScale) / toScale;
                toY = (focal.y / toScale - focal.y / scale + y * toScale) / toScale;
            }
            var panResult = constrainXY(toX, toY, toScale, { relative: false, force: true });
            x = panResult.x;
            y = panResult.y;
            scale = toScale;
            return setTransformWithEvent('panzoomzoom', opts, originalEvent);
        }
        function zoomInOut(isIn, zoomOptions) {
            var opts = __assign(__assign(__assign({}, options), { animate: true }), zoomOptions);
            return zoom(scale * Math.exp((isIn ? 1 : -1) * opts.step), opts);
        }
        function zoomIn(zoomOptions) {
            return zoomInOut(true, zoomOptions);
        }
        function zoomOut(zoomOptions) {
            return zoomInOut(false, zoomOptions);
        }
        function zoomToPoint(toScale, point, zoomOptions, originalEvent) {
            var dims = getDimensions(elem);
            // Instead of thinking of operating on the panzoom element,
            // think of operating on the area inside the panzoom
            // element's parent
            // Subtract padding and border
            var effectiveArea = {
                width: dims.parent.width -
                    dims.parent.padding.left -
                    dims.parent.padding.right -
                    dims.parent.border.left -
                    dims.parent.border.right,
                height: dims.parent.height -
                    dims.parent.padding.top -
                    dims.parent.padding.bottom -
                    dims.parent.border.top -
                    dims.parent.border.bottom
            };
            // Adjust the clientX/clientY to ignore the area
            // outside the effective area
            var clientX = point.clientX -
                dims.parent.left -
                dims.parent.padding.left -
                dims.parent.border.left -
                dims.elem.margin.left;
            var clientY = point.clientY -
                dims.parent.top -
                dims.parent.padding.top -
                dims.parent.border.top -
                dims.elem.margin.top;
            // Adjust the clientX/clientY for HTML elements,
            // because they have a transform-origin of 50% 50%
            if (!isSVG) {
                clientX -= dims.elem.width / scale / 2;
                clientY -= dims.elem.height / scale / 2;
            }
            // Convert the mouse point from it's position over the
            // effective area before the scale to the position
            // over the effective area after the scale.
            var focal = {
                x: (clientX / effectiveArea.width) * (effectiveArea.width * toScale),
                y: (clientY / effectiveArea.height) * (effectiveArea.height * toScale)
            };
            return zoom(toScale, __assign(__assign({ animate: false }, zoomOptions), { focal: focal }), originalEvent);
        }
        function zoomWithWheel(event, zoomOptions) {
            // Need to prevent the default here
            // or it conflicts with regular page scroll
            event.preventDefault();
            var opts = __assign(__assign(__assign({}, options), zoomOptions), { animate: false });
            // Normalize to deltaX in case shift modifier is used on Mac
            var delta = event.deltaY === 0 && event.deltaX ? event.deltaX : event.deltaY;
            var wheel = delta < 0 ? 1 : -1;
            var toScale = constrainScale(scale * Math.exp((wheel * opts.step) / 3), opts).scale;
            return zoomToPoint(toScale, event, opts);
        }
        function reset(resetOptions) {
            var opts = __assign(__assign(__assign({}, options), { animate: true, force: true }), resetOptions);
            scale = constrainScale(opts.startScale, opts).scale;
            var panResult = constrainXY(opts.startX, opts.startY, scale, opts);
            x = panResult.x;
            y = panResult.y;
            return setTransformWithEvent('panzoomreset', opts);
        }
        var origX;
        var origY;
        var startClientX;
        var startClientY;
        var startScale;
        var startDistance;
        var pointers = [];
        function handleDown(event) {
            // Don't handle this event if the target is excluded
            if (isExcluded(event.target, options)) {
                return;
            }
            addPointer(pointers, event);
            isPanning = true;
            options.handleStartEvent(event);
            origX = x;
            origY = y;
            trigger('panzoomstart', { x: x, y: y, scale: scale, isSVG: isSVG, originalEvent: event }, options);
            // This works whether there are multiple
            // pointers or not
            var point = getMiddle(pointers);
            startClientX = point.clientX;
            startClientY = point.clientY;
            startScale = scale;
            startDistance = getDistance(pointers);
        }
        function move(event) {
            if (!isPanning ||
                origX === undefined ||
                origY === undefined ||
                startClientX === undefined ||
                startClientY === undefined) {
                return;
            }
            addPointer(pointers, event);
            var current = getMiddle(pointers);
            if (pointers.length > 1) {
                // A startDistance of 0 means
                // that there weren't 2 pointers
                // handled on start
                if (startDistance === 0) {
                    startDistance = getDistance(pointers);
                }
                // Use the distance between the first 2 pointers
                // to determine the current scale
                var diff = getDistance(pointers) - startDistance;
                var toScale = constrainScale((diff * options.step) / 80 + startScale).scale;
                zoomToPoint(toScale, current);
            }
            else {
                // Panning during pinch zoom can cause issues
                // because the zoom has not always rendered in time
                // for accurate calculations
                // See https://github.com/timmywil/panzoom/issues/512
                pan(origX + (current.clientX - startClientX) / scale, origY + (current.clientY - startClientY) / scale, {
                    animate: false
                }, event);
            }
        }
        function handleUp(event) {
            // Don't call panzoomend when panning with 2 touches
            // until both touches end
            if (pointers.length === 1) {
                trigger('panzoomend', { x: x, y: y, scale: scale, isSVG: isSVG, originalEvent: event }, options);
            }
            // Note: don't remove all pointers
            // Can restart without having to reinitiate all of them
            // Remove the pointer regardless of the isPanning state
            removePointer(pointers, event);
            if (!isPanning) {
                return;
            }
            isPanning = false;
            origX = origY = startClientX = startClientY = undefined;
        }
        var bound = false;
        function bind() {
            if (bound) {
                return;
            }
            bound = true;
            onPointer('down', options.canvas ? parent : elem, handleDown);
            onPointer('move', document, move, { passive: true });
            onPointer('up', document, handleUp, { passive: true });
        }
        function destroy() {
            bound = false;
            destroyPointer('down', options.canvas ? parent : elem, handleDown);
            destroyPointer('move', document, move);
            destroyPointer('up', document, handleUp);
        }
        if (!options.noBind) {
            bind();
        }
        return {
            bind: bind,
            destroy: destroy,
            eventNames: events$1,
            getPan: function () { return ({ x: x, y: y }); },
            getScale: function () { return scale; },
            getOptions: function () { return shallowClone(options); },
            pan: pan,
            reset: reset,
            resetStyle: resetStyle,
            setOptions: setOptions,
            setStyle: function (name, value) { return setStyle(elem, name, value); },
            zoom: zoom,
            zoomIn: zoomIn,
            zoomOut: zoomOut,
            zoomToPoint: zoomToPoint,
            zoomWithWheel: zoomWithWheel
        };
    }
    Panzoom.defaultOptions = defaultOptions;

    // Adapted from https://github.com/hperrin/svelte-material-ui/blob/master/packages/common/forwardEvents.js

    // prettier-ignore
    const events = [
        'focus', 'blur',
        'fullscreenchange', 'fullscreenerror', 'scroll',
        'cut', 'copy', 'paste',
        'keydown', 'keypress', 'keyup',
        'auxclick', 'click', 'contextmenu', 'dblclick',
        'mousedown', 'mouseenter', 'mouseleave', 'mousemove', 'mouseover', 'mouseout', 'mouseup',
        'pointerlockchange', 'pointerlockerror', 'select', 'wheel',
        'drag', 'dragend', 'dragenter', 'dragstart', 'dragleave', 'dragover', 'drop',
        'touchcancel', 'touchend', 'touchmove', 'touchstart',
        'pointerover', 'pointerenter', 'pointerdown', 'pointermove', 'pointerup', 'pointercancel', 'pointerout', 'pointerleave', 
        'gotpointercapture', 'lostpointercapture'
      ];

    function forwardEventsBuilder() {
      const component = get_current_component();

      return node => {
        const destructors = events.map(event =>
          listen$1(node, event, e => bubble(component, e))
        );

        return {
          destroy: () => destructors.forEach(destroy => destroy())
        };
      };
    }

    class RenderManager {
      constructor() {
        this.register = this.register.bind(this);
        this.unregister = this.unregister.bind(this);
        this.redraw = this.redraw.bind(this);
        this.resize = this.resize.bind(this);
        this.render = this.render.bind(this);

        this.currentLayerId = 0;
        this.setups = new Map();
        this.renderers = new Map();

        this.needsSetup = false;
        this.needsResize = true;
        this.needsRedraw = true;

        this.layerSequence = [];
      }

      redraw() {
        this.needsRedraw = true;
      }

      resize() {
        this.needsResize = true;
        this.needsRedraw = true;
      }

      register({ setup, render }) {
        if (setup) {
          this.setups.set(this.currentLayerId, setup);
          this.needsSetup = true;
        }

        this.renderers.set(this.currentLayerId, render);

        this.needsRedraw = true;
        return this.currentLayerId++;
      }

      unregister(layerId) {
        this.renderers.delete(layerId);
        this.needsRedraw = true;
      }

      render({ autoclear, pixelRatio, context, width, height }) {
        const renderProps = { context, width, height };

        if (this.needsResize) {
          context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
          this.needsResize = false;
        }

        if (this.needsSetup) {
          for (const [layerId, setup] of this.setups) {
            setup(renderProps);
            this.setups.delete(layerId);
          }

          this.needsSetup = false;
        }

        if (this.needsRedraw) {
          if (autoclear) {
            context.clearRect(0, 0, width, height);
          }

          for (const layerId of this.layerSequence) {
            this.renderers.get(layerId)(renderProps);
          }

          this.needsRedraw = false;
        }
      }
    }

    /* node_modules\svelte-canvas\src\components\Canvas.svelte generated by Svelte v3.49.0 */
    const file$2 = "node_modules\\svelte-canvas\\src\\components\\Canvas.svelte";

    function create_fragment$2(ctx) {
    	let canvas_1;
    	let canvas_1_style_value;
    	let canvas_1_width_value;
    	let canvas_1_height_value;
    	let t;
    	let div;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[13].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[12], null);

    	const block = {
    		c: function create() {
    			canvas_1 = element("canvas");
    			t = space();
    			div = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(canvas_1, "style", canvas_1_style_value = "display: block; width: " + /*width*/ ctx[1] + "px; height: " + /*height*/ ctx[2] + "px;" + (/*style*/ ctx[3] ? ` ${/*style*/ ctx[3]}` : ''));
    			attr_dev(canvas_1, "width", canvas_1_width_value = /*width*/ ctx[1] * /*pixelRatio*/ ctx[0]);
    			attr_dev(canvas_1, "height", canvas_1_height_value = /*height*/ ctx[2] * /*pixelRatio*/ ctx[0]);
    			add_location(canvas_1, file$2, 80, 0, 1793);
    			set_style(div, "display", "none");
    			add_location(div, file$2, 90, 0, 2004);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, canvas_1, anchor);
    			/*canvas_1_binding*/ ctx[14](canvas_1);
    			insert_dev(target, t, anchor);
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			/*div_binding*/ ctx[15](div);
    			current = true;

    			if (!mounted) {
    				dispose = action_destroyer(/*forwardEvents*/ ctx[6].call(null, canvas_1));
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*width, height, style*/ 14 && canvas_1_style_value !== (canvas_1_style_value = "display: block; width: " + /*width*/ ctx[1] + "px; height: " + /*height*/ ctx[2] + "px;" + (/*style*/ ctx[3] ? ` ${/*style*/ ctx[3]}` : ''))) {
    				attr_dev(canvas_1, "style", canvas_1_style_value);
    			}

    			if (!current || dirty & /*width, pixelRatio*/ 3 && canvas_1_width_value !== (canvas_1_width_value = /*width*/ ctx[1] * /*pixelRatio*/ ctx[0])) {
    				attr_dev(canvas_1, "width", canvas_1_width_value);
    			}

    			if (!current || dirty & /*height, pixelRatio*/ 5 && canvas_1_height_value !== (canvas_1_height_value = /*height*/ ctx[2] * /*pixelRatio*/ ctx[0])) {
    				attr_dev(canvas_1, "height", canvas_1_height_value);
    			}

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 4096)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[12],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[12])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[12], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(canvas_1);
    			/*canvas_1_binding*/ ctx[14](null);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    			/*div_binding*/ ctx[15](null);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const KEY = {};

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Canvas', slots, ['default']);
    	let { width = 640, height = 640, pixelRatio = undefined, style = null, autoclear = true } = $$props;
    	let canvas, context, animationLoop, layerRef, layerObserver;
    	const forwardEvents = forwardEventsBuilder();
    	const manager = new RenderManager();

    	function redraw() {
    		manager.redraw();
    	}

    	function getCanvas() {
    		return canvas;
    	}

    	function getContext() {
    		return context;
    	}

    	if (pixelRatio === undefined) {
    		if (typeof window === 'undefined') {
    			pixelRatio = 2;
    		} else {
    			pixelRatio = window.devicePixelRatio;
    		}
    	}

    	function draw() {
    		manager.render({
    			context,
    			width,
    			height,
    			pixelRatio,
    			autoclear
    		});

    		animationLoop = window.requestAnimationFrame(draw);
    	}

    	setContext(KEY, {
    		register: manager.register,
    		unregister: manager.unregister,
    		redraw: manager.redraw
    	});

    	onMount(() => {
    		context = canvas.getContext('2d');
    		layerObserver = new MutationObserver(getLayerSequence);
    		layerObserver.observe(layerRef, { childList: true });
    		getLayerSequence();
    		draw();

    		function getLayerSequence() {
    			const sequence = [...layerRef.children].map(layer => +layer.dataset.layerId);
    			$$invalidate(11, manager.layerSequence = sequence, manager);
    			manager.redraw();
    		}
    	});

    	onDestroy(() => {
    		if (typeof window === 'undefined') return;
    		window.cancelAnimationFrame(animationLoop);
    		layerObserver.disconnect();
    	});

    	const writable_props = ['width', 'height', 'pixelRatio', 'style', 'autoclear'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Canvas> was created with unknown prop '${key}'`);
    	});

    	function canvas_1_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			canvas = $$value;
    			$$invalidate(4, canvas);
    		});
    	}

    	function div_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			layerRef = $$value;
    			$$invalidate(5, layerRef);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('width' in $$props) $$invalidate(1, width = $$props.width);
    		if ('height' in $$props) $$invalidate(2, height = $$props.height);
    		if ('pixelRatio' in $$props) $$invalidate(0, pixelRatio = $$props.pixelRatio);
    		if ('style' in $$props) $$invalidate(3, style = $$props.style);
    		if ('autoclear' in $$props) $$invalidate(7, autoclear = $$props.autoclear);
    		if ('$$scope' in $$props) $$invalidate(12, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		KEY,
    		onMount,
    		onDestroy,
    		setContext,
    		forwardEventsBuilder,
    		RenderManager,
    		width,
    		height,
    		pixelRatio,
    		style,
    		autoclear,
    		canvas,
    		context,
    		animationLoop,
    		layerRef,
    		layerObserver,
    		forwardEvents,
    		manager,
    		redraw,
    		getCanvas,
    		getContext,
    		draw
    	});

    	$$self.$inject_state = $$props => {
    		if ('width' in $$props) $$invalidate(1, width = $$props.width);
    		if ('height' in $$props) $$invalidate(2, height = $$props.height);
    		if ('pixelRatio' in $$props) $$invalidate(0, pixelRatio = $$props.pixelRatio);
    		if ('style' in $$props) $$invalidate(3, style = $$props.style);
    		if ('autoclear' in $$props) $$invalidate(7, autoclear = $$props.autoclear);
    		if ('canvas' in $$props) $$invalidate(4, canvas = $$props.canvas);
    		if ('context' in $$props) context = $$props.context;
    		if ('animationLoop' in $$props) animationLoop = $$props.animationLoop;
    		if ('layerRef' in $$props) $$invalidate(5, layerRef = $$props.layerRef);
    		if ('layerObserver' in $$props) layerObserver = $$props.layerObserver;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*width, height, pixelRatio, autoclear, manager*/ 2183) {
    			(manager.resize());
    		}
    	};

    	return [
    		pixelRatio,
    		width,
    		height,
    		style,
    		canvas,
    		layerRef,
    		forwardEvents,
    		autoclear,
    		redraw,
    		getCanvas,
    		getContext,
    		manager,
    		$$scope,
    		slots,
    		canvas_1_binding,
    		div_binding
    	];
    }

    class Canvas extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$1, create_fragment$2, safe_not_equal, {
    			width: 1,
    			height: 2,
    			pixelRatio: 0,
    			style: 3,
    			autoclear: 7,
    			redraw: 8,
    			getCanvas: 9,
    			getContext: 10
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Canvas",
    			options,
    			id: create_fragment$2.name
    		});
    	}

    	get width() {
    		throw new Error("<Canvas>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set width(value) {
    		throw new Error("<Canvas>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get height() {
    		throw new Error("<Canvas>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set height(value) {
    		throw new Error("<Canvas>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get pixelRatio() {
    		throw new Error("<Canvas>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set pixelRatio(value) {
    		throw new Error("<Canvas>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get style() {
    		throw new Error("<Canvas>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set style(value) {
    		throw new Error("<Canvas>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get autoclear() {
    		throw new Error("<Canvas>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set autoclear(value) {
    		throw new Error("<Canvas>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get redraw() {
    		return this.$$.ctx[8];
    	}

    	set redraw(value) {
    		throw new Error("<Canvas>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getCanvas() {
    		return this.$$.ctx[9];
    	}

    	set getCanvas(value) {
    		throw new Error("<Canvas>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getContext() {
    		return this.$$.ctx[10];
    	}

    	set getContext(value) {
    		throw new Error("<Canvas>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\svelte-canvas\src\components\Layer.svelte generated by Svelte v3.49.0 */

    const { Error: Error_1 } = globals;
    const file$1 = "node_modules\\svelte-canvas\\src\\components\\Layer.svelte";

    function create_fragment$1(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "data-layer-id", /*layerId*/ ctx[0]);
    			add_location(div, file$1, 24, 0, 548);
    		},
    		l: function claim(nodes) {
    			throw new Error_1("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop$1,
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Layer', slots, []);
    	const { register, unregister, redraw } = getContext(KEY);

    	let { setup = undefined, render = () => {
    		
    	} } = $$props;

    	if (typeof setup !== 'function' && setup !== undefined) {
    		throw new Error('setup must be a function');
    	}

    	if (typeof render !== 'function') {
    		throw new Error('render must be a function');
    	}

    	const layerId = register({ setup, render });
    	onDestroy(() => unregister(layerId));
    	const writable_props = ['setup', 'render'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Layer> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('setup' in $$props) $$invalidate(1, setup = $$props.setup);
    		if ('render' in $$props) $$invalidate(2, render = $$props.render);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		onDestroy,
    		KEY,
    		register,
    		unregister,
    		redraw,
    		setup,
    		render,
    		layerId
    	});

    	$$self.$inject_state = $$props => {
    		if ('setup' in $$props) $$invalidate(1, setup = $$props.setup);
    		if ('render' in $$props) $$invalidate(2, render = $$props.render);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*render*/ 4) {
    			(redraw());
    		}
    	};

    	return [layerId, setup, render];
    }

    class Layer extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment$1, safe_not_equal, { setup: 1, render: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Layer",
    			options,
    			id: create_fragment$1.name
    		});
    	}

    	get setup() {
    		throw new Error_1("<Layer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set setup(value) {
    		throw new Error_1("<Layer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get render() {
    		throw new Error_1("<Layer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set render(value) {
    		throw new Error_1("<Layer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    let frame;

    const now = Date.now();

    function start(set) {
      set(Date.now() - now);

      frame = window.requestAnimationFrame(() => start(set));
      return () => window.cancelAnimationFrame(frame);
    }

    function noop() {}

    var t = readable(
      Date.now() - now,
      typeof window === 'undefined' ? noop : start
    );

    class Helper {
    	constructor() {
    		console.log("working");
    	}
    	getMousePos(canvas, evt, rect) {
    		return { x: evt.clientX - rect.left, y: evt.clientY - rect.top };
    	}
    	scaleNumber(num, oldRange, newRange){
            let a = oldRange[0], b = oldRange[1], c = newRange[0], d = newRange[1];
            return (b*c - (a)*d)/(b-a) + (num)*(d/(b-a));
        }
        getIMG(blob, callback){
    		let a = new FileReader();
            a.onload = function(e) {
            	if (callback && typeof callback == "function") callback(e.target.result);
            };
            a.readAsDataURL(blob);
    	}
    }

    /* src\App.svelte generated by Svelte v3.49.0 */

    const { console: console_1 } = globals;
    const file = "src\\App.svelte";

    // (355:2) {#if settingsOpen}
    function create_if_block_5(ctx) {
    	let menu;
    	let current;

    	menu = new Menu({
    			props: {
    				settings: /*proxySettings*/ ctx[6],
    				legacy: /*settings*/ ctx[2].theme,
    				version: /*version*/ ctx[21]
    			},
    			$$inline: true
    		});

    	menu.$on("settingsOpen", /*settingsOpen_handler_1*/ ctx[41]);

    	const block = {
    		c: function create() {
    			create_component(menu.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(menu, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const menu_changes = {};
    			if (dirty[0] & /*proxySettings*/ 64) menu_changes.settings = /*proxySettings*/ ctx[6];
    			if (dirty[0] & /*settings*/ 4) menu_changes.legacy = /*settings*/ ctx[2].theme;
    			menu.$set(menu_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(menu.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(menu.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(menu, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5.name,
    		type: "if",
    		source: "(355:2) {#if settingsOpen}",
    		ctx
    	});

    	return block;
    }

    // (364:2) {#if loading}
    function create_if_block_4(ctx) {
    	let loader;
    	let current;
    	loader = new Loader({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(loader.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(loader, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(loader.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(loader.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(loader, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(364:2) {#if loading}",
    		ctx
    	});

    	return block;
    }

    // (368:2) {#if fileSelected}
    function create_if_block_1(ctx) {
    	let div1;
    	let t0;
    	let zoomscale_1;
    	let t1;
    	let div0;
    	let canvas;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block = /*pickingMode*/ ctx[8] && /*mouseincanvas*/ ctx[14] && create_if_block_3(ctx);

    	zoomscale_1 = new Zoomscale({
    			props: {
    				zoomscale: /*zoomscale*/ ctx[15],
    				instance: /*instance*/ ctx[10]
    			},
    			$$inline: true
    		});

    	canvas = new Canvas({
    			props: {
    				width: /*width*/ ctx[0],
    				height: /*height*/ ctx[1],
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	canvas.$on("mousedown", /*handleMouseDown*/ ctx[24]);
    	canvas.$on("mouseup", /*handleMouseUp*/ ctx[25]);
    	canvas.$on("mousemove", /*handleMouseMove*/ ctx[26]);
    	canvas.$on("mouseenter", /*mouseenter_handler*/ ctx[42]);
    	canvas.$on("mouseleave", /*mouseleave_handler*/ ctx[43]);
    	canvas.$on("click", /*click_handler*/ ctx[44]);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			if (if_block) if_block.c();
    			t0 = space();
    			create_component(zoomscale_1.$$.fragment);
    			t1 = space();
    			div0 = element("div");
    			create_component(canvas.$$.fragment);
    			attr_dev(div0, "class", "canvas-container-inner svelte-nv5cfc");
    			set_style(div0, "opacity", /*workAreaOpacity*/ ctx[17]);
    			toggle_class(div0, "pickingMode", /*pickingMode*/ ctx[8]);
    			toggle_class(div0, "croppingMode", /*croppingMode*/ ctx[9]);
    			add_location(div0, file, 384, 4, 9892);
    			attr_dev(div1, "class", "canvas-container svelte-nv5cfc");
    			toggle_class(div1, "legacy", /*settings*/ ctx[2].theme);
    			toggle_class(div1, "pixelated", /*pixelated*/ ctx[5]);
    			add_location(div1, file, 368, 3, 9586);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			if (if_block) if_block.m(div1, null);
    			append_dev(div1, t0);
    			mount_component(zoomscale_1, div1, null);
    			append_dev(div1, t1);
    			append_dev(div1, div0);
    			mount_component(canvas, div0, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div0, "click", /*click_handler_1*/ ctx[45], false, false, false),
    					listen_dev(div1, "mousemove", /*handleCursor*/ ctx[22], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (/*pickingMode*/ ctx[8] && /*mouseincanvas*/ ctx[14]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty[0] & /*pickingMode, mouseincanvas*/ 16640) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_3(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div1, t0);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			const zoomscale_1_changes = {};
    			if (dirty[0] & /*zoomscale*/ 32768) zoomscale_1_changes.zoomscale = /*zoomscale*/ ctx[15];
    			if (dirty[0] & /*instance*/ 1024) zoomscale_1_changes.instance = /*instance*/ ctx[10];
    			zoomscale_1.$set(zoomscale_1_changes);
    			const canvas_changes = {};
    			if (dirty[0] & /*width*/ 1) canvas_changes.width = /*width*/ ctx[0];
    			if (dirty[0] & /*height*/ 2) canvas_changes.height = /*height*/ ctx[1];

    			if (dirty[0] & /*testRender, croppingMode, render*/ 1573376 | dirty[1] & /*$$scope*/ 8388608) {
    				canvas_changes.$$scope = { dirty, ctx };
    			}

    			canvas.$set(canvas_changes);

    			if (!current || dirty[0] & /*workAreaOpacity*/ 131072) {
    				set_style(div0, "opacity", /*workAreaOpacity*/ ctx[17]);
    			}

    			if (dirty[0] & /*pickingMode*/ 256) {
    				toggle_class(div0, "pickingMode", /*pickingMode*/ ctx[8]);
    			}

    			if (dirty[0] & /*croppingMode*/ 512) {
    				toggle_class(div0, "croppingMode", /*croppingMode*/ ctx[9]);
    			}

    			if (dirty[0] & /*settings*/ 4) {
    				toggle_class(div1, "legacy", /*settings*/ ctx[2].theme);
    			}

    			if (dirty[0] & /*pixelated*/ 32) {
    				toggle_class(div1, "pixelated", /*pixelated*/ ctx[5]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			transition_in(zoomscale_1.$$.fragment, local);
    			transition_in(canvas.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			transition_out(zoomscale_1.$$.fragment, local);
    			transition_out(canvas.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (if_block) if_block.d();
    			destroy_component(zoomscale_1);
    			destroy_component(canvas);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(368:2) {#if fileSelected}",
    		ctx
    	});

    	return block;
    }

    // (375:4) {#if pickingMode && mouseincanvas}
    function create_if_block_3(ctx) {
    	let cursor;
    	let current;

    	cursor = new Cursor({
    			props: {
    				x: /*m*/ ctx[18].x,
    				y: /*m*/ ctx[18].y,
    				chosenColor: /*chosenColor*/ ctx[13]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(cursor.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(cursor, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const cursor_changes = {};
    			if (dirty[0] & /*m*/ 262144) cursor_changes.x = /*m*/ ctx[18].x;
    			if (dirty[0] & /*m*/ 262144) cursor_changes.y = /*m*/ ctx[18].y;
    			if (dirty[0] & /*chosenColor*/ 8192) cursor_changes.chosenColor = /*chosenColor*/ ctx[13];
    			cursor.$set(cursor_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(cursor.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(cursor.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(cursor, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(375:4) {#if pickingMode && mouseincanvas}",
    		ctx
    	});

    	return block;
    }

    // (417:6) {#if croppingMode}
    function create_if_block_2(ctx) {
    	let layer;
    	let current;

    	layer = new Layer({
    			props: { render: /*testRender*/ ctx[19] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(layer.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(layer, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const layer_changes = {};
    			if (dirty[0] & /*testRender*/ 524288) layer_changes.render = /*testRender*/ ctx[19];
    			layer.$set(layer_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(layer.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(layer.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(layer, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(417:6) {#if croppingMode}",
    		ctx
    	});

    	return block;
    }

    // (399:8) <Canvas           width={width}           height={height}           on:mousedown={handleMouseDown}           on:mouseup={handleMouseUp}           on:mousemove={handleMouseMove}           on:mouseenter={() => { mouseincanvas = true; }}           on:mouseleave={() => { mouseincanvas = false; }}           on:click={() => {            if (pickingMode) {             pickingMode = false;            instance.setOptions({ disablePan: false });             hex = chosenColor;            }           }}          >
    function create_default_slot_1(ctx) {
    	let layer;
    	let t_1;
    	let if_block_anchor;
    	let current;

    	layer = new Layer({
    			props: { render: /*render*/ ctx[20] },
    			$$inline: true
    		});

    	let if_block = /*croppingMode*/ ctx[9] && create_if_block_2(ctx);

    	const block = {
    		c: function create() {
    			create_component(layer.$$.fragment);
    			t_1 = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			mount_component(layer, target, anchor);
    			insert_dev(target, t_1, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const layer_changes = {};
    			if (dirty[0] & /*render*/ 1048576) layer_changes.render = /*render*/ ctx[20];
    			layer.$set(layer_changes);

    			if (/*croppingMode*/ ctx[9]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty[0] & /*croppingMode*/ 512) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_2(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(layer.$$.fragment, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(layer.$$.fragment, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(layer, detaching);
    			if (detaching) detach_dev(t_1);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(399:8) <Canvas           width={width}           height={height}           on:mousedown={handleMouseDown}           on:mouseup={handleMouseUp}           on:mousemove={handleMouseMove}           on:mouseenter={() => { mouseincanvas = true; }}           on:mouseleave={() => { mouseincanvas = false; }}           on:click={() => {            if (pickingMode) {             pickingMode = false;            instance.setOptions({ disablePan: false });             hex = chosenColor;            }           }}          >",
    		ctx
    	});

    	return block;
    }

    // (425:2) {#if !fileSelected && !loading}
    function create_if_block(ctx) {
    	let dropfield;
    	let current;

    	dropfield = new Dropfield({
    			props: { legacy: /*settings*/ ctx[2].theme },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(dropfield.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(dropfield, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const dropfield_changes = {};
    			if (dirty[0] & /*settings*/ 4) dropfield_changes.legacy = /*settings*/ ctx[2].theme;
    			dropfield.$set(dropfield_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(dropfield.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(dropfield.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(dropfield, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(425:2) {#if !fileSelected && !loading}",
    		ctx
    	});

    	return block;
    }

    // (347:1) <Desktop    {fileSelected}    {backdropColor}    {settingsOpen}    legacy={settings.theme}    settings={proxySettings}    bind:loading   >
    function create_default_slot(ctx) {
    	let t0;
    	let t1;
    	let t2;
    	let t3;
    	let actions;
    	let current;
    	let if_block0 = /*settingsOpen*/ ctx[7] && create_if_block_5(ctx);
    	let if_block1 = /*loading*/ ctx[11] && create_if_block_4(ctx);
    	let if_block2 = /*fileSelected*/ ctx[4] && create_if_block_1(ctx);
    	let if_block3 = !/*fileSelected*/ ctx[4] && !/*loading*/ ctx[11] && create_if_block(ctx);
    	actions = new Actions({ $$inline: true });

    	const block = {
    		c: function create() {
    			if (if_block0) if_block0.c();
    			t0 = space();
    			if (if_block1) if_block1.c();
    			t1 = space();
    			if (if_block2) if_block2.c();
    			t2 = space();
    			if (if_block3) if_block3.c();
    			t3 = space();
    			create_component(actions.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t0, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, t1, anchor);
    			if (if_block2) if_block2.m(target, anchor);
    			insert_dev(target, t2, anchor);
    			if (if_block3) if_block3.m(target, anchor);
    			insert_dev(target, t3, anchor);
    			mount_component(actions, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*settingsOpen*/ ctx[7]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty[0] & /*settingsOpen*/ 128) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_5(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(t0.parentNode, t0);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (/*loading*/ ctx[11]) {
    				if (if_block1) {
    					if (dirty[0] & /*loading*/ 2048) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block_4(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(t1.parentNode, t1);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}

    			if (/*fileSelected*/ ctx[4]) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);

    					if (dirty[0] & /*fileSelected*/ 16) {
    						transition_in(if_block2, 1);
    					}
    				} else {
    					if_block2 = create_if_block_1(ctx);
    					if_block2.c();
    					transition_in(if_block2, 1);
    					if_block2.m(t2.parentNode, t2);
    				}
    			} else if (if_block2) {
    				group_outros();

    				transition_out(if_block2, 1, 1, () => {
    					if_block2 = null;
    				});

    				check_outros();
    			}

    			if (!/*fileSelected*/ ctx[4] && !/*loading*/ ctx[11]) {
    				if (if_block3) {
    					if_block3.p(ctx, dirty);

    					if (dirty[0] & /*fileSelected, loading*/ 2064) {
    						transition_in(if_block3, 1);
    					}
    				} else {
    					if_block3 = create_if_block(ctx);
    					if_block3.c();
    					transition_in(if_block3, 1);
    					if_block3.m(t3.parentNode, t3);
    				}
    			} else if (if_block3) {
    				group_outros();

    				transition_out(if_block3, 1, 1, () => {
    					if_block3 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(if_block1);
    			transition_in(if_block2);
    			transition_in(if_block3);
    			transition_in(actions.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(if_block1);
    			transition_out(if_block2);
    			transition_out(if_block3);
    			transition_out(actions.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t0);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(t1);
    			if (if_block2) if_block2.d(detaching);
    			if (detaching) detach_dev(t2);
    			if (if_block3) if_block3.d(detaching);
    			if (detaching) detach_dev(t3);
    			destroy_component(actions, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(347:1) <Desktop    {fileSelected}    {backdropColor}    {settingsOpen}    legacy={settings.theme}    settings={proxySettings}    bind:loading   >",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let backdrop;
    	let t0;
    	let main;
    	let titlebar;
    	let t1;
    	let toolbox;
    	let updating_backdropColor;
    	let t2;
    	let desktop;
    	let updating_loading;
    	let current;
    	let mounted;
    	let dispose;

    	backdrop = new Backdrop({
    			props: { legacy: /*settings*/ ctx[2].theme },
    			$$inline: true
    		});

    	titlebar = new Titlebar({
    			props: {
    				settingsOpen: /*settingsOpen*/ ctx[7],
    				version: /*version*/ ctx[21],
    				fileSelected: /*fileSelected*/ ctx[4],
    				overwrite: /*settings*/ ctx[2].overwrite,
    				legacy: /*settings*/ ctx[2].theme,
    				tips: /*settings*/ ctx[2].tooltips
    			},
    			$$inline: true
    		});

    	titlebar.$on("clear", /*clear_handler*/ ctx[35]);

    	titlebar.$on("copy", function () {
    		if (is_function(/*tbx*/ ctx[16].copyImage)) /*tbx*/ ctx[16].copyImage.apply(this, arguments);
    	});

    	titlebar.$on("settingsOpen", /*settingsOpen_handler*/ ctx[36]);

    	function toolbox_backdropColor_binding(value) {
    		/*toolbox_backdropColor_binding*/ ctx[38](value);
    	}

    	let toolbox_props = {
    		settingsOpen: /*settingsOpen*/ ctx[7],
    		fileSelected: /*fileSelected*/ ctx[4],
    		hex: /*hex*/ ctx[12],
    		legacy: /*settings*/ ctx[2].theme,
    		tips: /*settings*/ ctx[2].tooltips
    	};

    	if (/*backdropColor*/ ctx[3] !== void 0) {
    		toolbox_props.backdropColor = /*backdropColor*/ ctx[3];
    	}

    	toolbox = new Toolbox({ props: toolbox_props, $$inline: true });
    	/*toolbox_binding*/ ctx[37](toolbox);
    	binding_callbacks.push(() => bind(toolbox, 'backdropColor', toolbox_backdropColor_binding));
    	toolbox.$on("cropImage", /*cropImage_handler*/ ctx[39]);
    	toolbox.$on("pickColor", /*pickColor_handler*/ ctx[40]);

    	function desktop_loading_binding(value) {
    		/*desktop_loading_binding*/ ctx[46](value);
    	}

    	let desktop_props = {
    		fileSelected: /*fileSelected*/ ctx[4],
    		backdropColor: /*backdropColor*/ ctx[3],
    		settingsOpen: /*settingsOpen*/ ctx[7],
    		legacy: /*settings*/ ctx[2].theme,
    		settings: /*proxySettings*/ ctx[6],
    		$$slots: { default: [create_default_slot] },
    		$$scope: { ctx }
    	};

    	if (/*loading*/ ctx[11] !== void 0) {
    		desktop_props.loading = /*loading*/ ctx[11];
    	}

    	desktop = new Desktop({ props: desktop_props, $$inline: true });
    	binding_callbacks.push(() => bind(desktop, 'loading', desktop_loading_binding));

    	const block = {
    		c: function create() {
    			create_component(backdrop.$$.fragment);
    			t0 = space();
    			main = element("main");
    			create_component(titlebar.$$.fragment);
    			t1 = space();
    			create_component(toolbox.$$.fragment);
    			t2 = space();
    			create_component(desktop.$$.fragment);
    			attr_dev(main, "class", "svelte-nv5cfc");
    			toggle_class(main, "legacy", /*settings*/ ctx[2].theme);
    			add_location(main, file, 305, 0, 8193);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(backdrop, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, main, anchor);
    			mount_component(titlebar, main, null);
    			append_dev(main, t1);
    			mount_component(toolbox, main, null);
    			append_dev(main, t2);
    			mount_component(desktop, main, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(window, "paste", /*handlePaste*/ ctx[27], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const backdrop_changes = {};
    			if (dirty[0] & /*settings*/ 4) backdrop_changes.legacy = /*settings*/ ctx[2].theme;
    			backdrop.$set(backdrop_changes);
    			const titlebar_changes = {};
    			if (dirty[0] & /*settingsOpen*/ 128) titlebar_changes.settingsOpen = /*settingsOpen*/ ctx[7];
    			if (dirty[0] & /*fileSelected*/ 16) titlebar_changes.fileSelected = /*fileSelected*/ ctx[4];
    			if (dirty[0] & /*settings*/ 4) titlebar_changes.overwrite = /*settings*/ ctx[2].overwrite;
    			if (dirty[0] & /*settings*/ 4) titlebar_changes.legacy = /*settings*/ ctx[2].theme;
    			if (dirty[0] & /*settings*/ 4) titlebar_changes.tips = /*settings*/ ctx[2].tooltips;
    			titlebar.$set(titlebar_changes);
    			const toolbox_changes = {};
    			if (dirty[0] & /*settingsOpen*/ 128) toolbox_changes.settingsOpen = /*settingsOpen*/ ctx[7];
    			if (dirty[0] & /*fileSelected*/ 16) toolbox_changes.fileSelected = /*fileSelected*/ ctx[4];
    			if (dirty[0] & /*hex*/ 4096) toolbox_changes.hex = /*hex*/ ctx[12];
    			if (dirty[0] & /*settings*/ 4) toolbox_changes.legacy = /*settings*/ ctx[2].theme;
    			if (dirty[0] & /*settings*/ 4) toolbox_changes.tips = /*settings*/ ctx[2].tooltips;

    			if (!updating_backdropColor && dirty[0] & /*backdropColor*/ 8) {
    				updating_backdropColor = true;
    				toolbox_changes.backdropColor = /*backdropColor*/ ctx[3];
    				add_flush_callback(() => updating_backdropColor = false);
    			}

    			toolbox.$set(toolbox_changes);
    			const desktop_changes = {};
    			if (dirty[0] & /*fileSelected*/ 16) desktop_changes.fileSelected = /*fileSelected*/ ctx[4];
    			if (dirty[0] & /*backdropColor*/ 8) desktop_changes.backdropColor = /*backdropColor*/ ctx[3];
    			if (dirty[0] & /*settingsOpen*/ 128) desktop_changes.settingsOpen = /*settingsOpen*/ ctx[7];
    			if (dirty[0] & /*settings*/ 4) desktop_changes.legacy = /*settings*/ ctx[2].theme;
    			if (dirty[0] & /*proxySettings*/ 64) desktop_changes.settings = /*proxySettings*/ ctx[6];

    			if (dirty[0] & /*settings, fileSelected, loading, pixelated, workAreaOpacity, pickingMode, croppingMode, instance, width, height, mouseincanvas, hex, chosenColor, testRender, render, zoomscale, m, proxySettings, settingsOpen*/ 2031607 | dirty[1] & /*$$scope*/ 8388608) {
    				desktop_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_loading && dirty[0] & /*loading*/ 2048) {
    				updating_loading = true;
    				desktop_changes.loading = /*loading*/ ctx[11];
    				add_flush_callback(() => updating_loading = false);
    			}

    			desktop.$set(desktop_changes);

    			if (dirty[0] & /*settings*/ 4) {
    				toggle_class(main, "legacy", /*settings*/ ctx[2].theme);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(backdrop.$$.fragment, local);
    			transition_in(titlebar.$$.fragment, local);
    			transition_in(toolbox.$$.fragment, local);
    			transition_in(desktop.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(backdrop.$$.fragment, local);
    			transition_out(titlebar.$$.fragment, local);
    			transition_out(toolbox.$$.fragment, local);
    			transition_out(desktop.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(backdrop, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(main);
    			destroy_component(titlebar);
    			/*toolbox_binding*/ ctx[37](null);
    			destroy_component(toolbox);
    			destroy_component(desktop);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance_1($$self, $$props, $$invalidate) {
    	let render;
    	let testRender;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	const { ipcRenderer } = require('electron');
    	const { version } = require('../package.json');
    	const helper = new Helper();
    	let fileSelected = false;
    	let width;
    	let height;
    	let pixelated = false;
    	let settings = {};
    	let proxySettings;
    	let settingsOpen = false;
    	let pickingMode = false;
    	let croppingMode = false;
    	let initUpdate = 0;
    	let instance;
    	let loading = false;
    	let element;
    	let hex;
    	let chosenColor;
    	let mouseincanvas = false;
    	let zoomscale = 1;
    	let tbx;
    	let backdropColor = settings.theme ? "#111111" : "#2F2E33";
    	let workAreaOpacity = 1;
    	let m = { x: 0, y: 0 };
    	let img = new Image();

    	img.onload = function () {
    		$$invalidate(0, width = img.width);
    		$$invalidate(1, height = img.height);
    	};

    	ipcRenderer.on('loading', (event, arg) => {
    		$$invalidate(11, loading = arg);
    	});

    	ipcRenderer.on('settings', (event, arg) => {
    		if (settings.zoom && settings.zoom != arg.zoom && instance) {
    			element = document.querySelector('.canvas-container-inner');
    			initPan(arg.zoom);
    		}

    		$$invalidate(2, settings = arg);
    		initUpdate++;
    		$$invalidate(3, backdropColor = settings.theme ? "#111111" : "#2F2E33");
    		if (initUpdate < 2) $$invalidate(6, proxySettings = settings);
    	});

    	ipcRenderer.on('deliver', (event, arg) => {
    		$$invalidate(28, img.src = arg, img);
    		$$invalidate(11, loading = false);
    		$$invalidate(4, fileSelected = arg);
    	});

    	function handleCursor(event) {
    		$$invalidate(18, m.x = event.clientX, m);
    		$$invalidate(18, m.y = event.clientY, m);
    	}

    	function wheelEvent(event) {
    		if (croppingMode) return;
    		instance.zoomWithWheel(event);
    	}

    	function changeEvent(event) {
    		$$invalidate(15, zoomscale = Number(event.detail.scale).toFixed(1));
    		if (event.detail.scale >= 10) $$invalidate(5, pixelated = true); else $$invalidate(5, pixelated = false);
    	}

    	function delInstance() {
    		try {
    			instance.destroy();
    			console.log("Removing listeners");
    			element.parentElement.removeEventListener('wheel', wheelEvent);
    			element.removeEventListener('panzoomchange', changeEvent);
    		} catch(e) {
    			
    		} /*console.log("errrrr", e);*/
    	}

    	function initPan(customZoom = false) {
    		if (!element) return;
    		delInstance();
    		if (croppingMode) return;

    		//make sure picking mode can't pan after
    		// And pass it to panzoom
    		$$invalidate(10, instance = Panzoom(element, {
    			maxScale: 10000,
    			step: customZoom || settings.zoom
    		}));

    		console.log("Adding listeners");
    		element.parentElement.addEventListener('wheel', wheelEvent);
    		element.addEventListener('panzoomchange', changeEvent);
    	}
    	let cropStartingPointX = 0;
    	let cropStartingPointY = 0;
    	let cropWidth = 0;
    	let cropHeight = 0;
    	let cropping = false;
    	let pixelWidth = 0;

    	function handleMouseDown(e) {
    		console.log("Canvas mousedown");
    		let canvas = e.srcElement;
    		let positionInfo = canvas.getBoundingClientRect();
    		let mousePos = helper.getMousePos(canvas, e, positionInfo);
    		let biggerSideTrue = height > width ? height : width;

    		let biggerSideVirt = positionInfo.height > positionInfo.width
    		? positionInfo.height
    		: positionInfo.width;

    		$$invalidate(34, pixelWidth = Math.round(biggerSideTrue / biggerSideVirt));
    		$$invalidate(29, cropStartingPointX = helper.scaleNumber(mousePos.x, [0, positionInfo.width], [0, width]));
    		$$invalidate(30, cropStartingPointY = helper.scaleNumber(mousePos.y, [0, positionInfo.height], [0, height]));
    		$$invalidate(33, cropping = true);
    	}

    	function handleMouseUp(e) {
    		let args = {
    			width: Math.ceil(cropWidth - cropStartingPointX),
    			height: Math.ceil(cropHeight - cropStartingPointY),
    			left: Math.ceil(cropStartingPointX),
    			top: Math.ceil(cropStartingPointY)
    		};

    		console.log(args);
    		ipcRenderer.send('editImage', { type: "crop", image: fileSelected, args });
    		$$invalidate(29, cropStartingPointX = 0);
    		$$invalidate(30, cropStartingPointY = 0);
    		$$invalidate(31, cropWidth = 0);
    		$$invalidate(32, cropHeight = 0);
    		$$invalidate(34, pixelWidth = 0);
    		$$invalidate(33, cropping = false);
    		$$invalidate(9, croppingMode = false);
    	}

    	function handleMouseMove(e) {
    		$$invalidate(14, mouseincanvas = true);
    		let canvas = e.srcElement;
    		let ctx = canvas.getContext('2d');
    		let positionInfo = canvas.getBoundingClientRect();
    		let mousePos = helper.getMousePos(canvas, e, positionInfo);
    		let newWidth = helper.scaleNumber(mousePos.x, [0, positionInfo.width], [0, width]);
    		let newHeight = helper.scaleNumber(mousePos.y, [0, positionInfo.height], [0, height]);

    		if (pickingMode) {
    			let imageData = ctx.getImageData(newWidth, newHeight, 1, 1);
    			let pixel = imageData.data;
    			`rgba(${pixel[0]}, ${pixel[1]}, ${pixel[2]}, ${pixel[3]})`;
    			$$invalidate(13, chosenColor = tinycolor({ r: pixel[0], g: pixel[1], b: pixel[2] }).toHexString());
    		} else if (croppingMode) {
    			$$invalidate(31, cropWidth = newWidth);
    			$$invalidate(32, cropHeight = newHeight);
    		}
    	}

    	function handlePaste(event) {
    		if (!settings.overwrite && fileSelected || settingsOpen) return;
    		let text = event.clipboardData.getData('Text');

    		if (text != "") {
    			if (text.startsWith("data") && text.includes("image")) {
    				//text is a data string, try to process it
    				return ipcRenderer.send('file', text);
    			} else if (text.startsWith("http")) {
    				//text is a url string, try to process it
    				return ipcRenderer.send('file', text);
    			} else {
    				console.log("text pasted! text:", text);
    			} //account for pastes of other types of text?
    		}

    		let items = (event.clipboardData || event.originalEvent.clipboardData).items;
    		let blob = null;

    		for (let i = 0; i < items.length; i++) {
    			if (items[i].type.indexOf("image") === 0) blob = items[i].getAsFile(); //afaik you can't really paste PSD here
    		}

    		if (blob == null) return console.log("null blob");

    		/*
    	Electron doesn't want us sending blob objects via ipc
    	so we'll handle it in-house instead.
    */
    		helper.getIMG(blob, result => {
    			$$invalidate(28, img.src = result, img);
    			$$invalidate(4, fileSelected = result);
    		});
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	const clear_handler = e => {
    		$$invalidate(4, fileSelected = false);
    		$$invalidate(3, backdropColor = settings.theme ? "#111111" : "#2F2E33");
    		$$invalidate(12, hex = undefined);
    		$$invalidate(8, pickingMode = false);
    		$$invalidate(9, croppingMode = false);
    		delInstance();
    	};

    	const settingsOpen_handler = e => {
    		$$invalidate(7, settingsOpen = e.detail);
    	};

    	function toolbox_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			tbx = $$value;
    			$$invalidate(16, tbx);
    		});
    	}

    	function toolbox_backdropColor_binding(value) {
    		backdropColor = value;
    		$$invalidate(3, backdropColor);
    	}

    	const cropImage_handler = e => {
    		$$invalidate(8, pickingMode = false);
    		$$invalidate(9, croppingMode = true);
    		instance.zoom(1, { animate: false });
    		instance.pan(0, 0);
    		console.log("reached");
    		instance.setOptions({ disablePan: true });
    	};

    	const pickColor_handler = e => {
    		$$invalidate(9, croppingMode = false);
    		$$invalidate(8, pickingMode = true);
    		instance.setOptions({ disablePan: true });
    	};

    	const settingsOpen_handler_1 = e => {
    		$$invalidate(7, settingsOpen = e.detail);
    	};

    	const mouseenter_handler = () => {
    		$$invalidate(14, mouseincanvas = true);
    	};

    	const mouseleave_handler = () => {
    		$$invalidate(14, mouseincanvas = false);
    	};

    	const click_handler = () => {
    		if (pickingMode) {
    			$$invalidate(8, pickingMode = false);
    			instance.setOptions({ disablePan: false });
    			$$invalidate(12, hex = chosenColor);
    		}
    	};

    	const click_handler_1 = () => {
    		setTimeout(
    			() => {
    				if (pickingMode) {
    					$$invalidate(8, pickingMode = false);
    					instance.setOptions({ disablePan: false });
    				}
    			},
    			100
    		);
    	};

    	function desktop_loading_binding(value) {
    		loading = value;
    		$$invalidate(11, loading);
    	}

    	$$self.$capture_state = () => ({
    		Titlebar,
    		Desktop,
    		Backdrop,
    		Toolbox,
    		Actions,
    		Dropfield,
    		Menu,
    		Loader,
    		Cursor,
    		Zoomscale,
    		tinycolor,
    		Panzoom,
    		Canvas,
    		Layer,
    		t,
    		Helper,
    		ipcRenderer,
    		version,
    		helper,
    		fileSelected,
    		width,
    		height,
    		pixelated,
    		settings,
    		proxySettings,
    		settingsOpen,
    		pickingMode,
    		croppingMode,
    		initUpdate,
    		instance,
    		loading,
    		element,
    		hex,
    		chosenColor,
    		mouseincanvas,
    		zoomscale,
    		tbx,
    		backdropColor,
    		workAreaOpacity,
    		m,
    		img,
    		handleCursor,
    		wheelEvent,
    		changeEvent,
    		delInstance,
    		initPan,
    		cropStartingPointX,
    		cropStartingPointY,
    		cropWidth,
    		cropHeight,
    		cropping,
    		pixelWidth,
    		handleMouseDown,
    		handleMouseUp,
    		handleMouseMove,
    		handlePaste,
    		testRender,
    		render
    	});

    	$$self.$inject_state = $$props => {
    		if ('fileSelected' in $$props) $$invalidate(4, fileSelected = $$props.fileSelected);
    		if ('width' in $$props) $$invalidate(0, width = $$props.width);
    		if ('height' in $$props) $$invalidate(1, height = $$props.height);
    		if ('pixelated' in $$props) $$invalidate(5, pixelated = $$props.pixelated);
    		if ('settings' in $$props) $$invalidate(2, settings = $$props.settings);
    		if ('proxySettings' in $$props) $$invalidate(6, proxySettings = $$props.proxySettings);
    		if ('settingsOpen' in $$props) $$invalidate(7, settingsOpen = $$props.settingsOpen);
    		if ('pickingMode' in $$props) $$invalidate(8, pickingMode = $$props.pickingMode);
    		if ('croppingMode' in $$props) $$invalidate(9, croppingMode = $$props.croppingMode);
    		if ('initUpdate' in $$props) initUpdate = $$props.initUpdate;
    		if ('instance' in $$props) $$invalidate(10, instance = $$props.instance);
    		if ('loading' in $$props) $$invalidate(11, loading = $$props.loading);
    		if ('element' in $$props) element = $$props.element;
    		if ('hex' in $$props) $$invalidate(12, hex = $$props.hex);
    		if ('chosenColor' in $$props) $$invalidate(13, chosenColor = $$props.chosenColor);
    		if ('mouseincanvas' in $$props) $$invalidate(14, mouseincanvas = $$props.mouseincanvas);
    		if ('zoomscale' in $$props) $$invalidate(15, zoomscale = $$props.zoomscale);
    		if ('tbx' in $$props) $$invalidate(16, tbx = $$props.tbx);
    		if ('backdropColor' in $$props) $$invalidate(3, backdropColor = $$props.backdropColor);
    		if ('workAreaOpacity' in $$props) $$invalidate(17, workAreaOpacity = $$props.workAreaOpacity);
    		if ('m' in $$props) $$invalidate(18, m = $$props.m);
    		if ('img' in $$props) $$invalidate(28, img = $$props.img);
    		if ('cropStartingPointX' in $$props) $$invalidate(29, cropStartingPointX = $$props.cropStartingPointX);
    		if ('cropStartingPointY' in $$props) $$invalidate(30, cropStartingPointY = $$props.cropStartingPointY);
    		if ('cropWidth' in $$props) $$invalidate(31, cropWidth = $$props.cropWidth);
    		if ('cropHeight' in $$props) $$invalidate(32, cropHeight = $$props.cropHeight);
    		if ('cropping' in $$props) $$invalidate(33, cropping = $$props.cropping);
    		if ('pixelWidth' in $$props) $$invalidate(34, pixelWidth = $$props.pixelWidth);
    		if ('testRender' in $$props) $$invalidate(19, testRender = $$props.testRender);
    		if ('render' in $$props) $$invalidate(20, render = $$props.render);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*img*/ 268435456) {
    			$$invalidate(20, render = ({ context }) => {
    				try {
    					context.drawImage(img, 0, 0);
    					element = document.querySelector('.canvas-container-inner');
    					initPan();
    				} catch(e) {
    					console.log("err", e);
    				}
    			});
    		}

    		if ($$self.$$.dirty[0] & /*settings, backdropColor*/ 12) {
    			{
    				if (!settings.transparency) $$invalidate(17, workAreaOpacity = tinycolor(backdropColor).toRgb().a); else $$invalidate(17, workAreaOpacity = 1);
    			}
    		}

    		if ($$self.$$.dirty[0] & /*img, cropStartingPointX, cropStartingPointY*/ 1879048192 | $$self.$$.dirty[1] & /*cropping, cropWidth, cropHeight, pixelWidth*/ 15) {
    			$$invalidate(19, testRender = ({ context, width, height }) => {
    				try {
    					if (!cropping) return;
    					context.globalAlpha = 1.0;
    					context.fillStyle = "#171719";
    					context.fillRect(0, 0, width, height);
    					context.globalAlpha = 0.5;
    					context.drawImage(img, 0, 0);
    					context.globalAlpha = 1.0;
    					context.drawImage(img, cropStartingPointX, cropStartingPointY, cropWidth - cropStartingPointX, cropHeight - cropStartingPointY, cropStartingPointX, cropStartingPointY, cropWidth - cropStartingPointX, cropHeight - cropStartingPointY);
    					context.strokeStyle = "#FAA916";
    					context.beginPath();
    					context.lineWidth = pixelWidth * 2;
    					context.setLineDash([pixelWidth * 6, pixelWidth * 3]);
    					context.rect(cropStartingPointX, cropStartingPointY, cropWidth - cropStartingPointX, cropHeight - cropStartingPointY);
    					context.stroke();
    					console.log("Ran square render");
    				} catch(e) {
    					console.log("err", e);
    				}
    			});
    		}
    	};

    	return [
    		width,
    		height,
    		settings,
    		backdropColor,
    		fileSelected,
    		pixelated,
    		proxySettings,
    		settingsOpen,
    		pickingMode,
    		croppingMode,
    		instance,
    		loading,
    		hex,
    		chosenColor,
    		mouseincanvas,
    		zoomscale,
    		tbx,
    		workAreaOpacity,
    		m,
    		testRender,
    		render,
    		version,
    		handleCursor,
    		delInstance,
    		handleMouseDown,
    		handleMouseUp,
    		handleMouseMove,
    		handlePaste,
    		img,
    		cropStartingPointX,
    		cropStartingPointY,
    		cropWidth,
    		cropHeight,
    		cropping,
    		pixelWidth,
    		clear_handler,
    		settingsOpen_handler,
    		toolbox_binding,
    		toolbox_backdropColor_binding,
    		cropImage_handler,
    		pickColor_handler,
    		settingsOpen_handler_1,
    		mouseenter_handler,
    		mouseleave_handler,
    		click_handler,
    		click_handler_1,
    		desktop_loading_binding
    	];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance_1, create_fragment, safe_not_equal, {}, null, [-1, -1]);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    	props: {
    		name: 'world'
    	}
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
