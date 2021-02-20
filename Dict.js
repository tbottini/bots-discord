const fs = require("fs")

class Dict
{
  constructor(name)
  {
    this.name = name;
    this.dict = {};
    this.init();
  }

  get file() { return "./" + this.name + ".json"}
  

  init()
  {
    if (fs.existsSync(this.file)) {
      console.log(this.file);
      var data = fs.readFileSync(this.file);
    
      this.dict = JSON.parse(data.toString());
      
      console.log("dict " + this.name, this.dict);
    }
  }

  save()
  {
    fs.writeFileSync(this.file, JSON.stringify(this.dict));
  }

  add(key, value)
  {
    this.dict[key] = value;
    this.save();
  }

  delete(key)
  {
    delete this.dict[key];
    this.save();
  }

  get(key)
  {
    return this.dict[key];
  }

  
}

class DictOccurence extends Dict
{
  constructor(name)
  {
    super(name);
  }

  add() {

  }

  increment(key)
  {
    if (!this.dict[key])
    {
      this.dict[key] = 0;
    }
    this.dict[key]++;
    this.save()
  }

  print()
  {
    console.log("print function call");
    var statsPrint = Object.entries(this.dict).map(p =>
        {

            return {
                name: p[0],
                value: parseInt(p[1]),
            }
        }).sort((a, b) => b.value - a.value).map((p, i) => {
       
          return p.name + ': ' + p.value;
        }).slice(0, 30)
        .join('\n');
      
        console.log(statsPrint);
      
    return statsPrint || "nothing";

  }
}

module.exports = {
    Dict,
    DictOccurence
}
