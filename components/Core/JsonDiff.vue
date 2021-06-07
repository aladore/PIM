<template style="min-width: 100%">
    <v-flex id="flex-json-diff" class="mx-sm-5 mx-0" style="min-width: 100%;">
        <div class="d-inline-flex">
            <div id="report"></div>
            <div class="reportDate"> - {{ date }}</div>
        </div>
        <div style="min-width: 100%;max-height: 85vh;display:flex;">
            <pre id="out" class="left mr-5"></pre>
            <pre id="out2" class="right mr-5 ml-0"></pre>
        </div>
    </v-flex>
</template>

<script>
export default {
    name: "JsonDiff",
    components: {},
    props: {
        oldJson: Object,
        newJson: Object,
        date: String,
    },
    mounted() {
    },
    data() {
        return {
            LEFT: "left",
            RIGHT: "right",
            EQUALITY: "eq",
            TYPE: "type",
            MISSING: "missing",
            diffs: [],
            requestCount: 0,
        };
    },
    watch: {
        oldJson(val) {
            this.compare(this.oldJson, this.newJson);
        },
    },
    methods: {
        compare(oldOne, newOne) {
            if (this.requestCount !== 0) {
                /*
                 * This means we have a pending request and we just need to wait for that to finish.
                 */
                return;
            }

            this.diffs = [];
            let left = JSON.parse(JSON.stringify(oldOne));
            let right = JSON.parse(JSON.stringify(newOne));

            let config = this.createConfig();
            this.formatAndDecorate(config, left);
            document.getElementById("out").innerHTML = config.out;

            let config2 = this.createConfig();
            this.formatAndDecorate(config2, right);
            document.getElementById("out2").innerHTML = config2.out;

            this.formatPRETags();

            config.currentPath = [];
            config2.currentPath = [];

            this.diffVal(left, config, right, config2);
            this.processDiffs();
            this.generateReport();
        },
        /**
         * Generate the report section with the diff
         */
        generateReport: function () {
            let report = document.getElementById("report");
            report.textContent = "";
            let title = document.createElement("div");
            title.className = "reportTitle";

            if (this.diffs.length === 0) {
                title.textContent = "Aucune modification";
                report.append(title);
                return;
            }

            let typeCount = 0,
                eqCount = 0,
                missingCount = 0
            ;
            this.diffs.forEach((diff) => {
                if (diff.type === this.EQUALITY) {
                    eqCount++;
                } else if (diff.type === this.MISSING) {
                    missingCount++;
                } else if (diff.type === this.TYPE) {
                    typeCount++;
                }
            });



            if (this.diffs.length === 1) {
                title.textContent = (this.diffs.length) + ' différence trouvée';
            } else {
                title.textContent = (this.diffs.length) + ' différences trouvées';
            }

            report.append(title);

            // let filterBlock = document.createElement("span");
            // filterBlock.className = "filterBlock ";
            // filterBlock.textContent = "Show :";

            // /*
            //  * The missing checkbox
            //  */
            // if (missingCount > 0) {
            //     var missing = $('<label><input id="showMissing" type="checkbox" name="checkbox" value="value" checked="true"></label>');
            //     if (missingCount === 1) {
            //         missing.append(missingCount + ' missing property');
            //     } else {
            //         missing.append(missingCount + ' missing properties');
            //     }
            //     missing.children('input').click(function () {
            //         if (!$(this).prop('checked')) {
            //             $('span.code.diff.missing').addClass('missing_off').removeClass('missing');
            //         } else {
            //             $('span.code.diff.missing_off').addClass('missing').removeClass('missing_off');
            //         }
            //     });
            //     filterBlock.append(missing);
            // }
            //
            // /*
            //  * The types checkbox
            //  */
            // if (typeCount > 0) {
            //     var types = $('<label><input id="showTypes" type="checkbox" name="checkbox" value="value" checked="true"></label>');
            //     if (typeCount === 1) {
            //         types.append(typeCount + ' incorrect type');
            //     } else {
            //         types.append(typeCount + ' incorrect types');
            //     }
            //
            //     types.children('input').click(function () {
            //         if (!$(this).prop('checked')) {
            //             $('span.code.diff.type').addClass('type_off').removeClass('type');
            //         } else {
            //             $('span.code.diff.type_off').addClass('type').removeClass('type_off');
            //         }
            //     });
            //     filterBlock.append(types);
            // }
            //
            // /*
            //  * The equals checkbox
            //  */
            // if (eqCount > 0) {
            //     var eq = $('<label><input id="showEq" type="checkbox" name="checkbox" value="value" checked="true"></label>');
            //     if (eqCount === 1) {
            //         eq.append(eqCount + ' unequal value');
            //     } else {
            //         eq.append(eqCount + ' unequal values');
            //     }
            //     eq.children('input').click(function () {
            //         if (!$(this).prop('checked')) {
            //             $('span.code.diff.eq').addClass('eq_off').removeClass('eq');
            //         } else {
            //             $('span.code.diff.eq_off').addClass('eq').removeClass('eq_off');
            //         }
            //     });
            //     filterBlock.append(eq);
            // }
            //
            // report.append(filterBlock);


        },
        /**
         * Format the object into the output stream and decorate the data tree with
         * the data about this object.
         */
        formatAndDecorate: function(/*Object*/ config, /*Object*/ data) {
            if (this.getType(data) === "array") {
                this.formatAndDecorateArray(config, data);
                return;
            }

            this.startObject(config);
            config.currentPath.push("/");

            var props = this.getSortedProperties(data);
            /*
             * If the first set has more than the second then we will catch it
             * when we compare values.  However, if the second has more then
             * we need to catch that here.
             */
            props.forEach(key => {
                config.out += this.newLine(config) + this.getTabs(config.indent) + '"' + this.unescapeString(key) + '": ';
                config.currentPath.push(key);
                config.paths.push({
                    path: this.generatePath(config),
                    line: config.line,
                });
                this.formatVal(data[key], config);
                config.currentPath.pop();
            });

            this.finishObject(config);
            config.currentPath.pop();
        },
        /**
         * Format the array into the output stream and decorate the data tree with
         * the data about this object.
         */
        formatAndDecorateArray: function(/*Object*/ config, /*Array*/ data) {
            this.startArray(config);

            /*
             * If the first set has more than the second then we will catch it
             * when we compare values.  However, if the second has more then
             * we need to catch that here.
             */
            data.forEach((arrayVal, index) => {
                config.out += this.newLine(config) + this.getTabs(config.indent);
                config.paths.push({
                    path: this.generatePath(config, "[" + index + "]"),
                    line: config.line,
                });

                config.currentPath.push("/[" + index + "]");
                this.formatVal(arrayVal, config);
                config.currentPath.pop();
            });

            this.finishArray(config);
            config.currentPath.pop();
        },
        /**
         * Format a specific value into the output stream.
         */
        formatVal: function(val, config) {
            if (this.getType(val) === "array") {
                config.out += "[";

                config.indent++;
                val.forEach((arrayVal, index) => {
                    config.out += this.newLine(config) + this.getTabs(config.indent);
                    config.paths.push({
                        path: this.generatePath(config, "[" + index + "]"),
                        line: config.line,
                    });

                    config.currentPath.push("/[" + index + "]");
                    this.formatVal(arrayVal, config);
                    config.currentPath.pop();
                });
                this.removeTrailingComma(config);
                config.indent--;

                config.out += this.newLine(config) + this.getTabs(config.indent) + "]" + ",";
            } else if (this.getType(val) === "object") {
                this.formatAndDecorate(config, val);
            } else if (this.getType(val) === "string") {
                config.out += '"' + this.unescapeString(val) + '",';
            } else if (this.getType(val) === "number") {
                config.out += val + ",";
            } else if (this.getType(val) === "boolean") {
                config.out += val + ",";
            } else if (this.getType(val) === "null") {
                config.out += "null,";
            }
        },
        /**
         * Format the output pre tags.
         */
        formatPRETags: function () {
            let preTags = document.getElementById("flex-json-diff").getElementsByTagName("pre");
            preTags.forEach((pre) => {
                let codeBlock = document.createElement("pre");
                codeBlock.className = "codeBlock";
                let lineNumbers = document.createElement("div");
                lineNumbers.className = "gutter";
                codeBlock.style.minWidth = "45%";
                // codeBlock.style.minHeight = "100%";
                codeBlock.style.flex = "1";
                codeBlock.append(lineNumbers);

                let codeLines = document.createElement("div");
                codeBlock.append(codeLines);

                const addLine = function (line, index) {
                    let div = document.createElement("div"),
                        lineNum = document.createElement("span"),
                        span = document.createElement("span")
                    ;
                    div.className = "codeLine line"+ (index + 1);
                    lineNum.className = "line-number ";
                    lineNum.innerHTML += (index + 1); //+'\n'
                    span.className = "code ";

                    lineNumbers.append(lineNum);

                    span.innerHTML = line;
                    div.append(span);

                    codeLines.append(div);
                };

                let lines = pre.textContent.split("\n");
                lines.forEach(addLine);

                if (pre.className.includes("codeBlock")) {
                    pre.className = pre.className.replace("codeBlock","").replace(" ","");
                }
                codeBlock.className += " " + pre.className;
                codeBlock.id = pre.id;

                pre.parentNode.replaceChild(codeBlock, pre);
            });
        },
        /**
         * Generate the differences between two values.  This handles differences of object
         * types and actual values.
         */
        diffVal: function (val1, config1, val2, config2) {

            if (this.getType(val1) === 'array') {
                this.diffArray(val1, config1, val2, config2);
            } else if (this.getType(val1) === 'object') {
                if (['array', 'string', 'number', 'boolean', 'null'].indexOf(this.getType(val2)) > -1) {
                    this.diffs.push(this.generateDiff(config1, this.generatePath(config1),
                        config2, this.generatePath(config2),
                        'Both types should be objects', this.TYPE));
                } else {
                    this.findDiffs(config1, val1, config2, val2);
                }
            } else if (this.getType(val1) === 'string') {
                if (this.getType(val2) !== 'string') {
                    this.diffs.push(this.generateDiff(config1, this.generatePath(config1),
                        config2, this.generatePath(config2),
                        'Both types should be strings', this.TYPE));
                } else if (val1 !== val2) {
                    this.diffs.push(this.generateDiff(config1, this.generatePath(config1),
                        config2, this.generatePath(config2),
                        'Both sides should be equal strings', this.EQUALITY));
                }
            } else if (this.getType(val1) === 'number') {
                if (this.getType(val2) !== 'number') {
                    this.diffs.push(this.generateDiff(config1, this.generatePath(config1),
                        config2, this.generatePath(config2),
                        'Both types should be numbers', this.TYPE));
                } else if (val1 !== val2) {
                    this.diffs.push(this.generateDiff(config1, this.generatePath(config1),
                        config2, this.generatePath(config2),
                        'Both sides should be equal numbers', this.EQUALITY));
                }
            } else if (this.getType(val1) === 'boolean') {
                this.diffBool(val1, config1, val2, config2);
            } else if (this.getType(val1) === 'null' && this.getType(val2) !== 'null') {
                this.diffs.push(this.generateDiff(config1, this.generatePath(config1),
                    config2, this.generatePath(config2),
                    'Both types should be nulls', this.TYPE));
            }
        },
        /**
         * Find the differences between the two objects and recurse into their sub objects.
         */
        findDiffs: function (/*Object*/ config1, /*Object*/ data1, /*Object*/ config2, /*Object*/ data2) {
            config1.currentPath.push('/');
            config2.currentPath.push('/');

            let key;
            // no un-used vars
            // var val;

            if (data1.length < data2.length) {
                /*
                 * This means the second data has more properties than the first.
                 * We need to find the extra ones and create diffs for them.
                 */
                for (key in data2) {
                    if (data2.hasOwnProperty(key)) {
                        // no un-used vars
                        // val = data1[key];
                        if (!data1.hasOwnProperty(key)) {
                            this.diffs.push(this.generateDiff(config1, this.generatePath(config1),
                                config2, this.generatePath(config2, '/' + key),
                                'The right side of this object has more items than the left side', this.MISSING));
                        }
                    }
                }
            }

            /*
             * Now we're going to look for all the properties in object one and
             * compare them to object two
             */
            for (key in data1) {
                if (data1.hasOwnProperty(key)) {
                    // no un-used vars
                    // val = data1[key];

                    config1.currentPath.push(key);

                    if (!data2.hasOwnProperty(key)) {
                        /*
                         * This means that the first data has a property which
                         * isn't present in the second data
                         */
                        this.diffs.push(this.generateDiff(config1, this.generatePath(config1),
                            config2, this.generatePath(config2),
                            'Missing property <code>' + key + '</code> from the object on the right side', this.MISSING));
                    } else {
                        config2.currentPath.push(key);

                        this.diffVal(data1[key], config1, data2[key], config2);
                        config2.currentPath.pop();
                    }
                    config1.currentPath.pop();
                }
            }

            config1.currentPath.pop();
            config2.currentPath.pop();

            /*
             * Now we want to look at all the properties in object two that
             * weren't in object one and generate diffs for them.
             */
            for (key in data2) {
                if (data2.hasOwnProperty(key)) {
                    // no un-used vars
                    // val = data1[key];

                    if (!data1.hasOwnProperty(key)) {
                        this.diffs.push(this.generateDiff(config1, this.generatePath(config1),
                            config2, this.generatePath(config2, key),
                            'Missing property <code>' + key + '</code> from the object on the left side', this.MISSING));
                    }
                }
            }
        },
        /**
         * Process the specified diff
         */
        processDiffs: function () {
            var left = [];
            var right = [];
            this.diffs.forEach((diff) => {
                let span = document.getElementById("flex-json-diff").querySelector('pre.left div.line' + diff.path1.line + ' span.code');
                span.className += ' '+diff.type+' diff';
                if (left.indexOf(diff.path1.line) === -1) {
                    span.onclick = function () {
                        this.handleDiffClick(diff.path1.line, this.LEFT);
                    };
                    left.push(diff.path1.line);
                }
                document.getElementById("flex-json-diff").querySelector('pre.right div.line' + diff.path2.line + ' span.code').className += ' '+diff.type+' diff';
                if (right.indexOf(diff.path2.line) === -1) {
                    document.getElementById("flex-json-diff").querySelector('pre.right div.line' + diff.path2.line + ' span.code')
                            .onclick = function () {
                                this.handleDiffClick(diff.path2.line, this.RIGHT);
                            }
                    right.push(diff.path2.line);
                }
            });

            this.diffs = this.diffs.sort(function (a, b) {
                return a.path1.line - b.path1.line;
            });

        },
        handleDiffClick: function (line, side) {
            let diffs = this.diffs.filter((diff) => {
                if (side === this.LEFT) {
                    return line === diff.path1.line;
                } else if (side === this.RIGHT) {
                    return line === diff.path2.line;
                } else {
                    return line === diff.path1.line || line === diff.path2.line;
                }
            });

            document.getElementById("flex-json-diff").querySelector('pre.left span.code').classList.remove("selected");
            document.getElementById("flex-json-diff").querySelector('pre.right span.code').classList.remove("selected");
            document.getElementById("flex-json-diff").querySelector('ul.toolbar').textContent = '';

            diffs.forEach((diff) => {
                document.getElementById("flex-json-diff").querySelector('pre.left div.line' + diff.path1.line + ' span.code').className += ' selected';
                document.getElementById("flex-json-diff").querySelector('pre.right div.line' + diff.path2.line + ' span.code').className += ' selected';
            });

            if (side === this.LEFT || side === this.RIGHT) {
                this.currentDiff = this.diffs.findIndex(function (diff) {
                    return diff.path1.line === line;
                });
            }

            if (this.currentDiff === -1) {
                this.currentDiff = this.diffs.findIndex(function (diff) {
                    return diff.path2.line === line;
                });
            }

            let buttons = document.createElement("div");
            buttons.id = "buttons";
            let prev = document.createElement("a");
            prev.title= this.$t('previous');
            prev.id = "prevButton";
            prev.textContent = '&lt;';
            prev.className += " disabled";
            prev.onclick = function (e) {
                e.preventDefault();
                this.highlightPrevDiff();
            };
            buttons.append(prev);

            let span = document.createElement('span');
            span.id = "prevNextLabel";
            buttons.append(span);

            let next = document.createElement("a");
            next.title= this.$t('next');
            next.id = "nextButton";
            next.textContent = '&gt;';
            next.className += " disabled";
            next.onclick = function (e) {
                e.preventDefault();
                this.highlightNextDiff();
            };
            buttons.append(next);

            document.getElementById("flex-json-diff").querySelector('ul.toolbar').append(buttons);
            this.updateButtonStyles();

            this.showDiffDetails(diffs);
        },
        /**
         * Show the details of the specified diff
         */
        showDiffDetails: function (diffs) {
            diffs.forEach((diff) => {
                console.log('diff', diff.msg);
                // var li = $('<li></li>');
                // li.html(diff.msg);
                // $('ul.toolbar').append(li);
                //
                // li.click(function () {
                //     this.scrollToDiff(diff);
                // });

            });
        },
        /**
         * Generate the diff and verify that it matches a JSON path
         */
        generateDiff: function (config1, path1, config2, path2, /*String*/ msg, type) {
            if (path1 !== '/' && path1.charAt(path1.length - 1) === '/') {
                path1 = path1.substring(0, path1.length - 1);
            }

            if (path2 !== '/' && path2.charAt(path2.length - 1) === '/') {
                path2 = path2.substring(0, path2.length - 1);
            }
            var pathObj1 = config1.paths.find(function (path) {
                return path.path === path1;
            });
            var pathObj2 = config2.paths.find(function (path) {
                return path.path === path2;
            });

            if (!pathObj1) {
                throw 'Unable to find line number for (' + msg + '): ' + path1;
            }

            if (!pathObj2) {
                throw 'Unable to find line number for (' + msg + '): ' + path2;
            }

            return {
                path1: pathObj1,
                path2: pathObj2,
                type: type,
                msg: msg
            };
        },
        /**
         * We handle boolean values specially because we can show a nicer message for them.
         */
        diffBool: function (val1, config1, val2, config2) {
            if (this.getType(val2) !== 'boolean') {
                this.diffs.push(this.generateDiff(config1, this.generatePath(config1),
                    config2, this.generatePath(config2),
                    'Both types should be booleans', this.TYPE));
            } else if (val1 !== val2) {
                if (val1) {
                    this.diffs.push(this.generateDiff(config1, this.generatePath(config1),
                        config2, this.generatePath(config2),
                        'The left side is <code>true</code> and the right side is <code>false</code>', this.EQUALITY));
                } else {
                    this.diffs.push(this.generateDiff(config1, this.generatePath(config1),
                        config2, this.generatePath(config2),
                        'The left side is <code>false</code> and the right side is <code>true</code>', this.EQUALITY));
                }
            }
        },
        /**
         * Arrays are more complex because we need to recurse into them and handle different length
         * issues so we handle them specially in this function.
         */
        diffArray: function (val1, config1, val2, config2) {
            if (this.getType(val2) !== 'array') {
                this.diffs.push(this.generateDiff(config1, this.generatePath(config1),
                    config2, this.generatePath(config2),
                    'Both types should be arrays', this.TYPE));
                return;
            }

            if (val1.length < val2.length) {
                /*
                 * Then there were more elements on the right side and we need to
                 * generate those differences.
                 */
                for (var i = val1.length; i < val2.length; i++) {
                    this.diffs.push(this.generateDiff(config1, this.generatePath(config1),
                        config2, this.generatePath(config2, '[' + i + ']'),
                        'Missing element <code>' + i + '</code> from the array on the left side', this.MISSING));
                }
            }
            val1.forEach((arrayVal, index) => {
                if (val2.length <= index) {
                    this.diffs.push(this.generateDiff(config1, this.generatePath(config1, '[' + index + ']'),
                        config2, this.generatePath(config2),
                        'Missing element <code>' + index + '</code> from the array on the right side', this.MISSING));
                } else {
                    config1.currentPath.push('/[' + index + ']');
                    config2.currentPath.push('/[' + index + ']');

                    if (this.getType(val2) === 'array') {
                        /*
                         * If both sides are arrays then we want to diff them.
                         */
                        this.diffVal(val1[index], config1, val2[index], config2);
                    }
                    config1.currentPath.pop();
                    config2.currentPath.pop();
                }
            });
        },
        /**
         * When we parse the JSON string we end up removing the escape strings when we parse it
         * into objects.  This results in invalid JSON if we insert those strings back into the
         * generated JSON.  We also need to look out for characters that change the line count
         * like new lines and carriage returns.
         *
         * This function puts those escaped values back when we generate the JSON output for the
         * well known escape strings in JSON.  It handles properties and values.
         *
         * This function does not handle unicode escapes.  Unicode escapes are optional in JSON
         * and the JSON output is still valid with a unicode character in it.
         */
        unescapeString: function(val) {
            if (val) {
                return val
                    .replace("\\", "\\\\") // Single slashes need to be replaced first
                    .replace(/"/g, '\\"') // Then double quotes
                    .replace(/\n/g, "\\n") // New lines
                    .replace("\b", "\\b") // Backspace
                    .replace(/\f/g, "\\f") // Formfeed
                    .replace(/\r/g, "\\r") // Carriage return
                    .replace(/\t/g, "\\t"); // Horizontal tabs
            } else {
                return val;
            }
        },
        /**
         * Sort all the relevant properties and return them in an alphabetical sort by property key
         */
        getSortedProperties: function(/*Object*/ obj) {
            var props = [];

            for (var prop in obj) {
                if (obj.hasOwnProperty(prop)) {
                    props.push(prop);
                }
            }

            props = props.sort(function(a, b) {
                return a.localeCompare(b);
            });

            return props;
        },
        /**
         * Create a config object for holding differences
         */
        createConfig: function() {
            return {
                out: "",
                indent: -1,
                currentPath: [],
                paths: [],
                line: 1,
            };
        },
        // setupNewDiff: function () {
        //     document.getElementById("flex-json-diff").style.display = "none";
        //     document.getElementById("flex-json-diff").getElementsByTagName("pre").forEach((pre) => {
        //             pre.textContent = "";
        //         });
        //     document.getElementById("flex-json-diff").querySelector("ul.toolbar").textContent = "";
        // },
        /**
         * Validate the input against the JSON parser
         */
        validateInput: function(json, side) {
            try {
                // jsl.parser.parse(json);
                let jsonParse = JSON.parse(JSON.stringify(json));
                console.log(side + " side", jsonParse);
                return true;
            } catch (parseException) {
                console.error(side + " side", parseException);
                return false;
            }
        },
        /**
         * Generate the start of the an object in the output stream and push in the new path
         */
        startObject: function(config) {
            config.indent++;
            config.out += "{";

            if (config.paths.length === 0) {
                /*
                 * Then we are at the top of the object and we want to add
                 * a path for it.
                 */
                config.paths.push({
                    path: this.generatePath(config),
                    line: config.line,
                });
            }

            if (config.indent === 0) {
                config.indent++;
            }
        },
        /**
         * Finish the object, outdent, and pop off all the path
         */
        finishObject: function(config) {
            if (config.indent === 0) {
                config.indent--;
            }

            this.removeTrailingComma(config);

            config.indent--;
            config.out += this.newLine(config) + this.getTabs(config.indent) + "}";
            if (config.indent !== 0) {
                config.out += ",";
            } else {
                config.out += this.newLine(config);
            }
        },
        /**
         * Generate a JSON path based on the specific configuration and an optional property.
         */
        generatePath: function(config, prop) {
            var s = "";
            config.currentPath.forEach(path => {
                s += path;
            });

            if (prop) {
                s += "/" + prop;
            }

            if (s.length === 0) {
                return "/";
            } else {
                return s;
            }
        },
        highlightPrevDiff: function () {
            if (this.currentDiff > 0) {
                this.currentDiff--;
                this.highlightDiff(this.currentDiff);
                // this.scrollToDiff(this.diffs[this.currentDiff]);

                this.updateButtonStyles();
            }
        },

        highlightNextDiff: function () {
            if (this.currentDiff < this.diffs.length - 1) {
                this.currentDiff++;
                this.highlightDiff(this.currentDiff);
                // this.scrollToDiff(this.diffs[this.currentDiff]);

                this.updateButtonStyles();
            }
        },
        /**
         * Highlight the diff at the specified index
         */
        highlightDiff: function (index) {
            this.handleDiffClick(this.diffs[index].path1.line, this.BOTH);
        },
        /**
         * Scroll the specified diff to be visible
         */
        // scrollToDiff: function (diff) {
        //     $('html, body').animate({
        //         scrollTop: $('pre.left div.line' + diff.path1.line + ' span.code').offset().top
        //     }, 0);
        // },
        updateButtonStyles: function () {
            document.getElementById("prevButton").classList.remove("disabled");
            document.getElementById("nextButton").classList.remove("disabled");

            document.getElementById("prevNextLabel").textContent = this.currentDiff + 1 + " of " + this.diffs.length;

            if (this.currentDiff === 1) {
                document.getElementById("prevButton").class.className += " disabled";
            } else if (this.currentDiff === this.diffs.length - 1) {
                document.getElementById("nextButton").class.className += " disabled";
            }
        },
        /**
         * Remove the trailing comma from the output.
         */
        removeTrailingComma: function(config) {
            /*
             * Remove the trailing comma
             */
            if (config.out.charAt(config.out.length - 1) === ",") {
                config.out = config.out.substring(0, config.out.length - 1);
            }
        },
        /**
         * Add a new line to the output stream
         */
        newLine: function(config) {
            config.line++;
            return "\n";
        },
        /**
         * Get the current indent level
         */
        getTabs: function(/*int*/ indent) {
            var s = "";
            for (var i = 0; i < indent; i++) {
                s += "    ";
            }

            return s;
        },
        /**
         * Fixing typeof
         * takes value and returns type of value
         * @param  value
         * return typeof value
         */
        getType(value) {
            if (
                function() {
                    return value && value !== this;
                }.call(value)
            ) {
                //fallback on 'typeof' for truthy primitive values
                return typeof value;
            }
            return {}.toString
                .call(value)
                .match(/\s([a-z|A-Z]+)/)[1]
                .toLowerCase();
        },
    },
};
</script>

<style scoped></style>
