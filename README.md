# ExtraSugar

Adds extra native object methods using the [Sugar](https://sugarjs.com/) Javascript utility library. It also corrects and enhances existing Sugar typescript definitions.

## Sugar repo
https://github.com/andrewplummer/Sugar

## Methods

### Object

<dl>
	<dt><code>Object.isDefined(obj)</code></dt>
	<dd>Returns false if <code>obj</code> is undefined, otherwise true.</dd>
	<dt><code>.mapKeys(obj, map, [skipNull])</code></dt>
	<dd></dd>
	<dt><code>.cordon(obj, [deep])</code></dt>
	<dd></dd>
	<dt><code>.collect(obj, collectFn)</code></dt>
	<dd></dd>
	<dt><code>.replace(obj, key, replacer)</code></dt>
	<dd></dd>
	<dt><code>.selectValues(obj, keys)</code></dt>
	<dd></dd>
	<dt><code>.getWithDefault(obj, key, default, [inherited])</code></dt>
	<dd></dd>
	<dt><code>.duplicate(obj, [duplicateFn])</code></dt>
	<dd></dd>
	<dt><code>.when(obj, condition, whenFn)</code></dt>
	<dd></dd>
</dl>


### String

<dl>
	<dt><code>.canBeNumber()</code></dt>
	<dd></dd>
	<dt><code>.compare(str)</code></dt>
	<dd></dd>
	<dt><code>.splice(start, [deleteCount], [...items])</code></dt>
	<dd></dd>
</dl>

### Array

<dl>
	<dt><code>Array.ensure(arr, [ignoreNull])</code></dt>
	<dd></dd>
	<dt><code>.move(fromIndex, toIndex)</code></dt>
	<dd></dd>
	<dt><code>.indexesOf(items)</code></dt>
	<dd></dd>
	<dt><code>.sift(search)</code></dt>
	<dd></dd>
	<dt><code>.tapEach(eachFn, [context])</code></dt>
	<dd></dd>
	<dt><code>.toObject(mapFn)</code></dt>
	<dd></dd>
	<dt><code>.indexes()</code></dt>
	<dd></dd>
	<dt><code>.normalizeIndex(index, [loop])</code></dt>
	<dd></dd>
	<dt><code>.expel(items)</code></dt>
	<dd></dd>
	<dt><code>.transpose(items, [missing])</code></dt>
	<dd></dd>
</dl>

### Function

<dl>
	<dt><code>.isA(classType)</code></dt>
	<dd></dd>
</dl>

### Boolean

<dl>
	<dt><code>Boolean.parse(value)</code></dt>
	<dd></dd>
</dl>

### Date

<dl>
	<dt><code>Date.earliest(dates)</code></dt>
	<dd></dd>
	<dt><code>Date.latest(dates)</code></dt>
	<dd></dd>
</dl>

### Range

<dl>
	<dt><code>start</code></dt>
	<dd></dd>
	<dt><code>end</code></dt>
	<dd></dd>
</dl>

## Types

<dl>
	<dt><code>primitive</code></dt>
	<dd></dd>
	<dt><code>UnensuredArray&ltT&gt</code></dt>
	<dd></dd>
</dl>
