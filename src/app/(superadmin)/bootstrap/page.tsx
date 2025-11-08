// app/superadmin/page.tsx
import { db } from "@/lib/db";
import {
  client,
  userTypeLevelMaster,
  userTypeEntity,
  skuLevelMaster,
  skuEntity,
  skuVariant,
  skuPointConfig,
  earningTypes,
  qrTypes,
  redemptionChannels,
  redemptionStatuses,
  schemeTypes,
  creativesTypes,
  locationLevelMaster,
  locationEntity,
} from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

// === SERVER ACTIONS ===
async function createClient(formData: FormData) {
  "use server";
  const name = formData.get("name") as string;
  const code = formData.get("code") as string || null;
  await db.insert(client).values({ name, code });
  revalidatePath("/superadmin");
}

async function createUserTypeLevel(formData: FormData) {
  "use server";
  const levelNo = parseInt(formData.get("levelNo") as string);
  const levelName = formData.get("levelName") as string;
  const parentLevelId = formData.get("parentLevelId")
    ? parseInt(formData.get("parentLevelId") as string)
    : null;
  await db.insert(userTypeLevelMaster).values({ levelNo, levelName, parentLevelId });
  revalidatePath("/superadmin");
}

async function createUserTypeEntity(formData: FormData) {
  "use server";
  const levelId = parseInt(formData.get("levelId") as string);
  const typeName = formData.get("typeName") as string;
  const parentTypeId = formData.get("parentTypeId")
    ? parseInt(formData.get("parentTypeId") as string)
    : null;
  await db.insert(userTypeEntity).values({ levelId, typeName, parentTypeId, isActive: true });
  revalidatePath("/superadmin");
}

async function createSkuLevel(formData: FormData) {
  "use server";
  const clientId = parseInt(formData.get("clientId") as string);
  const levelNo = parseInt(formData.get("levelNo") as string);
  const levelName = formData.get("levelName") as string;
  const parentLevelId = formData.get("parentLevelId")
    ? parseInt(formData.get("parentLevelId") as string)
    : null;
  await db.insert(skuLevelMaster).values({ clientId, levelNo, levelName, parentLevelId });
  revalidatePath("/superadmin");
}

async function createSkuEntity(formData: FormData) {
  "use server";
  const clientId = parseInt(formData.get("clientId") as string);
  const levelId = parseInt(formData.get("levelId") as string);
  const name = formData.get("name") as string;
  const code = formData.get("code") as string || null;
  const parentEntityId = formData.get("parentEntityId")
    ? parseInt(formData.get("parentEntityId") as string)
    : null;
  await db.insert(skuEntity).values({ clientId, levelId, name, code, parentEntityId, isActive: true });
  revalidatePath("/superadmin");
}

async function createSkuVariant(formData: FormData) {
  "use server";
  const skuEntityId = parseInt(formData.get("skuEntityId") as string);
  const variantName = formData.get("variantName") as string;
  const packSize = formData.get("packSize") as string || null;
  const mrp = parseFloat(formData.get("mrp") as string);
  await db.insert(skuVariant).values({ skuEntityId, variantName, packSize, mrp, isActive: true });
  revalidatePath("/superadmin");
}

async function createSkuPointConfig(formData: FormData) {
  "use server";
  const clientId = parseInt(formData.get("clientId") as string);
  const skuVariantId = parseInt(formData.get("skuVariantId") as string);
  const userTypeId = parseInt(formData.get("userTypeId") as string);
  const pointsPerUnit = parseFloat(formData.get("pointsPerUnit") as string);
  await db.insert(skuPointConfig).values({
    clientId,
    skuVariantId,
    userTypeId,
    pointsPerUnit: pointsPerUnit.toString(),
  });
  revalidatePath("/superadmin");
}

async function createLocationLevel(formData: FormData) {
  "use server";
  const clientId = parseInt(formData.get("clientId") as string);
  const levelNo = parseInt(formData.get("levelNo") as string);
  const levelName = formData.get("levelName") as string;
  const parentLevelId = formData.get("parentLevelId")
    ? parseInt(formData.get("parentLevelId") as string)
    : null;
  await db.insert(locationLevelMaster).values({ clientId, levelNo, levelName, parentLevelId });
  revalidatePath("/superadmin");
}

async function createLocationEntity(formData: FormData) {
  "use server";
  const clientId = parseInt(formData.get("clientId") as string);
  const levelId = parseInt(formData.get("levelId") as string);
  const name = formData.get("name") as string;
  const code = formData.get("code") as string || null;
  const parentEntityId = formData.get("parentEntityId")
    ? parseInt(formData.get("parentEntityId") as string)
    : null;
  await db.insert(locationEntity).values({ clientId, levelId, name, code, parentEntityId });
  revalidatePath("/superadmin");
}

