const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const fs = require('fs');
const User = require('./../models/user.model')
const Event = require('./../models/event.model')
const Response = require('./../services/response')

const JSON2CSV = require('json-2-csv')

const jsonToCsv = async function (req, res) {
  let id = req.user._id;
  try {
    const userDoc = await User.findOne({ _id: id });
    if (userDoc) {
      const user = await userDoc.toObject({ getters: false, virtual: false });


      const exceptKeys = [
        'phone_number',
        'team',
        'socialLinks',
        'role',
        'verified',
        'google_id',
        // 'claimAlmusStatus',
        'formulaBharatDetails',
        'secondary_role',
        'contactPhoneNumber',
      ];
      let parsed = {
        header: [],
        data: {}
      };
      let events = await Event.find().sort({ start_date: 'descending' }).populate('organizers').exec();
      for (const event of events) {
        parsed.header.push({
          id: `Participated_in__${event.name}`,
          title: `Participated_in__${event.name}`
        });
        parsed.data[`Participated_in__${event.name}`] = (user.eventParticipated.includes(event._id))?'Yes':'No';
        if (user.eventOfParticipation == event._id && event.name === 'Formula Bharat 2020') {
            exceptKeys.splice(exceptKeys.indexOf('formulaBharatDetails'),1)
        }
      }
      parsed =  makeHeader(user, exceptKeys, parsed.header, parsed.data);
      const pathPart = `./static/csv/${user._id}`
      if (!fs.existsSync(pathPart)){
        fs.mkdirSync(pathPart);
      }
      const path = `${pathPart}/out.csv`;
      const csvWriter = createCsvWriter({
        path: path,
        header: parsed.header
      });

      await csvWriter.writeRecords([parsed.data]);
      return Response.success(res, { path: path.replace('./static','') })
    }
    return Response.failed(res, { message: "User Not Found" })
  } catch (error) {
    console.log(error)
    return Response.failed(res, { message: "Internal Server Error" })
  }
}

const csvToJson = async function (req, res) {
  let id = req.user._id;
  try {
    let user = await User.findOne({ _id: id })
    if (user) {
      if (req.files && req.files.file) {
        let file = req.files.file;
        if (file && file.data) {
          let csv = file.data.toString('utf8');
          let data = await JSON2CSV.csv2jsonAsync(csv, {
            emptyFieldValue: null,
            expandArrayObjects: true
           });



           if (data && data.length) {
             const participatedEvents = [];
             const itemToEdit = data[0];
             for (const key in itemToEdit) {
                if (key.includes('Participated_in__')) {
                  if (itemToEdit[key].includes('Yes')) {
                    const eventTitle = key.replace('Participated_in__','')
                    const event = await Event.findOne({ name: eventTitle });
                    if(event) {
                      participatedEvents.push(event._id);
                    }
                  }
                  delete itemToEdit[key]
                }
              }


             itemToEdit.eventParticipated = participatedEvents;
             itemToEdit.phone_parts.code = (itemToEdit.phone_parts.code.length && itemToEdit.phone_parts.code[0] === '+')?`${itemToEdit.phone_parts.code}`:`+${itemToEdit.phone_parts.code}`;
             itemToEdit.phone_number = `(${itemToEdit.phone_parts.code})${itemToEdit.phone_parts.number}`;
             if (
               itemToEdit.formulaBharatDetails &&
               itemToEdit.formulaBharatDetails.emergencyContactDetails &&
               itemToEdit.formulaBharatDetails.emergencyContactDetails.phone_parts
             ) {
               itemToEdit.formulaBharatDetails.emergencyContactDetails.phone_parts.code = (itemToEdit.formulaBharatDetails.emergencyContactDetails.phone_parts.code.length && itemToEdit.formulaBharatDetails.emergencyContactDetails.phone_parts.code[0] === '+')?`${itemToEdit.formulaBharatDetails.emergencyContactDetails.phone_parts.code}`:`+${itemToEdit.formulaBharatDetails.emergencyContactDetails.phone_parts.code}`;
               const emergencyPhoneParts = itemToEdit.formulaBharatDetails.emergencyContactDetails.phone_parts;
               itemToEdit.formulaBharatDetails.emergencyContactDetails.contactPhoneNumber = `(${emergencyPhoneParts.code})${emergencyPhoneParts.number}`;
             }

             const result = await User.findOneAndUpdate({ _id: user._id }, itemToEdit );
             if(result) {
               return Response.success(res, { user: result });
             }
             return Response.failed(res, { message: "Can't update user fields" })
           }
           return Response.failed(res, { message: "Data not found" })
        }
      }
    }
    return Response.failed(res, { message: "User Not Found" })
  } catch (error) {
    console.log(error);
    return Response.failed(res, { message: "Internal Server Error" })
  }
};

const makeHeader =  function (element,exceptKeys, header = [], data = {}, keyPrefix = '') {
  if( (element instanceof Object) && !(element instanceof Array)) {
    for(const key in element) {
      if(key === 'id' || key === '_id' || key[0] === '_' || exceptKeys.includes(key)) {
        continue;
      }

      if(key === 'claimAlmusStatus') {
        element[key] = element[key].toString();
      }

      const name = (keyPrefix)?`${keyPrefix}.${key}`:key;
      if(element[key] instanceof Object && !(element[key] instanceof Array) ) {
        makeHeader(element[key],exceptKeys, header, data, name);
      } else {
        if (!exceptKeys.includes(key)) {
          const name = (keyPrefix)?`${keyPrefix}.${key}`:key;
          header.push({
            id: name,
            title: name
          });
          data[name] = element[key];
        }
      }
    }
  } else {
    if (!exceptKeys.includes(element)) {
      const name = (keyPrefix)?`${keyPrefix}.${element}`:element;
      header.push({
        id: name,
        title: name
      });
      data[name] = element;
    }
  }
  return {header, data};
};

const makeObject =  function (json, object = {}) {
 for (const key in json) {
     if(key.includes('.')) {
       const keys = key.split('.');
       object = {
         ...object,
         ...recursiveKeyGen(keys, json[key], object)
       };
     } else {
       object[key] = json[key];
     }
  }
  return object;
};

const recursiveKeyGen = (keys, value, object = {}) => {
  const key = keys.shift();
  if(!keys.length) {
    object[key] = value;
    return object;
  }

  if(!object[key]) {
    object[key] = {};
  }
  recursiveKeyGen(keys, value, object[key]);
  return object
};

module.exports = {
  jsonToCsv,
  csvToJson
};
