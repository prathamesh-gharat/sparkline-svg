import memoizeOne from 'memoize-one';



type DGetter = (
  values: number[],
  viewBoxWidth: number,
  viewBoxHeight: number,
  decimals: number,
) => string;



const round = (n: number, decimals: number): number => {
  const power: number = 10 ** decimals;
  return Math.round(n * power) / power;
};

const getD: DGetter = (
  values: number[],
  viewBoxWidth: number,
  viewBoxHeight: number,
  decimals: number,
): string => {
  let l: string[] = [];
  const max: number = Math.max(...values);
  const length: number = values.length;
  for (let i: number = 0; i < length; i++) {
    l.push(
      round(i / length * viewBoxWidth, decimals) + ',' +
      round(viewBoxHeight - (values[i] / max * viewBoxHeight), decimals),
    );
  }
  return `M ${l.join(' L ')}`;
};

export default class Sparkline {

  private _decimals: number;
  private _desc: string;
  private _fill: string;
  private _getD: DGetter;
  private _height: string;
  private _preserveAspectRatio: string;
  private _stroke: string;
  private _strokeWidth: number;
  private _title: string;
  private _width: string;
  private _values: number[];
  private _viewBoxHeight: number;
  private _viewBoxWidth: number;

  public constructor(values: number[] = []) {
    this._decimals = 2;
    this._desc = 'A line graph representation of a value\'s change over time.';
    this._fill = 'transparent';
    this._getD = memoizeOne(getD);
    this._height = '100%';
    this._preserveAspectRatio = 'none';
    this._stroke = 'currentColor';
    this._strokeWidth = 1;
    this._title = 'Sparkline';
    this._width = '100%';
    this._values = values;
    this._viewBoxHeight = 1;
    this._viewBoxWidth = 1;
  }

  public get d(): string {
    return this._getD(
      this._values,
      this._viewBoxWidth,
      this._viewBoxHeight,
      this._decimals,
    );
  }

  public get dataUri(): string {
    return `data:image/svg+xml;base64,${btoa(this.outerHTML)}`;
  }

  public get outerHTML() {
    let fillPath: string = '';
    let strokePath: string = '';

    // If values exist,
    if (this._values.length !== 0) {
      strokePath = `
        <path
          d="${this.d}"
          fill="transparent"
          stroke="${this._stroke}"
          strokeWidth="${this._strokeWidth}"
        />
      `;

      // If a fill color exists,
      if (this._fill !== 'transparent') {
        fillPath = `
          <path
            d="${this.d}"
            fill="${this._fill}"
            stroke="transparent"
            strokeWidth="0"
          />
        `;
      }
    }

    return `<?xml version="1.0" encoding="utf-8"?>
      <svg
        height="${this._height}"
        preserveAspectRatio="${this._preserveAspectRatio}"
        version="1.1"
        viewBox="0 0 ${this._viewBoxWidth} ${this._viewBoxHeight}"
        x="0px"
        xml:space="preserve"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        y="0px"
        width="${this._width}"
      >
        <title>${this._title}</title>
        <desc>${this._desc}</desc>
        ${fillPath}
        ${strokePath}
      </svg>
    `;
  }

  public setDecimals(decimals: number): this {
    this._decimals = decimals;
    return this;
  }

  public setDesc(desc: string): this {
    this._desc = desc;
    return this;
  }

  public setDescription(desc: string): this {
    this._desc = desc;
    return this;
  }

  public setFill(fill: string): this {
    this._fill = fill;
    return this;
  }

  public setHeight(height: string): this {
    this._height = height;
    return this;
  }

  public setPreserveAspectRatio(preserveAspectRatio: string): this {
    this._preserveAspectRatio = preserveAspectRatio;
    return this;
  }

  public setStroke(stroke: string): this {
    this._stroke = stroke;
    return this;
  }

  public setStrokeWidth(strokeWidth: number): this {
    this._strokeWidth = strokeWidth;
    return this;
  }

  public setTitle(title: string): this {
    this._title = title;
    return this;
  }

  public setValues(values: number[]): this {
    this._values = values;
    return this;
  }

  public setViewBoxHeight(viewBoxHeight: number): this {
    this._viewBoxHeight = viewBoxHeight;
    return this;
  }

  public setWidth(width: string): this {
    this._width = width;
    return this;
  }
}