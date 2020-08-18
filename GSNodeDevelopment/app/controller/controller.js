const { poolPromise, sql } = require('../models/db');
const integrationNames = require('../models/intigrationNames');
const { MAX } = require('mssql');
exports.getIntigrationNames = async (req, res) => {
  try {
    const pool = await poolPromise
    let queryStr = 'select * from [CEH].INTEGRATION_LISTS';

    const result = await pool.request()
      .query(queryStr, function (err, data) {
        if (err) {
          console.log('error while fetching data' + err)
        }
        else {
          let resultArray = [];
          let resultObj = {}
          data.recordset.forEach(element => {
            resultObj = {
              IntegrationCode: element.INTEGRATION_CODE,
              IntegrationName: element.INTEGRATION_NAME
            }
            resultArray.push(resultObj)
          });
          var send_data = resultArray;
          res.json(send_data);
        }
      })
  } catch (err) {
    res.status(500)
    res.send(err.message)
  }
}
exports.seacrhByOrders = async (req, res) => {
  try {
    sourceId = req.query.sourceId ? req.query.sourceId : '';
    integtationCode = req.query.intName ? req.query.intName : '';
    intStatus = req.query.intStatus ? req.query.intStatus : ''
    fromDate = req.query.fromDate ? req.query.fromDate : '';
    toDate = req.query.toDate ? req.query.toDate : '';

    if (sourceId == 'null') {
      sourceId = '';
    }
    if (fromDate == 'null') {
      fromDate = '';
    }
    if (toDate == 'null') {
      toDate = '';
    }
    if (intStatus == 'null') {
      intStatus = '';
    }
    if (integtationCode == 'null') {
      integtationCode = '';
    }

    sourceId = "'" + sourceId + "'"
    integtationCode = "'" + integtationCode + "'"
    intStatus = "'" + intStatus + "'"
    fromDate = "'" + fromDate + "'"
    toDate = "'" + toDate + "'"
    const pool = await poolPromise
    let query =
      `DECLARE
    @integtationCode   varchar(100)
   ,@SourceTrxId       varchar(100)
 ,@IntegrationStatus varchar(100)
 ,@fromDate          varchar(100)
 ,@toDate            varchar(100)
 ,@SQL			   VARCHAR(MAX)
 ,@all               VARCHAR(2)   = '-1'
 ,@integtationCodeFilter     VARCHAR(MAX)
 ,@SourceTrxIdFilter VARCHAR(MAX)
 ,@IntegrationStatusFilter   VARCHAR(MAX)
 ,@fromDatefilter    VARCHAR(MAX)
 ,@toDatefilter      VARCHAR(MAX)
BEGIN
--assign the value to build the dynamic query
SET @SourceTrxId       = ${sourceId}
SET @integtationCode   = ${integtationCode}
SET @IntegrationStatus = ${intStatus}
SET @fromDate          = ${fromDate}
SET @toDate            = ${toDate};


-- Set Filter for Integration Code
SET @integtationCodeFilter = CASE WHEN @integtationCode IS NULL OR @integtationCode = ''
THEN '''' + @all + ''' = ''' + @all + '''' 
ELSE 'INTEGRATION_CODE = ''' + @integtationCode + '''' 
END

-- Set Filter for Source Trx Id
SET @SourceTrxIdFilter = CASE WHEN @SourceTrxId IS NULL OR @SourceTrxId = ''
THEN '''' + @all + ''' = ''' + @all + '''' 
ELSE 'SOURCE_TRX_ID = ''' + @SourceTrxId + '''' 
END

-- Set Filter for Integration Status
SET @IntegrationStatusFilter = CASE WHEN @IntegrationStatus IS NULL OR @IntegrationStatus = ''
THEN '''' + @all + ''' = ''' + @all + '''' 
ELSE 'INTEGRATION_STATUS = ''' + @IntegrationStatus + '''' 
END

-- Set Filter for from date
SET @fromDatefilter = CASE WHEN @fromDate IS NULL OR @fromDate = ''
THEN '''' + @all + ''' = ''' + @all + '''' 
ELSE 'TRX_DATE >= ' + '''' + @fromDate  + ''''
END

-- Set Filter for from date
SET @toDatefilter = CASE WHEN @toDate IS NULL OR @toDate = ''
THEN '''' + @all + ''' = ''' + @all + '''' 
ELSE 'TRX_DATE <= ' + '''' + @toDate  + ''''
END


SET @SQL ='select distinct 
      a.integration_code,
              a.integration_name,
      (select count(*) from CEH.INTEGRATION_DTLS b where ' + 
                  @integtationCodeFilter
              + ' AND ' + @SourceTrxIdFilter + 
              + ' AND ' + @IntegrationStatusFilter
              + ' AND ' + @fromDatefilter
              + ' AND ' + @toDatefilter +
             ') total_count, ' +
      '(select count(*) from CEH.INTEGRATION_DTLS b where ' + 
                  @integtationCodeFilter
              + ' AND ' + @SourceTrxIdFilter + 
              + ' AND ' + @IntegrationStatusFilter
              + ' AND ' + @fromDatefilter
              + ' AND ' + @toDatefilter 
      + ' AND b.integration_status ='+ ''''+'ERROR'+'''' +
             ') error_count , '+
      '(select count(*) from CEH.INTEGRATION_DTLS b where ' + 
                  @integtationCodeFilter
              + ' AND ' + @SourceTrxIdFilter + 
              + ' AND ' + @IntegrationStatusFilter
              + ' AND ' + @fromDatefilter
              + ' AND ' + @toDatefilter 
      + ' AND b.integration_status ='+ ''''+'SUCCESS'+'''' +
             ') success_count '+
   'FROM CEH.INTEGRATION_DTLS_V a
   WHERE '
              + @integtationCodeFilter
              + ' AND ' + @SourceTrxIdFilter + ''
              + ' AND ' + @IntegrationStatusFilter
              + ' AND ' + @fromDatefilter
              + ' AND ' + @toDatefilter ;

print(@sql)
EXEC(@sql)

END;`
    const result = await pool.request()
      .query(query, function (err, data) {
        if (err) {
          console.log(err)
        }
        else {
          var send_data = data.recordset;
          res.json(send_data);
        }
      })
  } catch (err) {
    res.status(500)
    res.send(err.message)
  }
}