async function createMaster(formData: FormData, table: any, fields: string[]) {
  "use server";
  const values: any = {};
  fields.forEach((f) => {
    const val = formData.get(f);
    if (val !== null && val !== "") {
      values[f] = f.includes("Id") || f === "isActive" ? parseInt(val as string) : val;
    }
  });
  await db.insert(table).values(values);
  revalidatePath("/superadmin");
}

// === PAGE COMPONENT ===
export default async function SuperAdminPage() {
  const [
    clients,
    userTypeLevels,
    userTypeEntities,
    skuLevels,
    skuEntities,
    skuVariants,
    skuPointConfigs,
    locationLevels,
    locationEntities,
    earningTypeList,
    qrTypeList,
    redemptionChannelList,
    redemptionStatusList,
    schemeTypeList,
    creativesTypeList,
  ] = await Promise.all([
    db.select().from(client),
    db.select().from(userTypeLevelMaster),
    db.select().from(userTypeEntity),
    db.select().from(skuLevelMaster),
    db.select().from(skuEntity),
    db.select().from(skuVariant),
    db.select().from(skuPointConfig),
    db.select().from(locationLevelMaster),
    db.select().from(locationEntity),
    db.select().from(earningTypes),
    db.select().from(qrTypes),
    db.select().from(redemptionChannels),
    db.select().from(redemptionStatuses),
    db.select().from(schemeTypes),
    db.select().from(creativesTypes),
  ]);

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <h1 className="text-3xl font-bold mb-8">SuperAdmin Masters</h1>

      <Tabs defaultValue="client" className="w-full">
        <TabsList className="grid grid-cols-4 lg:grid-cols-8 gap-2 mb-8 overflow-x-auto">
          <TabsTrigger value="client">Client</TabsTrigger>
          <TabsTrigger value="user-type-level">User Type Level</TabsTrigger>
          <TabsTrigger value="user-type-entity">User Type</TabsTrigger>
          <TabsTrigger value="sku-level">SKU Level</TabsTrigger>
          <TabsTrigger value="sku-entity">SKU Entity</TabsTrigger>
          <TabsTrigger value="sku-variant">SKU Variant</TabsTrigger>
          <TabsTrigger value="sku-point">Point Config</TabsTrigger>
          <TabsTrigger value="location">Location</TabsTrigger>
        </TabsList>

        {/* === CLIENT === */}
        <TabsContent value="client">
          <Card>
            <CardHeader><CardTitle>Add Client</CardTitle></CardHeader>
            <CardContent>
              <form action={createClient} className="space-y-4">
                <Input name="name" placeholder="Client Name" required />
                <Input name="code" placeholder="Code (optional)" />
                <Button type="submit">Add Client</Button>
              </form>
              <div className="mt-6 space-y-2">
                {clients.map((c) => (
                  <div key={c.id} className="p-2 border rounded">{c.name} {c.code && `(${c.code})`}</div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* === USER TYPE LEVEL === */}
        <TabsContent value="user-type-level">
          <Card>
            <CardHeader><CardTitle>User Type Level</CardTitle></CardHeader>
            <CardContent>
              <form action={createUserTypeLevel} className="space-y-4">
                <Input name="levelNo" type="number" placeholder="Level No" required />
                <Input name="levelName" placeholder="Level Name" required />
                <Select name="parentLevelId">
                  <SelectTrigger><SelectValue placeholder="Parent Level (optional)" /></SelectTrigger>
                  <SelectContent>
                    {userTypeLevels.map((l) => (
                      <SelectItem key={l.id} value={l.id.toString()}>{l.levelName}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button type="submit">Add Level</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* === USER TYPE ENTITY === */}
        <TabsContent value="user-type-entity">
          <Card>
            <CardHeader><CardTitle>User Type Entity</CardTitle></CardHeader>
            <CardContent>
              <form action={createUserTypeEntity} className="space-y-4">
                <Select name="levelId" required>
                  <SelectTrigger><SelectValue placeholder="Select Level" /></SelectTrigger>
                  <SelectContent>
                    {userTypeLevels.map((l) => (
                      <SelectItem key={l.id} value={l.id.toString()}>{l.levelName}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input name="typeName" placeholder="Type Name (e.g., Retailer)" required />
                <Select name="parentTypeId">
                  <SelectTrigger><SelectValue placeholder="Parent Type (optional)" /></SelectTrigger>
                  <SelectContent>
                    {userTypeEntities.map((e) => (
                      <SelectItem key={e.id} value={e.id.toString()}>{e.typeName}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button type="submit">Add Type</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* === SKU LEVEL === */}
        <TabsContent value="sku-level">
          <Card>
            <CardHeader><CardTitle>SKU Level</CardTitle></CardHeader>
            <CardContent>
              <form action={createSkuLevel} className="space-y-4">
                <Select name="clientId" required>
                  <SelectTrigger><SelectValue placeholder="Client" /></SelectTrigger>
                  <SelectContent>
                    {clients.map((c) => (
                      <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input name="levelNo" type="number" placeholder="Level No" required />
                <Input name="levelName" placeholder="Level Name" required />
                <Select name="parentLevelId">
                  <SelectTrigger><SelectValue placeholder="Parent Level" /></SelectTrigger>
                  <SelectContent>
                    {skuLevels.map((l) => (
                      <SelectItem key={l.id} value={l.id.toString()}>{l.levelName}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button type="submit">Add SKU Level</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* === SKU ENTITY === */}
        <TabsContent value="sku-entity">
          <Card>
            <CardHeader><CardTitle>SKU Entity</CardTitle></CardHeader>
            <CardContent>
              <form action={createSkuEntity} className="space-y-4">
                <Select name="clientId" required>
                  <SelectTrigger><SelectValue placeholder="Client" /></SelectTrigger>
                  <SelectContent>
                    {clients.map((c) => (
                      <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select name="levelId" required>
                  <SelectTrigger><SelectValue placeholder="Level" /></SelectTrigger>
                  <SelectContent>
                    {skuLevels.map((l) => (
                      <SelectItem key={l.id} value={l.id.toString()}>{l.levelName}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input name="name" placeholder="Name (e.g., Cement)" required />
                <Input name="code" placeholder="Code (optional)" />
                <Select name="parentEntityId">
                  <SelectTrigger><SelectValue placeholder="Parent Entity" /></SelectTrigger>
                  <SelectContent>
                    {skuEntities.map((e) => (
                      <SelectItem key={e.id} value={e.id.toString()}>{e.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button type="submit">Add SKU Entity</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* === SKU VARIANT === */}
        <TabsContent value="sku-variant">
          <Card>
            <CardHeader><CardTitle>SKU Variant</CardTitle></CardHeader>
            <CardContent>
              <form action={createSkuVariant} className="space-y-4">
                <Select name="skuEntityId" required>
                  <SelectTrigger><SelectValue placeholder="Select SKU Entity" /></SelectTrigger>
                  <SelectContent>
                    {skuEntities.map((e) => (
                      <SelectItem key={e.id} value={e.id.toString()}>{e.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input name="variantName" placeholder="Variant (e.g., OPC 53)" required />
                <Input name="packSize" placeholder="Pack Size (e.g., 50kg)" />
                <Input name="mrp" type="number" step="0.01" placeholder="MRP" required />
                <Button type="submit">Add Variant</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* === SKU POINT CONFIG === */}
        <TabsContent value="sku-point">
          <Card>
            <CardHeader><CardTitle>SKU Point Mapping</CardTitle></CardHeader>
            <CardContent>
              <form action={createSkuPointConfig} className="space-y-4">
                <Select name="clientId" required>
                  <SelectTrigger><SelectValue placeholder="Client" /></SelectTrigger>
                  <SelectContent>
                    {clients.map((c) => (
                      <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select name="skuVariantId" required>
                  <SelectTrigger><SelectValue placeholder="SKU Variant" /></SelectTrigger>
                  <SelectContent>
                    {skuVariants.map((v) => (
                      <SelectItem key={v.id} value={v.id.toString()}>
                        {v.variantName} ({v.packSize})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select name="userTypeId" required>
                  <SelectTrigger><SelectValue placeholder="User Type" /></SelectTrigger>
                  <SelectContent>
                    {userTypeEntities.map((u) => (
                      <SelectItem key={u.id} value={u.id.toString()}>{u.typeName}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input name="pointsPerUnit" type="number" step="0.01" placeholder="Points per Unit" required />
                <Button type="submit">Map Points</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* === LOCATION === */}
        <TabsContent value="location">
          <div className="space-y-6">
            <Card>
              <CardHeader><CardTitle>Location Level</CardTitle></CardHeader>
              <CardContent>
                <form action={createLocationLevel} className="space-y-4">
                  <Select name="clientId"><SelectTrigger><SelectValue placeholder="Client" /></SelectTrigger><SelectContent>{clients.map(c => <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>)}</SelectContent></Select>
                  <Input name="levelNo" type="number" placeholder="Level No" required />
                  <Input name="levelName" placeholder="Level Name" required />
                  <Button type="submit">Add Level</Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Location Entity</CardTitle></CardHeader>
              <CardContent>
                <form action={createLocationEntity} className="space-y-4">
                  <Select name="clientId"><SelectTrigger><SelectValue placeholder="Client" /></SelectTrigger><SelectContent>{clients.map(c => <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>)}</SelectContent></Select>
                  <Select name="levelId"><SelectTrigger><SelectValue placeholder="Level" /></SelectTrigger><SelectContent>{locationLevels.map(l => <SelectItem key={l.id} value={l.id.toString()}>{l.levelName}</SelectItem>)}</SelectContent></Select>
                  <Input name="name" placeholder="Name" required />
                  <Input name="code" placeholder="Code" />
                  <Button type="submit">Add Entity</Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}