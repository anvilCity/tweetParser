const _retext = require('retext');
const _keywords = require('retext-keywords');
const _nlcstToString = require('nlcst-to-string');
const _sentiment = require('retext-sentiment');
const _normalize = require('nlcst-normalize');

exports.parse = function( text, callback )
{
	_extractKeywords( text, callback );
};

exports.sentimentScore = function( text, callback )
{
	_retext().use( _sentiment ).use(function () 
	{
	    return function (cst) 
	    {
	        callback( cst );
	    };
	}).process(text);
};

exports.extractKeywords = function( text, callback )
{
	text = text.replace(/(?:https?|ftp):\/\/[\n\S]+/gi, '');
	text = text.replace(/^rt\W/gi, '');
	text = text.replace(/\Wrt\W/gi, '');

	_retext().use( _keywords ).process(text, function ( err, file )
		{
			const space = file.namespace('retext');

			var keywords = [];

	        space.keywords.forEach(function (keyword) 
	        {
	        	const keywordString =  _normalize( _nlcstToString( keyword.matches[0].node ) );
	            
	            if( keywordString.length > 1 )
		            keywords.push( keywordString );
	        });
	        
	        callback( err, keywords );
		}
	);
};