exports.getOrderDeatils = async (req, res) => {
  try {
    let sourceID = req.query.sourceId ? req.query.sourceId : '';
    let intStat = req.query.intStatus ? req.query.intStatus : '';
    let intCode = req.query.intName ? req.query.intName : '';
    let fDate = req.query.fromDate ? req.query.fromDate : '';
    let tDate = req.query.toDate ? req.query.toDate : '';

    if (sourceID == 'null') {
      sourceID = ''
    }
    if (intStat == 'null') {
      intStat = ''
    }
    if (intCode == 'null') {
      intCode = ''
    }
    if (fDate == 'null') {
      fDate = ''
    }
    if (tDate == 'null') {
      tDate = ''
    }

    sourceID = "'" + sourceID + "'"
    intCode = "'" + intCode + "'"
    intStat = "'" + intStat + "'"
    fDate = "'" + fDate + "'"
    tDate = "'" + tDate + "'"
    let queryStr = `
    DECLARE
            @integtationCode   varchar(100)
           ,@SourceTrxId       varchar(100)
         ,@IntegrationStatus varchar(100)
         ,@fromDate          varchar(100)
         ,@toDate            varchar(100)
         ,@SQL			   VARCHAR(MAX)
         ,@all               VARCHAR(2)   = '-1'
         ,@integtationCodeFilter     VARCHAR(MAX)
         ,@SourceTrxIdFilter VARCHAR(MAX)
         ,@IntegrationStatusFilter   VARCHAR(MAX)
         ,@fromDatefilter    VARCHAR(MAX)
         ,@toDatefilter      VARCHAR(MAX)
    BEGIN
    --assign the value to build the dynamic query
    SET @integtationCode   = ${intCode}
    SET @SourceTrxId       = ${sourceID}
    SET @IntegrationStatus = ${intStat}
    SET @fromDate          = ${fDate}
    SET @toDate            = ${tDate}
    
    -- Set Filter for Integration Code
    SET @integtationCodeFilter = CASE WHEN @integtationCode IS NULL OR @integtationCode = ''
    THEN '''' + @all + ''' = ''' + @all + '''' 
    ELSE 'INTEGRATION_CODE = ''' + @integtationCode + '''' 
    END
    
    -- Set Filter for Source Trx Id
    SET @SourceTrxIdFilter = CASE WHEN @SourceTrxId IS NULL OR @SourceTrxId = ''
    THEN '''' + @all + ''' = ''' + @all + '''' 
    ELSE 'SOURCE_TRX_ID = ''' + @SourceTrxId + '''' 
    END
    
    -- Set Filter for Integration Status
    SET @IntegrationStatusFilter = CASE WHEN @IntegrationStatus IS NULL OR @IntegrationStatus = ''
    THEN '''' + @all + ''' = ''' + @all + '''' 
    ELSE 'INTEGRATION_STATUS = ''' + @IntegrationStatus + '''' 
    END
    
    -- Set Filter for from date
    SET @fromDatefilter = CASE WHEN @fromDate IS NULL OR @fromDate = ''
    THEN '''' + @all + ''' = ''' + @all + '''' 
    ELSE 'TRX_DATE >= ' + '''' + @fromDate  + ''''
    END
    
    -- Set Filter for from date
    SET @toDatefilter = CASE WHEN @toDate IS NULL OR @toDate = ''
    THEN '''' + @all + ''' = ''' + @all + '''' 
    ELSE 'TRX_DATE <= ' + '''' + @toDate  + ''''
    END
    
    SET @SQL ='  SELECT * FROM [CEH].INTEGRATION_DTLS_V
    WHERE ' + @integtationCodeFilter
    + ' AND ' + @SourceTrxIdFilter + ''
    + ' AND ' + @IntegrationStatusFilter
    + ' AND ' + @fromDatefilter
    + ' AND ' + @toDatefilter;
    
    --print(@sql)
    EXEC(@sql)
    
    END;`;
    const pool = await poolPromise;
    const result = await pool.request().query(queryStr, function (error, results) {
      if (error) {
        console.log(error)
      }
      else {
        var send_data = results.recordset;
        res.json(send_data);
      }
    })

  }
  catch (err) {
    res.status(500)
    res.send(err.message)
  }
}

exports.updateOrder = async (req, res) => {
  if (req.body) {
    try {
      const pool = await poolPromise
      let request = await pool.request();
      request.input('INTEGRATION_CODE', sql.VarChar(200), req.body.integrationCode);
      request.input('GLOBAL_TRX_ID', sql.VarChar(200), req.body.globaTrxId);
      request.input('SOURCE_TRX_ID', sql.VarChar(200), req.body.sourceTrxId);
      request.input('INT_DTLS_ID', sql.VarChar(200), req.body.intDetailsId);
      request.input('PAYLOAD', sql.VarChar(MAX), req.body.payload);
      request.input('RESUBMIT_FLAG', sql.VarChar(50), req.body.resubmitFlag);
      request.input('LAST_UPD_USER_ID', sql.VarChar(200), req.body.updatedUserId);
      request.output('returnStatus', sql.VarChar(200))
      request.output('errorMessage', sql.VarChar(4000))
      request.execute('CEH.UpdateIntgDetails', function (err, results) {
        if (err) {
          console.log('error while updating' + err);
        } else {
          res.send(results);
        }
      })
    } catch (err) {
      res.status(500)
      res.send(err.message)
    }
  }
}

