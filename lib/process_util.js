module.exports.isDebugging = function()
{
  return typeof v8debug === 'object'
    || /--debug|--inspect/.test(process.execArgv.join(' '))
    || process.execArgv.indexOf('--debug') > -1
    || process.execArgv.indexOf('--debug-brk') > -1;
};